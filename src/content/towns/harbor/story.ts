import type { Phrase } from '../../phrases';
import type { NpcDef } from '../../characters';
import type { QuestDef } from '../../quests';
import type { Step } from '../../dialogues';
import { chapter, storyKit } from '../types';

/**
 * Maple Harbor story: "The Harbor Light". The summer port festival is days away, but the old
 * lighthouse has gone dark and the first ferry of the season can't come in safely. Nagi-sensei
 * trains you while the town gets ready, and the harbor bell rings when the light returns.
 */
export const HARBOR_PHRASES: Phrase[] = [];
const { P, say, reply, build, meaning, narrate, quiz, doIt, C, obj } = storyKit(HARBOR_PHRASES, 'h_', 'n4_');

export const HARBOR_NPCS: NpcDef[] = [
  {
    id: 'kaito', species: 'penguin', extra: 'bowtie',
    name: { en: 'Harbormaster Kaito', es: 'Capitán Kaito', ja: 'カイト{港長|こうちょう}' },
    title: { en: 'Harbormaster of Maple Harbor', es: 'Capitán del Puerto Arce', ja: 'もみじ港の港長' },
    personality: { en: 'Serious about rules, soft about everything else. Has never missed a sunrise.', es: 'Serio con las normas y tierno con todo lo demás. Nunca se ha perdido un amanecer.', ja: '規則にはきびしいけれど、ほかはとてもやさしい。' },
    colors: { main: '#3E4A66', accent: '#F2C94C', belly: '#FFFFFF', nose: '#F2913D' },
    voice: { pitch: 160, speed: 0.85 }, favorites: ['coffee', 'carp'], likes: ['tea', 'bread'],
    stories: [P('kaito_s1', '{毎朝|まいあさ}、 {一番|いちばん} {早|はや}く {港|みなと} ^に {来|き}ます。', 'Every morning I\'m the first one at the harbor.', 'Cada mañana soy el primero en llegar al puerto.', ['minato']), P('kaito_s2', '{若|わか}い ころ、 {大|おお}きい {船|ふね} ^の {船長|せんちょう} でした。', 'When I was young, I was captain of a big ship.', 'De joven fui capitán de un gran barco.', ['fune'])],
    routine: [{ from: 0, to: 24, node: 'hall', activity: 'work' }], tint: '#3E4A66',
  },
  {
    id: 'nagi', species: 'otter', extra: 'glasses',
    name: { en: 'Nagi-sensei', es: 'Maestra Nagi', ja: 'ナギ{先生|せんせい}' },
    title: { en: 'Dojo master and inventor', es: 'Maestra del dojo e inventora', ja: '道場の先生・発明家' },
    personality: { en: 'Patient, clever with her paws, and always smells faintly of machine oil.', es: 'Paciente, muy mañosa y siempre huele un poco a aceite de máquina.', ja: 'がまん強くて手先が器用。いつも少し機械油のにおいがする。' },
    colors: { main: '#8A6448', accent: '#6E4A34', belly: '#E9D2B4', nose: '#3A2A22' },
    voice: { pitch: 190, speed: 0.85 }, favorites: ['tea', 'shrimp'], likes: ['cookie', 'crab'],
    stories: [P('nagi_s1', '{子|こ}ども ^の ころ ^から {機械|きかい} ^を {直|なお}す ^の ^が {好|す}き でした。', 'I\'ve loved fixing machines since I was little.', 'Desde pequeña me encanta arreglar máquinas.', ['naosu']), P('nagi_s2', 'ことば ^も {道具|どうぐ} ^と {同|おな}じ。 {使|つか}えば {使|つか}う ほど {上手|じょうず} ^に なります。', 'Words are like tools: the more you use them, the better you get.', 'Las palabras son como herramientas: cuanto más las usas, mejor.', ['dougu'], 3)],
    routine: [{ from: 0, to: 24, node: 'dojo', activity: 'work' }], tint: '#6E4A34',
  },
  {
    id: 'sawa', species: 'otter', extra: 'apron',
    name: { en: 'Sawa', es: 'Sawa', ja: 'サワ' },
    title: { en: 'Fishmonger', es: 'Pescadera', ja: '魚屋さん' },
    personality: { en: 'Loud, generous and proud of her fish. Raising little Chapu on her own.', es: 'Ruidosa, generosa y orgullosa de su pescado. Cría sola al pequeño Chapu.', ja: '声が大きくて気前がいい。ひとりでチャプを育てている。' },
    colors: { main: '#A97C55', accent: '#5E95C4', belly: '#F2DFC4', nose: '#3A2A22' },
    voice: { pitch: 260, speed: 1.15 }, favorites: ['trout', 'apple'], likes: ['carp', 'milk'],
    stories: [P('sawa_s1', 'うち ^の {魚|さかな} ^は {港|みなと} ^で {一番|いちばん} {新鮮|しんせん} です ^よ！', 'My fish is the freshest in the harbor!', '¡Mi pescado es el más fresco del puerto!', ['sakana', 'shinsen']), P('sawa_s2', 'チャプ ^が {生|う}まれて、 {毎日|まいにち} ^が {楽|たの}しく なりました。', 'Since Chapu was born, every day has been fun.', 'Desde que nació Chapu, cada día es divertido.', [])],
    routine: [{ from: 0, to: 24, node: 'market', activity: 'work' }], tint: '#5E95C4',
  },
  {
    id: 'pen', species: 'penguin', extra: 'cap',
    name: { en: 'Pen', es: 'Pen', ja: 'ペン' },
    title: { en: 'Mail carrier', es: 'Cartero', ja: '郵便屋さん' },
    personality: { en: 'Cheerful, chatty and terrible with directions, which is a problem for a mail carrier.', es: 'Alegre, charlatán y muy despistado con las direcciones, algo grave para un cartero.', ja: '明るくておしゃべり。でも方向音痴なのが悩み。' },
    colors: { main: '#2E3A52', accent: '#E5735F', belly: '#FFFFFF', nose: '#F2913D' },
    voice: { pitch: 300, speed: 1.3 }, favorites: ['shrimp', 'cookie'], likes: ['sandwich', 'goldfish'],
    stories: [P('pen_s1', '{実|じつ} ^は、 よく {道|みち} ^に {迷|まよ}います…', 'To be honest, I often get lost…', 'La verdad es que me pierdo a menudo…', ['michi', 'mayou']), P('pen_s2', 'いつか {南|みなみ} ^の {島|しま} ^へ {手紙|てがみ} ^を {届|とど}けたい です。', 'Someday I want to deliver letters to the southern islands.', 'Algún día quiero llevar cartas a las islas del sur.', ['shima'])],
    routine: [{ from: 0, to: 24, node: 'post', activity: 'work' }], tint: '#E5735F',
  },
  {
    id: 'lulu', species: 'penguin', extra: 'apron',
    name: { en: 'Lulu', es: 'Lulu', ja: 'ルル' },
    title: { en: 'Harbor diner cook', es: 'Cocinera del comedor del puerto', ja: '港の食堂のコック' },
    personality: { en: 'Dreamy and kind. Hums while she cooks and hears every rumor in town.', es: 'Soñadora y amable. Tararea mientras cocina y se entera de todos los rumores.', ja: 'おっとりしてやさしい。料理しながら歌い、町のうわさは何でも知っている。' },
    colors: { main: '#4E5A7A', accent: '#F2A7B0', belly: '#FFF6F0', nose: '#F2913D' },
    voice: { pitch: 280, speed: 1.0 }, favorites: ['soup', 'strawberry'], likes: ['honey', 'cake'],
    stories: [P('lulu_s1', '{料理|りょうり} ^を {作|つく}り ながら {歌|うた}う ^の ^が {好|す}き です。', 'I like singing while I cook.', 'Me gusta cantar mientras cocino.', []), P('lulu_s2', 'お{客|きゃく}さん ^が {笑|わら}う ^と、 {私|わたし} ^も うれしく なります。', 'When my customers smile, I feel happy too.', 'Cuando mis clientes sonríen, yo también me alegro.', ['warau'])],
    routine: [{ from: 0, to: 24, node: 'kitchen', activity: 'work' }], tint: '#F2A7B0',
  },
  {
    id: 'chapu', species: 'otter', extra: 'none',
    name: { en: 'Chapu', es: 'Chapu', ja: 'チャプ' },
    title: { en: 'Sawa\'s son', es: 'Hijo de Sawa', ja: 'サワの息子' },
    personality: { en: 'Six years old, collects seashells and can\'t sit still.', es: 'Tiene seis años, colecciona conchas y no para quieto.', ja: '6歳。貝殻を集めていて、じっとしていられない。' },
    colors: { main: '#B88B62', accent: '#E5735F', belly: '#F6E5CC', nose: '#3A2A22' },
    voice: { pitch: 430, speed: 1.3 }, favorites: ['cookie', 'goldfish'], likes: ['cake', 'apple'],
    stories: [P('chapu_s1', 'ぼく、 {貝殻|かいがら} ^を {百|ひゃっ}{個|こ} {持|も}って いる ^よ！', 'I have a hundred seashells!', '¡Tengo cien conchas!', ['kaigara']), P('chapu_s2', '{大|おお}きく なったら、 {灯台|とうだい} ^の {人|ひと} ^に なりたい！', 'When I grow up, I want to be a lighthouse keeper!', '¡De mayor quiero ser farero!', ['toudai'])],
    routine: [{ from: 0, to: 24, node: 'park', activity: 'stroll' }], tint: '#E5735F', scale: 0.72,
  },
];

