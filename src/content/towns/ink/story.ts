import type { Phrase } from '../../phrases';
import type { NpcDef } from '../../characters';
import type { QuestDef } from '../../quests';
import type { Step } from '../../dialogues';
import { chapter, storyKit } from '../types';

/**
 * Inkbrush Village story: "The Washed-Away Signs". A storm washed the ink off every sign in Sumi
 * Village days before the New Year calligraphy festival. Hari-sensei teaches you to read and write
 * hiragana, katakana and your first kanji so the village can repaint its signs together.
 * Written for absolute beginners: villagers only use kana you've already met, narration explains.
 */
export const INK_PHRASES: Phrase[] = [];
const { P, say, reply, build, meaning, narrate, quiz, doIt, C, obj } = storyKit(INK_PHRASES, 'i_', 'kn_');

export const INK_NPCS: NpcDef[] = [
  {
    id: 'mochi', species: 'panda', extra: 'bowtie',
    name: { en: 'Mayor Mochi', es: 'Alcaldesa Mochi', ja: 'モチ{村長|そんちょう}' },
    title: { en: 'Mayor of Sumi Village', es: 'Alcaldesa del Pueblo Sumi', ja: 'すみ村の村長' },
    personality: { en: 'A cheerful panda who naps after lunch and believes anyone can learn to write beautifully.', es: 'Una panda alegre que se echa la siesta después de comer y cree que cualquiera puede aprender a escribir bonito.', ja: '昼ごはんのあとに昼寝する、明るいパンダ。だれでもきれいな字が書けると信じている。' },
    colors: { main: '#FAF7F2', accent: '#2E2A2A', belly: '#FFFFFF', nose: '#2E2A2A' },
    voice: { pitch: 220, speed: 0.9 }, favorites: ['tea', 'cake'], likes: ['bread', 'honey'],
    stories: [P('mochi_s1', 'すみ ^は くろ い いろ です。', 'Sumi is a black color (ink).', 'Sumi es un color negro (tinta).', []), P('mochi_s2', 'わたし ^は ひるね ^が すき です。', 'I like naps.', 'Me gustan las siestas.', [])],
    routine: [{ from: 0, to: 24, node: 'hall', activity: 'work' }], tint: '#2E2A2A',
  },
  {
    id: 'hari', species: 'hedgehog', extra: 'glasses',
    name: { en: 'Hari-sensei', es: 'Maestro Hari', ja: 'ハリ{先生|せんせい}' },
    title: { en: 'Calligraphy master', es: 'Maestro de caligrafía', ja: '書道の先生' },
    personality: { en: 'Prickly on the outside, endlessly patient with a brush in hand. Has written ten thousand あ.', es: 'Espinoso por fuera, infinitamente paciente con un pincel en la mano. Ha escrito diez mil あ.', ja: '見た目はとげとげ、でも筆を持つととても気が長い。「あ」を一万回書いた。' },
    colors: { main: '#D9B98E', accent: '#7A5A44', belly: '#F6E8D4', nose: '#2E2A2A' },
    voice: { pitch: 150, speed: 0.8 }, favorites: ['tea', 'apple'], likes: ['cookie', 'strawberry'],
    stories: [P('hari_s1', 'まいにち すこし ずつ。', 'A little every day.', 'Un poco cada día.', []), P('hari_s2', 'ふで ^は こころ ^を うつします。', 'The brush shows your heart.', 'El pincel refleja tu corazón.', [])],
    routine: [{ from: 0, to: 24, node: 'dojo', activity: 'work' }], tint: '#7A5A44',
  },
  {
    id: 'kuri', species: 'hedgehog', extra: 'apron',
    name: { en: 'Kuri', es: 'Kuri', ja: 'クリ' },
    title: { en: 'Sweets seller', es: 'Vendedora de dulces', ja: 'おかし屋さん' },
    personality: { en: 'Round, rosy and always smells of roasted chestnuts.', es: 'Redondita, sonrosada y siempre huele a castañas asadas.', ja: 'まんまるでほっぺが赤い。いつも焼き栗のにおいがする。' },
    colors: { main: '#E9C79E', accent: '#9A6A44', belly: '#FFF2E2', nose: '#2E2A2A' },
    voice: { pitch: 300, speed: 1.15 }, favorites: ['honey', 'cake'], likes: ['apple', 'milk'],
    stories: [P('kuri_s1', 'くり ^の おかし ^が いちばん です！', 'Chestnut sweets are the best!', '¡Los dulces de castaña son los mejores!', []), P('kuri_s2', 'あまい もの ^は しあわせ。', 'Sweet things are happiness.', 'Lo dulce es felicidad.', [])],
    routine: [{ from: 0, to: 24, node: 'market', activity: 'work' }], tint: '#9A6A44',
  },
  {
    id: 'nori', species: 'panda', extra: 'cap',
    name: { en: 'Nori', es: 'Nori', ja: 'ノリ' },
    title: { en: 'Mail carrier', es: 'Cartero', ja: '郵便屋さん' },
    personality: { en: 'Steady and kind. Since the storm he has a bag full of letters and no names to read on the doors.', es: 'Tranquilo y amable. Desde la tormenta tiene la bolsa llena de cartas y ningún nombre que leer en las puertas.', ja: 'おだやかでやさしい。嵐のあと、手紙はたくさんあるのにドアの名前が読めない。' },
    colors: { main: '#F4F1EA', accent: '#33302E', belly: '#FFFFFF', nose: '#33302E' },
    voice: { pitch: 180, speed: 0.95 }, favorites: ['sandwich', 'tea'], likes: ['bread', 'cookie'],
    stories: [P('nori_s1', 'てがみ ^は たからもの です。', 'Letters are treasures.', 'Las cartas son tesoros.', []), P('nori_s2', 'あるく ^の ^が すき です。', 'I like walking.', 'Me gusta caminar.', [])],
    routine: [{ from: 0, to: 24, node: 'post', activity: 'work' }], tint: '#33302E',
  },
  {
    id: 'maron', species: 'hedgehog', extra: 'bow',
    name: { en: 'Maron', es: 'Maron', ja: 'マロン' },
    title: { en: 'Café owner', es: 'Dueña del café', ja: 'カフェの店長' },
    personality: { en: 'Trained as a pastry chef far away and came home with a café full of katakana.', es: 'Estudió repostería lejos y volvió a casa con un café lleno de katakana.', ja: '遠くでお菓子の修業をして、カタカナだらけのカフェを開いた。' },
    colors: { main: '#C9A27A', accent: '#6E4A34', belly: '#FBEBD6', nose: '#2E2A2A' },
    voice: { pitch: 260, speed: 1.05 }, favorites: ['coffee', 'cake'], likes: ['strawberry', 'milk'],
    stories: [P('maron_s1', 'ケーキ ^は まいあさ つくります。', 'I bake cakes every morning.', 'Hago pasteles cada mañana.', []), P('maron_s2', 'コーヒー ^と ケーキ ^は ともだち です。', 'Coffee and cake are friends.', 'El café y el pastel son amigos.', [])],
    routine: [{ from: 0, to: 24, node: 'kitchen', activity: 'work' }], tint: '#6E4A34',
  },
  {
    id: 'miru', species: 'panda', extra: 'none',
    name: { en: 'Miru', es: 'Miru', ja: 'ミル' },
    title: { en: "The mayor's granddaughter", es: 'Nieta de la alcaldesa', ja: '村長の孫' },
    personality: { en: 'Five years old, learning her kana right alongside you, and very competitive about it.', es: 'Tiene cinco años, aprende los kana a la vez que tú y es muy competitiva.', ja: '5歳。あなたといっしょにかなを勉強中。負けずぎらい。' },
    colors: { main: '#FBF8F3', accent: '#2E2A2A', belly: '#FFFFFF', nose: '#2E2A2A' },
    voice: { pitch: 440, speed: 1.3 }, favorites: ['cookie', 'strawberry'], likes: ['cake', 'apple'],
    stories: [P('miru_s1', 'みる、 ぜんぶ かける ^よ！', 'Miru can write them all!', '¡Miru los sabe escribir todos!', []), P('miru_s2', 'いちばん すき ^な もじ ^は 「あ」！', 'My favorite letter is あ!', '¡Mi letra favorita es あ!', [])],
    routine: [{ from: 0, to: 24, node: 'park', activity: 'stroll' }], tint: '#2E2A2A', scale: 0.7,
  },
];

