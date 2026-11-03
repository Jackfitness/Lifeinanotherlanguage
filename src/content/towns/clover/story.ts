import type { Expr, LText } from '../../../core/types';
import type { Phrase } from '../../phrases';
import type { Step } from '../../dialogues';
import type { QuestDef } from '../../quests';
import type { NpcDef } from '../../characters';

/**
 * Clover Meadow story: "The Clover Bell". The meadow's spring festival is coming, but the old
 * bell in the clock tower has gone silent. Legend says it rings again when a newcomer speaks the
 * town's language from the heart, so Kero-sensei trains you for the Clover Exam.
 */
export const CLOVER_PHRASES: Phrase[] = [];
const P = (id: string, ja: string, en: string, es: string, words: string[] = [], lvl: 1 | 2 | 3 = 1) => {
  CLOVER_PHRASES.push({ id: 'c_' + id, lvl, words: words.map((w) => 'n5_' + w), t: { ja, en, es } });
  return 'c_' + id;
};
const say = (p: string, e: Expr = 'neutral'): Step => ({ t: 'say', p, e });
const reply = (ok: string[], bad: string[] = []): Step => ({ t: 'reply', ok, bad });
const build = (p: string): Step => ({ t: 'build', p });
const meaning = (p: string): Step => ({ t: 'meaning', p });
const narrate = (en: string, es: string, ja = ''): Step => ({ t: 'narrate', text: { en, es, ja } });
const quiz = (q: LText, options: string[], answer = 0): Step => ({ t: 'quiz', q, options, answer });
const doIt = (fn: string, arg?: unknown): Step => ({ t: 'do', fn, arg });

// ------------------------------------------------------------------ villagers
export const CLOVER_NPCS: NpcDef[] = [
  {
    id: 'ponpon', species: 'duck', extra: 'bowtie',
    name: { en: 'Mayor Ponpon', es: 'Alcalde Ponpon', ja: 'ポンポン{町長|ちょうちょう}' },
    title: { en: 'Mayor of Clover Meadow', es: 'Alcalde del Prado del Trébol', ja: 'クローバー町の町長' },
    personality: { en: 'Proud, kind and a little forgetful. Has organized the spring festival for forty years.', es: 'Orgulloso, amable y algo olvidadizo. Organiza el festival de primavera desde hace cuarenta años.', ja: '誇り高くてやさしい、少しわすれっぽい町長。' },
    colors: { main: '#FFF8EE', accent: '#F2913D', belly: '#FFFFFF', nose: '#F2913D' },
    voice: { pitch: 175, speed: 0.85 }, favorites: ['bread', 'tea'], likes: ['cookie', 'milk'],
    stories: [P('ponpon_s1', '{毎年|まいとし}、お{祭|まつ}り ^を {作|つく}ります。', 'I organize the festival every year.', 'Organizo el festival todos los años.', ['matsuri']), P('ponpon_s2', '{若|わか}い ころ、{歌|うた} ^が {上手|じょうず} でした。', 'When I was young, I was good at singing.', 'De joven cantaba muy bien.', ['uta'])],
    routine: [{ from: 0, to: 24, node: 'hall', activity: 'work' }], tint: '#F2913D',
  },
  {
    id: 'kero', species: 'frog', extra: 'glasses',
    name: { en: 'Kero-sensei', es: 'Maestro Kero', ja: 'ケロ{先生|せんせい}' },
    title: { en: 'Dojo master', es: 'Maestro del dojo', ja: '道場の先生' },
    personality: { en: 'Calm, strict and secretly very soft. Believes every word is a small kindness.', es: 'Tranquilo, estricto y en secreto muy tierno. Cree que cada palabra es un pequeño gesto amable.', ja: '落ち着いていて厳しいけれど、本当はとてもやさしい。' },
    colors: { main: '#7DB46C', accent: '#4F9466', belly: '#E4F2DD', nose: '#4F9466' },
    voice: { pitch: 140, speed: 0.8 }, favorites: ['tea'], likes: ['milk', 'cookie'],
    stories: [P('kero_s1', '{毎朝|まいあさ} {五時|ごじ} ^に {起|お}きます。', 'I get up at five every morning.', 'Me levanto a las cinco cada mañana.', ['asa', 'okiru']), P('kero_s2', 'ことば ^は {小|ちい}さな やさしさ です。', 'Words are small kindnesses.', 'Las palabras son pequeñas amabilidades.', [], 2)],
    routine: [{ from: 0, to: 24, node: 'dojo', activity: 'work' }], tint: '#4F9466',
  },
  {
    id: 'hana', species: 'duck', extra: 'bow',
    name: { en: 'Hana', es: 'Hana', ja: 'ハナ' },
    title: { en: 'Market stall keeper', es: 'Vendedora del mercado', ja: '市場のお店の人' },
    personality: { en: 'Bright, chatty and great at bargains. Knows everyone in town.', es: 'Alegre, conversadora y experta en gangas. Conoce a todo el pueblo.', ja: '明るくておしゃべり。町のみんなを知っている。' },
    colors: { main: '#F6D36B', accent: '#F2913D', belly: '#FFF3C9', nose: '#F2913D' },
    voice: { pitch: 330, speed: 1.2 }, favorites: ['strawberry', 'flower'], likes: ['apple', 'carrot'],
    stories: [P('hana_s1', '{私|わたし} ^は くだもの ^が {大好|だいす}き です。', 'I love fruit.', 'Me encanta la fruta.', ['kudamono']), P('hana_s2', 'いつか {大|おお}きい {店|みせ} ^を {作|つく}りたい です。', 'Someday I want to open a big shop.', 'Algún día quiero abrir una tienda grande.', ['tsukuru'])],
    routine: [{ from: 0, to: 24, node: 'market', activity: 'work' }], tint: '#E9A92A',
  },
  {
    id: 'tobi', species: 'frog', extra: 'cap',
    name: { en: 'Tobi', es: 'Tobi', ja: 'トビ' },
    title: { en: 'Mail carrier', es: 'Cartero', ja: '郵便屋さん' },
    personality: { en: 'Fast, cheerful and always a little out of breath. Hops everywhere.', es: 'Rápido, alegre y siempre algo sin aliento. Va saltando a todas partes.', ja: '足が速くて元気。いつも少し息を切らしている。' },
    colors: { main: '#A8DABB', accent: '#5E95C4', belly: '#EAF7EE', nose: '#4F9466' },
    voice: { pitch: 290, speed: 1.35 }, favorites: ['carrot', 'milk'], likes: ['apple', 'sandwich'],
    stories: [P('tobi_s1', '{毎日|まいにち} {百|ひゃく} ^の {手紙|てがみ} ^を {運|はこ}びます！', 'I deliver a hundred letters every day!', '¡Reparto cien cartas cada día!', ['tegami']), P('tobi_s2', '{走|はし}る ^の ^が {好|す}き です。', 'I love running.', 'Me encanta correr.', ['suki'])],
    routine: [{ from: 0, to: 24, node: 'post', activity: 'work' }], tint: '#5E95C4',
  },
  {
    id: 'kuu', species: 'duck', extra: 'apron',
    name: { en: 'Kuu', es: 'Kuu', ja: 'クー' },
    title: { en: 'Restaurant owner', es: 'Dueña del restaurante', ja: 'レストランの店長' },
    personality: { en: 'Warm, busy and a fantastic cook. Worries about her daughter Mimi.', es: 'Cálida, ocupada y una cocinera fantástica. Se preocupa por su hija Mimi.', ja: 'あたたかくて忙しい、料理上手なお母さん。' },
    colors: { main: '#B88A5E', accent: '#5E8E74', belly: '#F2DCC0', nose: '#F2913D' },
    voice: { pitch: 210, speed: 1.0 }, favorites: ['honey', 'milk'], likes: ['bread', 'soup'],
    stories: [P('kuu_s1', '{私|わたし} ^の スープ ^は {有名|ゆうめい} です ^よ。', 'My soup is famous, you know.', 'Mi sopa es famosa, ¿sabes?', ['yuumei']), P('kuu_s2', 'ミミ ^は {私|わたし} ^の {宝物|たからもの} です。', 'Mimi is my treasure.', 'Mimi es mi tesoro.', [])],
    routine: [{ from: 0, to: 24, node: 'kitchen', activity: 'work' }], tint: '#8A5A3B',
  },
  {
    id: 'mimi', species: 'duck', extra: 'none',
    name: { en: 'Mimi', es: 'Mimi', ja: 'ミミ' },
    title: { en: "Kuu's daughter", es: 'Hija de Kuu', ja: 'クーの娘' },
    personality: { en: 'Five years old, curious about everything, and terrible at staying put.', es: 'Tiene cinco años, siente curiosidad por todo y nunca se queda quieta.', ja: '5歳。なんでも気になって、じっとしていられない。' },
    colors: { main: '#FBE08A', accent: '#F2913D', belly: '#FFF8D6', nose: '#F2913D' },
    voice: { pitch: 420, speed: 1.3 }, favorites: ['cookie', 'strawberry'], likes: ['cake', 'apple'],
    stories: [P('mimi_s1', 'ミミ ^は {五歳|ごさい} です！', "I'm five years old!", '¡Tengo cinco años!', ['sai']), P('mimi_s2', 'ちょうちょ ^が {大好|だいす}き！', 'I love butterflies!', '¡Me encantan las mariposas!', [])],
    routine: [{ from: 0, to: 24, node: 'park', activity: 'stroll' }], tint: '#E9A92A', scale: 0.72,
  },
];