// ------------------------------------------------------------------ chapter dialogue
// 1 · Welcome to the harbor
const c1 = [
  C('h1_kaito', [
    say(P('kai_hello', 'おっと！ {新|あたら}しい {顔|かお} です ^ね。 {初|はじ}めまして。', 'Oh! A new face. Nice to meet you.', '¡Vaya! Una cara nueva. Encantado.', [], 1), 'surprised'),
    say(P('kai_im', '{私|わたし} ^は カイト。 この {港|みなと} ^の {港長|こうちょう} です。', 'I\'m Kaito, the harbormaster here.', 'Soy Kaito, el capitán de este puerto.', ['minato', 'kouchou']), 'happy'),
    say(P('kai_boat_q', '{船|ふね} ^に {乗|の}った こと ^が あります ^か。', 'Have you ever been on a boat?', '¿Has subido alguna vez a un barco?', ['fune', 'noru'])),
    reply([P('me_boat_yes', 'はい、 {一度|いちど} {乗|の}った こと ^が あります。', 'Yes, I\'ve been on one once.', 'Sí, he subido una vez.', ['noru']), P('me_boat_no', 'いいえ、 {一度|いちど} ^も {乗|の}った こと ^が ありません。', 'No, I\'ve never been on one.', 'No, nunca he subido a uno.', ['noru'])], [P('me_boat_will', '{明日|あした} {船|ふね} ^に {乗|の}ります。', 'I\'ll ride a boat tomorrow.', 'Mañana subiré a un barco.', ['fune'])]),
    say(P('kai_light', 'じつ ^は、 {困|こま}って います。 {灯台|とうだい} ^の {光|ひかり} ^が {消|き}えて しまいました。', 'Actually, we\'re in trouble. The lighthouse light has gone out.', 'La verdad es que tenemos un problema. La luz del faro se ha apagado.', ['toudai', 'hikari'], 3), 'sad'),
    say(P('kai_ferry', '{光|ひかり} ^が ない ^と、 {夏|なつ} ^の {最初|さいしょ} ^の フェリー ^が {港|みなと} ^に {入|はい}れません。', 'Without the light, the first summer ferry can\'t enter the harbor.', 'Sin la luz, el primer ferry del verano no puede entrar al puerto.', ['ferii', 'minato'], 3), 'thinking'),
    meaning('h_kai_ferry'),
    say(P('kai_nagi', '{道場|どうじょう} ^の ナギ{先生|せんせい} ^に {会|あ}って ください。 {先生|せんせい} ^は {何|なん} ^でも {知|し}って います。', 'Please go and see Nagi-sensei at the dojo. She knows everything.', 'Ve a ver a la maestra Nagi al dojo. Ella lo sabe todo.', ['shiru'])),
    doIt('meet', 'kaito'),
  ]),
  C('h1_nagi', [
    say(P('nagi_hello', 'あら、 いらっしゃい。 ナギ です。 {道場|どうじょう} ^の {先生|せんせい} ^を して います。', 'Oh, welcome. I\'m Nagi. I teach at the dojo.', 'Oh, bienvenida. Soy Nagi. Soy la maestra del dojo.', []), 'surprised'),
    say(P('nagi_where_q', 'どこ ^に {住|す}んで いる ^の？', 'Where do you live?', '¿Dónde vives?', ['sumu'])),
    reply([P('me_live_village', 'ほっこり{村|むら} ^に {住|す}んで います。', 'I live in Cozy Village.', 'Vivo en el Pueblito Acogedor.', ['sumu'])], [P('me_live_will', 'ほっこり{村|むら} ^に {住|す}みたい です。', 'I want to live in Cozy Village.', 'Quiero vivir en el Pueblito Acogedor.', ['sumu']), 'h_me_boat_will']),
    say(P('nagi_light', '{灯台|とうだい} ^の こと ^は {聞|き}きました。 {私|わたし} ^が {直|なお}したい ^けど、 {部品|ぶひん} ^が {足|た}りない ^の。', 'I heard about the lighthouse. I\'d like to fix it, but I\'m short of parts.', 'Me he enterado de lo del faro. Quiero arreglarlo, pero me faltan piezas.', ['toudai', 'naosu', 'buhin'], 3), 'thinking'),
    say(P('nagi_study', 'その {間|あいだ}、 いっしょ ^に {日本語|にほんご} ^を {勉強|べんきょう}しましょう。 {港|みなと} ^の ことば ^を {教|おし}えます ^ね。', 'In the meantime, let\'s study Japanese together. I\'ll teach you harbor words.', 'Mientras tanto, estudiemos japonés juntas. Te enseñaré palabras del puerto.', ['minato']), 'happy'),
    build('h_me_live_village'),
    doIt('meet', 'nagi'),
  ]),
  C('h1_pen', [
    say(P('pen_hello', 'わっ！ ごめんなさい、 {急|いそ}いで いて… ペン です！', 'Whoa! Sorry, I was in a hurry… I\'m Pen!', '¡Uy! Perdón, iba con prisa… ¡Soy Pen!', ['isogu'], 1), 'surprised'),
    say(P('pen_first_q', '{港|みなと} ^は {初|はじ}めて です ^か。', 'Is this your first time at the harbor?', '¿Es tu primera vez en el puerto?', ['minato', 'hajimete'])),
    reply([P('me_first_yes', 'はい、 {初|はじ}めて です。 {海|うみ} ^が きれい です ^ね。', 'Yes, it\'s my first time. The sea is beautiful.', 'Sí, es la primera vez. El mar es precioso.', ['hajimete', 'umi'])], [P('me_first_wind', '{風|かぜ} ^が {強|つよ}い です ^ね。', 'The wind is strong, isn\'t it.', 'Hace mucho viento, ¿verdad?', ['kaze'])]),
    say(P('pen_want', 'ぼく ^は いつか {島|しま} ^へ {行|い}きたい ^んです。 でも、 {灯台|とうだい} ^が {暗|くら}い ^と {危|あぶ}ない…', 'Someday I want to go to the islands. But with the lighthouse dark, it\'s dangerous…', 'Algún día quiero ir a las islas. Pero con el faro apagado es peligroso…', ['shima', 'toudai', 'kurai', 'abunai'], 3), 'sad'),
    doIt('meet', 'pen'),
  ]),
];

