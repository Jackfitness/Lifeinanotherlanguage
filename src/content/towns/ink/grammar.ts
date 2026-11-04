import type { DrillItem, GrammarPoint } from '../types';

/** Script rules for Inkbrush Village: how the writing systems work. Drills fill in a missing character. */
const D = (q: string, a: string, wrong: string[], en: string, es: string): DrillItem => ({ q, a, wrong, m: { en, es } });

export const INK_GRAMMAR: GrammarPoint[] = [
  // ---- 1 · あ か さ
  {
    id: 'i_vowels', unit: 1,
    title: { en: 'The five vowels: あ い う え お', es: 'Las cinco vocales: あ い う え お' },
    note: { en: 'Japanese has five vowels, always said the same way: a (father), i (machine), u (food, lips relaxed), e (pet), o (pole). Every hiragana ends in one of them, except ん.', es: 'El japonés tiene cinco vocales, siempre igual que en español: a, i, u (con los labios relajados), e, o. Todo hiragana termina en una de ellas, salvo ん.' },
    example: 'あ い う え お', exampleM: { en: 'a · i · u · e · o', es: 'a · i · u · e · o' },
    items: [
      D('あ ＿＿ う え お', 'い', ['え', 'こ'], 'a, i, u, e, o', 'a, i, u, e, o'),
      D('あ い う ＿＿ お', 'え', ['い', 'さ'], 'a, i, u, e, o', 'a, i, u, e, o'),
      D('＿＿お (ao: blue)', 'あ', ['お', 'う'], 'ao means blue', 'ao significa azul'),
    ],
  },
  {
    id: 'i_k_row', unit: 1,
    title: { en: 'The K row: か き く け こ', es: 'La fila K: か き く け こ' },
    note: { en: 'Add a k sound to each vowel: ka, ki, ku, ke, ko. Kana come in rows like this, so learning the five vowels is half the work.', es: 'Añade el sonido k a cada vocal: ka, ki, ku, ke, ko. Los kana van por filas, así que con las cinco vocales ya llevas medio camino.' },
    example: 'かさ', exampleM: { en: 'kasa (umbrella)', es: 'kasa (paraguas)' },
    items: [
      D('＿＿さ (kasa: umbrella)', 'か', ['さ', 'け'], 'kasa: umbrella', 'kasa: paraguas'),
      D('か き ＿＿ け こ', 'く', ['し', 'う'], 'ka, ki, ku, ke, ko', 'ka, ki, ku, ke, ko'),
      D('い＿＿ (ike: pond)', 'け', ['こ', 'き'], 'ike: pond', 'ike: estanque'),
    ],
  },
  {
    id: 'i_s_row', unit: 1,
    title: { en: 'The S row: さ し す せ そ', es: 'La fila S: さ し す せ そ' },
    note: { en: 'sa, shi, su, se, so. Careful: し is "shi", not "si".', es: 'sa, shi, su, se, so. Ojo: し se lee "shi", no "si".' },
    example: 'すし', exampleM: { en: 'sushi', es: 'sushi' },
    items: [
      D('す＿＿ (sushi)', 'し', ['す', 'せ'], 'sushi', 'sushi'),
      D('あ＿＿ (asa: morning)', 'さ', ['そ', 'し'], 'asa: morning', 'asa: mañana'),
      D('さ し ＿＿ せ そ', 'す', ['く', 'こ'], 'sa, shi, su, se, so', 'sa, shi, su, se, so'),
    ],
  },
  // ---- 2 · た な は
  {
    id: 'i_t_row', unit: 2,
    title: { en: 'The T row: ち and つ', es: 'La fila T: ち y つ' },
    note: { en: 'ta, chi, tsu, te, to. Two surprises: ち is "chi" and つ is "tsu".', es: 'ta, chi, tsu, te, to. Dos sorpresas: ち es "chi" y つ es "tsu".' },
    example: 'とけい', exampleM: { en: 'tokei (clock)', es: 'tokei (reloj)' },
    items: [
      D('＿＿けい (tokei: clock)', 'と', ['て', 'た'], 'tokei: clock', 'tokei: reloj'),
      D('た ＿＿ つ て と', 'ち', ['さ', 'き'], 'ta, chi, tsu, te, to', 'ta, chi, tsu, te, to'),
      D('く＿＿ (kutsu: shoes)', 'つ', ['ち', 'す'], 'kutsu: shoes', 'kutsu: zapatos'),
    ],
  },
  {
    id: 'i_n_row', unit: 2,
    title: { en: 'The N row: な に ぬ ね の', es: 'La fila N: な に ぬ ね の' },
    note: { en: 'na, ni, nu, ne, no. ぬ (nu) and め (me) look alike: ぬ has a little loop at the end.', es: 'na, ni, nu, ne, no. ぬ (nu) y め (me) se parecen: ぬ tiene un bucle al final.' },
    example: 'ねこ', exampleM: { en: 'neko (cat)', es: 'neko (gato)' },
    items: [
      D('＿＿こ (neko: cat)', 'ね', ['れ', 'わ'], 'neko: cat', 'neko: gato'),
      D('い＿＿ (inu: dog)', 'ぬ', ['め', 'の'], 'inu: dog', 'inu: perro'),
      D('な ＿＿ ぬ ね の', 'に', ['た', 'こ'], 'na, ni, nu, ne, no', 'na, ni, nu, ne, no'),
    ],
  },
  {
    id: 'i_h_row', unit: 2,
    title: { en: 'The H row: ふ is "fu"', es: 'La fila H: ふ es "fu"' },
    note: { en: 'ha, hi, fu, he, ho. ふ is softer than English f, like blowing out a candle.', es: 'ha, hi, fu, he, ho. ふ es más suave que la f española, como soplar una vela.' },
    example: 'はな', exampleM: { en: 'hana (flower)', es: 'hana (flor)' },
    items: [
      D('＿＿な (hana: flower)', 'は', ['ほ', 'け'], 'hana: flower', 'hana: flor'),
      D('は ひ ＿＿ へ ほ', 'ふ', ['う', 'す'], 'ha, hi, fu, he, ho', 'ha, hi, fu, he, ho'),
      D('さか＿＿ (sakana: fish)', 'な', ['た', 'は'], 'sakana: fish', 'sakana: pescado'),
    ],
  },
  // ---- 3 · ま や ら わ ん
  {
    id: 'i_m_y_row', unit: 3,
    title: { en: 'The M and Y rows', es: 'Las filas M e Y' },
    note: { en: 'ma, mi, mu, me, mo, then just three in the Y row: ya, yu, yo.', es: 'ma, mi, mu, me, mo, y la fila Y solo tiene tres: ya, yu, yo.' },
    example: 'やま', exampleM: { en: 'yama (mountain)', es: 'yama (montaña)' },
    items: [
      D('や＿＿ (yama: mountain)', 'ま', ['も', 'は'], 'yama: mountain', 'yama: montaña'),
      D('＿＿き (yuki: snow)', 'ゆ', ['よ', 'や'], 'yuki: snow', 'yuki: nieve'),
      D('ま み む ＿＿ も', 'め', ['ぬ', 'ね'], 'ma, mi, mu, me, mo', 'ma, mi, mu, me, mo'),
    ],
  },
  {
    id: 'i_r_row', unit: 3,
    title: { en: 'The R row: a soft tap', es: 'La fila R: una r suave' },
    note: { en: 'ra, ri, ru, re, ro. The Japanese r is a quick tap of the tongue, between r, l and d, like the Spanish "pero".', es: 'ra, ri, ru, re, ro. La r japonesa es un toque rápido de la lengua, como en "pero".' },
    example: 'よる', exampleM: { en: 'yoru (night)', es: 'yoru (noche)' },
    items: [
      D('よ＿＿ (yoru: night)', 'る', ['ろ', 'れ'], 'yoru: night', 'yoru: noche'),
      D('さ＿＿ (saru: monkey)', 'る', ['ら', 'り'], 'saru: monkey', 'saru: mono'),
      D('ら り る ＿＿ ろ', 'れ', ['わ', 'ね'], 'ra, ri, ru, re, ro', 'ra, ri, ru, re, ro'),
    ],
  },
  {
    id: 'i_wa_n', unit: 3,
    title: { en: 'わ, を and ん', es: 'わ, を y ん' },
    note: { en: 'わ is wa. を (wo) is only used as a particle and is said "o". ん is the only kana with no vowel: just "n".', es: 'わ es wa. を (wo) solo se usa como partícula y se pronuncia "o". ん es el único kana sin vocal: solo "n".' },
    example: 'わたし', exampleM: { en: 'watashi (I)', es: 'watashi (yo)' },
    items: [
      D('＿＿たし (watashi: I)', 'わ', ['は', 'ね'], 'watashi: I', 'watashi: yo'),
      D('ご は ＿＿ (gohan: rice)', 'ん', ['を', 'の'], 'gohan: rice', 'gohan: arroz'),
      D('こ＿＿にちは (konnichiwa)', 'ん', ['を', 'わ'], 'hello', 'hola'),
    ],
  },
  // ---- 4 · Marks
  {
    id: 'i_dakuten', unit: 4,
    title: { en: 'Two little dashes ゛ (dakuten)', es: 'Dos rayitas ゛ (dakuten)' },
    note: { en: 'Two dashes make a sound "voiced": か ka → が ga, さ sa → ざ za, た ta → だ da, は ha → ば ba. A small circle ゜ turns は into ぱ pa.', es: 'Dos rayitas hacen el sonido "sonoro": か ka → が ga, さ sa → ざ za, た ta → だ da, は ha → ば ba. Un circulito ゜ convierte は en ぱ pa.' },
    example: 'ごはん', exampleM: { en: 'gohan (rice, meal)', es: 'gohan (arroz, comida)' },
    items: [
      D('＿＿はん (gohan: rice)', 'ご', ['こ', 'ぽ'], 'gohan: rice', 'gohan: arroz'),
      D('りん＿＿ (ringo: apple)', 'ご', ['こ', 'ぐ'], 'ringo: apple', 'ringo: manzana'),
      D('は → ば → ＿＿', 'ぱ', ['ぽ', 'ほ'], 'ha → ba → pa', 'ha → ba → pa'),
    ],
  },
  {
    id: 'i_small_tsu', unit: 4,
    title: { en: 'Small っ: a tiny pause', es: 'っ pequeña: una pausa' },
    note: { en: 'A small っ doubles the next consonant with a short stop: きって kitte (stamp), not kite.', es: 'Una っ pequeña dobla la consonante siguiente con una breve pausa: きって kitte (sello), no kite.' },
    example: 'きって', exampleM: { en: 'kitte (stamp)', es: 'kitte (sello)' },
    items: [
      D('き＿＿て (kitte: stamp)', 'っ', ['つ', 'て'], 'kitte: stamp', 'kitte: sello'),
      D('が＿＿こう (gakkou: school)', 'っ', ['つ', 'こ'], 'gakkou: school', 'gakkou: escuela'),
      D('ね＿＿ (netsu: fever)', 'つ', ['っ', 'ち'], 'netsu: fever (full-size つ)', 'netsu: fiebre (つ normal)'),
    ],
  },
  {
    id: 'i_small_ya', unit: 4,
    title: { en: 'Small ゃ ゅ ょ', es: 'ゃ ゅ ょ pequeñas' },
    note: { en: 'A small ゃ, ゅ or ょ blends with the kana before it: き + ょ = きょ kyo, ち + ゃ = ちゃ cha. Long vowels are written out: おかあさん okaasan.', es: 'Una ゃ, ゅ o ょ pequeña se funde con el kana anterior: き + ょ = きょ kyo, ち + ゃ = ちゃ cha. Las vocales largas se escriben: おかあさん okaasan.' },
    example: 'きょう', exampleM: { en: 'kyou (today)', es: 'kyou (hoy)' },
    items: [
      D('き＿＿う (kyou: today)', 'ょ', ['よ', 'ゅ'], 'kyou: today', 'kyou: hoy'),
      D('お＿＿ゃ (ocha: tea)', 'ち', ['し', 'き'], 'ocha: green tea', 'ocha: té verde'),
      D('おか＿＿さん (okaasan: mother)', 'あ', ['お', 'ー'], 'okaasan: mother', 'okaasan: madre'),
    ],
  },
  // ---- 5 · Katakana I
  {
    id: 'i_katakana', unit: 5,
    title: { en: 'Katakana: same sounds, sharper shapes', es: 'Katakana: mismos sonidos, formas angulosas' },
    note: { en: 'Katakana spells the same sounds as hiragana, mostly for words from other languages. か and カ are both "ka".', es: 'El katakana tiene los mismos sonidos que el hiragana, sobre todo para palabras de otros idiomas. か y カ son "ka".' },
    example: 'アイス', exampleM: { en: 'aisu (ice cream)', es: 'aisu (helado)' },
    items: [
      D('か = ＿＿', 'カ', ['サ', 'ケ'], 'both are "ka"', 'las dos son "ka"'),
      D('＿＿イス (aisu: ice cream)', 'ア', ['マ', 'ヌ'], 'aisu: ice cream', 'aisu: helado'),
      D('テ＿＿ス (tenisu: tennis)', 'ニ', ['ハ', 'ト'], 'tenisu: tennis', 'tenisu: tenis'),
    ],
  },
  {
    id: 'i_long_bar', unit: 5,
    title: { en: 'The long bar ー', es: 'La barra larga ー' },
    note: { en: 'In katakana, a long vowel is a bar: ケーキ keeki (cake), ノート nooto (notebook).', es: 'En katakana, una vocal larga se escribe con una barra: ケーキ keeki (pastel), ノート nooto (cuaderno).' },
    example: 'ケーキ', exampleM: { en: 'keeki (cake)', es: 'keeki (pastel)' },
    items: [
      D('ケ＿＿キ (keeki: cake)', 'ー', ['イ', 'ニ'], 'keeki: cake', 'keeki: pastel'),
      D('ノ＿＿ト (nooto: notebook)', 'ー', ['オ', 'ウ'], 'nooto: notebook', 'nooto: cuaderno'),
      D('ココ＿＿ (kokoa: cocoa)', 'ア', ['ー', 'イ'], 'kokoa: hot chocolate', 'kokoa: chocolate caliente'),
    ],
  },
  {
    id: 'i_kata_k_s', unit: 5,
    title: { en: 'Katakana look-alikes: シ ツ ソ ン', es: 'Katakana parecidos: シ ツ ソ ン' },
    note: { en: 'シ (shi) and ツ (tsu): シ\'s dots line up on the left and its stroke sweeps up; ツ\'s dots sit on top and the stroke falls. ソ (so) and ン (n) work the same way.', es: 'シ (shi) y ツ (tsu): los puntos de シ van a la izquierda y el trazo sube; los de ツ van arriba y el trazo baja. ソ (so) y ン (n) funcionan igual.' },
    example: 'シ · ツ · ソ · ン', exampleM: { en: 'shi · tsu · so · n', es: 'shi · tsu · so · n' },
    items: [
      D('"shi" = ＿＿', 'シ', ['ツ', 'ソ'], 'shi', 'shi'),
      D('"tsu" = ＿＿', 'ツ', ['シ', 'ン'], 'tsu', 'tsu'),
      D('"so" = ＿＿', 'ソ', ['ン', 'リ'], 'so', 'so'),
    ],
  },
  // ---- 6 · Katakana II
  {
    id: 'i_loanwords', unit: 6,
    title: { en: 'Loanwords', es: 'Préstamos de otros idiomas' },
    note: { en: 'Words borrowed from other languages are written in katakana and reshaped to Japanese sounds: coffee → コーヒー koohii, camera → カメラ kamera.', es: 'Las palabras tomadas de otros idiomas se escriben en katakana y se adaptan a los sonidos japoneses: coffee → コーヒー koohii, camera → カメラ kamera.' },
    example: 'コーヒー', exampleM: { en: 'koohii (coffee)', es: 'koohii (café)' },
    items: [
      D('カ＿＿ラ (kamera: camera)', 'メ', ['ヌ', 'ナ'], 'kamera: camera', 'kamera: cámara'),
      D('ホテ＿＿ (hoteru: hotel)', 'ル', ['レ', 'ロ'], 'hoteru: hotel', 'hoteru: hotel'),
      D('ラー＿＿ン (raamen: ramen)', 'メ', ['マ', 'モ'], 'raamen: ramen', 'raamen: ramen'),
    ],
  },
  {
    id: 'i_kata_marks', unit: 6,
    title: { en: 'Katakana marks and small kana', es: 'Marcas y kana pequeños en katakana' },
    note: { en: 'The dashes and circle work the same in katakana: ハ ha → バ ba → パ pa. Small ャ ュ ョ blend too: メニュー menyuu.', es: 'Las rayitas y el circulito funcionan igual en katakana: ハ ha → バ ba → パ pa. ャ ュ ョ pequeñas también se funden: メニュー menyuu.' },
    example: 'パン', exampleM: { en: 'pan (bread)', es: 'pan (pan)' },
    items: [
      D('＿＿ン (pan: bread)', 'パ', ['ハ', 'バ'], 'pan: bread', 'pan: pan'),
      D('メニ＿＿ー (menyuu: menu)', 'ュ', ['ユ', 'ョ'], 'menyuu: menu', 'menyuu: menú'),
      D('コー＿＿ー (koohii: coffee)', 'ヒ', ['ビ', 'ピ'], 'koohii: coffee', 'koohii: café'),
    ],
  },
  {
    id: 'i_which_script', unit: 6,
    title: { en: 'Which script?', es: '¿Qué escritura?' },
    note: { en: 'Japanese mixes all three: kanji for core meanings, hiragana for grammar and native words, katakana for loanwords, names and emphasis.', es: 'El japonés mezcla las tres: kanji para los significados, hiragana para la gramática y palabras japonesas, katakana para préstamos, nombres y énfasis.' },
    example: '{私|わたし} ^は コーヒー ^が {好|す}き です。', exampleM: { en: 'I like coffee. (kanji + hiragana + katakana)', es: 'Me gusta el café. (kanji + hiragana + katakana)' },
    items: [
      D('ice cream = ＿＿', 'アイス', ['あいす', 'アイ'], 'loanwords use katakana', 'los préstamos van en katakana'),
      D('cat (native word) = ＿＿', 'ねこ', ['ネコ', 'ねご'], 'native words usually use hiragana or kanji', 'las palabras japonesas suelen ir en hiragana o kanji'),
      D('coffee = ＿＿', 'コーヒー', ['こーひー', 'コヒー'], 'loanwords use katakana', 'los préstamos van en katakana'),
    ],
  },
  // ---- 7 · Kanji pictures
  {
    id: 'i_pictographs', unit: 7,
    title: { en: 'Kanji started as pictures', es: 'Los kanji empezaron como dibujos' },
    note: { en: '山 is three mountain peaks, 川 is flowing water, 木 is a tree with roots, 日 was a sun, 口 an open mouth.', es: '山 son tres picos, 川 es agua que fluye, 木 es un árbol con raíces, 日 era un sol, 口 una boca abierta.' },
    example: '{山|やま} · {川|かわ} · {木|き}', exampleM: { en: 'mountain · river · tree', es: 'montaña · río · árbol' },
    items: [
      D('mountain = ＿＿', '{山|やま}', ['{川|かわ}', '{木|き}'], 'three peaks', 'tres picos'),
      D('river = ＿＿', '{川|かわ}', ['{山|やま}', '{田|た}'], 'flowing water', 'agua que fluye'),
      D('tree = ＿＿', '{木|き}', ['{火|ひ}', '{人|ひと}'], 'a tree with roots', 'un árbol con raíces'),
    ],
  },
  {
    id: 'i_readings', unit: 7,
    title: { en: 'One kanji, several readings', es: 'Un kanji, varias lecturas' },
    note: { en: 'Most kanji have a native reading and a Chinese-based one: 日 is ひ (sun) but にち in 日曜日. Small kana above kanji (furigana) show how to read them.', es: 'La mayoría de kanji tienen una lectura japonesa y otra de origen chino: 日 es ひ (sol), pero にち en 日曜日. Los kana pequeños encima (furigana) indican cómo leerlos.' },
    example: '{日|ひ} · {日曜日|にちようび}', exampleM: { en: 'sun · Sunday', es: 'sol · domingo' },
    items: [
      D('water = ＿＿', '{水|みず}', ['{火|ひ}', '{目|め}'], 'water', 'agua'),
      D('fire = ＿＿', '{火|ひ}', ['{水|みず}', '{口|くち}'], 'fire', 'fuego'),
      D('rain = ＿＿', '{雨|あめ}', ['{日|ひ}', '{月|つき}'], 'rain falling from a cloud', 'lluvia que cae de una nube'),
    ],
  },
  {
    id: 'i_okurigana', unit: 7,
    title: { en: 'Kanji + kana together', es: 'Kanji y kana juntos' },
    note: { en: 'Words often mix a kanji stem with hiragana endings (okurigana): {大|おお}きい "big". The kanji holds the meaning; the kana shows the grammar.', es: 'Las palabras suelen mezclar una raíz en kanji con terminaciones en hiragana (okurigana): {大|おお}きい "grande". El kanji da el significado; el kana, la gramática.' },
    example: '{休|やす}む', exampleM: { en: 'yasumu (to rest)', es: 'yasumu (descansar)' },
    items: [
      D('person = ＿＿', '{人|ひと}', ['{入|はい}る', '{木|き}'], 'a person walking', 'una persona caminando'),
      D('eye = ＿＿', '{目|め}', ['{日|ひ}', '{田|た}'], 'an eye turned on its side', 'un ojo puesto de lado'),
      D('moon = ＿＿', '{月|つき}', ['{日|ひ}', '{目|め}'], 'a crescent moon', 'una luna creciente'),
    ],
  },
  // ---- 8 · Building blocks
  {
    id: 'i_combos', unit: 8,
    title: { en: 'Kanji are built from pieces', es: 'Los kanji se construyen con piezas' },
    note: { en: 'Two trees make a grove 林, three make a forest 森. A person 亻 by a tree 木 is resting 休. Sun 日 + moon 月 is bright 明.', es: 'Dos árboles forman un bosquecillo 林 y tres, un bosque 森. Una persona 亻 junto a un árbol 木 descansa 休. Sol 日 + luna 月 es luminoso 明.' },
    example: '{木|き} → {林|はやし} → {森|もり}', exampleM: { en: 'tree → grove → forest', es: 'árbol → bosquecillo → bosque' },
    items: [
      D('tree + tree = ＿＿', '{林|はやし}', ['{森|もり}', '{本|ほん}'], 'a grove', 'un bosquecillo'),
      D('sun + moon = ＿＿', '{明|あか}るい', ['{休|やす}む', '{森|もり}'], 'bright', 'luminoso'),
      D('person + tree = ＿＿', '{休|やす}む', ['{林|はやし}', '{明|あか}るい'], 'to rest', 'descansar'),
    ],
  },
  {
    id: 'i_numbers', unit: 8,
    title: { en: 'Counting strokes: 一 二 三', es: 'Contar trazos: 一 二 三' },
    note: { en: 'One, two and three are one, two and three lines. 上 (up) and 下 (down) point above and below a line.', es: 'Uno, dos y tres son una, dos y tres rayas. 上 (arriba) y 下 (abajo) señalan por encima y por debajo de una línea.' },
    example: '{一|いち} {二|に} {三|さん}', exampleM: { en: 'one, two, three', es: 'uno, dos, tres' },
    items: [
      D('three = ＿＿', '{三|さん}', ['{二|に}', '{川|かわ}'], 'three lines', 'tres rayas'),
      D('up = ＿＿', '{上|うえ}', ['{下|した}', '{中|なか}'], 'pointing above the line', 'señala por encima'),
      D('inside = ＿＿', '{中|なか}', ['{口|くち}', '{上|うえ}'], 'a line through a box', 'una raya que atraviesa una caja'),
    ],
  },
  {
    id: 'i_particles', unit: 8,
    title: { en: 'Particles read differently: は へ を', es: 'Partículas que se leen distinto: は へ を' },
    note: { en: 'As particles, は is read "wa", へ is read "e" and を is read "o". こんにちは ends in は, so it\'s konnichiwa.', es: 'Como partículas, は se lee "wa", へ se lee "e" y を se lee "o". こんにちは termina en は, por eso es konnichiwa.' },
    example: '{私|わたし} ^は ねこ ^が {好|す}き です。', exampleM: { en: 'watashi WA neko ga suki desu: I like cats.', es: 'watashi WA neko ga suki desu: me gustan los gatos.' },
    items: [
      D('こんにち＿＿ (konnichiwa)', 'は', ['わ', 'ば'], 'hello', 'hola'),
      D('みず ＿＿ のむ (mizu o nomu: drink water)', 'を', ['お', 'わ'], 'drink water', 'beber agua'),
      D('やま ＿＿ いく (yama e iku: go to the mountain)', 'へ', ['え', 'へい'], 'go to the mountain', 'ir a la montaña'),
    ],
  },
];