// ------------------------------------------------------------------ chapter dialogue
const C = (id: string, steps: Step[]) => [id, steps] as const;

// Chapter 1 · A new face
const c1 = [
  C('c1_ponpon', [
    say(P('pon_hello', 'おや！ はじめまして。', 'Oh! Nice to meet you.', '¡Vaya! Mucho gusto.'), 'surprised'),
    say(P('pon_im', '{私|わたし} ^は ポンポン です。 この {町|まち} ^の {町長|ちょうちょう} です。', "I'm Ponpon. I'm the mayor of this town.", 'Soy Ponpon. Soy el alcalde de este pueblo.', ['watashi', 'machi', 'chouchou']), 'happy'),
    say(P('pon_name_q', 'あなた ^の お{名前|なまえ} ^は？', 'And your name?', '¿Y tu nombre?', ['anata', 'namae'])),
    reply([P('me_name', '{私|わたし} ^は $name です。', "I'm $name.", 'Soy $name.', ['watashi'])], ['c_pon_country', 'thanks']),
    say(P('pon_country', 'お{国|くに} ^は どこ です ^か。', 'Where are you from?', '¿De dónde eres?', ['kuni', 'doko'])),
    reply([P('me_usa', 'アメリカ です。', "I'm from America.", 'Soy de Estados Unidos.', ['amerika']), P('me_spain', 'スペイン です。', "I'm from Spain.", 'Soy de España.', ['supein']), P('me_mexico', 'メキシコ です。', "I'm from Mexico.", 'Soy de México.', ['mekishiko'])], ['c_pon_hello']),
    say(P('pon_welcome', 'ようこそ、 クローバー{町|まち} ^へ！', 'Welcome to Clover Town!', '¡Bienvenido al pueblo Trébol!', ['machi']), 'happy'),
    say(P('pon_festival', 'もうすぐ {春|はる} ^の お{祭|まつ}り です。 でも… ベル ^が {鳴|な}りません。', "The spring festival is coming soon. But… the bell won't ring.", 'Pronto es el festival de primavera. Pero… la campana no suena.', ['matsuri', 'beru', 'naru'], 2), 'sad'),
    meaning('c_pon_festival'),
    say(P('pon_go_kero', '{道場|どうじょう} ^の ケロ{先生|せんせい} ^に {会|あ}って ください。', 'Please go and see Kero-sensei at the dojo.', 'Por favor, ve a ver al maestro Kero en el dojo.', ['sensei', 'au'], 2)),
    doIt('meet', 'ponpon'),
  ]),
  C('c1_kero', [
    say(P('kero_hello', 'ケロ。 {私|わたし} ^は ケロ です。 {道場|どうじょう} ^の {先生|せんせい} です。', "Kero. I'm Kero. I'm the teacher of the dojo.", 'Kero. Soy Kero. Soy el maestro del dojo.', ['sensei']), 'surprised'),
    say(P('kero_student_q', 'あなた ^は {学生|がくせい} です ^か。', 'Are you a student?', '¿Eres estudiante?', ['gakusei'])),
    reply([P('me_student', 'はい、 {学生|がくせい} です。', "Yes, I'm a student.", 'Sí, soy estudiante.', ['hai', 'gakusei']), P('me_worker', 'いいえ、 {会社員|かいしゃいん} です。', "No, I'm an office worker.", 'No, soy oficinista.', ['iie', 'kaishain'])], ['c_pon_welcome']),
    say(P('kero_legend', '{古|ふる}い ベル ^は、 {新|あたら}しい {人|ひと} ^の ことば ^で {鳴|な}ります。', 'The old bell rings with the words of a newcomer.', 'La vieja campana suena con las palabras de alguien nuevo.', ['furui', 'atarashii', 'hito', 'beru'], 2), 'thinking'),
    say(P('kero_train', '{日本語|にほんご} ^を {勉強|べんきょう}しましょう。 {道場|どうじょう} ^で {待|ま}って います。', "Let's study Japanese. I'll be waiting in the dojo.", 'Estudiemos japonés. Te espero en el dojo.', ['nihongo', 'benkyou', 'matsu'], 2), 'happy'),
    build('c_me_student'),
    doIt('meet', 'kero'),
  ]),
  C('c1_hana', [
    say(P('hana_hello', 'こんにちは！ {私|わたし} ^は ハナ です！', "Hello! I'm Hana!", '¡Hola! ¡Soy Hana!', ['watashi']), 'surprised'),
    say(P('hana_new_q', 'あなた ^も {新|あたら}しい {人|ひと} です ^か。', 'Are you new here too?', '¿Tú también eres nueva aquí?', ['atarashii', 'hito'])),
    reply([P('me_yes_new', 'はい、 {新|あたら}しい {人|ひと} です。', "Yes, I'm new.", 'Sí, soy nueva.', ['hai'])], ['c_me_spain']),
    say(P('hana_friend', 'じゃあ、 {私|わたし} ^たち ^は {友|とも}だち です ^ね！', "Then we're friends!", '¡Entonces somos amigas!', ['tomodachi']), 'love'),
    say(P('hana_market', '{明日|あした}、 {市場|いちば} ^に {来|き}て ください ^ね。', 'Please come to the market tomorrow, okay?', 'Ven al mercado mañana, ¿vale?', ['ichiba', 'kuru'], 2)),
    doIt('meet', 'hana'),
  ]),
];