// ------------------------------------------------------------------ chapter dialogue
// 1 · Ink and rain
const c1 = [
  C('i1_mochi', [
    say(P('mochi_hello', 'あっ！ こんにちは！', 'Oh! Hello!', '¡Oh! ¡Hola!', []), 'surprised'),
    narrate('A round panda in a bow tie bounces over. Every sign behind her is blank: the paint has run in long grey streaks.', 'Una panda redonda con pajarita se acerca dando saltitos. Todos los letreros detrás de ella están en blanco: la pintura se ha corrido en largos regueros grises.', 'ちょうネクタイの丸いパンダがはねてきた。後ろの看板は全部まっ白。墨が雨で流れてしまった。'),
    say(P('mochi_im', 'わたし ^は モチ。 すみ むら ^の そんちょう です。', "I'm Mochi, mayor of Sumi Village.", 'Soy Mochi, alcaldesa del Pueblo Sumi.', [])),
    say(P('mochi_rain', 'あめ… かんばん ^が しろ い。', 'The rain… the signs are white.', 'La lluvia… los letreros están blancos.', []), 'sad'),
    narrate('"Ame" means rain. "Kanban" means signs. The storm washed every word away, days before the New Year calligraphy festival.', '"Ame" significa lluvia. "Kanban" significa letreros. La tormenta borró todas las palabras, a pocos días del festival de caligrafía de Año Nuevo.', '「あめ」は雨、「かんばん」は看板。お正月の書道まつりの前に、嵐が字をぜんぶ消してしまった。'),
    say(P('mochi_learn', 'いっしょ ^に もじ ^を まなびましょう！', "Let's learn the letters together!", '¡Aprendamos las letras juntos!', []), 'happy'),
    reply([P('me_hai', 'はい！', 'Yes!', '¡Sí!', [])], [P('me_iie', 'いいえ。', 'No.', 'No.', [])]),
    narrate('Japanese uses three writing systems: hiragana, katakana and kanji. Hari-sensei at the dojo will start you on hiragana.', 'El japonés usa tres sistemas de escritura: hiragana, katakana y kanji. El maestro Hari, en el dojo, te enseñará primero el hiragana.', '日本語には三つの文字がある。ひらがな、カタカナ、漢字。道場のハリ先生がひらがなから教えてくれる。'),
    doIt('meet', 'mochi'),
  ]),
  C('i1_hari', [
    say(P('hari_hello', 'おや… こんにちは。', 'Oh… hello.', 'Vaya… hola.', []), 'surprised'),
    say(P('hari_im', 'わたし ^は ハリ。 しょどう ^の せんせい です。', "I'm Hari, the calligraphy teacher.", 'Soy Hari, el maestro de caligrafía.', []), 'happy'),
    narrate('Hari dips a brush and writes five shapes: あ い う え お. "a, i, u, e, o: the five vowels. Every other sound is built on them."', 'Hari moja un pincel y escribe cinco formas: あ い う え お. "a, i, u, e, o: las cinco vocales. Todos los demás sonidos se construyen sobre ellas".', 'ハリは筆に墨をつけて、五つの字を書いた。あ い う え お。「この五つの音がすべての基本だよ」'),
    say(P('hari_aiueo', 'あ、 い、 う、 え、 お。', 'a, i, u, e, o.', 'a, i, u, e, o.', [])),
    quiz({ en: 'Which one is "a"?', es: '¿Cuál es "a"?', ja: '「a」はどれ？' }, ['あ', 'お', 'い']),
    say(P('hari_ao', 'あお。 あお い そら。', 'Ao. A blue sky.', 'Ao. Un cielo azul.', ['ao'])),
    build(P('me_ao', 'あお', 'blue', 'azul', ['ao'])),
    say(P('hari_dojo', 'どうじょう ^で れんしゅう しましょう。', "Let's practice in the dojo.", 'Practiquemos en el dojo.', []), 'happy'),
    doIt('meet', 'hari'),
  ]),
];

