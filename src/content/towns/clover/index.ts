import { registerLexemes } from '../../lexicon';
import { registerPhrases } from '../../phrases';
import { QUESTS } from '../../quests';
import { CONVOS } from '../../dialogues';
import { registerNpcs } from '../../characters';
import { CLOVER_WORDS } from './vocab';
import { CLOVER_GRAMMAR } from './grammar';
import { CLOVER_READINGS } from './reading';
import { CLOVER_CONVOS, CLOVER_NPCS, CLOVER_PHRASES, CLOVER_QUESTS } from './story';

/** Clover Meadow (JLPT N5): the first Village Pass town. */
export const CLOVER = {
  id: 'clover',
  level: 'N5',
  words: CLOVER_WORDS,
  grammar: CLOVER_GRAMMAR,
  readings: CLOVER_READINGS,
  phrases: CLOVER_PHRASES,
  quests: CLOVER_QUESTS,
  npcs: CLOVER_NPCS,
  units: 8,
  unitTitles: [
    { en: 'Introductions', es: 'Presentaciones', ja: '自己紹介' },
    { en: 'Numbers & shopping', es: 'Números y compras', ja: '数と買い物' },
    { en: 'Time & daily life', es: 'La hora y la rutina', ja: '時間と生活' },
    { en: 'Places & directions', es: 'Lugares e indicaciones', ja: '場所と道案内' },
    { en: 'Food & describing', es: 'Comida y descripciones', ja: '食べ物とようす' },
    { en: 'Family & people', es: 'Familia y personas', ja: '家族と人' },
    { en: 'The past & weather', es: 'El pasado y el clima', ja: '過去と天気' },
    { en: 'Plans & invitations', es: 'Planes e invitaciones', ja: '予定とさそい' },
  ],
};

let registered = false;
export function registerClover() {
  if (registered) return;
  registered = true;
  registerLexemes(CLOVER_WORDS);
  registerPhrases(CLOVER_PHRASES);
  registerNpcs(CLOVER_NPCS);
  for (const q of CLOVER_QUESTS) if (!QUESTS.some((x) => x.id === q.id)) QUESTS.push(q);
  Object.assign(CONVOS, CLOVER_CONVOS);
}
