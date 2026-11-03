import type { TownContent } from '../types';
import { STARLIGHT_WORDS } from './vocab';
import { STARLIGHT_GRAMMAR } from './grammar';
import { STARLIGHT_READINGS } from './reading';
import { STARLIGHT_CONVOS, STARLIGHT_NPCS, STARLIGHT_PHRASES, STARLIGHT_QUESTS } from './story';

/** Starlight City (JLPT N1): cats and dogs in the big city. */
export const STARLIGHT: TownContent = {
  id: 'starlight',
  level: 'N1',
  theme: 'starlight',
  words: STARLIGHT_WORDS,
  grammar: STARLIGHT_GRAMMAR,
  readings: STARLIGHT_READINGS,
  phrases: STARLIGHT_PHRASES,
  quests: STARLIGHT_QUESTS,
  npcs: STARLIGHT_NPCS,
  convos: STARLIGHT_CONVOS,
  items: [
    { id: 'x_bouquet', lex: 'n1_hanataba', kind: 'quest' },
    { id: 'x_script', lex: 'n1_kyakuhon', kind: 'quest' },
  ],
  units: 8,
  unitTitles: [
    { en: 'Essence', es: 'Esencia', ja: '本質' },
    { en: 'Defiance', es: 'Desafío', ja: '逆境' },
    { en: 'Immediacy', es: 'Inmediatez', ja: '即時' },
    { en: 'Force & feeling', es: 'Obligación y sentimiento', ja: '不可避と感情' },
    { en: 'Circumstance', es: 'Circunstancias', ja: '状況' },
    { en: 'Propriety', es: 'Decoro', ja: '規範' },
    { en: 'Evaluation', es: 'Valoración', ja: '評価' },
    { en: 'Emotion & nuance', es: 'Emoción y matices', ja: '感情とニュアンス' },
  ],
  sensei: 'shiba',
  finaleQuest: 'starlight_9',
  examTitle: { en: 'The Starlight Exam', es: 'El Examen Estrella', ja: '星あかりの試験' },
  examPassedSub: { en: 'Go to the theater and ring the opening-night bell.', es: 'Ve al teatro y toca la campana del estreno.', ja: '劇場へ行って、開演の鐘を鳴らそう。' },
  arrive: { en: 'The bus glides into the city at dusk. Windows light up floor by floor, and the tower glitters like a star.', es: 'El autobús entra en la ciudad al anochecer. Las ventanas se encienden piso a piso y la torre brilla como una estrella.', ja: '夕暮れ、バスは街へすべりこむ。窓が一階ずつ灯り、塔が星のようにきらめく。' },
  finaleTitle: { en: 'The opening-night bell rings!', es: '¡Suena la campana del estreno!', ja: '開演の鐘が鳴った！' },
  finaleSub: { en: 'Starlight City complete! You\'ve finished every town, N5 to N1. Bravo!', es: '¡Ciudad Estrella completada! Has terminado todos los pueblos, del N5 al N1. ¡Bravo!', ja: '星あかりの街クリア！N5からN1まで、すべての町を制覇！' },
  signs: { hall: '{市役所|しやくしょ}', post: '{出版社|しゅっぱんしゃ}', restaurant: 'ビストロ', dojo: '{道場|どうじょう}', market: '{花市場|はないちば}' },
};