// Chapter 2 · Market day
const c2 = [
  C('c2_hana', [
    say(P('hana_market_day', '{今日|きょう} ^は {市場|いちば} ^の {日|ひ} です！', "Today is market day!", '¡Hoy es día de mercado!', ['kyou', 'ichiba']), 'happy'),
    say(P('hana_errand', '{町長|ちょうちょう} ^の おつかい です ^か。 メモ ^を {見|み}せて ください。', "An errand for the mayor? Show me the list, please.", '¿Un recado del alcalde? Enséñame la lista, por favor.', ['chouchou'], 2)),
    narrate('The list says: 3 eggs, 2 apples.', 'La lista dice: 3 huevos, 2 manzanas.', 'メモ：たまご 3つ、りんご 2つ'),
    say(P('hana_what', '{何|なに} ^が いい です ^か。', 'What would you like?', '¿Qué te pongo?', ['ii'])),
    reply([P('me_eggs3', 'たまご ^を みっつ ください。', 'Three eggs, please.', 'Tres huevos, por favor.', ['tamago', 'mittsu'])], [P('me_eggs1', 'たまご ^を ひとつ ください。', 'One egg, please.', 'Un huevo, por favor.', ['tamago', 'hitotsu']), P('me_meat', 'お{肉|にく} ^を ください。', 'Some meat, please.', 'Carne, por favor.', ['niku'])]),
    say(P('hana_and', 'はい！ ほか ^に ^は？', 'Sure! Anything else?', '¡Claro! ¿Algo más?')),
    reply([P('me_apples2', 'りんご ^を ふたつ ください。', 'Two apples, please.', 'Dos manzanas, por favor.', ['futatsu'])], [P('me_apples3', 'りんご ^を みっつ ください。', 'Three apples, please.', 'Tres manzanas, por favor.', ['mittsu'])]),
    say(P('hana_price', 'ぜんぶ ^で {五百|ごひゃく}{円|えん} です。', "That's 500 yen altogether.", 'Son 500 yenes en total.', ['en', 'hyaku'])),
    quiz({ en: 'How much is it altogether?', es: '¿Cuánto cuesta en total?', ja: 'ぜんぶでいくら？' }, ['500{円|えん}', '300{円|えん}', '100{円|えん}']),
    doIt('pay', 50),
    say(P('hana_thanks', 'ありがとう ございました！ また {来|き}て ^ね。', 'Thank you very much! Come again!', '¡Muchas gracias! ¡Vuelve pronto!', ['mata']), 'love'),
    doIt('giveItem', 'eggs_basket'),
  ]),
  C('c2_ponpon', [
    say(P('pon_back', 'おお、 {帰|かえ}りました ^か！', "Oh, you're back!", '¡Oh, has vuelto!', ['kaeru']), 'happy'),
    reply([P('me_here_eggs', 'これ ^は たまご ^と りんご です。', "These are the eggs and apples.", 'Aquí están los huevos y las manzanas.', ['kore', 'tamago'])], [P('me_that_far', 'あれ ^は {何|なん} です ^か。', 'What is that over there?', '¿Qué es aquello?', ['are', 'nan'])]),
    doIt('takeItem', 'eggs_basket'),
    say(P('pon_cake', 'ありがとう！ お{祭|まつ}り ^の ケーキ ^を {作|つく}ります。', "Thank you! I'll make a festival cake.", '¡Gracias! Haré un pastel para el festival.', ['tsukuru', 'matsuri']), 'love'),
    say(P('pon_how_much', 'いくら でした ^か。', 'How much was it?', '¿Cuánto costó?', ['ikura'])),
    reply([P('me_500', '{五百|ごひゃく}{円|えん} でした。', 'It was 500 yen.', 'Costó 500 yenes.', ['en'])], [P('me_5ji', '{五時|ごじ} でした。', "It was five o'clock.", 'Eran las cinco.', ['ji'])]),
    doIt('giveCoins', 80),
  ]),
];