// 2 · Names on the doors
const c2 = [
  C('i2_nori', [
    say(P('nori_hello', 'こんにちは。 ノリ です。', "Hello. I'm Nori.", 'Hola. Soy Nori.', []), 'surprised'),
    say(P('nori_trouble', 'てがみ ^が たくさん。 でも なまえ ^が… ない。', 'So many letters. But the names… are gone.', 'Tantas cartas. Pero los nombres… no están.', []), 'sad'),
    narrate('The storm washed the names off the doors. Nori has repainted them in fresh hiragana, but he needs help reading them.', 'La tormenta borró los nombres de las puertas. Nori los ha repintado en hiragana, pero necesita ayuda para leerlos.', '嵐でドアの名前が消えた。ノリはひらがなで書き直したけれど、読むのを手伝ってほしい。'),
    say(P('nori_door1', 'この いえ ^は… 「く り」？', 'This house is… "ku-ri"?', 'Esta casa es… ¿"ku-ri"?', ['ie'])),
    quiz({ en: 'How do you read くり?', es: '¿Cómo se lee くり?', ja: '「くり」の読みは？' }, ['kuri', 'kumo', 'sari']),
    say(P('nori_door2', 'はい！ くりさん ^の いえ。 この てがみ ^を おねがい します。', "Yes! Kuri's house. Please take this letter.", '¡Sí! La casa de Kuri. Lleva esta carta, por favor.', []), 'happy'),
    doIt('giveItem', 'i_letter'),
    doIt('meet', 'nori'),
  ]),
  C('i2_kuri', [
    say(P('kuri_hello', 'わあ！ こんにちは！ クリ です！', "Wow! Hello! I'm Kuri!", '¡Hala! ¡Hola! ¡Soy Kuri!', []), 'surprised'),
    reply([P('me_tegami', 'てがみ です。', "It's a letter.", 'Es una carta.', [])], ['i_me_iie']),
    doIt('takeItem', 'i_letter'),
    say(P('kuri_thanks', 'ありがとう！ はは ^から ^の てがみ！', "Thank you! A letter from my mother!", '¡Gracias! ¡Una carta de mi madre!', []), 'love'),
    say(P('kuri_neko', 'ねこ ^の えはがき！ かわいい！', 'A postcard with a cat! Cute!', '¡Una postal con un gato! ¡Qué mona!', ['neko'])),
    quiz({ en: 'What animal is on the postcard? (ねこ)', es: '¿Qué animal hay en la postal? (ねこ)', ja: 'えはがきの動物は？（ねこ）' }, ['cat', 'dog', 'fish']),
    doIt('meet', 'kuri'),
    doIt('giveCoins', 40),
  ]),
];