// 2 · Market morning
const c2 = [
  C('h2_sawa', [
    say(P('sawa_hello', 'いらっしゃい！ {新鮮|しんせん} ^な {魚|さかな} ^は いかが？ サワ ^の {店|みせ} だ ^よ！', 'Welcome! How about some fresh fish? This is Sawa\'s stall!', '¡Bienvenido! ¿Pescado fresco? ¡Es el puesto de Sawa!', ['shinsen', 'sakana'], 2), 'surprised'),
    say(P('sawa_lulu', 'ルル ^の {食堂|しょくどう} ^の {注文|ちゅうもん} ^だ ^ね？ どれ ^を {選|えら}ぶ？', 'It\'s the order for Lulu\'s diner, right? Which will you pick?', 'Es el pedido del comedor de Lulu, ¿no? ¿Cuál eliges?', ['chuumon', 'erabu'])),
    reply([P('me_this_fresh', 'この {魚|さかな} ^は {新鮮|しんせん}そう です ^ね。 これ ^に します。', 'This fish looks fresh. I\'ll take this one.', 'Este pescado parece fresco. Me llevo este.', ['sakana', 'shinsen'])], [P('me_too_many', '{魚|さかな} ^が {多|おお}すぎます。', 'There are too many fish.', 'Hay demasiados peces.', ['ooi'])]),
    say(P('sawa_tako_q', 'たこ ^も どう？ ちょっと {高|たか}い ^けど ^ね。', 'How about octopus too? It\'s a bit pricey, though.', '¿Y pulpo también? Aunque es un poco caro.', ['tako', 'takai'])),
    reply([P('me_too_expensive', 'ちょっと {高|たか}すぎます。 えび ^は {安|やす}い です ^か。', 'It\'s a little too expensive. Is the shrimp cheap?', 'Es un poco caro. ¿Las gambas son baratas?', ['takai', 'ebi', 'yasui'])], ['h_me_too_many']),
    say(P('sawa_shrimp', 'えび ^は {今日|きょう} {安|やす}い ^よ！ でも {少|すく}ない から、 {早|はや}い{者|もの}{勝|が}ち だ ^よ。', 'Shrimp is cheap today! But there\'s not much, so first come, first served.', '¡Hoy las gambas están baratas! Pero quedan pocas, así que el primero que llegue.', ['ebi', 'yasui', 'sukunai'], 3), 'happy'),
    quiz({ en: 'Why should you buy shrimp quickly?', es: '¿Por qué hay que comprar gambas rápido?', ja: 'どうして早くえびを買う？' }, ['{少|すく}ない から', '{高|たか}い から', '{大|おお}きい から']),
    doIt('pay', 40),
    doIt('giveItem', 'h_fish'),
    doIt('meet', 'sawa'),
  ]),
  C('h2_lulu', [
    say(P('lulu_hello', 'ふんふん♪ あら、 {初|はじ}めまして。 ルル です。', 'La la la♪ Oh, nice to meet you. I\'m Lulu.', 'Lalalá♪ Oh, encantada. Soy Lulu.', [], 1), 'surprised'),
    reply([P('me_fish_for_you', 'サワさん ^から {魚|さかな} ^を {持|も}って きました。', 'I brought fish from Sawa.', 'Te traigo pescado de Sawa.', ['sakana'])], ['h_me_too_many']),
    doIt('takeItem', 'h_fish'),
    say(P('lulu_taste', 'わあ、 おいしそう！ {味|あじ} ^を {見|み}て みて。', 'Wow, it looks delicious! Have a taste.', '¡Qué buena pinta! Pruébalo.', ['aji']), 'happy'),
    narrate('Lulu grills the fish with lemon. It\'s soft, salty and perfect.', 'Lulu asa el pescado con limón. Está tierno, salado y perfecto.', 'ルルはレモンで魚を焼いた。やわらかくて、塩味がちょうどいい。'),
    reply([P('me_easy_eat', '{骨|ほね} ^が なくて、 {食|た}べやすい です！', 'There are no bones, so it\'s easy to eat!', '¡No tiene espinas, es fácil de comer!', [])], [P('me_hard_eat', '{食|た}べにくい です。', 'It\'s hard to eat.', 'Es difícil de comer.', [])]),
    say(P('lulu_festival', 'お{祭|まつ}り ^の {日|ひ} ^に ^は、 もっと たくさん {作|つく}る つもり です。', 'On festival day I plan to cook much more.', 'El día de la fiesta pienso cocinar mucho más.', ['tsumori']), 'love'),
    doIt('meet', 'lulu'),
    doIt('giveCoins', 60),
  ]),
];

