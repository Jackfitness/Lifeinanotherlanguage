import { S, store, type PairProgress, type SrsCard } from '../core/save';
import { bus } from '../core/events';
import { LEVEL_NUM } from '../core/types';
import { lex, LEXICON, type Lexeme } from '../content/lexicon';
import { phrase, type Phrase } from '../content/phrases';
import { NOTES, type GrammarNote } from '../content/notes';
import { grade, isDue, mastery, newCard } from './srs';
import { plainText, renderNative, renderTarget, romanized, tilesOf, type RenderOpts } from './text';
import { toSyllables } from '../audio/samples';
import { speech } from './tts';
import { voicePack } from '../audio/voicepack';

/** Learning state for the active native→target pair, plus rendering helpers bound to settings. */
export const pairKey = () => `${S().profile.native}>${S().profile.target}`;
export const target = () => S().profile.target;
export const native = () => S().profile.native;
export const levelNum = () => LEVEL_NUM[S().profile.level];

export function progress(): PairProgress {
  const d = S();
  const k = pairKey();
  if (!d.learning[k]) d.learning[k] = { lex: {}, phr: {}, notes: [] };
  return d.learning[k];
}

export const renderOpts = (extra: Partial<RenderOpts> = {}): RenderOpts =>
  ({ jaScript: S().settings.jaScript, romaji: S().settings.romaji, name: S().profile.name, ...extra });

// ------------------------------------------------------------ rendering
export const lexTarget = (id: string, extra: Partial<RenderOpts> = {}) => renderTarget(lex(id).t[target()] ?? lex(id).t.en, target(), renderOpts(extra));
export const lexNative = (id: string) => renderNative(lex(id).t[native()] ?? lex(id).t.en, native(), renderOpts());
export const lexPlain = (id: string) => plainText(lex(id).t[target()], target(), renderOpts());

/** Raw target text of an item lexeme for $item substitution. */
const itemSrc = (itemLex?: string, lang = target()) => (itemLex ? lex(itemLex).t[lang] ?? lex(itemLex).t.en : undefined);

export const phraseTarget = (id: string, itemLex?: string, extra: Partial<RenderOpts> = {}) =>
  renderTarget(phrase(id).t[target()], target(), renderOpts({ item: itemSrc(itemLex), ...extra }));
export const phraseNative = (id: string, itemLex?: string) =>
  renderNative(phrase(id).t[native()] ?? phrase(id).t.en, native(), renderOpts({ item: itemSrc(itemLex, native()) }));
export const phrasePlain = (id: string, itemLex?: string) =>
  plainText(phrase(id).t[target()], target(), renderOpts({ item: itemSrc(itemLex) }));
/** Babble syllables for a villager line, following the real line's rhythm and vowels. */
export const phraseSyllables = (id: string, itemLex?: string) =>
  toSyllables(romanized(phrase(id).t[target()], target(), renderOpts({ item: itemSrc(itemLex) })));
export const phraseTiles = (id: string, itemLex?: string) =>
  tilesOf(phrase(id).t[target()], target(), renderOpts({ item: itemSrc(itemLex) }));

export function say(text: string, rate?: number, onEnd?: () => void) {
  speech.speak(text, target(), { rate: rate ?? S().settings.rate, onEnd });
}
/** Speak a phrase: neural pre-rendered clip when available, device voice otherwise. */
export function sayPhrase(id: string, itemLex?: string, onEnd?: () => void) {
  speech.stop();
  if (voicePack.play(itemLex ? `p:${id}|${itemLex}` : `p:${id}`, onEnd)) return;
  say(phrasePlain(id, itemLex), undefined, onEnd);
}
export function sayLex(id: string) {
  speech.stop();
  if (voicePack.play(`w:${id}`)) return;
  say(lexPlain(id));
}
export function stopSpeaking() { speech.stop(); voicePack.stop(); }
/** Load the pronunciation pack for the current target language and speed setting. */
export function loadVoicePack() { voicePack.ensure(target(), S().settings.rate < 0.85 ? 'slow' : 'normal'); }