// 3 · The last rows
const c3 = [
  C('i3_miru', [
    say(P('miru_hi', 'あっ！ だれ？', 'Oh! Who are you?', '¡Oh! ¿Quién eres?', []), 'surprised'),
    say(P('miru_name', 'みる ^は みる！ ごさい！', "Miru is Miru! Five years old!", '¡Miru es Miru! ¡Cinco años!', [])),
    narrate('Miru proudly shows you her name written in hiragana: み る. "mi" and "ru", from the last rows of the chart.', 'Miru te enseña orgullosa su nombre en hiragana: み る. "mi" y "ru", de las últimas filas de la tabla.', 'ミルはひらがなで書いた名前を見せてくれた。み る。表の最後の行の字だ。'),
    quiz({ en: 'How do you read みる?', es: '¿Cómo se lee みる?', ja: '「みる」の読みは？' }, ['miru', 'mire', 'nuru']),
    say(P('miru_race', 'きょうそう！ どっち ^が はやく かける？', "A race! Who can write faster?", '¡Una carrera! ¿Quién escribe más rápido?', []), 'happy'),
    reply([P('me_ok', 'いい ^よ！', 'OK!', '¡Vale!', [])], ['i_me_iie']),
    doIt('meet', 'miru'),
  ]),
  C('i3_hari', [
    say(P('hari_n', 'ん ^は とくべつ。 ん ^だけ ^は おと ^が ひとつ。', 'ん is special. Only ん is a single sound.', 'ん es especial. Solo ん es un único sonido.', []), 'thinking'),
    narrate('Hari writes やま (yama, mountain), ゆき (yuki, snow) and わたし (watashi, I). You have now met every basic hiragana.', 'Hari escribe やま (yama, montaña), ゆき (yuki, nieve) y わたし (watashi, yo). Ya conoces todos los hiragana básicos.', 'ハリは「やま」「ゆき」「わたし」と書いた。これでひらがなの基本はぜんぶ。'),
    say(P('hari_yama', 'やま ^に ゆき。', 'Snow on the mountain.', 'Nieve en la montaña.', ['yama', 'yuki'])),
    quiz({ en: 'What is on the mountain? (ゆき)', es: '¿Qué hay en la montaña? (ゆき)', ja: 'やまに何がある？（ゆき）' }, ['snow', 'rain', 'flowers']),
    build(P('me_watashi', 'わたし', 'I, me', 'yo', ['watashi'])),
    say(P('hari_good', 'よく できました。', 'Well done.', 'Bien hecho.', []), 'love'),
    doIt('giveCoins', 50),
  ]),
];

// 4 · Little marks
const c4 = [
  C('i4_kuri', [
    say(P('kuri_sign', 'みて！ かんばん ^を かきました！', "Look! I painted my sign!", '¡Mira! ¡He pintado mi letrero!', []), 'happy'),
    narrate('Kuri\'s sign says たんこ. Something is missing: the two little dashes. With them, た becomes だ and こ becomes ご: だんご, dango, sweet rice dumplings.', 'El letrero de Kuri dice たんこ. Falta algo: las dos rayitas. Con ellas, た se convierte en だ y こ en ご: だんご, dango, bolitas dulces de arroz.', 'クリの看板には「たんこ」と書いてある。点々がない！「だんご」になるはず。'),
    quiz({ en: 'What should the sign say?', es: '¿Qué debería decir el letrero?', ja: '看板は何と書くべき？' }, ['だんご', 'たんこ', 'だんこ']),
    say(P('kuri_oops', 'あっ！ てんてん ^を わすれた！', 'Oh! I forgot the dashes!', '¡Ay! ¡Olvidé las rayitas!', []), 'surprised'),
    say(P('kuri_gift', 'ありがとう。 だんご ^と おちゃ ^を どうぞ。', 'Thank you. Have some dango and tea.', 'Gracias. Toma dango y té.', ['ocha']), 'love'),
    doIt('giveItem', 'tea'),
  ]),
  C('i4_mochi', [
    say(P('mochi_kyou', 'きょう ^は ごはん ^を いっしょ ^に たべよう！', "Let's eat together today!", '¡Comamos juntos hoy!', ['kyou', 'gohan']), 'happy'),
    narrate('Mochi points at きょう: き plus a small ょ makes "kyo". Small ゃ ゅ ょ blend into the kana before them.', 'Mochi señala きょう: き más una ょ pequeña hace "kyo". Las ゃ ゅ ょ pequeñas se funden con el kana anterior.', 'モチは「きょう」を指さした。小さい「ょ」は前の字とくっついて「きょ」になる。'),
    quiz({ en: 'How do you read きょう?', es: '¿Cómo se lee きょう?', ja: '「きょう」の読みは？' }, ['kyou', 'kiyou', 'kyuu']),
    reply([P('me_itadakimasu', 'いただきます！', "Let's eat! (said before meals)", '¡Que aproveche! (antes de comer)', [])], ['i_me_iie']),
    doIt('giveCoins', 60),
  ]),
];