// Chapter 3 · The clock tower
const c3 = [
  C('c3_tobi', [
    say(P('tobi_hello', 'はあ、 はあ… こんにちは！ トビ です！', "Phew, phew… Hello! I'm Tobi!", 'Uf, uf… ¡Hola! ¡Soy Tobi!'), 'surprised'),
    say(P('tobi_late', '{大変|たいへん}！ {時計台|とけいだい} ^が {止|と}まりました！', "Oh no! The clock tower has stopped!", '¡Qué desastre! ¡La torre del reloj se ha parado!', ['tokeidai'], 2), 'sad'),
    say(P('tobi_time_q', '{今|いま}、 {何時|なんじ} です ^か。', 'What time is it now?', '¿Qué hora es ahora?', ['ima', 'nanji'])),
    doIt('askTime'),
    say(P('tobi_work', '{私|わたし} ^は {毎朝|まいあさ} {七時|しちじ} ^に {働|はたら}きます。', 'I start work at seven every morning.', 'Empiezo a trabajar a las siete cada mañana.', ['hataraku', 'asa'])),
    meaning('c_tobi_work'),
    say(P('tobi_help', '{時計台|とけいだい} ^に {行|い}きましょう！', "Let's go to the clock tower!", '¡Vamos a la torre del reloj!', ['tokeidai', 'iku']), 'happy'),
    doIt('meet', 'tobi'),
  ]),
  C('c3_tobi2', [
    narrate('Inside the clock tower, the gears are dusty but whole. You wind them together.', 'Dentro de la torre, los engranajes están polvorientos pero enteros. Los dais cuerda juntos.', '時計台の中、歯車はほこりだらけだけど無事。いっしょにねじを巻いた。'),
    say(P('tobi_works', 'やった！ {動|うご}きました！', 'Yay! It works!', '¡Bien! ¡Funciona!'), 'love'),
    say(P('tobi_bell_q', 'でも、 ベル ^は {鳴|な}りません ^ね…', "But the bell still won't ring…", 'Pero la campana sigue sin sonar…', ['beru', 'naru']), 'sad'),
    say(P('tobi_schedule', 'お{祭|まつ}り ^は {日曜日|にちようび} ^の {六時|ろくじ} ^から です。', 'The festival starts Sunday at six.', 'El festival empieza el domingo a las seis.', ['matsuri', 'nichiyoubi']), 'thinking'),
    quiz({ en: 'When does the festival start?', es: '¿Cuándo empieza el festival?', ja: 'お祭りはいつから？' }, ['{日曜日|にちようび} {六時|ろくじ}', '{土曜日|どようび} {七時|しちじ}', '{月曜日|げつようび} {六時|ろくじ}']),
    reply([P('me_got_it', 'わかりました。 {日曜日|にちようび} ^に {来|き}ます。', "Got it. I'll come on Sunday.", 'Entendido. Vendré el domingo.', ['kuru', 'nichiyoubi'])], [P('me_monday', '{月曜日|げつようび} ^に {休|やす}みます。', "I'll take Monday off.", 'Descansaré el lunes.', ['yasumu', 'getsuyoubi'])]),
  ]),
];

// Chapter 4 · Letters for everyone
const c4 = [
  C('c4_tobi', [
    say(P('tobi_foot', 'いたた… {足|あし} ^が いたい です。', 'Ouch… my foot hurts.', 'Ay… me duele el pie.'), 'sad'),
    say(P('tobi_letters', 'この {手紙|てがみ} ^を {町|まち} ^の みんな ^に {届|とど}けて ください！', 'Please deliver these letters to everyone in town!', '¡Por favor, entrega estas cartas a todo el pueblo!', ['tegami', 'machi'], 2)),
    say(P('tobi_where_hana', 'ハナさん ^は {市場|いちば} ^に います。 {郵便局|ゆうびんきょく} ^の {前|まえ} です。', "Hana is at the market. It's in front of the post office.", 'Hana está en el mercado. Está delante de la oficina de correos.', ['ichiba', 'yuubinkyoku', 'mae'], 2)),
    say(P('tobi_where_kuu', 'クーさん ^の レストラン ^は {公園|こうえん} ^の となり ^に あります。', "Kuu's restaurant is next to the park.", 'El restaurante de Kuu está al lado del parque.', ['resutoran', 'kouen', 'tonari'], 2)),
    quiz({ en: "Where is Kuu's restaurant?", es: '¿Dónde está el restaurante de Kuu?', ja: 'クーさんのレストランはどこ？' }, ['{公園|こうえん} ^の となり', '{郵便局|ゆうびんきょく} ^の {前|まえ}', '{道場|どうじょう} ^の {中|なか}']),
    say(P('tobi_where_mayor', '{町長|ちょうちょう} ^は {時計台|とけいだい} ^の {右|みぎ} ^の {建物|たてもの} ^に います。', "The mayor is in the building to the right of the clock tower.", 'El alcalde está en el edificio a la derecha de la torre del reloj.', ['migi', 'tokeidai'], 2)),
    doIt('giveItem', 'letter_hana'), doIt('giveItem', 'letter_kuu'), doIt('giveItem', 'letter_pon'),
  ]),
  C('c4_hana', [
    reply([P('me_letter_for_you', 'ハナさん ^に {手紙|てがみ} です。', "Here's a letter for you, Hana.", 'Hana, tienes una carta.', ['tegami'])], ['c_me_that_far']),
    doIt('takeItem', 'letter_hana'),
    say(P('hana_letter', 'わあ、 ありがとう！ {母|はは} ^から ^の {手紙|てがみ} です！', "Wow, thank you! It's a letter from my mom!", '¡Guau, gracias! ¡Es una carta de mi mamá!', ['haha', 'tegami']), 'love'),
  ]),
  C('c4_kuu', [
    say(P('kuu_hello', 'あら、 はじめまして！ クー です。', "Oh, nice to meet you! I'm Kuu.", '¡Oh, mucho gusto! Soy Kuu.'), 'surprised'),
    reply(['c_me_letter_kuu'], ['c_me_eggs3']),
    doIt('takeItem', 'letter_kuu'),
    say(P('kuu_thanks', 'ありがとう。 {遠|とお}い ^の ^に、 ご{苦労|くろう}さま。', "Thank you. It's far, so thanks for the trouble.", 'Gracias. Está lejos, gracias por la molestia.', ['tooi'], 2), 'happy'),
    doIt('meet', 'kuu'),
  ]),
  C('c4_ponpon', [
    reply(['c_me_letter_pon'], ['c_me_500']),
    doIt('takeItem', 'letter_pon'),
    say(P('pon_letter', 'ほう！ {銀行|ぎんこう} ^から ^の {手紙|てがみ} です ^ね。', "Oh! A letter from the bank.", '¡Vaya! Una carta del banco.', ['ginkou', 'tegami']), 'thinking'),
    say(P('pon_good_job', 'よく できました。 トビ ^も よろこびます ^よ。', 'Well done. Tobi will be happy too.', 'Bien hecho. Tobi también se alegrará.', [], 2), 'happy'),
    doIt('giveCoins', 80),
  ]),
];
P('me_letter_kuu', 'クーさん ^に {手紙|てがみ} です。', "Here's a letter for you, Kuu.", 'Kuu, tienes una carta.', ['tegami']);
P('me_letter_pon', '{町長|ちょうちょう} ^に {手紙|てがみ} です。', "Here's a letter for you, Mayor.", 'Señor alcalde, tiene una carta.', ['tegami', 'chouchou']);