// 3 · The ferry rules
const c3 = [
  C('h3_kaito', [
    say(P('kai_rules', 'フェリー ^が {来|く}る {前|まえ} ^に、 {規則|きそく} ^を {覚|おぼ}えなければ なりません。', 'Before the ferry comes, you must learn the rules.', 'Antes de que llegue el ferry, tienes que aprenderte las normas.', ['ferii', 'kisoku']), 'thinking'),
    say(P('kai_rule1', '{出発|しゅっぱつ} ^の {十分|じゅっぷん} {前|まえ} ^に {乗|の}らなければ なりません。', 'You must board ten minutes before departure.', 'Hay que subir diez minutos antes de la salida.', ['shuppatsu', 'noru'])),
    say(P('kai_rule2', '{船|ふね} ^の {上|うえ} ^で {走|はし}っては いけません。 {危|あぶ}ない です から。', 'You must not run on board. It\'s dangerous.', 'No se puede correr a bordo. Es peligroso.', ['fune', 'abunai'])),
    say(P('kai_rule3', 'でも、 {写真|しゃしん} ^は {撮|と}っても いい です ^よ。', 'But you may take photos.', 'Pero sí puedes hacer fotos.', []), 'happy'),
    quiz({ en: 'Which is NOT allowed on the ferry?', es: '¿Qué NO está permitido en el ferry?', ja: 'フェリーでしてはいけないことは？' }, ['{走|はし}る こと', '{写真|しゃしん} ^を {撮|と}る こと', '{十分|じゅっぷん} {前|まえ} ^に {乗|の}る こと']),
    say(P('kai_photo_q', '{写真|しゃしん} ^を {撮|と}りたい ^とき ^は？', 'And when you want to take a photo?', '¿Y si quieres hacer una foto?', [])),
    reply([P('me_may_photo', '{写真|しゃしん} ^を {撮|と}っても いい です ^か。', 'May I take a photo?', '¿Puedo hacer una foto?', [])], [P('me_must_run', '{走|はし}らなければ なりません。', 'I have to run.', 'Tengo que correr.', [])]),
    say(P('kai_good', 'よろしい！ {安全|あんぜん} ^が {一番|いちばん} です。', 'Very good! Safety comes first.', '¡Muy bien! La seguridad es lo primero.', ['anzen']), 'happy'),
  ]),
  C('h3_pen', [
    say(P('pen_timetable', '{新|あたら}しい {時刻表|じこくひょう} ^が できました！ {見|み}て ください。', 'The new timetable is ready! Take a look.', '¡Ya está el nuevo horario! Échale un vistazo.', ['jikokuhyou']), 'happy'),
    narrate('Ferry: departs 9:00 → arrives at the island 10:30. Last ferry back: 17:00.', 'Ferry: sale a las 9:00 → llega a la isla a las 10:30. Último ferry de vuelta: 17:00.', 'フェリー：9時出発 → 10時半に島に到着。帰りの最終便：17時。'),
    quiz({ en: 'When is the last ferry back?', es: '¿A qué hora sale el último ferry de vuelta?', ja: '帰りの最終便は何時？' }, ['{午後|ごご} {五時|ごじ}', '{午前|ごぜん} {九時|くじ}', '{十時半|じゅうじはん}']),
    say(P('pen_late', 'ぼく ^は いつも {遅|おく}れちゃう ^んです。 {遅|おく}れちゃ だめ ^です ^よ ^ね…', 'I\'m always late. I shouldn\'t be late, right…', 'Siempre llego tarde. No debería llegar tarde, ¿verdad…?', ['okureru']), 'sad'),
    reply([P('me_dont_hurry', '{大丈夫|だいじょうぶ}。 {早|はや}く {出|で}れば、 {急|いそ}がなくても いい です ^よ。', 'It\'s OK. If you leave early, you don\'t have to hurry.', 'Tranquilo. Si sales pronto, no hace falta correr.', ['daijoubu', 'hayaku', 'isogu'])], ['h_me_must_run']),
    say(P('pen_thanks', 'そう です ^ね！ ありがとう！', 'You\'re right! Thanks!', '¡Tienes razón! ¡Gracias!', []), 'love'),
  ]),
];

// 4 · Deliveries
const c4 = [
  C('h4_pen', [
    say(P('pen_parcel', 'この {小包|こづつみ} ^を サワさん ^に {届|とど}けて くれません ^か。 ぼく、 また {道|みち} ^に {迷|まよ}いそう で…', 'Could you deliver this parcel to Sawa for me? I think I\'d get lost again…', '¿Podrías llevarle este paquete a Sawa? Creo que me volvería a perder…', ['michi', 'mayou'], 3), 'sad'),
    say(P('pen_way', '{橋|はし} ^を {渡|わた}って、 {角|かど} ^を {右|みぎ} ^に {曲|ま}がる ^と {魚市場|うおいちば} ^が あります。', 'Cross the bridge, turn right at the corner, and you\'ll find the fish market.', 'Cruza el puente, gira a la derecha en la esquina y verás el mercado de pescado.', ['hashi', 'wataru', 'kado', 'magaru', 'ichiba'], 3)),
    quiz({ en: 'Which way is the fish market?', es: '¿Por dónde se va al mercado de pescado?', ja: '魚市場への道は？' }, ['{橋|はし} ^を {渡|わた}って {右|みぎ}', '{橋|はし} ^を {渡|わた}って {左|ひだり}', 'まっすぐ {灯台|とうだい} ^まで']),
    doIt('giveItem', 'h_parcel'),
  ]),
  C('h4_sawa', [
    reply([P('me_parcel_for_you', 'ペンさん ^から {小包|こづつみ} ^を あずかりました。', 'I\'m bringing a parcel from Pen.', 'Te traigo un paquete de Pen.', [])], ['h_me_too_expensive']),
    doIt('takeItem', 'h_parcel'),
    say(P('sawa_gift', 'ありがとう！ これ ^は {妹|いもうと} ^が くれた お{土産|みやげ} ^だ ^よ。', 'Thanks! It\'s a souvenir my little sister sent me.', '¡Gracias! Es un recuerdo que me ha mandado mi hermana.', ['kureru', 'omiyage']), 'love'),
    say(P('sawa_share', 'あなた ^に ^も ひとつ あげる ^ね。 {島|しま} ^の おかし だ ^よ。', 'I\'ll give you one too. They\'re island sweets.', 'Te doy uno a ti también. Son dulces de la isla.', ['ageru', 'shima'])),
    reply([P('me_got_sweet', 'サワさん ^に おかし ^を もらいました。 うれしい です！', 'I got sweets from you, Sawa. I\'m so happy!', '¡Me has dado dulces, Sawa! ¡Qué ilusión!', ['morau'])], [P('me_gave_sweet', 'サワさん ^に おかし ^を あげました。', 'I gave Sawa sweets.', 'Le di dulces a Sawa.', ['ageru'])]),
    doIt('giveCoins', 40),
  ]),
  C('h4_lulu', [
    say(P('lulu_rumor', 'ペンさん ^が {言|い}って いました ^よ。 あなた ^が {手伝|てつだ}って くれた って。', 'Pen was saying you helped him out.', 'Pen dice que le echaste una mano.', ['tetsudau']), 'happy'),
    reply([P('me_pen_taught', 'ペンさん ^が {道|みち} ^を {教|おし}えて くれました。', 'Pen showed me the way.', 'Pen me indicó el camino.', ['michi'])], ['h_me_gave_sweet']),
    say(P('lulu_lunch', 'じゃあ、 お{昼|ひる} ^を {作|つく}って あげます ^ね。', 'Then I\'ll make you lunch.', 'Entonces te preparo la comida.', []), 'love'),
    doIt('giveItem', 'sandwich'),
  ]),
];

