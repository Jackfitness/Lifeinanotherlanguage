import { S, store } from '../core/save';
import { pick } from '../core/i18n';
import { lex } from '../content/lexicon';
import { phrase } from '../content/phrases';
import { TOWNS, townById } from '../content/towns';
import type { GrammarPoint, Reading, TownContent } from '../content/towns/types';
import { renderNative, renderTarget } from './text';
import { card, dueWords, lexNative, lexTarget, masteryOf, native, phraseNative, phraseTarget, renderOpts, review, sayLex, sayPhrase, shuffle, target } from './engine';
import { mastery } from './srs';

/** One dojo question, ready for the dialogue UI. */
export interface DojoQ {
  section: 'vocab' | 'kanji' | 'grammar' | 'reading' | 'listening';
  prompt: string;        // HTML
  promptJa: boolean;     // prompt is Japanese (bigger, speakable)
  sub: string;           // instruction / question in the player's language (HTML)
  options: { html: string; ja: boolean }[];
  answer: number;
  explain: string;       // HTML shown after a wrong answer
  speak?: () => void;    // audio for the prompt
  autoSpeak?: boolean;   // listening: play immediately, hide text
  grade: (correct: boolean) => void;
}

let T: TownContent = TOWNS[0];
/** Point the dojo at the town the player is in. */
export function setDojoTown(id: string) { T = townById(id) ?? TOWNS[0]; }
export const dojoTown = () => T;
type TownState = { lessons: Record<string, number>; examBest: number; examPassed: boolean; grammar: Record<string, { right: number; wrong: number }>; sessions: number; arrived: boolean };

export function townState(id = T.id): TownState {
  const d = S() as unknown as { towns?: Record<string, TownState> };
  if (!d.towns) d.towns = {};
  if (!d.towns[id]) d.towns[id] = { lessons: {}, examBest: 0, examPassed: false, grammar: {}, sessions: 0, arrived: false };
  return d.towns[id];
}

/** Units are unlocked as the story reaches them (chapter N unlocks unit N). */
export function unlockedUnits(): number {
  let n = 1;
  for (const q of T.quests) {
    const st = S().quests[q.id];
    if (st && q.chapter && q.chapter <= T.units) n = Math.max(n, q.chapter);
  }
  return n;
}

export const lessonsDone = () => Object.keys(townState().lessons).filter((k) => townState().lessons[k] >= 60).length;

/** Belt earned in the dojo: lessons and the exam move you up. */
export function belt(): { id: string; color: string; name: { en: string; es: string; ja: string } } {
  const ts = townState(), done = lessonsDone();
  if (ts.examPassed) return { id: 'black', color: '#3A2E26', name: { en: 'Black belt', es: 'Cinturón negro', ja: '黒帯' } };
  if (done >= 8) return { id: 'brown', color: '#8A5A3B', name: { en: 'Brown belt', es: 'Cinturón marrón', ja: '茶帯' } };
  if (done >= 6) return { id: 'blue', color: '#5E95C4', name: { en: 'Blue belt', es: 'Cinturón azul', ja: '青帯' } };
  if (done >= 4) return { id: 'green', color: '#4F9466', name: { en: 'Green belt', es: 'Cinturón verde', ja: '緑帯' } };
  if (done >= 2) return { id: 'yellow', color: '#E9A92A', name: { en: 'Yellow belt', es: 'Cinturón amarillo', ja: '黄帯' } };
  return { id: 'white', color: '#FFFFFF', name: { en: 'White belt', es: 'Cinturón blanco', ja: '白帯' } };
}

/** Share of town words the player knows well (mastery ≥ 3). */
export function townMastery() {
  const words = T.words;
  return words.filter((w) => mastery(card('lex', w.id)) >= 3).length / words.length;
}

// ------------------------------------------------------------------ helpers
const ja = (markup: string, extra = {}) => renderTarget(markup, target(), renderOpts(extra));
const kanjiOnly = (markup: string) => renderTarget(markup, target(), { ...renderOpts(), jaScript: 'kanji', romaji: false, showRuby: false });
const reading = (markup: string) => markup.replace(/\{([^|}]+)\|([^}]+)\}/g, '$2').replace(/\^/g, '').replace(/ /g, '');
const nat = (txt: { [k: string]: string }) => renderNative(pick(txt, native()), native(), { name: S().profile.name });
const hasKanji = (markup: string) => /\{[^|}]*[一-龯][^|}]*\|/.test(markup);

function wordsIn(units: number[]) { return T.words.filter((w) => units.includes(w.unit)); }
function grammarIn(units: number[]) { return T.grammar.filter((g) => units.includes(g.unit)); }