// 5 · The café board
const c5 = [
  C('i5_maron', [
    say(P('maron_hello', 'いらっしゃいませ！ マロン ^の カフェ です！', "Welcome! This is Maron's café!", '¡Bienvenido! ¡Es el café de Maron!', []), 'surprised'),
    narrate('Maron\'s menu board is written in katakana, the sharper-looking script used for words from other languages. Same sounds as hiragana, different shapes.', 'La pizarra del café de Maron está en katakana, la escritura más angulosa que se usa para palabras de otros idiomas. Mismos sonidos que el hiragana, otras formas.', 'マロンのメニューはカタカナ。外国から来たことばに使う、角ばった文字。音はひらがなと同じ。'),
    say(P('maron_menu', 'アイス、 ケーキ、 ココア。 どれ ^に します ^か？', 'Ice cream, cake, hot chocolate. Which will you have?', 'Helado, pastel, chocolate caliente. ¿Qué vas a tomar?', ['aisu', 'keeki', 'kokoa'])),
    reply([P('me_keeki', 'ケーキ ^を ください。', 'Cake, please.', 'Un pastel, por favor.', ['keeki']), P('me_kokoa', 'ココア ^を ください。', 'Hot chocolate, please.', 'Un chocolate caliente, por favor.', ['kokoa'])], [P('me_sushi', 'すし ^を ください。', 'Sushi, please.', 'Sushi, por favor.', ['sushi'])]),
    narrate('The bar in ケーキ (keeki) makes the vowel long.', 'La barra de ケーキ (keeki) alarga la vocal.', '「ケーキ」の「ー」は音をのばす記号。'),
    doIt('pay', 20),
    say(P('maron_enjoy', 'どうぞ！ おいしい ^よ。', 'Here you go! It\'s delicious.', '¡Aquí tienes! Está riquísimo.', []), 'love'),
    doIt('meet', 'maron'),
  ]),
  C('i5_maron2', [
    say(P('maron_board', 'メニュー ^の ボード ^が しろ い… てつだって くれる？', 'My menu board is blank… will you help?', 'Mi pizarra está en blanco… ¿me ayudas?', []), 'sad'),
    quiz({ en: 'Which is "aisu" (ice cream)?', es: '¿Cuál es "aisu" (helado)?', ja: '「アイス」はどれ？' }, ['アイス', 'アイヌ', 'マイス']),
    quiz({ en: 'Which is "kokoa" (hot chocolate)?', es: '¿Cuál es "kokoa" (chocolate caliente)?', ja: '「ココア」はどれ？' }, ['ココア', 'コロア', 'ユユア']),
    say(P('maron_thanks', 'ありがとう！ きれい ^な ボード！', 'Thank you! What a lovely board!', '¡Gracias! ¡Qué pizarra tan bonita!', []), 'love'),
    doIt('giveCoins', 60),
  ]),
];

// 6 · Words from far away
const c6 = [
  C('i6_nori', [
    say(P('nori_parcel', 'とおく ^から ^の こづつみ です。', 'A parcel from far away.', 'Un paquete de muy lejos.', []), 'surprised'),
    narrate('The parcel has stickers in katakana: カメラ and コーヒー. Words borrowed from other languages get reshaped to Japanese sounds.', 'El paquete tiene pegatinas en katakana: カメラ y コーヒー. Las palabras de otros idiomas se adaptan a los sonidos japoneses.', '小包にカタカナのシール。「カメラ」と「コーヒー」。外国のことばは日本語の音になる。'),
    quiz({ en: 'What is カメラ?', es: '¿Qué es カメラ?', ja: '「カメラ」は？' }, ['camera', 'cola', 'cream']),
    quiz({ en: 'What is コーヒー?', es: '¿Qué es コーヒー?', ja: '「コーヒー」は？' }, ['coffee', 'cookie', 'cocoa']),
    say(P('nori_maron', 'マロンさん ^に とどけて ください。', 'Please deliver it to Maron.', 'Llévaselo a Maron, por favor.', [])),
    doIt('giveItem', 'i_parcel'),
  ]),
  C('i6_maron', [
    reply([P('me_kozutsumi', 'こづつみ です。', "It's a parcel.", 'Es un paquete.', [])], ['i_me_sushi']),
    doIt('takeItem', 'i_parcel'),
    say(P('maron_coffee', 'わあ、 コーヒー ^の まめ！ メニュー ^に コーヒー ^と ラーメン ^を かこう！', 'Wow, coffee beans! Let\'s add coffee and ramen to the menu!', '¡Hala, granos de café! ¡Añadamos café y ramen al menú!', ['koohii', 'raamen']), 'love'),
    quiz({ en: 'Which is "raamen"?', es: '¿Cuál es "raamen"?', ja: '「ラーメン」はどれ？' }, ['ラーメン', 'ラーノン', 'ヲーメン']),
    say(P('maron_pan', 'パン ^も どうぞ！', 'Have some bread too!', '¡Toma también pan!', ['pan']), 'happy'),
    doIt('giveItem', 'bread'),
  ]),
];