// Chapter 5 · Kuu's kitchen
const c5 = [
  C('c5_kuu', [
    say(P('kuu_menu', 'お{祭|まつ}り ^の {料理|りょうり} ^を {作|つく}って います。', "I'm making food for the festival.", 'Estoy preparando la comida del festival.', ['ryouri', 'tsukuru', 'matsuri']), 'happy'),
    say(P('kuu_taste', 'この スープ ^を {飲|の}んで ください。', 'Please try this soup.', 'Prueba esta sopa, por favor.', ['nomu'], 2)),
    narrate('You sip the soup. It is warm, rich, and very, very spicy.', 'Pruebas la sopa. Está caliente, sabrosa y muy, muy picante.', 'スープを飲んだ。あたたかくて、とても、とても辛い。'),
    say(P('kuu_how', 'どう です ^か。', 'How is it?', '¿Qué tal está?')),
    reply([P('me_spicy', 'おいしい です。 でも、 {辛|から}い です！', "It's delicious. But it's spicy!", 'Está rica. ¡Pero pica!', ['karai'])], [P('me_sweet', 'とても {甘|あま}い です。', "It's very sweet.", 'Está muy dulce.', ['amai'])]),
    say(P('kuu_kids', 'ああ、 {子|こ}ども ^に ^は {辛|から}い です ^ね。', 'Ah, it is spicy for children, isn\'t it.', 'Ah, para los niños pica demasiado, ¿verdad?', ['kodomo', 'karai']), 'thinking'),
    say(P('kuu_sweet_q', '{甘|あま}い もの ^が {好|す}き です ^か。', 'Do you like sweet things?', '¿Te gustan las cosas dulces?', ['amai', 'suki'])),
    reply([P('me_like_sweet', 'はい、 {甘|あま}い もの ^が {好|す}き です。', 'Yes, I like sweet things.', 'Sí, me gustan las cosas dulces.', ['suki']), P('me_dislike_sweet', 'いいえ、 あまり {好|す}き じゃない です。', "No, I don't really like them.", 'No, no me gustan mucho.', ['suki'])], ['c_me_got_it']),
    say(P('kuu_honey', 'はちみつ ^が {欲|ほ}しい です。 {市場|いちば} ^に あります ^か。', 'I need some honey. Is there any at the market?', 'Necesito miel. ¿Hay en el mercado?', ['ichiba', 'aru'], 2)),
    doIt('meet', 'kuu'),
  ]),
  C('c5_hana', [
    reply([P('me_honey_q', 'はちみつ ^は あります ^か。', 'Do you have honey?', '¿Tienes miel?', ['aru'])], ['c_me_meat']),
    say(P('hana_honey', 'はい、 あります！ この はちみつ ^は {新|あたら}しくて {甘|あま}い です ^よ。', "Yes, I do! This honey is fresh and sweet.", '¡Sí, tengo! Esta miel es fresca y dulce.', ['atarashii', 'amai']), 'happy'),
    doIt('giveItem', 'honey_jar'),
  ]),
  C('c5_kuu2', [
    doIt('takeItem', 'honey_jar'),
    say(P('kuu_cake', 'できました！ はちみつ ^の ケーキ です。', "It's ready! A honey cake.", '¡Listo! Un pastel de miel.'), 'love'),
    say(P('kuu_taste2', 'どう です ^か。 おいしい です ^か。', 'How is it? Is it tasty?', '¿Qué tal? ¿Está rico?', [])),
    reply([P('me_tasty', 'とても おいしい です！', "It's very tasty!", '¡Está riquísimo!')], ['c_me_spicy']),
    say(P('kuu_famous', 'この ケーキ ^は お{祭|まつ}り ^で {有名|ゆうめい} ^に なります ^ね。', 'This cake will be famous at the festival!', '¡Este pastel será famoso en el festival!', ['yuumei'], 2), 'love'),
  ]),
];

// Chapter 6 · Where is Mimi?
const c6 = [
  C('c6_kuu', [
    say(P('kuu_worried', 'たいへん！ ミミ ^が いません！', "Oh no! Mimi is gone!", '¡Qué horror! ¡Mimi no está!'), 'sad'),
    say(P('kuu_daughter', 'ミミ ^は {私|わたし} ^の {娘|むすめ} です。 {五歳|ごさい} です。', "Mimi is my daughter. She's five years old.", 'Mimi es mi hija. Tiene cinco años.', ['sai'], 2)),
    say(P('kuu_looks', '{黄色|きいろ} ^の {小|ちい}さい アヒル です。', "She's a small yellow duck.", 'Es una patita pequeña y amarilla.', ['kawaii'])),
    quiz({ en: 'How old is Mimi?', es: '¿Cuántos años tiene Mimi?', ja: 'ミミは何歳？' }, ['{五歳|ごさい}', '{三歳|さんさい}', '{七歳|ななさい}']),
    say(P('kuu_search', 'いっしょ ^に {探|さが}して ください！', 'Please help me look for her!', '¡Ayúdame a buscarla, por favor!', ['sagasu', 'issho'], 2), 'sad'),
    reply([P('me_lets_search', 'はい！ いっしょ ^に {探|さが}しましょう。', "Yes! Let's look together.", '¡Sí! Busquémosla juntos.', ['sagasu', 'issho'])], ['c_me_monday']),
  ]),
  C('c6_hana', [
    reply([P('me_mimi_where', 'ミミちゃん ^は どこ ^に います ^か。', 'Where is Mimi?', '¿Dónde está Mimi?', ['doko', 'iru'])], ['c_me_honey_q']),
    say(P('hana_saw', 'さっき、 {公園|こうえん} ^の {方|ほう} ^へ {行|い}きました ^よ。 ちょうちょ ^を {追|お}いかけて いました。', 'She went toward the park a moment ago. She was chasing a butterfly.', 'Hace un momento fue hacia el parque. Perseguía una mariposa.', ['kouen'], 3), 'thinking'),
    say(P('hana_family', '{私|わたし} ^も {小|ちい}さい ころ、 よく {家族|かぞく} ^と {公園|こうえん} ^で {遊|あそ}びました。', 'When I was little, I often played in the park with my family too.', 'De pequeña, yo también jugaba mucho en el parque con mi familia.', ['kazoku', 'asobu'], 3)),
  ]),
  C('c6_mimi', [
    say(P('mimi_hi', 'あっ！ だれ？', 'Oh! Who are you?', '¡Oh! ¿Quién eres?', ['dare']), 'surprised'),
    reply([P('me_mom_waits', 'お{母|かあ}さん ^が {待|ま}って います ^よ。', 'Your mom is waiting for you.', 'Tu mamá te está esperando.', ['okaasan', 'matsu'])], ['c_me_tasty']),
    say(P('mimi_butterfly', 'ちょうちょ ^が きれい でした！', 'The butterfly was so pretty!', '¡La mariposa era preciosa!', ['kirei']), 'love'),
    say(P('mimi_family', 'ミミ ^は お{母|かあ}さん ^と {二人|ふたり} です。 あなた ^の {家族|かぞく} ^は？', "It's just Mom and me. What about your family?", 'Somos mamá y yo. ¿Y tu familia?', ['futari', 'kazoku'])),
    reply([P('me_family4', '{四人|よにん} です。 {父|ちち} ^と {母|はは} ^と {妹|いもうと} ^が います。', "There are four of us. I have a father, a mother and a little sister.", 'Somos cuatro. Tengo padre, madre y una hermana menor.', ['chichi', 'haha', 'imouto']), P('me_family3', '{三人|さんにん} です。 {母|はは} ^と {兄|あに} ^が います。', 'There are three of us. I have a mother and an older brother.', 'Somos tres. Tengo madre y un hermano mayor.', ['haha', 'ani'])], ['c_me_500']),
    say(P('mimi_home', 'いっしょ ^に {帰|かえ}ろう！', "Let's go home together!", '¡Volvamos juntos a casa!', ['kaeru', 'issho']), 'happy'),
    doIt('meet', 'mimi'),
    doIt('mimiHome'),
  ]),
  C('c6_kuu2', [
    say(P('kuu_relief', 'ミミ！ よかった… ありがとう ございます。', 'Mimi! Thank goodness… Thank you so much.', '¡Mimi! Menos mal… Muchísimas gracias.'), 'love'),
    say(P('kuu_family_now', 'あなた ^は もう {私|わたし} ^たち ^の {家族|かぞく} です ^ね。', "You're part of our family now.", 'Ya eres parte de nuestra familia.', ['kazoku'], 2), 'love'),
    doIt('giveCoins', 100),
  ]),
];

