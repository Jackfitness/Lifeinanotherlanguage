import './styles.css';
import { store } from './core/save';
import { setUiLang, t } from './core/i18n';
import { audio } from './audio/audio';
import { speech } from './learning/tts';
import { Game } from './game';
import { runOnboarding } from './ui/onboarding';
import { fadeThrough, h, ui } from './ui/dom';
import { applyFont } from './ui/fonts';

async function boot() {
  const canvas = document.getElementById('scene') as HTMLCanvasElement;
  const game = new Game(canvas);
  Object.assign(window, { __game: game, __audio: audio }); // debug handles for automated tests
  const hasSave = await store.load();
  void applyFont(hasSave ? store.data.settings.font : 'pop');

  if (hasSave) {
    setUiLang(store.data.profile.native);
    const title = h('div.onb.title-screen', null,
      h('div.logo', null, h('span.mark', null, '🧸'), h('h1', null, t('title')), h('p', null, t('subtitle'))),
      h('div.tap-start', null, t('tapStart')));
    ui().append(title);
    await new Promise<void>((res) => title.addEventListener('click', () => res(), { once: true }));
    audio.unlock(); audio.open(); speech.prime();
    await fadeThrough(() => { title.remove(); game.startPlay(false); });
    return;
  }

  const r = await runOnboarding();
  store.create({ name: r.name, species: r.species, color: r.color, native: r.native, target: r.target, level: r.level });
  store.data.settings.jaScript = r.jaScript;
  store.data.settings.romaji = r.romaji;
  store.touch('onboard');
  await fadeThrough(() => game.startPlay(true));
}

window.addEventListener('pagehide', () => store.flush());
document.addEventListener('visibilitychange', () => { if (document.hidden) store.flush(); });
void boot();
