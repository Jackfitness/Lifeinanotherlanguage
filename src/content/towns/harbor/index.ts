import type { TownContent } from '../types';
import { HARBOR_WORDS } from './vocab';
import { HARBOR_GRAMMAR } from './grammar';
import { HARBOR_READINGS } from './reading';
import { HARBOR_CONVOS, HARBOR_NPCS, HARBOR_PHRASES, HARBOR_QUESTS } from './story';

/** Maple Harbor (JLPT N4): penguins and otters by the sea. */
export const HARBOR: TownContent = {
  id: 'harbor',
  level: 'N4',
  theme: 'harbor',
  words: HARBOR_WORDS,
  grammar: HARBOR_GRAMMAR,
  readings: HARBOR_READINGS,
  phrases: HARBOR_PHRASES,
  quests: HARBOR_QUESTS,
  npcs: HARBOR_NPCS,
  convos: HARBOR_CONVOS,
  items: [
    { id: 'h_fish', lex: 'n4_sakana', kind: 'quest' },
    { id: 'h_parcel', lex: 'n4_purezento', kind: 'quest' },
    { id: 'h_part', lex: 'n4_buhin', kind: 'quest' },
    { id: 'h_tool', lex: 'n4_dougu', kind: 'quest' },
  ],
  units: 8,
  unitTitles: [
    { en: 'Arrival & experiences', es: 'Llegada y experiencias', ja: '到着と経験' },
    { en: 'The fish market', es: 'El mercado de pescado', ja: '魚市場' },
    { en: 'Ferry rules', es: 'Normas del ferry', ja: 'フェリーの規則' },
    { en: 'Directions & gifts', es: 'Indicaciones y regalos', ja: '道案内とプレゼント' },
    { en: 'Weather & plans', es: 'Tiempo y planes', ja: '天気と予定' },
    { en: 'The lost pup', es: 'El pequeño perdido', ja: '迷子' },
    { en: 'Fixing the light', es: 'Arreglar la luz', ja: '光を直す' },
    { en: 'Invitations & reasons', es: 'Invitaciones y razones', ja: 'さそいと理由' },
  ],
  sensei: 'nagi',
  finaleQuest: 'harbor_9',
  examTitle: { en: 'The Harbor Exam', es: 'El Examen del Puerto', ja: '港の試験' },
  examPassedSub: { en: 'Go to the festival and ring the harbor bell.', es: 'Ve a la fiesta y toca la campana del puerto.', ja: 'お祭りへ行って、港の鐘を鳴らそう。' },
  arrive: { en: 'The bus rolls down to the sea. Gulls cry, ropes creak, and the air tastes of salt.', es: 'El autobús baja hasta el mar. Gritan las gaviotas, crujen las cuerdas y el aire sabe a sal.', ja: 'バスは海へ下りていく。カモメが鳴き、ロープがきしみ、潮の香りがする。' },
  finaleTitle: { en: 'The harbor bell rings!', es: '¡Suena la campana del puerto!', ja: '港の鐘が鳴った！' },
  finaleSub: { en: 'Maple Harbor complete! Lantern Hills (N3) awaits.', es: '¡Puerto Arce completado! Te esperan las Colinas de Faroles (N3).', ja: 'もみじ港クリア！次はちょうちん丘（N3）。' },
  signs: { hall: '{港|みなと}{事務所|じむしょ}', post: '{郵便局|ゆうびんきょく}', restaurant: '{食堂|しょくどう}', dojo: '{道場|どうじょう}', market: '{魚市場|うおいちば}' },
};