// 5 · Storm warning
const c5 = [
  C('h5_kaito', [
    say(P('kai_forecast', '{天気予報|てんきよほう} ^に よる ^と、 {今夜|こんや} ^は {嵐|あらし} ^に なる そう です。', 'According to the forecast, there\'ll be a storm tonight.', 'Según el pronóstico, esta noche habrá tormenta.', ['tenkiyohou', 'arashi'], 3), 'thinking'),
    say(P('kai_think_q', 'フェリー ^は {大丈夫|だいじょうぶ} だ ^と {思|おも}います ^か。', 'Do you think the ferry will be all right?', '¿Crees que el ferry estará bien?', ['daijoubu', 'omou'])),
    reply([P('me_think_danger', '{波|なみ} ^が {高|たか}い ので、 {危|あぶ}ない ^と {思|おも}います。', 'The waves are high, so I think it\'s dangerous.', 'Las olas son altas, así que creo que es peligroso.', ['nami', 'abunai', 'omou'])], [P('me_think_swim', '{泳|およ}ぎ たい ^と {思|おも}います。', 'I think I want to swim.', 'Creo que quiero nadar.', ['omou'])]),
    say(P('kai_decide', 'そう です ^ね。 {今日|きょう} ^は {船|ふね} ^を {出|だ}さない こと ^に {決|き}めました。', 'You\'re right. I\'ve decided not to send out any boats today.', 'Tienes razón. He decidido no sacar los barcos hoy.', ['kimeru', 'fune'], 3)),
    say(P('kai_plan_q', 'あなた ^は {嵐|あらし} ^の {間|あいだ}、 {何|なに} ^を する つもり です ^か。', 'What do you plan to do during the storm?', '¿Qué piensas hacer durante la tormenta?', ['arashi', 'tsumori'])),
    reply([P('me_plan_study', '{道場|どうじょう} ^で {勉強|べんきょう}する つもり です。', 'I plan to study at the dojo.', 'Pienso estudiar en el dojo.', ['tsumori'])], [P('me_plan_boat', '{船|ふね} ^で {島|しま} ^へ {行|い}く つもり です。', 'I plan to take a boat to the island.', 'Pienso ir a la isla en barco.', ['tsumori'])]),
    say(P('kai_good_plan', 'いい {考|かんが}え です。 {明日|あした} ^は {晴|は}れる ^と いい です ^ね。', 'Good idea. I hope it clears up tomorrow.', 'Buena idea. Ojalá mañana despeje.', ['hareru']), 'happy'),
  ]),
  C('h5_nagi', [
    say(P('nagi_storm', '{嵐|あらし} ^の {夜|よる} ^は、 {灯台|とうだい} ^が {一番|いちばん} {大切|たいせつ} ^な ^のに…', 'On stormy nights the lighthouse matters most, and yet…', 'En las noches de tormenta el faro es lo más importante, y sin embargo…', ['arashi', 'toudai'], 3), 'sad'),
    say(P('nagi_after', '{雨|あめ} ^が {止|や}んだら、 いっしょ ^に {部品|ぶひん} ^を {探|さが}そう。', 'When the rain stops, let\'s look for parts together.', 'Cuando pare la lluvia, busquemos piezas juntas.', ['yamu', 'buhin', 'sagasu'])),
    reply([P('me_lets_look', 'はい、 {探|さが}しましょう！ {心配|しんぱい}しないで ください。', 'Yes, let\'s look! Don\'t worry.', '¡Sí, busquemos! No te preocupes.', ['sagasu', 'shinpai'])], ['h_me_think_swim']),
  ]),
];

// 6 · Where's Chapu?
const c6 = [
  C('h6_sawa', [
    say(P('sawa_lost', 'たいへん！ チャプ ^が いない ^の！ {嵐|あらし} ^の {後|あと}、 {外|そと} ^へ {遊|あそ}び ^に {行|い}った みたい…', 'Oh no! Chapu\'s gone! He seems to have gone out to play after the storm…', '¡Ay, no! ¡Chapu no está! Parece que salió a jugar después de la tormenta…', ['arashi', 'asobu'], 3), 'sad'),
    say(P('sawa_looks', '{小|ちい}さい カワウソ で、 {赤|あか}い {貝殻|かいがら} ^を {持|も}って いる ^よ。', 'He\'s a small otter carrying a red seashell.', 'Es una nutria pequeña con una concha roja.', ['kaigara'])),
    reply([P('me_will_find', '{大丈夫|だいじょうぶ}。 {私|わたし} ^が {見|み}つけます。', 'It\'ll be OK. I\'ll find him.', 'Tranquila. Yo lo encontraré.', ['daijoubu', 'mitsukeru'])], ['h_me_plan_boat']),
  ]),
  C('h6_lulu', [
    reply([P('me_chapu_q', 'チャプ ^を {見|み}ません でした ^か。', 'Haven\'t you seen Chapu?', '¿No has visto a Chapu?', [])], ['h_me_pen_taught']),
    say(P('lulu_heard', 'ペンさん ^に よる ^と、 {公園|こうえん} ^の {林|はやし} ^の {方|ほう} ^へ {行|い}った そう です ^よ。', 'According to Pen, he went toward the grove by the park.', 'Según Pen, fue hacia el bosquecillo del parque.', ['hayashi'], 3), 'thinking'),
    say(P('lulu_singing', '{歌|うた}い ながら {歩|ある}いて いた そう です。', 'Apparently he was walking along singing.', 'Dicen que iba caminando y cantando.', []), 'happy'),
    quiz({ en: 'Where did Chapu go?', es: '¿Adónde fue Chapu?', ja: 'チャプはどこへ行った？' }, ['{公園|こうえん} ^の {林|はやし}', '{魚市場|うおいちば}', 'フェリー ^の {上|うえ}']),
  ]),
  C('h6_chapu', [
    say(P('chapu_hi', 'わっ！ だれ？', 'Whoa! Who are you?', '¡Uy! ¿Quién eres?', [], 1), 'surprised'),
    reply([P('me_mom_worried', 'お{母|かあ}さん ^が {心配|しんぱい}して います ^よ。', 'Your mom is worried about you.', 'Tu mamá está preocupada.', ['shinpai'])], ['h_me_live_village']),
    say(P('chapu_shells', 'ごめん… {貝殻|かいがら} ^を {探|さが}したり、 {砂|すな} ^で {遊|あそ}んだり して いた ^の。', 'Sorry… I was looking for shells, playing in the sand and stuff.', 'Perdón… estaba buscando conchas, jugando con la arena y eso.', ['kaigara', 'sagasu', 'suna', 'asobu'], 3), 'sad'),
    say(P('chapu_found', 'でも ね、 {見|み}て！ {光|ひか}る {石|いし} ^を {見|み}つけた ^よ！', 'But look! I found a shiny stone!', '¡Pero mira! ¡He encontrado una piedra que brilla!', ['hikaru', 'mitsukeru']), 'love'),
    narrate('It isn\'t a stone. It\'s a glass lens, the kind used in lighthouses.', 'No es una piedra. Es una lente de cristal, como las de los faros.', 'それは石ではなく、灯台に使うガラスのレンズだった。'),
    doIt('giveItem', 'h_part'),
    doIt('meet', 'chapu'),
  ]),
  C('h6_sawa2', [
    say(P('sawa_relief', 'チャプ！ よかった… {本当|ほんとう} ^に {安心|あんしん}した。', 'Chapu! Thank goodness… I\'m so relieved.', '¡Chapu! Menos mal… Qué alivio.', ['anshin']), 'love'),
    say(P('sawa_thank', 'あなた ^が {見|み}つけて くれた ^んだ ^ね。 ありがとう。', 'You found him for me. Thank you.', 'Tú lo encontraste. Gracias.', ['mitsukeru', 'kureru']), 'love'),
    doIt('giveCoins', 80),
  ]),
];

