import type { LText } from '../../../core/types';

/**
 * Clover Meadow grammar (JLPT N5). Each point has a short explanation, an example and drill
 * items: a Japanese sentence with a blank (＿＿), the correct choice and distractors.
 */
export interface DrillItem { q: string; a: string; wrong: string[]; m: LText }
export interface GrammarPoint { id: string; unit: number; title: LText; note: LText; example: string; exampleM: LText; items: DrillItem[] }

const D = (q: string, a: string, wrong: string[], en: string, es: string): DrillItem => ({ q, a, wrong, m: { en, es } });

export const CLOVER_GRAMMAR: GrammarPoint[] = [
  // ---- Unit 1
  {
    id: 'g_wa_desu', unit: 1,
    title: { en: 'A は B です', es: 'A は B です' },
    note: { en: '"A is B." は (read "wa") marks the topic, です politely ends the sentence.', es: '"A es B". は (se lee "wa") marca el tema y です cierra la frase con cortesía.' },
    example: '{私|わたし} ^は {学生|がくせい} です。', exampleM: { en: 'I am a student.', es: 'Soy estudiante.' },
    items: [
      D('{私|わたし} ＿＿ {学生|がくせい} です。', 'は', ['を', 'に'], 'I am a student.', 'Soy estudiante.'),
      D('ハナさん ^は {先生|せんせい} ＿＿。', 'です', ['ます', 'か'], 'Hana is a teacher.', 'Hana es maestra.'),
      D('トビさん ＿＿ {友|とも}だち です。', 'は', ['で', 'へ'], 'Tobi is a friend.', 'Tobi es un amigo.'),
      D('ここ ＿＿ クローバー{町|まち} です。', 'は', ['を', 'が'], 'This is Clover Town.', 'Esto es el pueblo Trébol.'),
    ],
  },
  {
    id: 'g_ka', unit: 1,
    title: { en: 'Questions with か', es: 'Preguntas con か' },
    note: { en: 'Add か to the end of a sentence to ask a question. No question mark is needed.', es: 'Añade か al final para preguntar. No hace falta signo de interrogación.' },
    example: 'ミミさん ^は {学生|がくせい} です ^か。', exampleM: { en: 'Is Mimi a student?', es: '¿Mimi es estudiante?' },
    items: [
      D('あなた ^は {先生|せんせい} です ＿＿。', 'か', ['は', 'を'], 'Are you a teacher?', '¿Eres maestro?'),
      D('お{名前|なまえ} ^は {何|なん} です ＿＿。', 'か', ['の', 'に'], 'What is your name?', '¿Cómo te llamas?'),
      D('{日本|にほん} ^の {人|ひと} です ＿＿。', 'か', ['も', 'と'], 'Are you from Japan?', '¿Eres de Japón?'),
    ],
  },
  {
    id: 'g_no', unit: 1,
    title: { en: 'の: of, \'s', es: 'の: de' },
    note: { en: 'の links two nouns: A の B = "A\'s B" or "B of A".', es: 'の une dos sustantivos: A の B = "el B de A".' },
    example: '{私|わたし} ^の {名前|なまえ} ^は ミア です。', exampleM: { en: 'My name is Mia.', es: 'Mi nombre es Mia.' },
    items: [
      D('{私|わたし} ＿＿ {友|とも}だち です。', 'の', ['を', 'へ'], "She's my friend.", 'Es mi amiga.'),
      D('{日本語|にほんご} ＿＿ {先生|せんせい} です。', 'の', ['で', 'が'], "I'm a Japanese teacher.", 'Soy maestro de japonés.'),
      D('これ ^は トビさん ＿＿ {手紙|てがみ} です。', 'の', ['に', 'か'], "This is Tobi's letter.", 'Esta es la carta de Tobi.'),
    ],
  },
  {
    id: 'g_mo', unit: 1,
    title: { en: 'も: also', es: 'も: también' },
    note: { en: 'も replaces は to mean "also / too".', es: 'も sustituye a は y significa "también".' },
    example: '{私|わたし} ^も {学生|がくせい} です。', exampleM: { en: "I'm a student too.", es: 'Yo también soy estudiante.' },
    items: [
      D('ハナさん ^は {学生|がくせい} です。{私|わたし} ＿＿ {学生|がくせい} です。', 'も', ['の', 'を'], "Hana is a student. I'm a student too.", 'Hana es estudiante. Yo también.'),
      D('クーさん ＿＿ アヒル です。', 'も', ['に', 'で'], 'Kuu is a duck too.', 'Kuu también es un pato.'),
    ],
  },
  // ---- Unit 2
  {
    id: 'g_kosoado', unit: 2,
    title: { en: 'これ・それ・あれ', es: 'これ・それ・あれ' },
    note: { en: 'これ = this (near me), それ = that (near you), あれ = that (over there). どれ = which one?', es: 'これ = esto (cerca de mí), それ = eso (cerca de ti), あれ = aquello (lejos). どれ = ¿cuál?' },
    example: 'これ ^は いくら です ^か。', exampleM: { en: 'How much is this?', es: '¿Cuánto cuesta esto?' },
    items: [
      D('（{近|ちか}く ^の りんご）＿＿ ^は いくら です ^か。', 'これ', ['あれ', 'どれ'], 'How much is this (apple near me)?', '¿Cuánto cuesta esto (la manzana cerca de mí)?'),
      D('（{遠|とお}く ^の {山|やま}）＿＿ ^は {何|なん} です ^か。', 'あれ', ['これ', 'それ'], 'What is that (far away)?', '¿Qué es aquello (a lo lejos)?'),
      D('{赤|あか}い ^の ^は ＿＿ です ^か。', 'どれ', ['これ', 'あれ'], 'Which one is the red one?', '¿Cuál es el rojo?'),
    ],
  },
  {
    id: 'g_wo_kudasai', unit: 2,
    title: { en: '～を ください', es: '～を ください' },
    note: { en: '"Please give me ~." Use it when buying or ordering: りんごを ください.', es: '"Deme ~, por favor." Se usa al comprar o pedir: りんごを ください.' },
    example: 'たまご ^を ください。', exampleM: { en: 'Eggs, please.', es: 'Huevos, por favor.' },
    items: [
      D('りんご ＿＿ ください。', 'を', ['は', 'に'], 'An apple, please.', 'Una manzana, por favor.'),
      D('お{茶|ちゃ} ^を ＿＿。', 'ください', ['です', 'ありがとう'], 'Tea, please.', 'Té, por favor.'),
      D('この {野菜|やさい} ＿＿ ください。', 'を', ['が', 'も'], 'These vegetables, please.', 'Estas verduras, por favor.'),
    ],
  },
  {
    id: 'g_counters', unit: 2,
    title: { en: 'Counting things: ひとつ・ふたつ', es: 'Contar cosas: ひとつ・ふたつ' },
    note: { en: 'For general things use ひとつ, ふたつ, みっつ… after the object: りんごを ふたつ ください.', es: 'Para cosas en general: ひとつ, ふたつ, みっつ… después del objeto: りんごを ふたつ ください.' },
    example: 'たまご ^を みっつ ください。', exampleM: { en: 'Three eggs, please.', es: 'Tres huevos, por favor.' },
    items: [
      D('りんご ^を ＿＿ ください。（2）', 'ふたつ', ['ふたり', 'にじ'], 'Two apples, please.', 'Dos manzanas, por favor.'),
      D('パン ^を ＿＿ ください。（1）', 'ひとつ', ['ひとり', 'いちじ'], 'One bread, please.', 'Un pan, por favor.'),
      D('いちご ^を ＿＿ ください。（3）', 'みっつ', ['さんにん', 'さんじ'], 'Three strawberries, please.', 'Tres fresas, por favor.'),
    ],
  },
  {
    id: 'g_ikura', unit: 2,
    title: { en: 'Prices: いくら・～円', es: 'Precios: いくら・～円' },
    note: { en: 'いくらですか = how much is it? Prices use 円 (yen): ひゃく えん = 100 yen.', es: 'いくらですか = ¿cuánto cuesta? Los precios usan 円 (yen): ひゃく えん = 100 yenes.' },
    example: 'この たまご ^は {百|ひゃく}{円|えん} です。', exampleM: { en: 'These eggs are 100 yen.', es: 'Estos huevos cuestan 100 yenes.' },
    items: [
      D('これ ^は ＿＿ です ^か。', 'いくら', ['いくつ', 'なんじ'], 'How much is this?', '¿Cuánto cuesta esto?'),
      D('りんご ^は {三百|さんびゃく} ＿＿ です。', '{円|えん}', ['{時|じ}', '{人|にん}'], 'The apple is 300 yen.', 'La manzana cuesta 300 yenes.'),
    ],
  },
  // ---- Unit 3
  {
    id: 'g_ji_ni', unit: 3,
    title: { en: 'Time + に', es: 'Hora + に' },
    note: { en: 'Clock times take に: 七時に おきます = I get up at seven. Words like 今日 and 毎日 don\'t take に.', es: 'Las horas llevan に: 七時に おきます = me levanto a las siete. Palabras como 今日 o 毎日 no llevan に.' },
    example: '{七時|しちじ} ^に {起|お}きます。', exampleM: { en: 'I get up at seven.', es: 'Me levanto a las siete.' },
    items: [
      D('{八時|はちじ} ＿＿ {学校|がっこう} ^へ {行|い}きます。', 'に', ['を', 'の'], 'I go to school at eight.', 'Voy a la escuela a las ocho.'),
      D('{毎日|まいにち} ＿＿ {働|はたら}きます。', '（なし / none）', ['に', 'を'], 'I work every day. (No particle!)', 'Trabajo todos los días. (¡Sin partícula!)'),
      D('{十時|じゅうじ} ＿＿ {寝|ね}ます。', 'に', ['で', 'が'], 'I go to bed at ten.', 'Me acuesto a las diez.'),
    ],
  },
  {
    id: 'g_masu', unit: 3,
    title: { en: 'Polite verbs: ～ます・～ません', es: 'Verbos corteses: ～ます・～ません' },
    note: { en: '～ます is the polite present ("I do / will do"). ～ません is the negative ("I don\'t").', es: '～ます es el presente cortés ("hago / haré"). ～ません es la negación ("no hago").' },
    example: '{毎日|まいにち} {日本語|にほんご} ^を {勉強|べんきょう}します。', exampleM: { en: 'I study Japanese every day.', es: 'Estudio japonés todos los días.' },
    items: [
      D('{朝|あさ} {六時|ろくじ} ^に {起|お}き＿＿。', 'ます', ['です', 'ません です'], 'I get up at six in the morning.', 'Me levanto a las seis de la mañana.'),
      D('{日曜日|にちようび} ^は {働|はたら}き＿＿。', 'ません', ['ます か', 'ないです'], "I don't work on Sundays.", 'No trabajo los domingos.'),
      D('{毎晩|まいばん} {本|ほん} ^を {読|よ}＿＿。', 'みます', ['みです', 'むます'], 'I read a book every evening.', 'Leo un libro cada noche.'),
      D('お{酒|さけ} ^は {飲|の}＿＿。', 'みません', ['まない', 'みますん'], "I don't drink alcohol.", 'No bebo alcohol.'),
    ],
  },
  {
    id: 'g_kara_made', unit: 3,
    title: { en: '～から ～まで', es: '～から ～まで' },
    note: { en: 'から = from, まで = until / to: 九時から 五時まで = from nine to five.', es: 'から = desde, まで = hasta: 九時から 五時まで = de nueve a cinco.' },
    example: '{店|みせ} ^は {九時|くじ} ^から {五時|ごじ} ^まで です。', exampleM: { en: 'The shop is open from nine to five.', es: 'La tienda abre de nueve a cinco.' },
    items: [
      D('{月曜日|げつようび} ＿＿ {金曜日|きんようび} ^まで {働|はたら}きます。', 'から', ['まで', 'に'], 'I work from Monday to Friday.', 'Trabajo de lunes a viernes.'),
      D('{図書館|としょかん} ^は {十時|じゅうじ} ^から {六時|ろくじ} ＿＿ です。', 'まで', ['から', 'へ'], 'The library is open from ten to six.', 'La biblioteca abre de diez a seis.'),
    ],
  },
  // ---- Unit 4
  {
    id: 'g_ni_arimasu', unit: 4,
    title: { en: 'Where things are: ～に あります・います', es: 'Dónde están: ～に あります・います' },
    note: { en: 'Place + に + あります for things, います for people and animals: 駅は どこに ありますか.', es: 'Lugar + に + あります para cosas, います para personas y animales: 駅は どこに ありますか.' },
    example: '{郵便局|ゆうびんきょく} ^は {公園|こうえん} ^の となり ^に あります。', exampleM: { en: 'The post office is next to the park.', es: 'La oficina de correos está al lado del parque.' },
    items: [
      D('{駅|えき} ^は どこ ^に ＿＿ ^か。', 'あります', ['います', 'です'], 'Where is the station?', '¿Dónde está la estación?'),
      D('ミミちゃん ^は {公園|こうえん} ^に ＿＿。', 'います', ['あります', 'ます'], 'Mimi is in the park.', 'Mimi está en el parque.'),
      D('{本|ほん} ^は つくえ ^の {上|うえ} ＿＿ あります。', 'に', ['を', 'で'], 'The book is on the desk.', 'El libro está encima del escritorio.'),
      D('ねこ ^が いす ^の {下|した} ^に ＿＿。', 'います', ['あります', 'いきます'], 'There is a cat under the chair.', 'Hay un gato debajo de la silla.'),
    ],
  },
  {
    id: 'g_he_iku', unit: 4,
    title: { en: 'Going places: ～へ / ～に 行きます', es: 'Ir a: ～へ / ～に 行きます' },
    note: { en: 'へ (read "e") or に marks where you go: 駅へ 行きます = I go to the station.', es: 'へ (se lee "e") o に marcan adónde vas: 駅へ 行きます = voy a la estación.' },
    example: '{明日|あした} {図書館|としょかん} ^へ {行|い}きます。', exampleM: { en: "I'll go to the library tomorrow.", es: 'Mañana iré a la biblioteca.' },
    items: [
      D('{銀行|ぎんこう} ＿＿ {行|い}きます。', 'へ', ['を', 'の'], "I'm going to the bank.", 'Voy al banco.'),
      D('{何時|なんじ} ^に {家|いえ} ^へ {帰|かえ}り＿＿ ^か。', 'ます', ['です', 'ません です'], 'What time do you go home?', '¿A qué hora vuelves a casa?'),
      D('{友|とも}だち ^が {町|まち} ＿＿ {来|き}ます。', 'に', ['を', 'が'], 'A friend is coming to town.', 'Un amigo viene al pueblo.'),
    ],
  },
  {
    id: 'g_position', unit: 4,
    title: { en: 'Position words: ～の 上・前・となり', es: 'Posición: ～の 上・前・となり' },
    note: { en: 'X の 上 (on top of X), 前 (in front of), うしろ (behind), 中 (inside), となり (next to).', es: 'X の 上 (encima de X), 前 (delante de), うしろ (detrás de), 中 (dentro de), となり (al lado de).' },
    example: 'ベル ^は {時計台|とけいだい} ^の {中|なか} ^に あります。', exampleM: { en: 'The bell is inside the clock tower.', es: 'La campana está dentro de la torre del reloj.' },
    items: [
      D('{銀行|ぎんこう} ^は {駅|えき} ^の ＿＿ ^に あります。（next to）', 'となり', ['うしろ', 'なか'], 'The bank is next to the station.', 'El banco está al lado de la estación.'),
      D('ねこ ^は はこ ^の ＿＿ ^に います。（inside）', '{中|なか}', ['{上|うえ}', '{前|まえ}'], 'The cat is inside the box.', 'El gato está dentro de la caja.'),
      D('{公園|こうえん} ^は {学校|がっこう} ^の ＿＿ ^に あります。（in front）', '{前|まえ}', ['{右|みぎ}', '{下|した}'], 'The park is in front of the school.', 'El parque está delante de la escuela.'),
    ],
  },
  // ---- Unit 5
  {
    id: 'g_wo_verb', unit: 5,
    title: { en: 'Objects with を', es: 'Complemento con を' },
    note: { en: 'を (read "o") marks what you act on: パンを 食べます = I eat bread.', es: 'を (se lee "o") marca sobre qué actúas: パンを 食べます = como pan.' },
    example: '{朝|あさ}ご{飯|はん} ^に パン ^を {食|た}べます。', exampleM: { en: 'I eat bread for breakfast.', es: 'Desayuno pan.' },
    items: [
      D('コーヒー ＿＿ {飲|の}みます。', 'を', ['が', 'に'], 'I drink coffee.', 'Bebo café.'),
      D('クーさん ^は スープ ＿＿ {作|つく}ります。', 'を', ['へ', 'で'], 'Kuu makes soup.', 'Kuu prepara sopa.'),
      D('{毎日|まいにち} {野菜|やさい} ^を {食|た}べ＿＿。', 'ます', ['です', 'るます'], 'I eat vegetables every day.', 'Como verduras todos los días.'),
    ],
  },
  {
    id: 'g_i_adj', unit: 5,
    title: { en: 'い-adjectives', es: 'Adjetivos -い' },
    note: { en: 'い-adjectives end in い: おいしいです. Negative: drop い, add くないです → おいしくないです. いい becomes よくないです.', es: 'Los adjetivos -い terminan en い: おいしいです. Negativo: quita い y añade くないです → おいしくないです. いい pasa a よくないです.' },
    example: 'この ケーキ ^は {甘|あま}くない です。', exampleM: { en: "This cake isn't sweet.", es: 'Este pastel no es dulce.' },
    items: [
      D('この スープ ^は {辛|から}＿＿ です。（not spicy）', 'くない', ['いない', 'じゃない'], "This soup isn't spicy.", 'Esta sopa no es picante.'),
      D('{今日|きょう} ^は {天気|てんき} ^が ＿＿ です。（not good）', 'よくない', ['いくない', 'いいじゃない'], "The weather isn't good today.", 'Hoy no hace buen tiempo.'),
      D('{高|たか}い りんご ^は おいし＿＿ です ^か。', 'い', ['な', 'く'], 'Are expensive apples tasty?', '¿Las manzanas caras están ricas?'),
    ],
  },
  {
    id: 'g_na_adj', unit: 5,
    title: { en: 'な-adjectives', es: 'Adjetivos -な' },
    note: { en: 'な-adjectives take な before a noun (しずかな 町) and じゃないです in the negative (しずかじゃないです).', es: 'Los adjetivos -な llevan な ante un sustantivo (しずかな 町) y じゃないです en negativo (しずかじゃないです).' },
    example: 'クローバー{町|まち} ^は しずか ^な {町|まち} です。', exampleM: { en: 'Clover Town is a quiet town.', es: 'Trébol es un pueblo tranquilo.' },
    items: [
      D('ここ ^は きれい ＿＿ {公園|こうえん} です。', 'な', ['い', 'の'], 'This is a pretty park.', 'Este es un parque bonito.'),
      D('{市場|いちば} ^は しずか ＿＿ です。（not quiet）', 'じゃない', ['くない', 'ないな'], "The market isn't quiet.", 'El mercado no es tranquilo.'),
      D('ハナさん ^は {元気|げんき} ＿＿ アヒル です。', 'な', ['の', 'く'], 'Hana is a lively duck.', 'Hana es una pata muy animada.'),
    ],
  },
  {
    id: 'g_ga_suki', unit: 5,
    title: { en: '～が 好きです', es: '～が 好きです' },
    note: { en: '好き (like) and きらい (dislike) take が: すしが 好きです = I like sushi.', es: '好き (gustar) y きらい (no gustar) llevan が: すしが 好きです = me gusta el sushi.' },
    example: '{私|わたし} ^は {甘|あま}い もの ^が {好|す}きです。', exampleM: { en: 'I like sweet things.', es: 'Me gustan las cosas dulces.' },
    items: [
      D('{私|わたし} ^は いちご ＿＿ {好|す}きです。', 'が', ['を', 'へ'], 'I like strawberries.', 'Me gustan las fresas.'),
      D('トビさん ^は {肉|にく} ^が ＿＿ です。（dislike）', 'きらい', ['きらく', 'すきない'], 'Tobi dislikes meat.', 'A Tobi no le gusta la carne.'),
    ],
  },
  // ---- Unit 6
  {
    id: 'g_people_age', unit: 6,
    title: { en: 'People and age: ～人・～歳', es: 'Personas y edad: ～人・～歳' },
    note: { en: 'Count people with 人: ひとり, ふたり, さんにん, よにん… Age uses 歳 (さい): なんさいですか = how old are you? いくつ also asks age politely.', es: 'Se cuentan personas con 人: ひとり, ふたり, さんにん, よにん… La edad usa 歳 (さい): なんさいですか = ¿cuántos años tienes?' },
    example: '{家族|かぞく} ^は {四人|よにん} です。', exampleM: { en: 'There are four people in my family.', es: 'Somos cuatro en mi familia.' },
    items: [
      D('ミミちゃん ^は {五|ご} ＿＿ です。', '{歳|さい}', ['{人|にん}', '{円|えん}'], 'Mimi is five years old.', 'Mimi tiene cinco años.'),
      D('{兄弟|きょうだい} ^が ＿＿ います。（2 people）', 'ふたり', ['ふたつ', 'にこ'], 'I have two siblings.', 'Tengo dos hermanos.'),
      D('{家族|かぞく} ^は {何人|なんにん} です ^か。― {三人|さんにん} ＿＿。', 'です', ['ます', 'います か'], 'How many in your family? — Three.', '¿Cuántos son en tu familia? — Tres.'),
    ],
  },
  {
    id: 'g_ga_imasu', unit: 6,
    title: { en: 'Having family: ～が います', es: 'Tener familia: ～が います' },
    note: { en: 'For people and animals you "have", use が います: 妹が います = I have a younger sister.', es: 'Para personas o animales que "tienes", usa が います: 妹が います = tengo una hermana menor.' },
    example: '{私|わたし} ^は {弟|おとうと} ^が います。', exampleM: { en: 'I have a younger brother.', es: 'Tengo un hermano menor.' },
    items: [
      D('{私|わたし} ^は {姉|あね} ＿＿ います。', 'が', ['を', 'で'], 'I have an older sister.', 'Tengo una hermana mayor.'),
      D('クーさん ^は {子|こ}ども ^が ＿＿。', 'います', ['あります', 'です'], 'Kuu has a child.', 'Kuu tiene un hijo.'),
    ],
  },
  {
    id: 'g_to', unit: 6,
    title: { en: 'と: and / with', es: 'と: y / con' },
    note: { en: 'と joins nouns ("A and B") and marks who you do something with: 母と 行きます = I go with my mother.', es: 'と une sustantivos ("A y B") e indica con quién: 母と 行きます = voy con mi madre.' },
    example: '{父|ちち} ^と {母|はは} ^と {公園|こうえん} ^へ {行|い}きます。', exampleM: { en: 'I go to the park with my father and mother.', es: 'Voy al parque con mi padre y mi madre.' },
    items: [
      D('パン ＿＿ たまご ^を ください。', 'と', ['も', 'の'], 'Bread and eggs, please.', 'Pan y huevos, por favor.'),
      D('{友|とも}だち ＿＿ {遊|あそ}びます。', 'と', ['を', 'が'], 'I play with my friend.', 'Juego con mi amigo.'),
    ],
  },
  // ---- Unit 7
  {
    id: 'g_mashita', unit: 7,
    title: { en: 'Past: ～ました・～ませんでした', es: 'Pasado: ～ました・～ませんでした' },
    note: { en: '～ました = did, ～ませんでした = didn\'t: きのう 雨が 降りました = It rained yesterday.', es: '～ました = hice, ～ませんでした = no hice: きのう 雨が 降りました = ayer llovió.' },
    example: '{昨日|きのう} {雨|あめ} ^が {降|ふ}りました。', exampleM: { en: 'It rained yesterday.', es: 'Ayer llovió.' },
    items: [
      D('{昨日|きのう} {市場|いちば} ^へ {行|い}き＿＿。', 'ました', ['ます', 'でした'], 'I went to the market yesterday.', 'Ayer fui al mercado.'),
      D('{今朝|けさ} ^は {何|なに} ^も {食|た}べ＿＿。', 'ませんでした', ['ました', 'ないでした'], "I didn't eat anything this morning.", 'Esta mañana no comí nada.'),
      D('{夜|よる} {強|つよ}い {風|かぜ} ^が ふき＿＿。', 'ました', ['ます か', 'です'], 'A strong wind blew last night.', 'Anoche sopló un viento fuerte.'),
    ],
  },
  {
    id: 'g_adj_past', unit: 7,
    title: { en: 'Adjectives in the past', es: 'Adjetivos en pasado' },
    note: { en: 'い-adjectives: drop い, add かったです (さむかったです). な-adjectives and nouns: でした (しずかでした).', es: 'Adjetivos -い: quita い y añade かったです (さむかったです). Adjetivos -な y sustantivos: でした (しずかでした).' },
    example: '{昨日|きのう} ^は とても {寒|さむ}かったです。', exampleM: { en: 'It was very cold yesterday.', es: 'Ayer hizo mucho frío.' },
    items: [
      D('お{祭|まつ}り ^は {楽|たの}し＿＿ です。（was fun）', 'かった', ['いでした', 'くて'], 'The festival was fun.', 'El festival fue divertido.'),
      D('{昨日|きのう} ^の {町|まち} ^は しずか ＿＿。', 'でした', ['かったです', 'くないです'], 'The town was quiet yesterday.', 'Ayer el pueblo estaba tranquilo.'),
      D('あらし ^は こわ＿＿ です。（was scary）', 'かった', ['いだった', 'いでした'], 'The storm was scary.', 'La tormenta daba miedo.'),
    ],
  },
  {
    id: 'g_kara_because', unit: 7,
    title: { en: '～から: because', es: '～から: porque' },
    note: { en: 'Put から after a reason: 雨ですから、傘を 持って いきます = Because it\'s raining, I\'ll take an umbrella.', es: 'Pon から después del motivo: 雨ですから、傘を 持って いきます = Como llueve, llevo paraguas.' },
    example: '{寒|さむ}いです ^から、{窓|まど} ^を {閉|し}めます。', exampleM: { en: "Because it's cold, I'll close the window.", es: 'Como hace frío, cierro la ventana.' },
    items: [
      D('{疲|つか}れました ＿＿、{休|やす}みます。', 'から', ['まで', 'に'], "I'm tired, so I'll rest.", 'Estoy cansado, así que descanso.'),
      D('{雨|あめ} です ＿＿、{傘|かさ} ^を {持|も}って いきます。', 'から', ['でも', 'と'], "It's raining, so I'll take an umbrella.", 'Llueve, así que llevo paraguas.'),
    ],
  },
  // ---- Unit 8
  {
    id: 'g_masenka', unit: 8,
    title: { en: 'Invitations: ～ませんか', es: 'Invitar: ～ませんか' },
    note: { en: '"Won\'t you…?" A soft, polite invitation: いっしょに 行きませんか = Would you like to go together?', es: '"¿No quieres…?" Una invitación cortés: いっしょに 行きませんか = ¿Vamos juntos?' },
    example: 'いっしょ ^に お{祭|まつ}り ^へ {行|い}きません ^か。', exampleM: { en: 'Would you like to go to the festival together?', es: '¿Quieres ir juntos al festival?' },
    items: [
      D('いっしょ ^に {歌|うた}い＿＿ ^か。', 'ません', ['ます', 'ましょう'], 'Would you like to sing together?', '¿Quieres cantar conmigo?'),
      D('{明日|あした} {公園|こうえん} ^で {会|あ}いません ＿＿。', 'か', ['ね', 'を'], 'Shall we meet in the park tomorrow?', '¿Nos vemos mañana en el parque?'),
    ],
  },
  {
    id: 'g_mashou', unit: 8,
    title: { en: "Let's: ～ましょう", es: 'Vamos a: ～ましょう' },
    note: { en: '～ましょう = "Let\'s…". Often the happy answer to ～ませんか: ええ、行きましょう!', es: '～ましょう = "¡Vamos a…!". Suele ser la respuesta alegre a ～ませんか: ええ、行きましょう!' },
    example: 'さあ、{踊|おど}りましょう！', exampleM: { en: "Come on, let's dance!", es: '¡Venga, a bailar!' },
    items: [
      D('ええ、{行|い}き＿＿！', 'ましょう', ['ません', 'ました'], "Yes, let's go!", '¡Sí, vamos!'),
      D('{少|すこ}し {休|やす}み＿＿。', 'ましょう', ['ませんでした', 'たい'], "Let's take a short rest.", 'Descansemos un poco.'),
    ],
  },
  {
    id: 'g_te_kudasai', unit: 8,
    title: { en: 'Requests: ～て ください', es: 'Pedir: ～て ください' },
    note: { en: 'Te-form + ください = "please do…": 見て ください (please look), 待って ください (please wait). Learn te-forms by group: 見る→見て, 待つ→待って, 書く→書いて, 読む→読んで.', es: 'Forma -te + ください = "por favor, haz…": 見て ください (mira), 待って ください (espera). 見る→見て, 待つ→待って, 書く→書いて, 読む→読んで.' },
    example: 'ちょっと {待|ま}って ください。', exampleM: { en: 'Please wait a moment.', es: 'Espera un momento, por favor.' },
    items: [
      D('ここ ^に {名前|なまえ} ^を {書|か}＿＿ ください。', 'いて', ['って', 'んで'], 'Please write your name here.', 'Escribe tu nombre aquí, por favor.'),
      D('ちょっと {待|ま}＿＿ ください。', 'って', ['いて', 'んで'], 'Please wait a moment.', 'Espera un momento, por favor.'),
      D('この {本|ほん} ^を {読|よ}＿＿ ください。', 'んで', ['いて', 'って'], 'Please read this book.', 'Lee este libro, por favor.'),
      D('{空|そら} ^を {見|み}＿＿ ください！', 'て', ['って', 'んで'], 'Please look at the sky!', '¡Mira el cielo!'),
    ],
  },
  {
    id: 'g_tai', unit: 8,
    title: { en: 'Wanting to: ～たいです', es: 'Querer: ～たいです' },
    note: { en: 'Verb stem + たいです = "I want to…": 花火を 見たいです = I want to see the fireworks.', es: 'Raíz del verbo + たいです = "quiero…": 花火を 見たいです = quiero ver los fuegos artificiales.' },
    example: '{花火|はなび} ^を {見|み}たいです。', exampleM: { en: 'I want to see the fireworks.', es: 'Quiero ver los fuegos artificiales.' },
    items: [
      D('{日本|にほん} ^へ {行|い}き＿＿ です。', 'たい', ['ます', 'ました'], 'I want to go to Japan.', 'Quiero ir a Japón.'),
      D('おいしい ケーキ ^が {食|た}べ＿＿ です。', 'たい', ['ません', 'て'], 'I want to eat a tasty cake.', 'Quiero comer un pastel rico.'),
    ],
  },
];
