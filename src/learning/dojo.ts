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
  section: 'vocab' | 'kanji' | 'grammar' | 'reading' | 'listening' | 'writing';
  prompt: string;        // HTML
  promptJa: boolean;     // prompt is Japanese (bigger, speakable)
  sub: string;           // instruction / question in the player's language (HTML)
  options: { html: string; ja: boolean }[];
  answer: number;
  explain: string;       // HTML shown after a wrong answer
  speak?: () => void;    // audio for the prompt
  autoSpeak?: boolean;   // listening: play immediately, hide text
  grade: (correct: boolean) => void;
  /** Writing drill: the character to trace instead of picking an option. */
  trace?: string;
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
/** In the writing-systems town kanji always show as kanji (with furigana), whatever the reading setting. */
const wordHtml = (id: string) => (T.script && hasKanji(lex(id).t.ja) ? ja(lex(id).t.ja, { jaScript: 'furigana' }) : lexTarget(id));
const isKana = (id: string) => !!(lex(id) as unknown as { kana?: boolean }).kana;

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
    const { options, answer } = mcq({ html: wordHtml(id), ja: true }, others.map((o) => ({ html: wordHtml(o), ja: true })));
    return { section: 'vocab', prompt: lexNative(id), promptJa: false, sub: nat(isKana(id) ? L('Which character is this?', '¿Qué carácter es este?') : L('Which word means this?', '¿Qué palabra significa esto?')), options, answer,
      explain: `<b>${wordHtml(id)}</b> — ${lexNative(id)}`, speak: () => sayLex(id), grade: (c) => review('lex', id, c) };
  }
  const { options, answer } = mcq({ html: lexNative(id), ja: false }, others.map((o) => ({ html: lexNative(o), ja: false })));
  void w;
  return { section: 'vocab', prompt: wordHtml(id), promptJa: true, sub: nat(isKana(id) ? L('How do you read it?', '¿Cómo se lee?') : L('What does it mean?', '¿Qué significa?')), options, answer,
    explain: `<b>${wordHtml(id)}</b> — ${lexNative(id)}`, speak: () => sayLex(id), grade: (c) => review('lex', id, c) };
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
  // the writing town drills kanji shapes, so show them as kanji without readings
  const gj = (m: string) => (T.script ? ja(m, { jaScript: 'kanji', showRuby: false, romaji: false }) : ja(m));
  const { options, answer } = mcq({ html: gj(item.a), ja: true }, item.wrong.map((w) => ({ html: gj(w), ja: true })));
  return { section: 'grammar', prompt: gj(item.q).replace(/＿＿/g, '<span class="blank">＿＿</span>'), promptJa: true,
    sub: `${nat(L('Fill in the blank', 'Completa el espacio'))} · <i>${nat(item.m)}</i>`, options, answer,
    explain: `<b>${nat(g.title)}</b> — ${nat(g.note)}`,
    grade: (c) => { const st = townState().grammar[g.id] ?? { right: 0, wrong: 0 }; c ? st.right++ : st.wrong++; townState().grammar[g.id] = st; store.touch('grammar'); } };
}

export function readingQ(r: Reading): DojoQ {
  const { options, answer } = mcq({ html: nat(r.options[0]), ja: false }, r.options.slice(1).map((o) => ({ html: nat(o), ja: false })));
  return { section: 'reading', prompt: T.script ? ja(r.text, { jaScript: 'furigana' }) : ja(r.text), promptJa: true, sub: nat(r.q), options, answer,
    explain: nat(r.options[0]), grade: () => {} };
}

/** Hear a character, pick it. */
export function listenKanaQ(id: string, pool: string[]): DojoQ {
  const q = vocabQ(id, pool, true);
  return { ...q, section: 'listening', prompt: '', promptJa: false, autoSpeak: true, sub: nat(L('Listen. Which character did you hear?', 'Escucha. ¿Qué carácter has oído?')) };
}

/** Trace a character (kana, or the kanji of a starter-kanji word). */
export function traceQ(id: string): DojoQ {
  const src = lex(id).t.ja;
  const glyph = hasKanji(src) ? (src.match(/\{([^|}]+)\|/)?.[1] ?? src)[0] : src.replace(/\{|\}|\|.*?\}/g, '')[0];
  return { section: 'writing', prompt: `<span class="trace-target">${lexNative(id)}</span>`, promptJa: false,
    sub: nat(L('Trace the character', 'Repasa el carácter')), options: [], answer: -1, trace: glyph,
    explain: `<b>${glyph}</b> — ${lexNative(id)}`, speak: () => sayLex(id), grade: (c) => review('lex', id, c) };
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
export type SessionKind = 'lesson' | 'daily' | 'vocab' | 'kanji' | 'grammar' | 'listening' | 'reading' | 'exam' | 'writing';

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
  if (T.script) return scriptSession(kind, unit, units, allUnits);
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