function pickOthers<T2>(pool: T2[], not: T2, n: number, key: (x: T2) => string) {
  const k = key(not);
  const seen = new Set([k]);
  const out: T2[] = [];
  for (const x of shuffle([...pool])) { const kx = key(x); if (!seen.has(kx)) { seen.add(kx); out.push(x); } if (out.length >= n) break; }
  return out;
}

function mcq(correct: { html: string; ja: boolean }, wrong: { html: string; ja: boolean }[]) {
  const options = shuffle([correct, ...wrong]);
  return { options, answer: options.indexOf(correct) };
}

const L = (en: string, es: string) => ({ en, es, ja: en });

// ------------------------------------------------------------------ generators
export function vocabQ(id: string, pool: string[], recall = Math.random() < 0.5): DojoQ {
  const w = lex(id);
  const others = pickOthers(pool, id, 3, (x) => lex(x).t.en);
  if (recall) {
    const { options, answer } = mcq({ html: lexTarget(id), ja: true }, others.map((o) => ({ html: lexTarget(o), ja: true })));
    return { section: 'vocab', prompt: lexNative(id), promptJa: false, sub: nat(L('Which word means this?', '¿Qué palabra significa esto?')), options, answer,
      explain: `<b>${lexTarget(id)}</b> — ${lexNative(id)}`, speak: () => sayLex(id), grade: (c) => review('lex', id, c) };
  }
  const { options, answer } = mcq({ html: lexNative(id), ja: false }, others.map((o) => ({ html: lexNative(o), ja: false })));
  void w;
  return { section: 'vocab', prompt: lexTarget(id), promptJa: true, sub: nat(L('What does it mean?', '¿Qué significa?')), options, answer,
    explain: `<b>${lexTarget(id)}</b> — ${lexNative(id)}`, speak: () => sayLex(id), grade: (c) => review('lex', id, c) };
}

export function kanjiQ(id: string, pool: string[]): DojoQ {
  const src = lex(id).t.ja;
  const others = pickOthers(pool.filter((x) => hasKanji(lex(x).t.ja)), id, 3, (x) => reading(lex(x).t.ja));
  const { options, answer } = mcq({ html: reading(src), ja: true }, others.map((o) => ({ html: reading(lex(o).t.ja), ja: true })));
  return { section: 'kanji', prompt: kanjiOnly(src), promptJa: true, sub: nat(L('How do you read it?', '¿Cómo se lee?')), options, answer,
    explain: `<b>${ja(src, { jaScript: 'furigana' })}</b> — ${lexNative(id)}`, speak: () => sayLex(id), grade: (c) => review('lex', id, c) };
}

export function listenWordQ(id: string, pool: string[]): DojoQ {
  const q = vocabQ(id, pool, false);
  return { ...q, section: 'listening', prompt: '', promptJa: true, autoSpeak: true, sub: nat(L('Listen. What did you hear?', 'Escucha. ¿Qué has oído?')) };
}

export function listenPhraseQ(pid: string, pool: string[]): DojoQ {
  const others = pickOthers(pool, pid, 3, (x) => phrase(x).t.en);
  const { options, answer } = mcq({ html: phraseNative(pid), ja: false }, others.map((o) => ({ html: phraseNative(o), ja: false })));
  return { section: 'listening', prompt: '', promptJa: true, autoSpeak: true, sub: nat(L('Listen. What did they say?', 'Escucha. ¿Qué han dicho?')), options, answer,
    explain: `<b>${phraseTarget(pid)}</b> — ${phraseNative(pid)}`, speak: () => sayPhrase(pid), grade: (c) => review('phr', pid, c) };
}

export function grammarQ(g: GrammarPoint, item = g.items[Math.floor(Math.random() * g.items.length)]): DojoQ {
  const { options, answer } = mcq({ html: ja(item.a), ja: true }, item.wrong.map((w) => ({ html: ja(w), ja: true })));
  return { section: 'grammar', prompt: ja(item.q).replace(/＿＿/g, '<span class="blank">＿＿</span>'), promptJa: true,
    sub: `${nat(L('Fill in the blank', 'Completa el espacio'))} · <i>${nat(item.m)}</i>`, options, answer,
    explain: `<b>${nat(g.title)}</b> — ${nat(g.note)}`,
    grade: (c) => { const st = townState().grammar[g.id] ?? { right: 0, wrong: 0 }; c ? st.right++ : st.wrong++; townState().grammar[g.id] = st; store.touch('grammar'); } };
}

export function readingQ(r: Reading): DojoQ {
  const { options, answer } = mcq({ html: nat(r.options[0]), ja: false }, r.options.slice(1).map((o) => ({ html: nat(o), ja: false })));
  return { section: 'reading', prompt: ja(r.text), promptJa: true, sub: nat(r.q), options, answer,
    explain: nat(r.options[0]), grade: () => {} };
}

