import type { TownContent } from '../types';
import { LANTERN_WORDS } from './vocab';
import { LANTERN_GRAMMAR } from './grammar';
import { LANTERN_READINGS } from './reading';
import { LANTERN_CONVOS, LANTERN_NPCS, LANTERN_PHRASES, LANTERN_QUESTS } from './story';

/** Lantern Hills (JLPT N3): foxes and raccoons under a thousand lanterns. */
export const LANTERN: TownContent = {
  id: 'lantern',
  level: 'N3',
  theme: 'lantern',
  words: LANTERN_WORDS,
  grammar: LANTERN_GRAMMAR,
  readings: LANTERN_READINGS,
  phrases: LANTERN_PHRASES,
  quests: LANTERN_QUESTS,
  npcs: LANTERN_NPCS,
  convos: LANTERN_CONVOS,
  items: [
    { id: 'l_lanterns', lex: 'n3_chouchin', kind: 'quest' },
    { id: 'l_clue', lex: 'n3_ashiato', kind: 'quest' },
  ],
  units: 8,
  unitTitles: [
    { en: 'Decisions & goals', es: 'Decisiones y objetivos', ja: '決心と目標' },
    { en: 'The night market', es: 'El mercado nocturno', ja: '夜市' },
    { en: 'Rumors', es: 'Rumores', ja: 'うわさ' },
    { en: 'Deduction', es: 'Deducción', ja: '推理' },
    { en: 'In the kitchen', es: 'En la cocina', ja: '厨房で' },
    { en: 'Favors & causatives', es: 'Favores y causativos', ja: '使役とお願い' },
    { en: 'While there\'s time', es: 'Mientras hay tiempo', ja: '時間のうちに' },
    { en: 'The festival', es: 'El festival', ja: '祭り' },
  ],
  sensei: 'gin',
  finaleQuest: 'lantern_9',
  examTitle: { en: 'The Hill Exam', es: 'El Examen de la Colina', ja: '丘の試験' },
  examPassedSub: { en: 'Go to the festival and ring the pagoda bell.', es: 'Ve al festival y toca la campana de la pagoda.', ja: '祭りへ行って、塔の鐘を鳴らそう。' },
  arrive: { en: 'The bus climbs through red maples. Paper lanterns sway along the road, and the air smells of ramen and smoke.', es: 'El autobús sube entre arces rojos. Los farolillos se mecen junto al camino y huele a ramen y a humo.', ja: 'バスは赤いもみじの中をのぼる。道ぞいに提灯がゆれ、ラーメンとけむりのにおいがする。' },
  finaleTitle: { en: 'The pagoda bell rings!', es: '¡Suena la campana de la pagoda!', ja: '塔の鐘が鳴った！' },
  finaleSub: { en: 'Lantern Hills complete! Snowcap Peaks (N2) awaits.', es: '¡Colinas de Faroles completadas! Te esperan los Picos Nevados (N2).', ja: 'ちょうちん丘クリア！次は雪山の里（N2）。' },
  signs: { hall: '{集会所|しゅうかいじょ}', post: '{郵便局|ゆうびんきょく}', restaurant: 'ラーメン', dojo: '{道場|どうじょう}', market: '{夜市|よいち}' },
};