// 7 · Fixing the light
const c7 = [
  C('h7_nagi', [
    reply([P('me_lens', 'チャプ ^が これ ^を {見|み}つけました。', 'Chapu found this.', 'Chapu encontró esto.', ['mitsukeru'])], ['h_me_lets_look']),
    doIt('takeItem', 'h_part'),
    say(P('nagi_lens', 'これ ^は… {灯台|とうだい} ^の レンズ！ {嵐|あらし} ^で {飛|と}ばされた ^のね。', 'This is… the lighthouse lens! The storm must have blown it away.', 'Esto es… ¡la lente del faro! La tormenta debió de arrastrarla.', ['toudai', 'arashi']), 'surprised'),
    say(P('nagi_can_fix', 'これ ^が あれば、 {直|なお}せる ^と {思|おも}う。 でも {道具|どうぐ} ^が {要|い}る ^の。', 'With this, I think I can fix it. But I need a tool.', 'Con esto creo que puedo arreglarlo. Pero necesito una herramienta.', ['naosu', 'dougu'], 3), 'thinking'),
    say(P('nagi_pen_tool', 'ペンさん ^が {古|ふる}い {道具箱|どうぐばこ} ^を {持|も}って いる はず。 {借|か}りて きて くれる？', 'Pen should have an old toolbox. Could you borrow it for me?', 'Pen debería tener una caja de herramientas vieja. ¿Me la traes?', ['dougu'], 3)),
  ]),
  C('h7_pen', [
    reply([P('me_borrow_tool', '{道具|どうぐ} ^を {貸|か}して くれません ^か。', 'Could you lend me your tools?', '¿Me prestas tus herramientas?', ['dougu', 'kureru'])], ['h_me_chapu_q']),
    say(P('pen_tool', 'もちろん！ {重|おも}い ^けど、 {持|も}てます ^か。', 'Of course! It\'s heavy, but can you carry it?', '¡Claro! Pesa, ¿puedes llevarla?', []), 'happy'),
    reply([P('me_can_carry', 'はい、 {持|も}てます。', 'Yes, I can carry it.', 'Sí, puedo.', ['dekiru'])], [P('me_cant_swim', '{泳|およ}げません。', 'I can\'t swim.', 'No sé nadar.', [])]),
    doIt('giveItem', 'h_tool'),
  ]),
  C('h7_nagi2', [
    doIt('takeItem', 'h_tool'),
    narrate('You climb the lighthouse with Nagi. She fits the lens; you hold the lamp steady.', 'Subes al faro con Nagi. Ella coloca la lente; tú sujetas la lámpara.', 'ナギと灯台をのぼった。ナギがレンズをはめ、あなたはランプを支えた。'),
    say(P('nagi_try', 'さあ、 スイッチ ^を {押|お}して みて。', 'Now, try pressing the switch.', 'A ver, pulsa el interruptor.', [])),
    narrate('Click. A warm beam sweeps across the sea.', 'Clic. Un haz cálido barre el mar.', 'カチッ。あたたかい光が海の上を回った。'),
    say(P('nagi_shines', 'やった！ また {光|ひか}る よう ^に なった！', 'We did it! It shines again!', '¡Lo conseguimos! ¡Vuelve a brillar!', ['hikaru']), 'love'),
    say(P('nagi_you_too', 'あなた ^も、 もう {難|むずか}しい {話|はなし} ^が わかる よう ^に なりました ^ね。', 'And you can understand difficult conversations now, too.', 'Y tú ya entiendes conversaciones difíciles.', ['muzukashii'], 3), 'happy'),
    doIt('giveCoins', 100),
  ]),
];

