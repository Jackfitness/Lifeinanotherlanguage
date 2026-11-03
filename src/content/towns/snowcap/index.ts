import type { TownContent } from '../types';
import { SNOWCAP_WORDS } from './vocab';
import { SNOWCAP_GRAMMAR } from './grammar';
import { SNOWCAP_READINGS } from './reading';
import { SNOWCAP_CONVOS, SNOWCAP_NPCS, SNOWCAP_PHRASES, SNOWCAP_QUESTS } from './story';

/** Snowcap Peaks (JLPT N2): owls and deer in a snowy hot-spring village. */
export const SNOWCAP: TownContent = {
  id: 'snowcap',
  level: 'N2',
  theme: 'snowcap',
  words: SNOWCAP_WORDS,
  grammar: SNOWCAP_GRAMMAR,
  readings: SNOWCAP_READINGS,
  phrases: SNOWCAP_PHRASES,
  quests: SNOWCAP_QUESTS,
  npcs: SNOWCAP_NPCS,
  convos: SNOWCAP_CONVOS,
  items: [
    { id: 's_draft', lex: 'n2_kiji', kind: 'quest' },
    { id: 's_blueprint', lex: 'n2_sekkeizu', kind: 'quest' },
    { id: 's_timber', lex: 'n2_mokuzai', kind: 'quest' },
  ],
  units: 8,
  unitTitles: [
    { en: 'Obligation', es: 'Obligación', ja: '義務' },
    { en: 'Basis & change', es: 'Base y cambio', ja: '根拠と変化' },
    { en: 'Contrast', es: 'Contraste', ja: '逆接' },
    { en: 'Not only…', es: 'No solo…', ja: '添加' },
    { en: 'Cost & advice', es: 'Costes y consejos', ja: '費用と助言' },
    { en: 'Risk & change', es: 'Riesgo y cambio', ja: '危険と変化' },
    { en: 'Procedure', es: 'Procedimiento', ja: '手順' },
    { en: 'Nuance', es: 'Matices', ja: 'ニュアンス' },
  ],
  sensei: 'hou',
  finaleQuest: 'snowcap_9',
  examTitle: { en: 'The Snowcap Exam', es: 'El Examen de los Picos Nevados', ja: '雪山の試験' },
  examPassedSub: { en: 'Go to the belfry and strike the year-end bell.', es: 'Ve al campanario y toca la campana de fin de año.', ja: '鐘楼へ行って、除夜の鐘をつこう。' },
  arrive: { en: 'The bus crunches up a snowy road. Steam rises from hot springs, and the whole valley is hushed and white.', es: 'El autobús sube crujiendo por la nieve. El vapor sale de las termas y el valle entero está blanco y en silencio.', ja: 'バスは雪道をのぼる。温泉から湯気が立ち、谷はしんと白い。' },
  finaleTitle: { en: 'The year-end bell resounds!', es: '¡Resuenan las campanadas!', ja: '除夜の鐘が響いた！' },
  finaleSub: { en: 'Snowcap Peaks complete! Starlight City (N1) awaits.', es: '¡Picos Nevados completados! Te espera Ciudad Estrella (N1).', ja: '雪山の里クリア！次は星あかりの街（N1）。' },
  signs: { hall: '{村役場|むらやくば}', post: '{新聞社|しんぶんしゃ}', restaurant: '{旅館|りょかん}', dojo: '{道場|どうじょう}', market: '{朝市|あさいち}' },
};
