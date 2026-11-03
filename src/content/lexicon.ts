import type { LText } from '../core/types';

/**
 * Vocabulary. Spanish nouns carry their article so gender is learned with the word
 * (Latin American usage). Japanese uses ruby markup: {漢字|かな}; spaces split chunks.
 */
export type LexCat =
  | 'food' | 'fish' | 'nature' | 'object' | 'place' | 'color'
  | 'furniture' | 'clothing' | 'feeling' | 'action'
  | 'people' | 'number' | 'time' | 'family';

export interface Lexeme {
  id: string;
  cat: LexCat;
  icon: string;
  lvl: 1 | 2 | 3;
  t: LText;
}

const L = (id: string, cat: LexCat, icon: string, en: string, es: string, ja: string, lvl: 1 | 2 | 3 = 1): Lexeme =>
  ({ id, cat, icon, lvl, t: { en, es, ja } });

export const LEXICON: Lexeme[] = [
  // Food & drink
  L('bread', 'food', '🍞', 'bread', 'el pan', 'パン'),
  L('coffee', 'food', '☕', 'coffee', 'el café', 'コーヒー'),
  L('tea', 'food', '🍵', 'tea', 'el té', 'お{茶|ちゃ}'),
  L('cake', 'food', '🍰', 'cake', 'el pastel', 'ケーキ'),
  L('cookie', 'food', '🍪', 'cookie', 'la galleta', 'クッキー'),
  L('croissant', 'food', '🥐', 'croissant', 'el cruasán', 'クロワッサン', 2),
  L('honey', 'food', '🍯', 'honey', 'la miel', 'はちみつ', 2),
  L('milk', 'food', '🥛', 'milk', 'la leche', '{牛乳|ぎゅうにゅう}', 2),
  L('water', 'food', '💧', 'water', 'el agua', '{水|みず}'),
  L('apple', 'food', '🍎', 'apple', 'la manzana', 'りんご'),
  L('strawberry', 'food', '🍓', 'strawberry', 'la fresa', 'いちご'),
  L('carrot', 'food', '🥕', 'carrot', 'la zanahoria', 'にんじん'),
  L('soup', 'food', '🍲', 'soup', 'la sopa', 'スープ', 2),
  L('sandwich', 'food', '🥪', 'sandwich', 'el sándwich', 'サンドイッチ', 2),

  // Pond life
  L('fish', 'fish', '🐟', 'fish', 'el pez', '{魚|さかな}'),
  L('goldfish', 'fish', '🐠', 'goldfish', 'el pez dorado', '{金魚|きんぎょ}', 2),
  L('carp', 'fish', '🎏', 'carp', 'la carpa', '{鯉|こい}', 2),
  L('catfish', 'fish', '🐡', 'catfish', 'el bagre', 'ナマズ', 3),
  L('trout', 'fish', '🐟', 'trout', 'la trucha', 'マス', 2),
  L('crab', 'fish', '🦀', 'crab', 'el cangrejo', 'カニ'),
  L('turtle', 'fish', '🐢', 'turtle', 'la tortuga', 'カメ'),
  L('frog', 'fish', '🐸', 'frog', 'la rana', 'カエル'),
  L('shrimp', 'fish', '🦐', 'shrimp', 'el camarón', 'エビ', 2),
  L('boot', 'fish', '👢', 'old boot', 'la bota vieja', '{古|ふる}い ブーツ', 2),

  // Nature
  L('flower', 'nature', '🌸', 'flower', 'la flor', '{花|はな}'),
  L('tree', 'nature', '🌳', 'tree', 'el árbol', '{木|き}'),
  L('mushroom', 'nature', '🍄', 'mushroom', 'el hongo', 'きのこ'),
  L('leaf', 'nature', '🍁', 'leaf', 'la hoja', '{葉|は}っぱ', 2),
  L('bird', 'nature', '🐦', 'bird', 'el pájaro', '{鳥|とり}'),
  L('butterfly', 'nature', '🦋', 'butterfly', 'la mariposa', 'ちょうちょ', 2),
  L('star', 'nature', '⭐', 'star', 'la estrella', '{星|ほし}'),
  L('moon', 'nature', '🌙', 'moon', 'la luna', '{月|つき}'),
  L('sun', 'nature', '☀️', 'sun', 'el sol', '{太陽|たいよう}', 2),
  L('rain', 'nature', '🌧️', 'rain', 'la lluvia', '{雨|あめ}'),
  L('snow', 'nature', '❄️', 'snow', 'la nieve', '{雪|ゆき}'),
  L('cloud', 'nature', '☁️', 'cloud', 'la nube', '{雲|くも}', 2),

  // Objects
  L('key', 'object', '🔑', 'key', 'la llave', '{鍵|かぎ}'),
  L('book', 'object', '📖', 'book', 'el libro', '{本|ほん}'),
  L('umbrella', 'object', '☂️', 'umbrella', 'el paraguas', '{傘|かさ}'),
  L('letter', 'object', '✉️', 'letter', 'la carta', '{手紙|てがみ}', 2),
  L('rod', 'object', '🎣', 'fishing rod', 'la caña de pescar', '{釣|つ}り{竿|ざお}', 2),
  L('coin', 'object', '🪙', 'coin', 'la moneda', 'コイン'),

  // Places
  L('cafe', 'place', '🧁', 'café', 'la cafetería', 'カフェ'),
  L('store', 'place', '🏪', 'store', 'la tienda', '{店|みせ}'),
  L('house', 'place', '🏠', 'house', 'la casa', '{家|いえ}'),
  L('garden', 'place', '🌷', 'garden', 'el jardín', '{庭|にわ}'),
  L('plaza', 'place', '🏘️', 'town square', 'la plaza', '{広場|ひろば}', 2),
  L('fountain', 'place', '⛲', 'fountain', 'la fuente', '{噴水|ふんすい}', 2),
  L('forest', 'place', '🌲', 'forest', 'el bosque', '{森|もり}'),
  L('bridge', 'place', '🌉', 'bridge', 'el puente', '{橋|はし}'),
  L('pond', 'place', '🪷', 'pond', 'el estanque', '{池|いけ}'),

  // Colors
  L('red', 'color', '🔴', 'red', 'rojo', '{赤|あか}い'),
  L('blue', 'color', '🔵', 'blue', 'azul', '{青|あお}い'),
  L('yellow', 'color', '🟡', 'yellow', 'amarillo', '{黄色|きいろ}い'),
  L('green', 'color', '🟢', 'green', 'verde', '{緑|みどり}'),
  L('pink', 'color', '🩷', 'pink', 'rosa', 'ピンク'),
  L('white', 'color', '⚪', 'white', 'blanco', '{白|しろ}い'),

  // Furniture
  L('chair', 'furniture', '🪑', 'chair', 'la silla', '{椅子|いす}'),
  L('table', 'furniture', '🍽️', 'table', 'la mesa', 'テーブル'),
  L('bed', 'furniture', '🛏️', 'bed', 'la cama', 'ベッド'),
  L('lamp', 'furniture', '💡', 'lamp', 'la lámpara', 'ランプ'),
  L('plant', 'furniture', '🪴', 'plant', 'la planta', '{植物|しょくぶつ}', 2),
  L('sofa', 'furniture', '🛋️', 'sofa', 'el sofá', 'ソファ'),
  L('bookshelf', 'furniture', '📚', 'bookshelf', 'la estantería', '{本棚|ほんだな}', 2),
  L('clock', 'furniture', '🕰️', 'clock', 'el reloj', '{時計|とけい}'),
  L('radio', 'furniture', '📻', 'radio', 'la radio', 'ラジオ'),
  L('plush', 'furniture', '🧸', 'stuffed animal', 'el peluche', 'ぬいぐるみ'),
  L('rug', 'furniture', '🟫', 'rug', 'la alfombra', 'ラグ'),

  // Clothing
  L('hat', 'clothing', '👒', 'hat', 'el sombrero', '{帽子|ぼうし}'),
  L('scarf', 'clothing', '🧣', 'scarf', 'la bufanda', 'マフラー'),
  L('ribbon', 'clothing', '🎀', 'ribbon', 'el lazo', 'リボン'),
  L('glasses', 'clothing', '👓', 'glasses', 'los lentes', 'めがね'),
  L('cap', 'clothing', '🧢', 'cap', 'la gorra', 'キャップ'),
  L('crown', 'clothing', '👑', 'crown', 'la corona', '{王冠|おうかん}', 3),

  // Feelings & descriptions
  L('happy', 'feeling', '😊', 'happy', 'feliz', 'うれしい'),
  L('sleepy', 'feeling', '😪', 'sleepy', 'con sueño', 'ねむい'),
  L('delicious', 'feeling', '😋', 'delicious', 'delicioso', 'おいしい'),
  L('cute', 'feeling', '🥰', 'cute', 'lindo', 'かわいい'),
  L('big', 'feeling', '🐘', 'big', 'grande', '{大|おお}きい'),
  L('small', 'feeling', '🐭', 'small', 'pequeño', '{小|ちい}さい'),
  L('hot', 'feeling', '🔥', 'hot', 'caliente', 'あつい'),
  L('cold', 'feeling', '🧊', 'cold', 'frío', 'つめたい'),

  // Actions
  L('eat', 'action', '🍽️', 'to eat', 'comer', '{食|た}べる'),
  L('drink', 'action', '🥤', 'to drink', 'beber', '{飲|の}む'),
  L('go_fishing', 'action', '🎣', 'to fish', 'pescar', '{釣|つ}る', 2),
  L('walk', 'action', '🚶', 'to walk', 'caminar', '{歩|ある}く'),
  L('read', 'action', '📖', 'to read', 'leer', '{読|よ}む'),
  L('sleep', 'action', '😴', 'to sleep', 'dormir', '{寝|ね}る'),
];

const byId = new Map(LEXICON.map((l) => [l.id, l]));
export const lex = (id: string): Lexeme => {
  const l = byId.get(id);
  if (!l) throw new Error('Unknown lexeme ' + id);
  return l;
};
export const hasLex = (id: string) => byId.has(id);
/** Add town vocabulary to the shared lexicon. */
export function registerLexemes(list: Lexeme[]) {
  for (const l of list) if (!byId.has(l.id)) { LEXICON.push(l); byId.set(l.id, l); }
}