// 8 · Festival preparations
const c8 = [
  C('h8_kaito', [
    say(P('kai_ferry_ok', '{灯台|とうだい} ^が {明|あか}るく なった ので、 フェリー ^が {来|こ}られます！', 'The lighthouse is bright again, so the ferry can come!', '¡El faro vuelve a dar luz, así que el ferry puede venir!', ['toudai', 'akarui', 'ferii']), 'happy'),
    say(P('kai_festival', '{土曜日|どようび} ^に お{祭|まつ}り ^を します。 みんな ^を {誘|さそ}って くれます ^か。', 'We\'ll hold the festival on Saturday. Will you invite everyone?', 'Haremos la fiesta el sábado. ¿Invitarás a todos?', ['sasou'])),
    reply([P('me_will_invite', 'はい、 みんな ^を {誘|さそ}います！', 'Yes, I\'ll invite everyone!', '¡Sí, los invitaré a todos!', ['sasou'])], ['h_me_cant_swim']),
  ]),
  C('h8_sawa', [
    reply([P('me_invite_sat', '{土曜日|どようび} ^の お{祭|まつ}り ^に {来|き}ません ^か。', 'Won\'t you come to the festival on Saturday?', '¿Por qué no vienes a la fiesta del sábado?', [])], ['h_me_borrow_tool']),
    say(P('sawa_yes', '{行|い}く {行|い}く！ {花火|はなび} ^も ある し、 チャプ ^も {楽|たの}しみ ^に して いる し！', 'I\'ll go! There\'ll be fireworks, and Chapu\'s looking forward to it too!', '¡Iré! ¡Habrá fuegos artificiales y Chapu está muy ilusionado!', ['hanabi', 'tanoshimi'], 3), 'love'),
  ]),
  C('h8_pen', [
    reply(['h_me_invite_sat'], ['h_me_can_carry']),
    say(P('pen_busy', '{残念|ざんねん}… その {日|ひ} ^は {手紙|てがみ} ^が {多|おお}い ので、 {忙|いそが}しい ^んです。', 'What a shame… I\'ve lots of letters that day, so I\'m busy.', 'Qué pena… Ese día tengo muchas cartas, así que estoy ocupado.', ['zannen', 'ooi']), 'sad'),
    say(P('pen_if_done', 'でも、 {仕事|しごと} ^が {早|はや}く {終|お}わったら、 {行|い}きます！', 'But if I finish work early, I\'ll come!', '¡Pero si termino pronto, iré!', ['hayaku']), 'happy'),
    quiz({ en: 'Will Pen come to the festival?', es: '¿Irá Pen a la fiesta?', ja: 'ペンはお祭りに来る？' }, ['{仕事|しごと} ^が {早|はや}く {終|お}わったら {来|く}る', 'ぜったい {来|こ}ない', '{朝|あさ} ^だけ {来|く}る']),
  ]),
  C('h8_lulu', [
    reply(['h_me_invite_sat'], ['h_me_gave_sweet']),
    say(P('lulu_cook', 'もちろん！ みんな ^が {集|あつ}まる ^なら、 たくさん {料理|りょうり} ^を {準備|じゅんび}しなきゃ！', 'Of course! If everyone\'s gathering, I\'ve got to prepare lots of food!', '¡Claro! Si nos reunimos todos, ¡tengo que preparar mucha comida!', ['atsumaru', 'junbi']), 'love'),
  ]),
  C('h8_nagi', [
    say(P('nagi_ready_q', 'お{祭|まつ}り ^の {準備|じゅんび} ^は どう？', 'How are the festival preparations going?', '¿Qué tal los preparativos de la fiesta?', ['junbi'])),
    reply([P('me_all_invited', 'みんな ^を {誘|さそ}いました。 {準備|じゅんび} ^が できました！', 'I\'ve invited everyone. We\'re ready!', '¡He invitado a todos! ¡Ya está todo listo!', ['sasou', 'junbi'])], ['h_me_plan_boat']),
    say(P('nagi_exam', 'それなら、 {最後|さいご} ^に {港|みなと} ^の {試験|しけん} ^を {受|う}けて。 {合格|ごうかく}したら、 {港|みなと} ^の {鐘|かね} ^を {鳴|な}らす {役|やく} ^を あなた ^に お{願|ねが}い します。', 'Then take the Harbor Exam last. If you pass, I\'ll ask you to ring the harbor bell.', 'Entonces, para terminar, haz el Examen del Puerto. Si apruebas, te pediré que toques la campana.', ['kane', 'naru'], 3), 'happy'),
  ]),
];

// 9 · The harbor bell
const finale = [
  C('h9_bell', [
    narrate('Lanterns line the pier. Far out at sea, the first ferry of summer blinks its lights in reply to the lighthouse.', 'Los farolillos bordean el muelle. A lo lejos, el primer ferry del verano parpadea respondiendo al faro.', '桟橋にちょうちんが並ぶ。遠くの海で、夏の最初のフェリーが灯台に光で答えた。'),
    say(P('kai_speak', 'さあ、 あなた ^の ことば ^で みんな ^に {話|はな}して ください。', 'Now, say something to everyone in your own words.', 'Ahora, di algo a todos con tus propias palabras.', [], 2), 'happy'),
    build(P('me_thanks_all', 'みんな ^の おかげ ^で、 {港|みなと} ^が {明|あか}るく なりました。', 'Thanks to everyone, the harbor is bright again.', 'Gracias a todos, el puerto vuelve a brillar.', ['minato', 'akarui'])),
    doIt('ringBell'),
    say(P('kai_rang', '{鐘|かね} ^が {鳴|な}りました！ フェリー ^が {着|つ}きます ^よ！', 'The bell rang! The ferry is arriving!', '¡Ha sonado la campana! ¡Llega el ferry!', ['kane', 'naru', 'tsuku']), 'love'),
  ]),
];

export const HARBOR_CONVOS: Record<string, Step[]> = Object.fromEntries([...c1, ...c2, ...c3, ...c4, ...c5, ...c6, ...c7, ...c8, ...finale]);