// Chapter 7 · The storm
const c7 = [
  C('c7_ponpon', [
    say(P('pon_storm', '{昨日|きのう} ^の {夜|よる}、 あらし ^が {来|き}ました。', 'A storm came last night.', 'Anoche llegó una tormenta.', ['kinou', 'arashi']), 'sad'),
    say(P('pon_wind', '{風|かぜ} ^が とても {強|つよ}かった です。', 'The wind was very strong.', 'El viento era muy fuerte.', ['kaze', 'tsuyoi'])),
    say(P('pon_decor', 'お{祭|まつ}り ^の かざり ^が こわれました。', 'The festival decorations got broken.', 'Se rompieron los adornos del festival.', ['matsuri'], 2), 'sad'),
    say(P('pon_scared_q', 'あなた ^は こわかった です ^か。', 'Were you scared?', '¿Tuviste miedo?', ['kowai'])),
    reply([P('me_scared', 'はい、 こわかった です。', 'Yes, I was scared.', 'Sí, tuve miedo.', ['kowai']), P('me_not_scared', 'いいえ、 だいじょうぶ でした。', 'No, I was fine.', 'No, estuve bien.', ['daijoubu'])], [P('me_fun_storm', 'あらし ^は {楽|たの}しい です。', 'Storms are fun.', 'Las tormentas son divertidas.', ['tanoshii'])]),
    say(P('pon_fix', 'かざり ^を {直|なお}しましょう。 みんな ^に {聞|き}いて ください。', "Let's fix the decorations. Please ask everyone.", 'Arreglemos los adornos. Pregunta a todos, por favor.', ['kiku'], 2)),
  ]),
  C('c7_tobi', [
    say(P('tobi_rain', '{昨日|きのう} ^は {雨|あめ} ^が たくさん {降|ふ}りました ^ね。', 'It rained a lot yesterday, didn\'t it.', 'Ayer llovió mucho, ¿verdad?', ['kinou', 'furu'])),
    say(P('tobi_window', '{寒|さむ}かった です ^から、 {窓|まど} ^を {閉|し}めました。', 'It was cold, so I closed the windows.', 'Hacía frío, así que cerré las ventanas.', ['samui', 'mado', 'shimeru'], 2)),
    meaning('c_tobi_window'),
    say(P('tobi_lantern', 'ちょうちん ^は {郵便局|ゆうびんきょく} ^の {中|なか} ^に あります。 {持|も}って いって ください。', 'The lanterns are inside the post office. Please take them.', 'Los farolillos están dentro de la oficina de correos. Llévatelos, por favor.', ['yuubinkyoku', 'naka'], 2), 'happy'),
    doIt('giveItem', 'lanterns'),
  ]),
  C('c7_ponpon2', [
    doIt('takeItem', 'lanterns'),
    say(P('pon_today_weather', '{今日|きょう} ^は いい {天気|てんき} です ^ね。 {晴|は}れ です！', "It's nice weather today. Sunny!", 'Hoy hace buen tiempo. ¡Está despejado!', ['tenki', 'hare']), 'happy'),
    reply([P('me_warm', 'はい、 {暖|あたた}かい です ^ね。', "Yes, it's warm, isn't it.", 'Sí, hace calorcito, ¿verdad?', ['atatakai'])], [P('me_snowing', '{雪|ゆき} ^が {降|ふ}って います。', "It's snowing.", 'Está nevando.', ['furu'])]),
    say(P('pon_tired', 'みんな {疲|つか}れました ^が、 かざり ^は きれい ^に なりました。', 'Everyone got tired, but the decorations look lovely again.', 'Todos se cansaron, pero los adornos quedaron preciosos.', ['tsukareru', 'kirei'], 3), 'love'),
    doIt('giveCoins', 100),
  ]),
];

