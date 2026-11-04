import { registerLexemes } from '../lexicon';
import { registerPhrases } from '../phrases';
import { QUESTS } from '../quests';
import { CONVOS } from '../dialogues';
import { registerNpcs } from '../characters';
import { registerItems } from '../items';
import type { TownContent } from './types';
import { INK } from './ink';
import { CLOVER } from './clover';
import { HARBOR } from './harbor';
import { LANTERN } from './lantern';
import { SNOWCAP } from './snowcap';
import { STARLIGHT } from './starlight';

/** Every town: the free writing-systems town, then N5 to N1. */
export const TOWNS: TownContent[] = [INK, CLOVER, HARBOR, LANTERN, SNOWCAP, STARLIGHT];
export const TOWN_IDS = TOWNS.map((t) => t.id);
export const townById = (id: string) => TOWNS.find((t) => t.id === id);
export const isTown = (id: string | undefined) => !!id && TOWN_IDS.includes(id);

let registered = false;
/** Adds every town's words, phrases, villagers, items, quests and dialogue to the shared tables. */
export function registerTowns() {
  if (registered) return;
  registered = true;
  for (const t of TOWNS) {
    registerLexemes(t.words);
    registerPhrases(t.phrases);
    registerNpcs(t.npcs);
    if (t.items) registerItems(t.items);
    for (const q of t.quests) if (!QUESTS.some((x) => x.id === q.id)) QUESTS.push(q);
    Object.assign(CONVOS, t.convos);
  }
}