/** Villager lines from the story, keyed by the chapter they appear in (used for listening drills). */
const LINE_UNITS = new Map<string, Map<string, number>>();
function lineUnits() {
  let m = LINE_UNITS.get(T.id);
  if (m) return m;
  m = new Map();
  for (const [cid, steps] of Object.entries(T.convos)) {
    const ch = cid.match(/^[a-z]+(\d)_/);
    if (!ch) continue;
    for (const st of steps) if (st.t === 'say' && !m.has(st.p)) m.set(st.p, Math.min(Number(ch[1]), T.units));
  }
  LINE_UNITS.set(T.id, m);
  return m;
}
const storyLines = (units: number[]) =>
  [...lineUnits()].filter(([p, u]) => units.includes(u) && !phrase(p).t.ja.includes('$')).map(([p]) => p);

// ------------------------------------------------------------------ sessions
export type SessionKind = 'lesson' | 'daily' | 'vocab' | 'kanji' | 'grammar' | 'listening' | 'reading' | 'exam';

export function buildSession(kind: SessionKind, unit = 1): DojoQ[] {
  const units = kind === 'lesson' ? [unit] : Array.from({ length: unlockedUnits() }, (_, i) => i + 1);
  const allUnits = Array.from({ length: T.units }, (_, i) => i + 1);
  const words = wordsIn(units).map((w) => w.id);
  const pool = wordsIn(kind === 'exam' ? allUnits : units).map((w) => w.id);
  const kanjiWords = words.filter((id) => hasKanji(lex(id).t.ja));
  const gram = grammarIn(units);
  const lines = storyLines(units);
  const qs: DojoQ[] = [];
  const take = <X>(arr: X[], n: number) => shuffle([...arr]).slice(0, n);
  switch (kind) {
    case 'lesson':
      for (const g of take(gram, 4)) qs.push(grammarQ(g));
      while (qs.length < 4 && gram.length) qs.push(grammarQ(gram[qs.length % gram.length]));
      for (const id of take(words, 3)) qs.push(vocabQ(id, pool));
      for (const id of take(words, 2)) qs.push(listenWordQ(id, pool));
      if (kanjiWords.length) qs.push(kanjiQ(take(kanjiWords, 1)[0], pool));
      else qs.push(vocabQ(take(words, 1)[0], pool, true));
      { const r = T.readings.find((x) => x.unit === unit); if (r) qs.push(readingQ(r)); }
      break;
    case 'daily': {
      const due = dueWords(6, (l) => (l as unknown as { town?: string }).town === T.id && units.includes((l as unknown as { unit: number }).unit));
      const fresh = take(words.filter((w) => !due.includes(w)), 6 - due.length);
      for (const id of [...due, ...fresh]) qs.push(Math.random() < 0.3 ? listenWordQ(id, pool) : vocabQ(id, pool));
      for (const g of take(gram, 3)) qs.push(grammarQ(g));
      if (kanjiWords.length) qs.push(kanjiQ(take(kanjiWords, 1)[0], pool));
      break;
    }
    case 'vocab': for (const id of take(words, 10)) qs.push(vocabQ(id, pool)); break;
    case 'kanji': for (const id of take(kanjiWords, 10)) qs.push(kanjiQ(id, pool)); break;
    case 'grammar': for (let i = 0; i < 10 && gram.length; i++) qs.push(grammarQ(gram[Math.floor(Math.random() * gram.length)])); break;
    case 'listening':
      for (const id of take(words, 6)) qs.push(listenWordQ(id, pool));
      for (const p of take(lines, 4)) qs.push(listenPhraseQ(p, lines));
      break;
    case 'reading': for (const r of take(T.readings.filter((x) => units.includes(x.unit)), 5)) qs.push(readingQ(r)); break;
    case 'exam': {
      const all = wordsIn(allUnits).map((w) => w.id);
      const allKanji = all.filter((id) => hasKanji(lex(id).t.ja));
      const allGram = T.grammar;
      const allLines = storyLines(allUnits);
      for (const id of take(all, 8)) qs.push(vocabQ(id, all));
      for (const id of take(allKanji, 6)) qs.push(kanjiQ(id, all));
      for (const g of take(allGram, 8)) qs.push(grammarQ(g));
      for (const r of take(T.readings, 4)) qs.push(readingQ(r));
      for (const p of take(allLines, 4)) qs.push(listenPhraseQ(p, allLines));
      return qs; // keep exam sections in order
    }
  }
  return shuffle(qs);
}

export function grammarFor(unit: number) { return grammarIn([unit]); }
export const unitTitle = (u: number) => pick(T.unitTitles[u - 1], native());
export const vocabCount = (u: number) => wordsIn([u]).length;
export const masteredIn = (u: number) => wordsIn([u]).filter((w) => masteryOf('lex', w.id) >= 3).length;