/** Sessions for the writing-systems town: read, hear and trace characters. */
function scriptSession(kind: SessionKind, unit: number, units: number[], allUnits: number[]): DojoQ[] {
  const take = <X>(arr: X[], n: number) => shuffle([...arr]).slice(0, n);
  const fill = <X>(arr: X[], n: number) => { const out: X[] = []; while (arr.length && out.length < n) out.push(...take(arr, n - out.length)); return out; };
  const kanaIn = (us: number[]) => wordsIn(us).filter((w) => w.kana).map((w) => w.id);
  const wordsOnly = (us: number[]) => wordsIn(us).filter((w) => !w.kana).map((w) => w.id);
  const kanjiIn = (us: number[]) => wordsIn(us).filter((w) => hasKanji(w.t.ja)).map((w) => w.id);
  const qs: DojoQ[] = [];
  const kana = kanaIn(units), plain = wordsOnly(units), kanji = kanjiIn(units), gram = grammarIn(units);
  const kanaPool = kana.length >= 4 ? kana : kanaIn(allUnits);
  switch (kind) {
    case 'lesson': {
      for (const g of fill(gram, 2)) qs.push(grammarQ(g));
      if (kana.length) {
        for (const id of take(kana, 3)) qs.push(vocabQ(id, kanaPool, false));
        for (const id of take(kana, 2)) qs.push(listenKanaQ(id, kanaPool));
        for (const id of take(kana, 2)) qs.push(traceQ(id));
      } else {
        for (const id of take(kanji, 3)) qs.push(kanjiQ(id, kanji));
        for (const id of take(kanji, 2)) qs.push(listenWordQ(id, kanji));
        for (const id of take(kanji, 2)) qs.push(traceQ(id));
      }
      if (plain.length) qs.push(vocabQ(take(plain, 1)[0], plain));
      { const r = T.readings.find((x) => x.unit === unit); if (r) qs.push(readingQ(r)); }
      return shuffle(qs);
    }
    case 'writing': for (const id of take([...kana, ...kanji], 8)) qs.push(traceQ(id)); return qs;
    case 'kanji': {
      const ks = kanji.length >= 4 ? kanji : kanjiIn(allUnits);
      for (const id of take(ks, 10)) qs.push(kanjiQ(id, ks));
      return qs;
    }
    case 'listening': for (const id of take(kanaPool, 10)) qs.push(listenKanaQ(id, kanaPool)); return qs;
    case 'vocab': case 'daily': {
      for (const id of take(kanaPool, 6)) qs.push(vocabQ(id, kanaPool));
      for (const id of take(plain, 4)) qs.push(vocabQ(id, plain));
      return shuffle(qs);
    }
    case 'grammar': for (const g of fill(gram, 10)) qs.push(grammarQ(g)); return qs;
    case 'reading': for (const r of take(T.readings.filter((x) => units.includes(x.unit)), 5)) qs.push(readingQ(r)); return qs;
    case 'exam': {
      const allKana = kanaIn(allUnits), allKanji = kanjiIn(allUnits);
      for (const id of take(allKana, 8)) qs.push(vocabQ(id, allKana, false));
      for (const id of take(allKana, 5)) qs.push(listenKanaQ(id, allKana));
      for (const id of take(allKanji, 5)) qs.push(kanjiQ(id, allKanji));
      for (const g of take(T.grammar, 4)) qs.push(grammarQ(g));
      for (const r of take(T.readings, 4)) qs.push(readingQ(r));
      for (const id of take([...take(allKana, 3), ...take(allKanji, 1)], 4)) qs.push(traceQ(id));
      return qs;
    }
  }
  return qs;
}

export function grammarFor(unit: number) { return grammarIn([unit]); }
export const unitTitle = (u: number) => pick(T.unitTitles[u - 1], native());
export const vocabCount = (u: number) => wordsIn([u]).length;
export const masteredIn = (u: number) => wordsIn([u]).filter((w) => masteryOf('lex', w.id) >= 3).length;
