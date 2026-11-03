import type { JaScript, Level, Species } from '../core/types';
import { LANGUAGES } from '../content/languages';
import { setUiLang, t } from '../core/i18n';
import { audio } from '../audio/audio';
import { speech } from '../learning/tts';
import { Plush } from '../world/plush';
import { mini } from '../world/portrait';
import { button, h, seg, toggle, ui } from './dom';
import { logoBlock } from './brand';

export interface OnboardResult {
  name: string; species: Species; color: string;
  native: string; target: string; level: Level; jaScript: JaScript; romaji: boolean;
}

export const PLAYER_COLORS = ['#F2C49B', '#E58F5E', '#F4ECE2', '#BFB6AE', '#A9C8E8', '#F3B9C8', '#8C6A55'];
export function playerSpec(species: Species, color: string) {
  const c = color.toLowerCase();
  const dark = ['#8c6a55', '#bfb6ae'].includes(c);
  return {
    species, main: color,
    accent: species === 'fox' ? '#5B4636' : species === 'dog' ? (dark ? '#5B4636' : '#C98F5E') : '#F2B2B8',
    belly: dark ? '#E9DCCF' : '#FFF6EC',
    nose: species === 'cat' ? '#E58C98' : '#3E2A20',
  };
}

/** Title screen → language & level choices → make your plush. */
export function runOnboarding(): Promise<OnboardResult> {
  const res: OnboardResult = { name: '', species: 'cat', color: PLAYER_COLORS[0], native: 'en', target: 'es', level: 'beginner', jaScript: 'kana', romaji: false };
  const browser = (navigator.language || 'en').slice(0, 2);
  if (LANGUAGES.some((l) => l.code === browser)) res.native = browser;
  res.target = LANGUAGES.find((l) => l.code !== res.native)!.code;
  setUiLang(res.native);

  return new Promise((resolve) => {
    const root = h('div.onb.title-screen');
    ui().append(root);
    let step = 0;
    let previewStop: (() => void) | null = null;

    const steps = () => (res.target === 'ja' ? ['native', 'target', 'level', 'script', 'plush'] : ['native', 'target', 'level', 'plush']);
    const dotsEl = () => h('div.steps', null, ...steps().map((_, i) => h('i' + (i === step ? '.on' : ''))));
    const nav = (canNext: () => boolean, last = false) => {
      const next = button('btn.primary', last ? '🏡 ' + t('moveIn') : t('next'), () => {
        if (!canNext()) return;
        if (last) { finish(); return; }
        step++; render();
      });
      return h('div.onb-nav', null, step > 0 ? button('btn.soft', t('back'), () => { step--; render(); }) : null, next);
    };
    const choice = (on: boolean, icon: string, label: string, sub: string | null, click: () => void) =>
      button('choice' + (on ? '.on' : ''), [h('span.cf', null, icon), h('div', null, label, sub ? h('small', null, sub) : null)], click);

    const finish = () => {
      previewStop?.();
      res.name = res.name.trim() || ({ cat: 'Mochi', fox: 'Kit', dog: 'Biscotti' } as Record<string, string>)[res.species];
      root.style.transition = 'opacity .4s'; root.style.opacity = '0';
      setTimeout(() => root.remove(), 400);
      resolve(res);
    };

    const render = () => {
      previewStop?.(); previewStop = null;
      root.className = 'onb';
      const kind = steps()[step];
      const card = h('div.onb-card');
      card.append(dotsEl());
      if (kind === 'native') {
        card.append(h('h2', null, t('pickNative')));
        for (const l of LANGUAGES) card.append(choice(res.native === l.code, l.flag, l.autonym, null, () => {
          res.native = l.code; setUiLang(l.code);
          if (res.target === l.code) res.target = LANGUAGES.find((x) => x.code !== l.code)!.code;
          render();
        }));
        card.append(nav(() => true));
      } else if (kind === 'target') {
        card.append(h('h2', null, t('pickTarget')));
        for (const l of LANGUAGES.filter((x) => x.code !== res.native)) card.append(choice(res.target === l.code, l.flag, l.autonym, null, () => { res.target = l.code; render(); }));
        card.append(nav(() => true));
      } else if (kind === 'level') {
        const name = LANGUAGES.find((l) => l.code === res.target)!.autonym;
        card.append(h('h2', null, t('pickLevel', { lang: name })));
        const lv: [Level, string][] = [['beginner', '🌱'], ['intermediate', '🌿'], ['advanced', '🌳']];
        for (const [v, ic] of lv) card.append(choice(res.level === v, ic, t('lvl_' + v), t('lvl_' + v + '_d'), () => {
          res.level = v; res.jaScript = v === 'beginner' ? 'kana' : v === 'intermediate' ? 'furigana' : 'kanji'; render();
        }));
        card.append(nav(() => true));
      } else if (kind === 'script') {
        card.append(h('h2', null, t('pickScript')));
        const opts: [JaScript, string, string][] = [['kana', 'あ', 'ねこ が すき'], ['furigana', 'ふ', ''], ['kanji', '字', '']];
        for (const [v, ic] of opts) card.append(choice(res.jaScript === v, ic, t('script_' + v), t('script_' + v + '_d'), () => { res.jaScript = v; render(); }));
        card.append(h('div.set-row', { style: { borderBottom: 0 } }, h('span', null, '🔤 ' + t('romaji')), toggle(res.romaji, (v) => (res.romaji = v))));
        card.append(nav(() => true));
      } else {
        card.append(h('h2', null, t('makePlush')));
        const pv = h('div.preview');
        card.append(pv);
        const input = h('input.name-input', { placeholder: t('yourName'), maxlength: 12, value: res.name, 'aria-label': t('yourName') }) as HTMLInputElement;
        input.addEventListener('input', () => (res.name = input.value.replace(/[{}|^$<>]/g, '')));
        card.append(input);
        const swatches = h('div.swatches');
        const drawSw = () => swatches.replaceChildren(...PLAYER_COLORS.map((c) => button('swatch' + (c === res.color ? '.on' : ''), '', () => { res.color = c; drawSw(); startPreview(); }, { style: { background: c }, 'aria-label': c })));
        drawSw();
        card.append(h('div', { style: { marginTop: '12px' } }, seg<Species>([
          { v: 'cat', label: '🐱 ' + t('species_cat') }, { v: 'fox', label: '🦊 ' + t('species_fox') }, { v: 'dog', label: '🐶 ' + t('species_dog') },
        ], res.species, (v) => { res.species = v; startPreview(); }, 'wide')), swatches);
        card.append(nav(() => true, true));
        const startPreview = () => {
          previewStop?.();
          const { renderer, scene, camera } = mini();
          const p = new Plush(playerSpec(res.species, res.color));
          scene.add(p.root);
          pv.replaceChildren(renderer.domElement);
          const rect = () => pv.getBoundingClientRect();
          let alive = true, last = performance.now();
          const loop = (now: number) => {
            if (!alive) return;
            const r = rect();
            renderer.setSize(r.width, r.height, false);
            camera.aspect = r.width / Math.max(1, r.height); camera.updateProjectionMatrix();
            camera.position.set(0, 1.0, 3.1); camera.lookAt(0, 0.72, 0);
            const dt = Math.min(0.05, (now - last) / 1000); last = now;
            p.targetYaw += dt * 0.6; p.yaw = p.targetYaw;
            p.update(dt, now / 1000);
            renderer.render(scene, camera);
            requestAnimationFrame(loop);
          };
          requestAnimationFrame(loop);
          setTimeout(() => { p.setExpr('happy'); setTimeout(() => p.setExpr('neutral'), 900); }, 200);
          previewStop = () => { alive = false; scene.remove(p.root); };
        };
        setTimeout(startPreview, 30);
      }
      root.replaceChildren(card);
    };

    // Title screen
    root.append(
      logoBlock(),
      h('div.tap-start', null, t('tapStart')),
    );
    root.addEventListener('click', function start() {
      root.removeEventListener('click', start);
      audio.unlock(); audio.open(); speech.prime();
      render();
    });
  });
}
