import { wordKit, type TownWord } from '../types';

/**
 * Inkbrush Village: the three writing systems. Single kana are "words" whose meaning is their
 * romaji reading (flagged kana: true) so the dojo can drill reading, listening and tracing.
 */
const W = wordKit('ink', 'kn_', 1);
const kana = (unit: number, chars: string, romaji: string): TownWord[] => {
  const cs = [...chars], rs = romaji.split(' ');
  return cs.map((c, i) => ({ ...W(unit, (unit >= 5 ? 'k' : 'h') + '_' + rs[i], 'object', c, rs[i], rs[i]), kana: true }));
};

export const INK_WORDS: TownWord[] = [
  // 1 · Hiragana あ か さ
  ...kana(1, 'あいうえおかきくけこさしすせそ', 'a i u e o ka ki ku ke ko sa shi su se so'),
  W(1, 'ao', 'color', 'あお', 'blue', 'azul'),
  W(1, 'ie', 'place', 'いえ', 'house', 'casa', 'house'),
  W(1, 'kasa', 'object', 'かさ', 'umbrella', 'paraguas', 'umbrella'),
  W(1, 'sushi', 'food', 'すし', 'sushi', 'sushi'),
  W(1, 'asa', 'time', 'あさ', 'morning', 'mañana (temprano)'),

  // 2 · Hiragana た な は
  ...kana(2, 'たちつてとなにぬねのはひふへほ', 'ta chi tsu te to na ni nu ne no ha hi fu he ho'),
  W(2, 'neko', 'nature', 'ねこ', 'cat', 'gato', 'cat'),
  W(2, 'inu', 'nature', 'いぬ', 'dog', 'perro', 'dog'),
  W(2, 'hana', 'nature', 'はな', 'flower', 'flor', 'flower'),
  W(2, 'sakana', 'fish', 'さかな', 'fish', 'pez, pescado', 'fish'),
  W(2, 'tokei', 'object', 'とけい', 'clock', 'reloj', 'clock'),

  // 3 · Hiragana ま や ら わ ん
  ...kana(3, 'まみむめもやゆよらりるれろわをん', 'ma mi mu me mo ya yu yo ra ri ru re ro wa wo n'),
  W(3, 'yama', 'place', 'やま', 'mountain', 'montaña'),
  W(3, 'yuki', 'nature', 'ゆき', 'snow', 'nieve'),
  W(3, 'yoru', 'time', 'よる', 'night', 'noche'),
  W(3, 'saru', 'nature', 'さる', 'monkey', 'mono'),
  W(3, 'watashi', 'people', 'わたし', 'I, me', 'yo'),

  // 4 · Marks: ゛ ゜ and small kana
  ...kana(4, 'がぎぐげござじずぜぞだでどばびぶべぼぱぴぷぺぽ', 'ga gi gu ge go za ji zu ze zo da de do ba bi bu be bo pa pi pu pe po'),
  W(4, 'gohan', 'food', 'ごはん', 'rice, meal', 'arroz, comida'),
  W(4, 'ringo', 'food', 'りんご', 'apple', 'manzana', 'apple'),
  W(4, 'kitte', 'object', 'きって', 'stamp', 'sello'),
  W(4, 'ocha', 'food', 'おちゃ', 'green tea', 'té verde', 'tea'),
  W(4, 'kyou', 'time', 'きょう', 'today', 'hoy'),
  W(4, 'okaasan', 'family', 'おかあさん', 'mother', 'madre'),

  // 5 · Katakana ア – ホ
  ...kana(5, 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホ', 'a i u e o ka ki ku ke ko sa shi su se so ta chi tsu te to na ni nu ne no ha hi fu he ho'),
  W(5, 'aisu', 'food', 'アイス', 'ice cream', 'helado'),
  W(5, 'keeki', 'food', 'ケーキ', 'cake', 'pastel', 'cake'),
  W(5, 'tenisu', 'action', 'テニス', 'tennis', 'tenis'),
  W(5, 'nooto', 'object', 'ノート', 'notebook', 'cuaderno', 'book'),
  W(5, 'kokoa', 'food', 'ココア', 'hot chocolate', 'chocolate caliente'),

  // 6 · Katakana マ – ン and loanwords
  ...kana(6, 'マミムメモヤユヨラリルレロワン', 'ma mi mu me mo ya yu yo ra ri ru re ro wa n'),
  W(6, 'koohii', 'food', 'コーヒー', 'coffee', 'café', 'coffee'),
  W(6, 'menyuu', 'object', 'メニュー', 'menu', 'menú'),
  W(6, 'pan', 'food', 'パン', 'bread', 'pan', 'bread'),
  W(6, 'kamera', 'object', 'カメラ', 'camera', 'cámara'),
  W(6, 'raamen', 'food', 'ラーメン', 'ramen', 'ramen'),
  W(6, 'hoteru', 'place', 'ホテル', 'hotel', 'hotel'),

  // 7 · Kanji that started as pictures
  W(7, 'hi', 'nature', '{日|ひ}', 'sun, day', 'sol, día'),
  W(7, 'tsuki', 'nature', '{月|つき}', 'moon, month', 'luna, mes'),
  W(7, 'ki', 'nature', '{木|き}', 'tree', 'árbol'),
  W(7, 'yama7', 'place', '{山|やま}', 'mountain', 'montaña'),
  W(7, 'kawa', 'place', '{川|かわ}', 'river', 'río'),
  W(7, 'hi7', 'nature', '{火|ひ}', 'fire', 'fuego'),
  W(7, 'mizu', 'nature', '{水|みず}', 'water', 'agua'),
  W(7, 'hito', 'people', '{人|ひと}', 'person', 'persona'),
  W(7, 'kuchi', 'object', '{口|くち}', 'mouth', 'boca'),
  W(7, 'me', 'object', '{目|め}', 'eye', 'ojo'),
  W(7, 'ta', 'place', '{田|た}', 'rice field', 'arrozal'),
  W(7, 'ame', 'nature', '{雨|あめ}', 'rain', 'lluvia'),

  // 8 · Kanji building blocks
  W(8, 'hayashi', 'nature', '{林|はやし}', 'grove (two trees)', 'bosquecillo (dos árboles)'),
  W(8, 'mori', 'nature', '{森|もり}', 'forest (three trees)', 'bosque (tres árboles)'),
  W(8, 'yasumu', 'action', '{休|やす}む', 'to rest (person by a tree)', 'descansar (persona junto a un árbol)'),
  W(8, 'akarui', 'feeling', '{明|あか}るい', 'bright (sun + moon)', 'luminoso (sol + luna)'),
  W(8, 'ichi', 'number', '{一|いち}', 'one', 'uno'),
  W(8, 'ni', 'number', '{二|に}', 'two', 'dos'),
  W(8, 'san', 'number', '{三|さん}', 'three', 'tres'),
  W(8, 'ookii', 'feeling', '{大|おお}きい', 'big', 'grande'),
  W(8, 'chiisai', 'feeling', '{小|ちい}さい', 'small', 'pequeño'),
  W(8, 'ue', 'place', '{上|うえ}', 'up, above', 'arriba'),
  W(8, 'shita', 'place', '{下|した}', 'down, below', 'abajo'),
  W(8, 'naka', 'place', '{中|なか}', 'inside, middle', 'dentro, medio'),
  W(8, 'onna', 'people', '{女|おんな}', 'woman', 'mujer'),
  W(8, 'otoko', 'people', '{男|おとこ}', 'man', 'hombre'),
];