// 7 · Pictures into words
const c7 = [
  C('i7_hari', [
    say(P('hari_kanji', 'さあ、 かんじ ^の じかん です。', 'Now it\'s time for kanji.', 'Ahora toca kanji.', []), 'happy'),
    narrate('Hari draws three peaks: 山. "Mountain. Many kanji began as pictures." Then flowing water, 川 (river), and a tree with roots, 木.', 'Hari dibuja tres picos: 山. "Montaña. Muchos kanji empezaron como dibujos". Luego agua que fluye, 川 (río), y un árbol con raíces, 木.', 'ハリは三つの山を描いた。山。「多くの漢字は絵から生まれた」。それから川と木。'),
    quiz({ en: 'Which kanji is "mountain"?', es: '¿Qué kanji es "montaña"?', ja: '「やま」の漢字は？' }, ['{山|やま}', '{川|かわ}', '{木|き}']),
    quiz({ en: 'Which kanji is "river"?', es: '¿Qué kanji es "río"?', ja: '「かわ」の漢字は？' }, ['{川|かわ}', '{山|やま}', '{田|た}']),
    say(P('hari_furigana', 'ちいさ い かな ^は よみかた です。', 'The small kana show how to read it.', 'Los kana pequeños indican cómo leerlo.', [])),
    narrate('The tiny kana above a kanji are called furigana. They show its reading.', 'Los kana diminutos encima de un kanji se llaman furigana. Indican su lectura.', '漢字の上の小さいかなは「ふりがな」。読み方を教えてくれる。'),
  ]),
  C('i7_miru', [
    say(P('miru_draw', 'みて！ みる ^も かんじ ^を かいた！', 'Look! Miru wrote kanji too!', '¡Mira! ¡Miru también ha escrito kanji!', []), 'happy'),
    narrate('Miru has drawn 日 and 月 side by side. "Sun and moon!"', 'Miru ha dibujado 日 y 月 juntos. "¡Sol y luna!"', 'ミルは日と月をならべて書いた。「おひさまとおつきさま！」'),
    quiz({ en: 'Which is "moon"?', es: '¿Cuál es "luna"?', ja: '「つき」はどれ？' }, ['{月|つき}', '{日|ひ}', '{目|め}']),
    say(P('miru_proud', 'みる、 てんさい？', 'Is Miru a genius?', '¿Miru es un genio?', []), 'love'),
    reply([P('me_sugoi', 'すごい！', 'Amazing!', '¡Increíble!', [])], ['i_me_iie']),
    doIt('giveCoins', 70),
  ]),
];

// 8 · Ready for the festival
const c8 = [
  C('i8_mochi', [
    say(P('mochi_festival', 'もうすぐ かきぞめ ^の おまつり です！', 'The calligraphy festival is almost here!', '¡Ya casi es el festival de caligrafía!', []), 'happy'),
    narrate('At kakizome, everyone writes their first characters of the year with a brush. Mochi asks you to invite the village.', 'En el kakizome, todos escriben con pincel sus primeros caracteres del año. Mochi te pide que invites al pueblo.', '書き初めでは、みんなが新年最初の字を筆で書く。モチは村のみんなを誘ってほしいと言う。'),
    reply([P('me_will_invite', 'はい、 みんな ^を さそいます！', "Yes, I'll invite everyone!", '¡Sí, invitaré a todos!', [])], ['i_me_iie']),
  ]),
  C('i8_kuri', [
    reply([P('me_invite', 'おまつり ^に きて ください！', 'Please come to the festival!', '¡Ven al festival, por favor!', [])], ['i_me_tegami']),
    say(P('kuri_yes', 'いく いく！ だんご ^を もって いく ^ね！', "I'll come! I'll bring dango!", '¡Iré! ¡Llevaré dango!', []), 'love'),
  ]),
  C('i8_nori', [
    reply(['i_me_invite'], ['i_me_kozutsumi']),
    say(P('nori_yes', 'はい。 たのしみ です。', 'Yes. I\'m looking forward to it.', 'Sí. Qué ilusión.', []), 'happy'),
  ]),
  C('i8_maron', [
    reply(['i_me_invite'], ['i_me_keeki']),
    say(P('maron_yes', 'もちろん！ ケーキ ^と ココア ^を つくる ^わ！', "Of course! I'll make cake and hot chocolate!", '¡Claro! ¡Haré pastel y chocolate caliente!', ['keeki', 'kokoa']), 'love'),
  ]),
  C('i8_hari', [
    say(P('hari_ready', 'じゅんび ^は いい ですか。', 'Are you ready?', '¿Estás listo?', [])),
    reply([P('me_ready', 'はい、 だいじょうぶ です！', "Yes, I'm ready!", '¡Sí, estoy listo!', [])], ['i_me_iie']),
    narrate('"Then take the Script Exam: every kana and your first kanji. Pass with 90%, and you\'ll write the festival banner and ring the bell."', '"Entonces haz el Examen de Escritura: todos los kana y tus primeros kanji. Aprueba con un 90 % y escribirás la pancarta del festival y tocarás la campana".', '「では文字の試験を受けなさい。かなと最初の漢字ぜんぶ。90%で合格したら、まつりの書を書いて鐘を鳴らそう」'),
    say(P('hari_exam', 'がんばって。', 'Do your best.', 'Ánimo.', []), 'happy'),
  ]),
];

