import { S, store } from '../core/save';
import { pick, t } from '../core/i18n';
import type { JaScript, Level } from '../core/types';
import { LANGUAGES } from '../content/languages';
import { LEXICON, lex, type LexCat } from '../content/lexicon';
import { phrase } from '../content/phrases';
import { ITEMS, item } from '../content/items';
import { NPCS, heartsFor, HEART_THRESHOLDS } from '../content/characters';
import { QUESTS } from '../content/quests';
import { ACHIEVEMENTS, count, friend, playerLevel, qs, xpAt } from '../core/progress';
import { card, dueWords, lexNative, lexTarget, masteryOf, metWords, phraseNative, phraseTarget, progress, sayLex, sayPhrase, target } from '../learning/engine';
import { button, confirmCard, h, seg, sheet, toast, toggle } from './dom';
import { audio } from '../audio/audio';

export interface NotebookHost {
  applySettings: () => void;
  equip: (slot: 'hat' | 'neck' | 'face', id: string | undefined) => void;
  changeLanguages: (native: string, target: string) => void;
  resetSave: () => void;
  portrait: (id: string) => string;
}

type Tab = 'quests' | 'words' | 'bag' | 'friends' | 'me';
const TABS: { id: Tab; icon: string }[] = [
  { id: 'quests', icon: '📜' }, { id: 'words', icon: '📖' }, { id: 'bag', icon: '🎒' }, { id: 'friends', icon: '💛' }, { id: 'me', icon: '🌼' },
];

const dots = (n: number) => h('div.dots', { 'aria-label': t('m' + n) }, ...[1, 2, 3, 4, 5].map((i) => h('i' + (i <= n ? '.on' : ''))));

export function openNotebook(host: NotebookHost, start: Tab = 'quests') {
  const body = h('div');
  const tabs = h('nav.tabs');
  const s = sheet('', body, { tabs });
  let cur: Tab = start;
  const render = () => {
    s.titleEl.textContent = t('tab_' + cur);
    tabs.replaceChildren(...TABS.map((tb) => button('tab' + (tb.id === cur ? '.on' : ''), [h('span.ti', null, tb.icon), t('tab_' + tb.id)], () => { cur = tb.id; render(); })));
    body.replaceChildren(PAGES[cur](host, render));
    (body.parentElement as HTMLElement).scrollTop = 0;
  };
  render();
  return s;
}