// ------------------------------------------------------------------ chapters as quests
export const HARBOR_QUESTS: QuestDef[] = [
  chapter('harbor', 1, '⚓', obj('Welcome to the Harbor', 'Bienvenido al puerto', '港へようこそ'), obj('Meet the harbormaster and learn why the lighthouse is dark.', 'Conoce al capitán y descubre por qué el faro está apagado.', '港長に会って、灯台が暗い理由を聞こう。'), [
    { talk: { kaito: 'h1_kaito' }, objective: obj('Say hello to Harbormaster Kaito', 'Saluda al capitán Kaito', 'カイト港長にあいさつしよう') },
    { talk: { nagi: 'h1_nagi' }, objective: obj('Visit Nagi-sensei at the dojo', 'Visita a la maestra Nagi en el dojo', '道場のナギ先生をたずねよう') },
    { dojo: 'lesson_1', objective: obj('Finish Lesson 1: experiences', 'Termina la Lección 1: experiencias', 'レッスン1：経験') },
    { talk: { pen: 'h1_pen' }, objective: obj('Meet Pen at the post office', 'Conoce a Pen en correos', '郵便局でペンに会おう') },
  ], { coins: 80, xp: 50 }),
  chapter('harbor', 2, '🐟', obj('Market Morning', 'Mañana de mercado', '市場の朝'), obj('Buy fish for Lulu\'s diner.', 'Compra pescado para el comedor de Lulu.', 'ルルの食堂のために魚を買おう。'), [
    { dojo: 'lesson_2', objective: obj('Finish Lesson 2: the fish market', 'Termina la Lección 2: el mercado', 'レッスン2：魚市場') },
    { talk: { sawa: 'h2_sawa' }, objective: obj('Buy fish from Sawa at the market', 'Compra pescado a Sawa en el mercado', '市場でサワから魚を買おう') },
    { talk: { lulu: 'h2_lulu' }, objective: obj('Bring the fish to Lulu\'s diner', 'Lleva el pescado al comedor de Lulu', 'ルルの食堂に魚を届けよう') },
  ], { coins: 90, xp: 55 }),
  chapter('harbor', 3, '⛴️', obj('Ferry Rules', 'Normas del ferry', 'フェリーの規則'), obj('Learn the ferry rules and the new timetable.', 'Aprende las normas del ferry y el nuevo horario.', 'フェリーの規則と新しい時刻表を覚えよう。'), [
    { talk: { kaito: 'h3_kaito' }, objective: obj('Learn the rules from Kaito', 'Aprende las normas con Kaito', 'カイトから規則を聞こう') },
    { dojo: 'lesson_3', objective: obj('Finish Lesson 3: rules and permission', 'Termina la Lección 3: normas y permiso', 'レッスン3：規則と許可') },
    { talk: { pen: 'h3_pen' }, objective: obj('Check the timetable with Pen', 'Mira el horario con Pen', 'ペンと時刻表を見よう') },
  ], { coins: 90, xp: 55 }),
  chapter('harbor', 4, '📦', obj('Special Delivery', 'Entrega especial', '特別配達'), obj('Help Pen deliver a parcel without getting lost.', 'Ayuda a Pen a entregar un paquete sin perderse.', 'ペンの代わりに小包を届けよう。'), [
    { talk: { pen: 'h4_pen' }, objective: obj('Get the parcel from Pen', 'Recoge el paquete de Pen', 'ペンから小包を受け取ろう') },
    { dojo: 'lesson_4', objective: obj('Finish Lesson 4: directions and giving', 'Termina la Lección 4: indicaciones y regalos', 'レッスン4：道案内とあげる・くれる') },
    { talk: { sawa: 'h4_sawa' }, objective: obj('Deliver the parcel to Sawa', 'Entrega el paquete a Sawa', 'サワに小包を届けよう') },
    { talk: { lulu: 'h4_lulu' }, objective: obj('Stop by Lulu\'s diner', 'Pasa por el comedor de Lulu', 'ルルの食堂によろう') },
  ], { coins: 100, xp: 60 }),
  chapter('harbor', 5, '⛈️', obj('Storm Warning', 'Aviso de tormenta', '嵐の注意報'), obj('A storm is coming. Help Kaito decide what to do.', 'Se acerca una tormenta. Ayuda a Kaito a decidir.', '嵐が来る。カイトといっしょに決めよう。'), [
    { dojo: 'lesson_5', objective: obj('Finish Lesson 5: weather and plans', 'Termina la Lección 5: tiempo y planes', 'レッスン5：天気と予定') },
    { talk: { kaito: 'h5_kaito' }, objective: obj('Talk to Kaito about the storm', 'Habla con Kaito de la tormenta', 'カイトと嵐の話をしよう') },
    { talk: { nagi: 'h5_nagi' }, objective: obj('Check on Nagi-sensei', 'Ve a ver a la maestra Nagi', 'ナギ先生のようすを見よう') },
  ], { coins: 100, xp: 60 }),
  chapter('harbor', 6, '🐚', obj('Where\'s Chapu?', '¿Dónde está Chapu?', 'チャプはどこ？'), obj('Chapu wandered off after the storm.', 'Chapu se fue tras la tormenta.', '嵐のあと、チャプがいなくなった。'), [
    { talk: { sawa: 'h6_sawa' }, objective: obj('Talk to Sawa', 'Habla con Sawa', 'サワと話そう') },
    { talk: { lulu: 'h6_lulu' }, objective: obj('Ask Lulu if she\'s heard anything', 'Pregunta a Lulu si sabe algo', 'ルルに聞いてみよう') },
    { dojo: 'lesson_6', objective: obj('Finish Lesson 6: describing and hearsay', 'Termina la Lección 6: descripciones y rumores', 'レッスン6：〜ながら・〜そうだ') },
    { talk: { chapu: 'h6_chapu' }, objective: obj('Find Chapu near the park', 'Encuentra a Chapu cerca del parque', '公園の近くでチャプを見つけよう') },
    { talk: { sawa: 'h6_sawa2' }, objective: obj('Bring Chapu home to Sawa', 'Lleva a Chapu con Sawa', 'チャプをサワのところへ') },
  ], { coins: 120, xp: 70 }),
  chapter('harbor', 7, '💡', obj('Fixing the Light', 'Arreglar la luz', '光を直そう'), obj('Chapu\'s "shiny stone" might save the lighthouse.', 'La "piedra brillante" de Chapu podría salvar el faro.', 'チャプの「光る石」で灯台が直るかも。'), [
    { talk: { nagi: 'h7_nagi' }, objective: obj('Show the lens to Nagi-sensei', 'Enseña la lente a la maestra Nagi', 'ナギ先生にレンズを見せよう') },
    { dojo: 'lesson_7', objective: obj('Finish Lesson 7: can and can\'t', 'Termina la Lección 7: poder', 'レッスン7：可能形') },
    { talk: { pen: 'h7_pen' }, objective: obj('Borrow tools from Pen', 'Pide herramientas a Pen', 'ペンから道具を借りよう') },
    { talk: { nagi: 'h7_nagi2' }, objective: obj('Fix the lighthouse with Nagi', 'Arregla el faro con Nagi', 'ナギと灯台を直そう') },
  ], { coins: 130, xp: 75 }),
  chapter('harbor', 8, '🎆', obj('Festival Preparations', 'Preparativos de la fiesta', 'お祭りの準備'), obj('Invite everyone to the harbor festival.', 'Invita a todos a la fiesta del puerto.', 'みんなを港のお祭りにさそおう。'), [
    { talk: { kaito: 'h8_kaito' }, objective: obj('Talk to Kaito', 'Habla con Kaito', 'カイトと話そう') },
    { dojo: 'lesson_8', objective: obj('Finish Lesson 8: reasons and conditions', 'Termina la Lección 8: razones y condiciones', 'レッスン8：〜ので・〜たら') },
    { talk: { sawa: 'h8_sawa', pen: 'h8_pen', lulu: 'h8_lulu' }, objective: obj('Invite Sawa, Pen and Lulu', 'Invita a Sawa, Pen y Lulu', 'サワ、ペン、ルルをさそおう') },
    { talk: { nagi: 'h8_nagi' }, objective: obj('Tell Nagi-sensei you\'re ready', 'Dile a la maestra Nagi que estás listo', 'ナギ先生に準備ができたと伝えよう') },
  ], { coins: 160, xp: 90 }),
  chapter('harbor', 9, '🔔', obj('The Harbor Bell', 'La campana del puerto', '港の鐘'), obj('Pass the Harbor Exam (80%) and ring the bell for the first ferry.', 'Aprueba el Examen del Puerto (80 %) y toca la campana para el primer ferry.', '港の試験（80%）に合格して、最初のフェリーのために鐘を鳴らそう。'), [
    { dojo: 'exam', objective: obj('Pass the Harbor Exam at the dojo', 'Aprueba el Examen del Puerto en el dojo', '道場で港の試験に合格しよう') },
    { talk: { kaito: 'h9_bell' }, objective: obj('Ring the harbor bell at the festival', 'Toca la campana en la fiesta', 'お祭りで港の鐘を鳴らそう') },
  ], { coins: 320, xp: 220, items: ['sofa'] }),
];