// 9 · The festival
const finale = [
  C('i9_bell', [
    narrate('The village gathers in the square. Every sign is freshly painted. A long sheet of paper waits on the ground with a brush and an inkstone.', 'El pueblo se reúne en la plaza. Todos los letreros están recién pintados. Una larga hoja de papel espera en el suelo con un pincel y un tintero.', '村のみんなが広場に集まった。看板はぜんぶ新しく書かれた。地面には長い紙と筆とすずりがある。'),
    say(P('mochi_write', 'さあ、 かいて ください！', 'Now, please write!', '¡Adelante, escribe!', []), 'happy'),
    build(P('me_banner', 'あたらしい とし、 あたらしい もじ。', 'A new year, new letters.', 'Año nuevo, letras nuevas.', [])),
    doIt('ringBell'),
    say(P('mochi_rang', 'すばらしい！ おめでとう！', 'Wonderful! Congratulations!', '¡Maravilloso! ¡Enhorabuena!', []), 'love'),
    narrate('You can read and write hiragana, katakana and your first kanji. Clover Meadow (N5) is waiting.', 'Ya sabes leer y escribir hiragana, katakana y tus primeros kanji. El Prado del Trébol (N5) te espera.', 'ひらがな、カタカナ、最初の漢字が読めて書けるようになった。クローバー町（N5）が待っている。'),
  ]),
];

export const INK_CONVOS: Record<string, Step[]> = Object.fromEntries([...c1, ...c2, ...c3, ...c4, ...c5, ...c6, ...c7, ...c8, ...finale]);
void meaning;

