import type { TownContent } from '../types';
import { CLOVER_WORDS } from './vocab';
import { CLOVER_GRAMMAR } from './grammar';
import { CLOVER_READINGS } from './reading';
import { CLOVER_CONVOS, CLOVER_NPCS, CLOVER_PHRASES, CLOVER_QUESTS } from './story';

/** Clover Meadow (JLPT N5): the first Village Pass town. */
export const CLOVER: TownContent = {
  id: 'clover',
  level: 'N5',
  theme: 'clover',
  words: CLOVER_WORDS,
  grammar: CLOVER_GRAMMAR,
  readings: CLOVER_READINGS,
  phrases: CLOVER_PHRASES,
  quests: CLOVER_QUESTS,
  npcs: CLOVER_NPCS,
  convos: CLOVER_CONVOS,
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
  sensei: 'kero',
  finaleQuest: 'clover_9',
  examTitle: { en: 'The Clover Exam', es: 'El Examen Trébol', ja: 'クローバー試験' },
  examPassedSub: { en: 'Go to the festival and ring the Clover Bell.', es: 'Ve al festival y haz sonar la campana del Trébol.', ja: 'お祭りへ行って、クローバーのベルを鳴らそう。' },
  arrive: { en: 'The bus rattles over the hills and stops in a sunny meadow full of clover.', es: 'El autobús cruza las colinas y se detiene en un prado soleado lleno de tréboles.', ja: 'バスは丘をこえて、クローバーいっぱいの明るい野原に止まった。' },
  finaleTitle: { en: 'The Clover Bell rings!', es: '¡Suena la campana del Trébol!', ja: 'クローバーのベルが鳴った！' },
  finaleSub: { en: 'Clover Meadow complete! Maple Harbor (N4) awaits.', es: '¡Prado del Trébol completado! Te espera Puerto Arce (N4).', ja: 'クローバー町クリア！次はもみじ港（N4）。' },
  signs: { hall: '{町役場|まちやくば}', post: '{郵便局|ゆうびんきょく}', restaurant: 'レストラン', dojo: '{道場|どうじょう}', market: '{市場|いちば}' },
};
