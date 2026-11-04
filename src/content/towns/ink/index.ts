import type { TownContent } from '../types';
import { INK_WORDS } from './vocab';
import { INK_GRAMMAR } from './grammar';
import { INK_READINGS } from './reading';
import { INK_CONVOS, INK_NPCS, INK_PHRASES, INK_QUESTS } from './story';

/** Inkbrush Village: the three writing systems, before N5. Free for everyone. */
export const INK: TownContent = {
  id: 'ink',
  level: 'かな',
  theme: 'ink',
  script: true,
  free: true,
  passMark: 90,
  words: INK_WORDS,
  grammar: INK_GRAMMAR,
  readings: INK_READINGS,
  phrases: INK_PHRASES,
  quests: INK_QUESTS,
  npcs: INK_NPCS,
  convos: INK_CONVOS,
  items: [
    { id: 'i_letter', lex: 'kn_ie', kind: 'quest' },
    { id: 'i_parcel', lex: 'kn_kamera', kind: 'quest' },
  ],
  units: 8,
  unitTitles: [
    { en: 'Hiragana あ か さ', es: 'Hiragana あ か さ', ja: 'ひらがな あ か さ' },
    { en: 'Hiragana た な は', es: 'Hiragana た な は', ja: 'ひらがな た な は' },
    { en: 'Hiragana ま や ら わ ん', es: 'Hiragana ま や ら わ ん', ja: 'ひらがな ま や ら わ ん' },
    { en: 'Little marks ゛゜ and small kana', es: 'Marcas ゛゜ y kana pequeños', ja: '点々と小さい字' },
    { en: 'Katakana ア – ホ', es: 'Katakana ア – ホ', ja: 'カタカナ ア〜ホ' },
    { en: 'Katakana マ – ン', es: 'Katakana マ – ン', ja: 'カタカナ マ〜ン' },
    { en: 'Kanji from pictures', es: 'Kanji pictográficos', ja: '絵からできた漢字' },
    { en: 'Kanji building blocks', es: 'Piezas de kanji', ja: '漢字の部品' },
  ],
  sensei: 'hari',
  finaleQuest: 'ink_9',
  examTitle: { en: 'The Script Exam', es: 'El Examen de Escritura', ja: '文字の試験' },
  examPassedSub: { en: 'Go to the square, write the festival banner and ring the bell.', es: 'Ve a la plaza, escribe la pancarta del festival y toca la campana.', ja: '広場へ行って、まつりの書を書いて鐘を鳴らそう。' },
  arrive: { en: 'The bus stops in a quiet village of white walls and bamboo. Every shop sign is blank, washed clean by last night\'s storm.', es: 'El autobús para en un pueblo tranquilo de paredes blancas y bambú. Todos los letreros están en blanco, lavados por la tormenta de anoche.', ja: '白いかべと竹の静かな村にバスが止まった。看板はぜんぶまっ白。ゆうべの嵐で字が流れてしまった。' },
  finaleTitle: { en: 'The festival bell rings!', es: '¡Suena la campana del festival!', ja: 'まつりの鐘が鳴った！' },
  finaleSub: { en: 'You can read Japanese now! Clover Meadow (N5) awaits.', es: '¡Ya sabes leer japonés! Te espera el Prado del Trébol (N5).', ja: '日本語が読めるようになった！次はクローバー町（N5）。' },
  signs: { hall: 'むら', post: 'ゆうびん', restaurant: 'カフェ', dojo: 'しょどう', market: 'おかし' },
};
