import type { Expr, LText } from '../../core/types';
import type { Lexeme } from '../lexicon';
import type { Phrase } from '../phrases';
import type { Step } from '../dialogues';
import type { QuestDef } from '../quests';
import type { NpcDef } from '../characters';
import type { ItemDef } from '../items';

/** A town word: tagged with the story chapter ("unit") that teaches it. */
export interface TownWord extends Lexeme { unit: number; town: string }

/** Grammar drill: a Japanese sentence with a blank (＿＿), the right choice and distractors. */
export interface DrillItem { q: string; a: string; wrong: string[]; m: LText }
export interface GrammarPoint { id: string; unit: number; title: LText; note: LText; example: string; exampleM: LText; items: DrillItem[] }

/** Short reading passage; the first option is the right answer. */
export interface Reading { id: string; unit: number; text: string; q: LText; options: LText[] }

/** Everything one Village Pass town needs: words, grammar, readings, story and villagers. */
export interface TownContent {
  id: string;
  level: string;
  /** Which 3D look the town uses (see world/towns/build.ts). */
  theme: string;
  words: TownWord[];
  grammar: GrammarPoint[];
  readings: Reading[];
  phrases: Phrase[];
  quests: QuestDef[];
  npcs: NpcDef[];
  convos: Record<string, Step[]>;
  items?: ItemDef[];
  units: number;
  unitTitles: LText[];
  /** Dojo teacher (villager id). */
  sensei: string;
  /** Last story chapter: its first step is the exam. */
  finaleQuest: string;
  examTitle: LText;
  examPassedSub: LText;
  arrive: LText;
  finaleTitle: LText;
  finaleSub: LText;
  /** Building signs in ruby markup. */
  signs: { hall: string; post: string; restaurant: string; dojo: string; market: string };
}

/** Story-writing helpers shared by every town. */
export function storyKit(phrases: Phrase[], phrasePrefix: string, wordPrefix: string) {
  const P = (id: string, ja: string, en: string, es: string, words: string[] = [], lvl: 1 | 2 | 3 = 2) => {
    phrases.push({ id: phrasePrefix + id, lvl, words: words.map((w) => (w.includes('_') ? w : wordPrefix + w)), t: { ja, en, es } });
    return phrasePrefix + id;
  };
  return {
    P,
    say: (p: string, e: Expr = 'neutral'): Step => ({ t: 'say', p, e }),
    reply: (ok: string[], bad: string[] = []): Step => ({ t: 'reply', ok, bad }),
    build: (p: string): Step => ({ t: 'build', p }),
    meaning: (p: string): Step => ({ t: 'meaning', p }),
    narrate: (en: string, es: string, ja = ''): Step => ({ t: 'narrate', text: { en, es, ja } }),
    quiz: (q: LText, options: string[], answer = 0): Step => ({ t: 'quiz', q, options, answer }),
    doIt: (fn: string, arg?: unknown): Step => ({ t: 'do', fn, arg }),
    C: (id: string, steps: Step[]) => [id, steps] as const,
    obj: (en: string, es: string, ja = '') => ({ en, es, ja }),
  };
}

/** Builds a chapter quest. Chapter N follows chapter N-1. */
export function chapter(town: string, n: number, icon: string, title: LText, summary: LText, steps: QuestDef['steps'], reward: QuestDef['reward']): QuestDef {
  return { id: `${town}_${n}`, icon, title, summary, steps, reward, after: n > 1 ? [`${town}_${n - 1}`] : [], town, chapter: n };
}

/** Builds a vocabulary helper for one town. */
export function wordKit(town: string, prefix: string, lvl: number) {
  return (unit: number, id: string, cat: TownWord['cat'], ja: string, en: string, es: string, icon = ''): TownWord =>
    ({ id: prefix + id, cat, icon, lvl, unit, town, t: { ja, en, es } } as TownWord);
}