// Chapter 8 · Getting ready
const c8 = [
  C('c8_ponpon', [
    say(P('pon_tomorrow', '{明日|あした} ^は いよいよ お{祭|まつ}り です！', "Tomorrow is finally the festival!", '¡Por fin, mañana es el festival!', ['ashita', 'matsuri']), 'happy'),
    say(P('pon_invite', 'みんな ^を お{祭|まつ}り ^に さそって ください。', 'Please invite everyone to the festival.', 'Por favor, invita a todos al festival.', ['matsuri'], 2)),
  ]),
  C('c8_hana', [
    reply([P('me_invite_hana', 'いっしょ ^に お{祭|まつ}り ^へ {行|い}きません ^か。', 'Would you like to go to the festival together?', '¿Quieres ir juntas al festival?', ['issho', 'matsuri'])], [P('me_go_alone', 'ひとり ^で {行|い}きます。', "I'll go alone.", 'Iré sola.', ['hitori'])]),
    say(P('hana_yes', 'ええ、 {行|い}きましょう！ {花火|はなび} ^が {見|み}たい です！', "Yes, let's go! I want to see the fireworks!", '¡Sí, vamos! ¡Quiero ver los fuegos artificiales!', ['hanabi', 'miru']), 'love'),
  ]),
  C('c8_tobi', [
    reply([P('me_invite_tobi', '{明日|あした}、 いっしょ ^に {踊|おど}りません ^か。', 'Would you like to dance together tomorrow?', '¿Bailamos juntos mañana?', ['odoru', 'issho'])], ['c_me_go_alone']),
    say(P('tobi_dance', 'いい です ^ね！ {踊|おど}りましょう！', "Sounds great! Let's dance!", '¡Qué buena idea! ¡A bailar!', ['odoru']), 'love'),
    say(P('tobi_photo', '{写真|しゃしん} ^を {撮|と}って ください ^ね。', 'Please take a photo of us, okay?', 'Haznos una foto, ¿vale?', ['shashin'], 2), 'happy'),
  ]),
  C('c8_kuu', [
    reply([P('me_invite_kuu', 'クーさん ^も ミミちゃん ^と {来|き}て ください。', 'Please come with Mimi too, Kuu.', 'Kuu, ven tú también con Mimi, por favor.', ['kuru'])], ['c_me_eggs1']),
    say(P('kuu_song', 'もちろん！ ミミ ^は {歌|うた} ^を {歌|うた}いたい そう です。', 'Of course! Mimi says she wants to sing a song.', '¡Claro! Mimi dice que quiere cantar una canción.', ['uta', 'utau'], 3), 'love'),
  ]),
  C('c8_kero', [
    say(P('kero_ready', 'よく {頑張|がんば}りました ^ね。', "You've worked very hard.", 'Te has esforzado mucho.', [], 2), 'happy'),
    say(P('kero_exam', 'ベル ^を {鳴|な}らす ^には、 クローバー{試験|しけん} ^に {合格|ごうかく}して ください。', 'To ring the bell, you must pass the Clover Exam.', 'Para hacer sonar la campana, debes aprobar el Examen Trébol.', ['beru'], 3), 'thinking'),
    say(P('kero_ready_q', '{準備|じゅんび} ^は いい です ^か。', 'Are you ready?', '¿Estás preparado?', [], 2)),
    reply([P('me_ready', 'はい、 がんばります！', "Yes, I'll do my best!", '¡Sí, me esforzaré!')], ['c_me_not_scared']),
  ]),
];

// Finale
const finale = [
  C('c9_bell', [
    narrate('The whole town gathers under the clock tower. Lanterns glow. Kero-sensei nods to you.', 'Todo el pueblo se reúne bajo la torre del reloj. Los farolillos brillan. El maestro Kero te hace una señal.', '町のみんなが時計台の下に集まった。ちょうちんが光る。ケロ先生がうなずいた。'),
    say(P('kero_speak', 'さあ、 あなた ^の ことば ^で ベル ^に {話|はな}して ください。', 'Now, speak to the bell in your own words.', 'Ahora, háblale a la campana con tus propias palabras.', ['hanasu', 'beru'], 2), 'happy'),
    build(P('me_bell_words', 'クローバー{町|まち} ^が {大好|だいす}き です。', 'I love Clover Town.', 'Me encanta el pueblo Trébol.', ['machi'])),
    doIt('ringBell'),
    say(P('pon_bell_rang', 'ベル ^が {鳴|な}りました！ お{祭|まつ}り ^を {始|はじ}めましょう！', "The bell rang! Let's start the festival!", '¡La campana ha sonado! ¡Que empiece el festival!', ['beru', 'naru', 'matsuri']), 'love'),
  ]),
];

export const CLOVER_CONVOS: Record<string, Step[]> = Object.fromEntries([...c1, ...c2, ...c3, ...c4, ...c5, ...c6, ...c7, ...c8, ...finale]);

// ------------------------------------------------------------------ chapters as quests
const obj = (en: string, es: string, ja = '') => ({ en, es, ja });
const Q = (id: string, n: number, icon: string, title: LText, summary: LText, steps: QuestDef['steps'], reward: QuestDef['reward']): QuestDef =>
  ({ id, icon, title, summary, steps, reward, after: n > 1 ? ['clover_' + (n - 1)] : [], town: 'clover', chapter: n });