export const INK_QUESTS: QuestDef[] = [
  chapter('ink', 1, '🖌️', obj('Ink and Rain', 'Tinta y lluvia', '墨と雨'), obj('The storm washed every sign blank. Meet the mayor and the calligraphy master.', 'La tormenta borró todos los letreros. Conoce a la alcaldesa y al maestro de caligrafía.', '嵐で看板が白くなった。村長と書道の先生に会おう。'), [
    { talk: { mochi: 'i1_mochi' }, objective: obj('Say hello to Mayor Mochi', 'Saluda a la alcaldesa Mochi', 'モチ村長にあいさつしよう') },
    { talk: { hari: 'i1_hari' }, objective: obj('Visit Hari-sensei at the dojo', 'Visita al maestro Hari en el dojo', '道場のハリ先生をたずねよう') },
    { dojo: 'lesson_1', objective: obj('Finish Lesson 1: あ か さ', 'Termina la Lección 1: あ か さ', 'レッスン1：あ か さ') },
  ], { coins: 60, xp: 40 }),
  chapter('ink', 2, '✉️', obj('Names on the Doors', 'Nombres en las puertas', 'ドアの名前'), obj('Help Nori read the names on the doors.', 'Ayuda a Nori a leer los nombres de las puertas.', 'ノリといっしょにドアの名前を読もう。'), [
    { dojo: 'lesson_2', objective: obj('Finish Lesson 2: た な は', 'Termina la Lección 2: た な は', 'レッスン2：た な は') },
    { talk: { nori: 'i2_nori' }, objective: obj('Talk to Nori at the post office', 'Habla con Nori en correos', '郵便局のノリと話そう') },
    { talk: { kuri: 'i2_kuri' }, objective: obj('Deliver the letter to Kuri', 'Lleva la carta a Kuri', 'クリに手紙を届けよう') },
  ], { coins: 70, xp: 45 }),
  chapter('ink', 3, '🐼', obj('The Last Rows', 'Las últimas filas', '最後の行'), obj('Finish the hiragana chart with a little rival.', 'Termina la tabla de hiragana con una pequeña rival.', '小さなライバルとひらがな表を完成させよう。'), [
    { talk: { miru: 'i3_miru' }, objective: obj('Meet Miru near the park', 'Conoce a Miru cerca del parque', '公園の近くでミルに会おう') },
    { dojo: 'lesson_3', objective: obj('Finish Lesson 3: ま や ら わ ん', 'Termina la Lección 3: ま や ら わ ん', 'レッスン3：ま や ら わ ん') },
    { talk: { hari: 'i3_hari' }, objective: obj('Show Hari-sensei what you learned', 'Enseña al maestro Hari lo que aprendiste', 'ハリ先生に見せよう') },
  ], { coins: 70, xp: 45 }),
  chapter('ink', 4, '🍡', obj('Little Marks', 'Marcas pequeñitas', '点々と小さい字'), obj('Two little dashes can change a word.', 'Dos rayitas pueden cambiar una palabra.', '点々でことばが変わる。'), [
    { dojo: 'lesson_4', objective: obj('Finish Lesson 4: ゛ ゜ and small kana', 'Termina la Lección 4: ゛ ゜ y kana pequeños', 'レッスン4：点々と小さい字') },
    { talk: { kuri: 'i4_kuri' }, objective: obj("Check Kuri's new sign", 'Mira el letrero nuevo de Kuri', 'クリの看板を見よう') },
    { talk: { mochi: 'i4_mochi' }, objective: obj('Have lunch with Mayor Mochi', 'Come con la alcaldesa Mochi', 'モチ村長とごはんを食べよう') },
  ], { coins: 80, xp: 50 }),
  chapter('ink', 5, '☕', obj('The Café Board', 'La pizarra del café', 'カフェのメニュー'), obj('Your first katakana, on a café menu.', 'Tu primer katakana, en un menú de café.', 'はじめてのカタカナはカフェのメニューで。'), [
    { talk: { maron: 'i5_maron' }, objective: obj("Visit Maron's café", 'Visita el café de Maron', 'マロンのカフェに行こう') },
    { dojo: 'lesson_5', objective: obj('Finish Lesson 5: katakana ア–ホ', 'Termina la Lección 5: katakana ア–ホ', 'レッスン5：カタカナ ア〜ホ') },
    { talk: { maron: 'i5_maron2' }, objective: obj("Help repaint Maron's menu board", 'Ayuda a repintar la pizarra de Maron', 'マロンのメニューを書き直そう') },
  ], { coins: 80, xp: 50 }),
  chapter('ink', 6, '📦', obj('Words from Far Away', 'Palabras de lejos', '遠くから来たことば'), obj('A parcel full of loanwords.', 'Un paquete lleno de préstamos.', 'カタカナのことばがいっぱいの小包。'), [
    { dojo: 'lesson_6', objective: obj('Finish Lesson 6: katakana マ–ン', 'Termina la Lección 6: katakana マ–ン', 'レッスン6：カタカナ マ〜ン') },
    { talk: { nori: 'i6_nori' }, objective: obj('Collect the parcel from Nori', 'Recoge el paquete de Nori', 'ノリから小包を受け取ろう') },
    { talk: { maron: 'i6_maron' }, objective: obj('Deliver the parcel to Maron', 'Lleva el paquete a Maron', 'マロンに小包を届けよう') },
  ], { coins: 90, xp: 55 }),
  chapter('ink', 7, '⛰️', obj('Pictures into Words', 'De dibujos a palabras', '絵から字へ'), obj('Your first kanji began as pictures.', 'Tus primeros kanji empezaron como dibujos.', 'はじめての漢字は絵から。'), [
    { talk: { hari: 'i7_hari' }, objective: obj('Learn kanji with Hari-sensei', 'Aprende kanji con el maestro Hari', 'ハリ先生と漢字を学ぼう') },
    { dojo: 'lesson_7', objective: obj('Finish Lesson 7: picture kanji', 'Termina la Lección 7: kanji pictográficos', 'レッスン7：絵からできた漢字') },
    { talk: { miru: 'i7_miru' }, objective: obj("See Miru's kanji", 'Mira los kanji de Miru', 'ミルの漢字を見よう') },
  ], { coins: 90, xp: 55 }),
  chapter('ink', 8, '🎍', obj('Ready for the Festival', 'Listos para el festival', 'まつりの準備'), obj('Invite everyone to the calligraphy festival.', 'Invita a todos al festival de caligrafía.', 'みんなを書き初めのまつりに誘おう。'), [
    { talk: { mochi: 'i8_mochi' }, objective: obj('Talk to Mayor Mochi', 'Habla con la alcaldesa Mochi', 'モチ村長と話そう') },
    { dojo: 'lesson_8', objective: obj('Finish Lesson 8: kanji building blocks', 'Termina la Lección 8: piezas de kanji', 'レッスン8：漢字の部品') },
    { talk: { kuri: 'i8_kuri', nori: 'i8_nori', maron: 'i8_maron' }, objective: obj('Invite Kuri, Nori and Maron', 'Invita a Kuri, Nori y Maron', 'クリ、ノリ、マロンを誘おう') },
    { talk: { hari: 'i8_hari' }, objective: obj("Tell Hari-sensei you're ready", 'Dile al maestro Hari que estás listo', 'ハリ先生に準備ができたと伝えよう') },
  ], { coins: 110, xp: 60 }),
  chapter('ink', 9, '🔔', obj('The Script Exam', 'El Examen de Escritura', '文字の試験'), obj('Pass the Script Exam (90%), write the festival banner and ring the bell.', 'Aprueba el Examen de Escritura (90 %), escribe la pancarta y toca la campana.', '文字の試験（90%）に合格して、まつりの書を書き、鐘を鳴らそう。'), [
    { dojo: 'exam', objective: obj('Pass the Script Exam at the dojo', 'Aprueba el Examen de Escritura en el dojo', '道場で文字の試験に合格しよう') },
    { talk: { mochi: 'i9_bell' }, objective: obj('Write the banner and ring the bell', 'Escribe la pancarta y toca la campana', '書を書いて鐘を鳴らそう') },
  ], { coins: 200, xp: 150, items: ['plant'] }),
];