const PAGES: Record<Tab, (host: NotebookHost, rerender: () => void) => HTMLElement> = {
  quests: () => {
    const wrap = h('div');
    const active = QUESTS.filter((q) => qs(q.id)?.state === 'active');
    const done = QUESTS.filter((q) => qs(q.id)?.state === 'done');
    if (!active.length) wrap.append(h('div.card', null, h('p', { style: { margin: 0, lineHeight: 1.55 } }, '🌙 ' + t('noQuests'))));
    for (const q of active) {
      const st = qs(q.id), step = q.steps[st.step];
      const c = h('div.card', null,
        h('div.quest-card', null, h('div.qi', null, q.icon), h('div', null, h('h3', null, pick(q.title)), h('p', null, pick(q.summary)))),
        h('div.objective', null, '➜', h('span', null, pick(step.objective))),
      );
      if (step.collect) c.append(h('div.objective', null, '🔎', h('span', null, step.collect.map((i) => `${lex(item(i).lex).icon}${st.found.includes(i) ? '✔' : '…'}`).join('  '))));
      if (step.hints?.length) {
        c.append(h('div.muted', { style: { fontSize: '0.75em', fontWeight: 700, margin: '10px 2px 0' } }, t('tapToRead')));
        for (const hp of step.hints) {
          const gl = h('span.hg.hidden', { html: phraseNative(hp) });
          const line = h('div.hint-line', { lang: target() }, h('span', { html: phraseTarget(hp) }), gl);
          line.addEventListener('click', () => { audio.tap(); gl.classList.toggle('hidden'); sayPhrase(hp); });
          c.append(line);
        }
      }
      wrap.append(c);
    }
    if (done.length) {
      wrap.append(h('div.section-title', null, t('questsDone')));
      for (const q of done) wrap.append(h('div.card.done-q', null, h('div.quest-card', null, h('div.qi', null, '✅'), h('div', null, h('h3', null, pick(q.title)), h('p', null, pick(q.summary))))));
    }
    return wrap;
  },

  words: () => {
    const wrap = h('div');
    const met = metWords();
    const due = dueWords(999).length;
    const st = S().stats;
    wrap.append(h('div.stat-row', null,
      h('div.stat', null, h('b', null, met.length), h('span', null, t('wordsLearned'))),
      h('div.stat', null, h('b', null, due), h('span', null, t('toReview'))),
      h('div.stat', null, h('b', null, st.answered ? Math.round((st.correct / st.answered) * 100) + '%' : '—'), h('span', null, t('accuracy'))),
    ));
    wrap.append(h('p.muted', { style: { fontSize: '0.85em', margin: '12px 4px', lineHeight: 1.5 } }, '💬 ' + t('reviewTip')));
    if (!met.length) { wrap.append(h('div.card', null, t('noWords'))); return wrap; }
    const cats: LexCat[] = ['food', 'fish', 'nature', 'object', 'place', 'color', 'furniture', 'clothing', 'feeling', 'action'];
    for (const cat of cats) {
      const ws = LEXICON.filter((l) => l.cat === cat && card('lex', l.id));
      if (!ws.length) continue;
      const total = LEXICON.filter((l) => l.cat === cat).length;
      wrap.append(h('div.section-title', null, h('span', null, t('cat_' + cat)), h('span', null, `${ws.length}/${total}`)));
      for (const l of ws) {
        const row = h('div.word', { role: 'button', tabindex: '0' },
          h('span.wi', null, l.icon),
          h('div.wt', null, h('b', { lang: target(), html: lexTarget(l.id) }), h('span', { html: lexNative(l.id) })),
          dots(masteryOf('lex', l.id)));
        row.addEventListener('click', () => { audio.tap(); sayLex(l.id); });
        wrap.append(row);
      }
    }
    const phr = Object.keys(progress().phr).filter((id) => { try { return !phrase(id).t.en.includes('$item'); } catch { return false; } });
    if (phr.length) {
      wrap.append(h('div.section-title', null, h('span', null, t('phrases')), h('span', null, phr.length)));
      for (const id of phr) {
        const row = h('div.word', { role: 'button', tabindex: '0' },
          h('span.wi', null, '💬'),
          h('div.wt', null, h('b', { lang: target(), html: phraseTarget(id) }), h('span', { html: phraseNative(id) })),
          dots(masteryOf('phr', id)));
        row.addEventListener('click', () => { audio.tap(); sayPhrase(id); });
        wrap.append(row);
      }
    }
    return wrap;
  },

  bag: (host, rerender) => {
    const wrap = h('div');
    const inv = Object.entries(S().inventory).filter(([, n]) => n > 0);
    const outfit = S().player.outfit;
    wrap.append(h('div.section-title', null, t('items')));
    if (!inv.length) wrap.append(h('div.card', null, t('emptyBag')));
    const grid = h('div.grid');
    for (const [id, n] of inv) {
      const def = item(id);
      const wearing = def.slot && outfit[def.slot] === id;
      const slot = h('div.slot' + (wearing ? '.sel' : ''), { role: 'button', tabindex: '0' },
        h('span.cnt', null, '×' + n), h('span.si', null, lex(def.lex).icon), h('span', { lang: target(), html: lexTarget(def.lex) }),
        def.slot ? h('div', { style: { marginTop: '6px' } }, h('span.pill', { style: { boxShadow: 'none', background: 'var(--cream)', fontSize: '0.85em' } }, wearing ? t('takeOff') : t('wear'))) : null);
      slot.addEventListener('click', () => {
        audio.tap(); sayLex(def.lex);
        if (def.slot) { host.equip(def.slot, wearing ? undefined : id); rerender(); }
        else toast(lex(def.lex).icon, lexNative(def.lex), lexTarget(def.lex), 1800);
      });
      grid.append(slot);
    }
    wrap.append(grid);
    // Pond journal
    const fish = ITEMS.filter((i) => i.kind === 'fish');
    const col = S().collection;
    wrap.append(h('div.section-title', null, h('span', null, '🎣 ' + t('collection')), h('span', null, `${fish.filter((f) => col[f.id]?.known).length}/${fish.length}`)));
    const fg = h('div.grid');
    for (const f of fish) {
      const c = col[f.id];
      const el = h('div.slot' + (!c ? '.unknown' : ''), null,
        c ? h('span.cnt', null, '×' + c.caught) : null,
        h('span.si', null, lex(f.lex).icon),
        c?.known ? h('span', { lang: target(), html: lexTarget(f.lex) }) : h('span.muted', null, c ? '?' : '—'));
      if (c?.known) el.addEventListener('click', () => { audio.tap(); sayLex(f.lex); });
      fg.append(el);
    }
    wrap.append(fg);
    return wrap;
  },

  friends: (host) => {
    const wrap = h('div');
    for (const n of NPCS) {
      const f = friend(n.id);
      const hearts = heartsFor(f.pts);
      const c = h('div.card');
      const img = h('div.avatar', { style: { background: n.tint + '55' } }, h('img', { src: host.portrait(n.id), alt: '', style: { width: '100%', height: '100%', objectFit: 'cover', borderRadius: '22px' } }));
      if (!f.met) {
        c.append(h('div.friend', null, img, h('div', null, h('b', null, '???'), h('div.muted', null, t('notMet')))));
        wrap.append(c); continue;
      }
      const next = HEART_THRESHOLDS[hearts + 1];
      c.append(h('div.friend', null, img, h('div', { style: { flex: 1 } },
        h('b', { style: { fontSize: '1.1em' } }, pick(n.name, target()), ' ', h('span.muted', { style: { fontWeight: 500, fontSize: '0.8em' } }, pick(n.title))),
        h('div.hearts', { 'aria-label': `${hearts}/5` }, '💛'.repeat(hearts) + '🤍'.repeat(5 - hearts)),
        next ? h('div.muted', { style: { fontSize: '0.75em' } }, `${f.pts} / ${next}`) : null)));
      c.append(h('p', { style: { fontSize: '0.9em', lineHeight: 1.5, margin: '10px 0 6px' } }, pick(n.personality)));
      c.append(h('div', { style: { fontSize: '0.88em', fontWeight: 700 } }, t('loves') + ': ',
        ...n.favorites.map((id) => h('span.chip', { style: { marginLeft: '4px' }, html: `<span class="ci">${lex(id).icon}</span>${lexTarget(id)}` }))));
      const told = n.stories.slice(0, f.story);
      if (told.length) {
        c.append(h('div.section-title', { style: { margin: '12px 0 4px' } }, t('stories')));
        for (const p of told) {
          const st = h('div.story', { lang: target() }, h('span', { html: phraseTarget(p) }), h('small', { html: phraseNative(p) }));
          st.addEventListener('click', () => { audio.tap(); sayPhrase(p); });
          c.append(st);
        }
      }
      wrap.append(c);
    }
    return wrap;
  },

  me: (host, rerender) => {
    const wrap = h('div');
    const d = S();
    const l = playerLevel();
    wrap.append(h('div.card', null, h('div.friend', null,
      h('div.avatar', { style: { background: 'var(--butter-soft)' } }, h('img', { src: host.portrait('player'), alt: '', style: { width: '100%', height: '100%', objectFit: 'cover', borderRadius: '22px' } })),
      h('div', null, h('b', { style: { fontSize: '1.15em' } }, d.profile.name),
        h('div.muted', { style: { fontSize: '0.85em' } }, `${t('level')} ${l} · ${d.player.xp - xpAt(l)}/${xpAt(l + 1) - xpAt(l)} XP`),
        h('div.muted', { style: { fontSize: '0.85em' } }, `🔥 ${t('streak', { n: d.stats.streak })} · 🪙 ${d.player.coins}`)))));
    // Achievements
    wrap.append(h('div.section-title', null, h('span', null, t('achievements')), h('span', null, `${Object.keys(d.achievements).length}/${ACHIEVEMENTS.length}`)));
    for (const a of ACHIEVEMENTS) {
      const got = !!d.achievements[a.id];
      wrap.append(h('div.card.ach' + (got ? '' : '.locked'), { style: { padding: '10px 14px', marginBottom: '6px' } },
        h('div.ai', null, a.icon), h('div', null, h('b', null, t('ach_' + a.id)), h('div.muted', { style: { fontSize: '0.82em' } }, t('ach_' + a.id + '_d')))));
    }
    // Settings
    wrap.append(h('div.section-title', null, t('settings')));
    const set = d.settings;
    const apply = () => { store.touch('settings'); host.applySettings(); };
    const rowEl = (label: string, ctl: HTMLElement) => h('div.set-row', null, h('span', null, label), ctl);
    const range = (v: number, min: number, max: number, step: number, on: (x: number) => void) => {
      const r = h('input', { type: 'range', min, max, step, value: v }) as HTMLInputElement;
      r.addEventListener('input', () => on(parseFloat(r.value)));
      return r;
    };
    const card2 = h('div.card');
    card2.append(
      rowEl('🎵 ' + t('music'), range(set.music, 0, 1, 0.05, (x) => { set.music = x; apply(); })),
      rowEl('🔔 ' + t('sfx'), range(set.sfx, 0, 1, 0.05, (x) => { set.sfx = x; apply(); })),
      rowEl('🗨️ ' + t('blips'), toggle(set.blips, (v) => { set.blips = v; apply(); })),
      rowEl('🔊 ' + t('autoplay'), toggle(set.autoplay, (v) => { set.autoplay = v; apply(); })),
      rowEl('🐢 ' + t('rate'), range(set.rate, 0.6, 1.15, 0.05, (x) => { set.rate = x; apply(); })),
      rowEl('🔠 ' + t('textSize'), seg([{ v: 'm', label: 'A' }, { v: 'l', label: 'A+' }, { v: 'xl', label: 'A++' }], set.textSize, (v) => { set.textSize = v; apply(); })),
      rowEl('🎚️ ' + t('proficiency'), seg<Level>([{ v: 'beginner', label: t('lvl_beginner') }, { v: 'intermediate', label: t('lvl_intermediate') }, { v: 'advanced', label: t('lvl_advanced') }], d.profile.level, (v) => { d.profile.level = v; apply(); })),
    );
    if (d.profile.target === 'ja') {
      card2.append(
        rowEl('あ ' + t('pickScript'), seg<JaScript>([{ v: 'kana', label: 'かな' }, { v: 'furigana', label: 'ふりがな' }, { v: 'kanji', label: '漢字' }], set.jaScript, (v) => { set.jaScript = v; apply(); })),
        rowEl('🔤 ' + t('romaji'), toggle(set.romaji, (v) => { set.romaji = v; apply(); })),
      );
    }
    card2.append(rowEl('🌙 ' + t('time'), seg([{ v: 'real', label: t('time_real') }, { v: 'day', label: t('time_day') }], set.timeMode, (v) => { set.timeMode = v as 'real' | 'day'; apply(); })));
    wrap.append(card2);
    // Languages
    wrap.append(h('div.section-title', null, t('languages')));
    const lc = h('div.card');
    const langSeg = (val: string, on: (v: string) => void, exclude?: string) =>
      seg(LANGUAGES.filter((x) => x.code !== exclude).map((x) => ({ v: x.code, label: x.autonym })), val, on);
    lc.append(
      rowEl('🗣️ ' + t('pickNative').replace(/[?？¿]/g, ''), langSeg(d.profile.native, (v) => {
        const tgt = v === d.profile.target ? LANGUAGES.find((x) => x.code !== v)!.code : d.profile.target;
        host.changeLanguages(v, tgt); rerender();
      })),
      rowEl('🌱 ' + t('learning'), langSeg(d.profile.target, (v) => { host.changeLanguages(d.profile.native, v); rerender(); }, d.profile.native)),
    );
    wrap.append(lc);
    wrap.append(h('div', { style: { textAlign: 'center', margin: '18px 0 8px' } }, button('btn.soft.small', '🌱 ' + t('resetSave'), async () => { if (await confirmCard(t('confirmReset'), t('resetSave'), t('back'))) host.resetSave(); })));
    wrap.append(h('p.muted', { style: { textAlign: 'center', fontSize: '0.72em' } }, 'Cozy Language Village · v0.1'));
    void count;
    return wrap;
  },
};