export const CLOVER_QUESTS: QuestDef[] = [
  Q('clover_1', 1, '👋', obj('A New Face', 'Una cara nueva', '新しい顔'), obj('Meet the mayor and learn about the silent bell.', 'Conoce al alcalde y descubre la campana silenciosa.', '町長に会って、鳴らないベルの話を聞こう。'), [
    { talk: { ponpon: 'c1_ponpon' }, objective: obj('Say hello to Mayor Ponpon at the town hall', 'Saluda al alcalde Ponpon en el ayuntamiento', '町役場でポンポン町長にあいさつしよう') },
    { talk: { kero: 'c1_kero' }, objective: obj('Visit Kero-sensei at the dojo', 'Visita al maestro Kero en el dojo', '道場のケロ先生をたずねよう') },
    { dojo: 'lesson_1', objective: obj('Finish Lesson 1 at the dojo', 'Termina la Lección 1 en el dojo', '道場でレッスン1を終えよう') },
    { talk: { hana: 'c1_hana' }, objective: obj('Meet Hana at the market', 'Conoce a Hana en el mercado', '市場でハナに会おう') },
  ], { coins: 80, xp: 40 }),
  Q('clover_2', 2, '🛍️', obj('Market Day', 'Día de mercado', '市場の日'), obj('Run an errand for the mayor and practice numbers and shopping.', 'Haz un recado para el alcalde y practica los números y las compras.', '町長のおつかい。数と買い物を練習しよう。'), [
    { dojo: 'lesson_2', objective: obj('Finish Lesson 2: numbers and shopping', 'Termina la Lección 2: números y compras', 'レッスン2：数と買い物') },
    { talk: { hana: 'c2_hana' }, objective: obj('Buy what is on the list from Hana', 'Compra lo de la lista a Hana', 'ハナからメモのものを買おう') },
    { talk: { ponpon: 'c2_ponpon' }, objective: obj('Bring the groceries to the mayor', 'Lleva la compra al alcalde', '町長に買ったものを届けよう') },
  ], { coins: 100, xp: 60 }),
  Q('clover_3', 3, '🕰️', obj('The Clock Tower', 'La torre del reloj', '時計台'), obj('The town clock has stopped. Learn to tell the time.', 'El reloj del pueblo se ha parado. Aprende a decir la hora.', '町の時計が止まった。時間の言い方を覚えよう。'), [
    { talk: { tobi: 'c3_tobi' }, objective: obj('Talk to Tobi at the post office', 'Habla con Tobi en la oficina de correos', '郵便局のトビと話そう') },
    { dojo: 'lesson_3', objective: obj('Finish Lesson 3: time and daily life', 'Termina la Lección 3: la hora y la rutina', 'レッスン3：時間と毎日の生活') },
    { talk: { tobi: 'c3_tobi2' }, objective: obj('Fix the clock with Tobi', 'Arregla el reloj con Tobi', 'トビと時計を直そう') },
  ], { coins: 100, xp: 60 }),
  Q('clover_4', 4, '✉️', obj('Letters for Everyone', 'Cartas para todos', 'みんなに手紙'), obj("Tobi hurt his foot. Deliver the mail using directions.", 'Tobi se ha hecho daño en el pie. Reparte el correo siguiendo indicaciones.', 'トビが足をけがした。道案内を聞いて手紙を届けよう。'), [
    { dojo: 'lesson_4', objective: obj('Finish Lesson 4: places and directions', 'Termina la Lección 4: lugares e indicaciones', 'レッスン4：場所と道案内') },
    { talk: { tobi: 'c4_tobi' }, objective: obj('Pick up the letters from Tobi', 'Recoge las cartas de Tobi', 'トビから手紙を受け取ろう') },
    { talk: { hana: 'c4_hana', kuu: 'c4_kuu', ponpon: 'c4_ponpon' }, objective: obj('Deliver letters to Hana, Kuu and the mayor', 'Entrega cartas a Hana, Kuu y el alcalde', 'ハナ、クー、町長に手紙を届けよう') },
  ], { coins: 120, xp: 70 }),
  Q('clover_5', 5, '🍲', obj("Kuu's Kitchen", 'La cocina de Kuu', 'クーのキッチン'), obj('Taste festival food and learn to describe things.', 'Prueba la comida del festival y aprende a describir cosas.', 'お祭りの料理を味見して、ようすの言い方を覚えよう。'), [
    { dojo: 'lesson_5', objective: obj('Finish Lesson 5: food and adjectives', 'Termina la Lección 5: comida y adjetivos', 'レッスン5：食べ物と形容詞') },
    { talk: { kuu: 'c5_kuu' }, objective: obj("Visit Kuu's restaurant", 'Visita el restaurante de Kuu', 'クーのレストランへ行こう') },
    { talk: { hana: 'c5_hana' }, objective: obj('Find honey at the market', 'Busca miel en el mercado', '市場ではちみつを探そう') },
    { talk: { kuu: 'c5_kuu2' }, objective: obj('Bring the honey to Kuu', 'Lleva la miel a Kuu', 'クーにはちみつを届けよう') },
  ], { coins: 120, xp: 70 }),
  Q('clover_6', 6, '🔎', obj('Where Is Mimi?', '¿Dónde está Mimi?', 'ミミはどこ？'), obj("Kuu's daughter has wandered off. Talk about family and find her.", 'La hija de Kuu se ha perdido. Habla de la familia y encuéntrala.', 'クーの娘がいなくなった。家族の話をして探そう。'), [
    { dojo: 'lesson_6', objective: obj('Finish Lesson 6: family and people', 'Termina la Lección 6: familia y personas', 'レッスン6：家族と人') },
    { talk: { kuu: 'c6_kuu' }, objective: obj('Talk to Kuu', 'Habla con Kuu', 'クーと話そう') },
    { talk: { hana: 'c6_hana' }, objective: obj('Ask Hana if she has seen Mimi', 'Pregunta a Hana si ha visto a Mimi', 'ハナにミミを見たか聞こう') },
    { talk: { mimi: 'c6_mimi' }, objective: obj('Find Mimi in the park', 'Encuentra a Mimi en el parque', '公園でミミを見つけよう') },
    { talk: { kuu: 'c6_kuu2' }, objective: obj('Bring Mimi home to Kuu', 'Lleva a Mimi con Kuu', 'ミミをクーのところへ') },
  ], { coins: 140, xp: 80 }),
  Q('clover_7', 7, '🌧️', obj('After the Storm', 'Después de la tormenta', 'あらしのあと'), obj('A storm broke the decorations. Talk about the past and fix things.', 'Una tormenta rompió los adornos. Habla del pasado y arréglalo.', 'あらしでかざりがこわれた。過去の話をして直そう。'), [
    { dojo: 'lesson_7', objective: obj('Finish Lesson 7: the past and weather', 'Termina la Lección 7: el pasado y el clima', 'レッスン7：過去と天気') },
    { talk: { ponpon: 'c7_ponpon' }, objective: obj('Talk to the mayor about the storm', 'Habla con el alcalde de la tormenta', '町長とあらしの話をしよう') },
    { talk: { tobi: 'c7_tobi' }, objective: obj('Ask Tobi for spare lanterns', 'Pide farolillos de repuesto a Tobi', 'トビにちょうちんをもらおう') },
    { talk: { ponpon: 'c7_ponpon2' }, objective: obj('Bring the lanterns to the mayor', 'Lleva los farolillos al alcalde', '町長にちょうちんを届けよう') },
  ], { coins: 140, xp: 80 }),
  Q('clover_8', 8, '🌸', obj('Getting Ready', 'Preparativos', 'じゅんび'), obj('Invite everyone to the festival and prepare for the Clover Exam.', 'Invita a todos al festival y prepárate para el Examen Trébol.', 'みんなをお祭りにさそって、クローバー試験にそなえよう。'), [
    { dojo: 'lesson_8', objective: obj('Finish Lesson 8: plans and invitations', 'Termina la Lección 8: planes e invitaciones', 'レッスン8：予定とさそい') },
    { talk: { ponpon: 'c8_ponpon' }, objective: obj('Talk to the mayor', 'Habla con el alcalde', '町長と話そう') },
    { talk: { hana: 'c8_hana', tobi: 'c8_tobi', kuu: 'c8_kuu' }, objective: obj('Invite Hana, Tobi and Kuu to the festival', 'Invita a Hana, Tobi y Kuu al festival', 'ハナ、トビ、クーをさそおう') },
    { talk: { kero: 'c8_kero' }, objective: obj('Tell Kero-sensei you are ready', 'Dile al maestro Kero que estás preparado', 'ケロ先生に準備ができたと伝えよう') },
  ], { coins: 160, xp: 90 }),
  Q('clover_9', 9, '🔔', obj('The Clover Bell', 'La campana del Trébol', 'クローバーのベル'), obj('Pass the Clover Exam (80%) and ring the bell at the festival.', 'Aprueba el Examen Trébol (80 %) y haz sonar la campana en el festival.', 'クローバー試験（80%）に合格して、お祭りでベルを鳴らそう。'), [
    { dojo: 'exam', objective: obj('Pass the Clover Exam at the dojo', 'Aprueba el Examen Trébol en el dojo', '道場でクローバー試験に合格しよう') },
    { talk: { ponpon: 'c9_bell' }, objective: obj('Ring the bell at the festival', 'Haz sonar la campana en el festival', 'お祭りでベルを鳴らそう') },
  ], { coins: 300, xp: 200, items: ['crown'] }),
];