// ------------------------------------------------------------ tracking
type Kind = 'lex' | 'phr';
const bucket = (k: Kind) => (k === 'lex' ? progress().lex : progress().phr);
export const card = (k: Kind, id: string): SrsCard | undefined => bucket(k)[id];
export const masteryOf = (k: Kind, id: string) => mastery(card(k, id));

/** Record exposure. Returns true the first time the item is met. */
export function expose(k: Kind, id: string): boolean {
  const b = bucket(k);
  const isNew = !b[id];
  if (isNew) b[id] = newCard();
  b[id].seen++;
  if (isNew && k === 'lex') bus.emit('learn:newWord', id);
  store.touch('learn');
  if (isNew) bus.emit('learn:count');
  return isNew;
}

/** Grade a recall. Returns whether the item was due (rewards only flow for due reviews). */
export function review(k: Kind, id: string, correct: boolean, assisted = false): { wasDue: boolean } {
  const b = bucket(k);
  if (!b[id]) b[id] = newCard();
  const wasDue = isDue(b[id]);
  b[id] = grade(b[id], correct, assisted);
  const st = S().stats;
  st.answered++;
  if (correct) st.correct++;
  store.touch('review');
  return { wasDue };
}

export function exposePhrase(id: string) {
  expose('phr', id);
  for (const w of phrase(id).words ?? []) expose('lex', w);
}

export const metWords = () => Object.keys(progress().lex);

/** Due lexemes, most overdue first; optionally filtered. */
export function dueWords(n: number, filter?: (l: Lexeme) => boolean): string[] {
  const now = Date.now();
  return Object.entries(progress().lex)
    .filter(([id, c]) => c.due <= now && (!filter || filter(lex(id))))
    .sort((a, b) => a[1].due - b[1].due)
    .slice(0, n)
    .map(([id]) => id);
}

/** Words to weave into small talk: due first, then new words appropriate to the level. */
export function wordsForChat(n: number, filter?: (l: Lexeme) => boolean): string[] {
  const picked = dueWords(n, filter);
  if (picked.length < n) {
    const known = new Set(metWords());
    const fresh = LEXICON.filter((l) => !known.has(l.id) && l.lvl <= levelNum() + 1 && (!filter || filter(l)) && l.cat !== 'action');
    shuffle(fresh);
    picked.push(...fresh.slice(0, n - picked.length).map((l) => l.id));
  }
  if (picked.length < n) {
    const rest = metWords().filter((id) => !picked.includes(id) && (!filter || filter(lex(id))));
    shuffle(rest);
    picked.push(...rest.slice(0, n - picked.length));
  }
  return picked;
}

/** Distractor lexemes: same category, preferring words the player has already met. */
export function distractors(id: string, n: number, pool?: string[]): string[] {
  const base = lex(id);
  const known = new Set(metWords());
  const tgt = target();
  const cands = (pool ?? LEXICON.filter((l) => l.cat === base.cat).map((l) => l.id))
    .filter((x) => x !== id && lex(x).t[tgt] !== base.t[tgt] && lex(x).icon !== base.icon);
  cands.sort((a, b) => Number(known.has(b)) - Number(known.has(a)) + (Math.random() - 0.5) * 0.8);
  return cands.slice(0, n);
}

/** First-time grammar note for a phrase, if any. */
export function noteFor(p: Phrase): GrammarNote | undefined {
  const seen = progress().notes;
  const src = p.t[target()] ?? '';
  return NOTES.find((n) => n.target === target() && !seen.includes(n.id) && n.body[native()] &&
    ((n.phrases && n.phrases.includes(p.id)) || (n.contains && src.includes(n.contains))));
}
export function markNote(id: string) { progress().notes.push(id); store.touch('note'); }

/** Whether the native-language meaning should show without a tap. */
/** Meanings stay hidden (tap to peek) unless the player turned on "Always show meanings". */
export const glossVisible = (_p?: Phrase) => !!S().settings.showMeanings;

export function shuffle<T>(a: T[]): T[] {
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}
