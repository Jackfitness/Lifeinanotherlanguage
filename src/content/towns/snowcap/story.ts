import type { Phrase } from '../../phrases';
import type { NpcDef } from '../../characters';
import type { QuestDef } from '../../quests';
import type { Step } from '../../dialogues';
import { chapter, storyKit } from '../types';

/**
 * Snowcap Peaks story: "The Year-End Bell". A crack in the old belfry's beam means the bell may
 * stay silent on New Year's Eve. The village argues over repairing or rebuilding, the paper takes
 * sides, a blizzard hits, and two-hundred-year-old blueprints turn up under the library.
 */
export const SNOWCAP_PHRASES: Phrase[] = [];
const { P, say, reply, build, meaning, narrate, quiz, doIt, C, obj } = storyKit(SNOWCAP_PHRASES, 's_', 'n2_');

export const SNOWCAP_NPCS: NpcDef[] = [
  {
    id: 'yuki', species: 'deer', extra: 'bowtie',
    name: { en: 'Chief Yuki', es: 'Alcaldesa Yuki', ja: 'ユキ{村長|そんちょう}' },
    title: { en: 'Chief of Snowcap Village', es: 'Alcaldesa del Pueblo Nevado', ja: '雪山の里の村長' },
    personality: { en: 'Calm, fair and carrying a little too much on her shoulders.', es: 'Serena, justa y con demasiado peso sobre los hombros.', ja: '落ち着いていて公平。少し責任を背負いすぎている。' },
    colors: { main: '#B98A5E', accent: '#7A5A3E', belly: '#F6E8D6', nose: '#3A2A22' },
    voice: { pitch: 210, speed: 0.85 }, favorites: ['tea', 'honey'], likes: ['soup', 'bread'],
    stories: [P('yuki_s1', '{村長|そんちょう} ^に なって {十年|じゅうねん}、 {毎年|まいとし} {除夜|じょや} ^の {鐘|かね} ^を {聞|き}いて きました。', 'In my ten years as chief, I\'ve heard the year-end bell every year.', 'En mis diez años de alcaldesa he oído las campanadas cada año.', ['sonchou', 'joyanokane']), P('yuki_s2', '{責任|せきにん} ^は {重|おも}い ^けれど、 {村|むら} ^の {人|ひと} ^が {好|す}き だ から ^こそ がんばれる ^の。', 'The responsibility is heavy, but I keep going precisely because I love the people here.', 'La responsabilidad pesa, pero sigo precisamente porque quiero a la gente de aquí.', ['sekinin'], 3)],
    routine: [{ from: 0, to: 24, node: 'hall', activity: 'work' }], tint: '#7A5A3E',
  },
  {
    id: 'hou', species: 'owl', extra: 'glasses',
    name: { en: 'Hou-sensei', es: 'Maestro Hou', ja: 'ホウ{先生|せんせい}' },
    title: { en: 'Dojo master and librarian', es: 'Maestro del dojo y bibliotecario', ja: '道場の先生・図書館長' },
    personality: { en: 'Thoughtful and dry-humored. Has read every book in the library twice.', es: 'Reflexivo y de humor seco. Ha leído dos veces cada libro de la biblioteca.', ja: '思慮深くてユーモアがある。図書館の本はすべて二回読んだ。' },
    colors: { main: '#8A7A6A', accent: '#5E5044', belly: '#F2E6D2', nose: '#E9A92A' },
    voice: { pitch: 130, speed: 0.8 }, favorites: ['tea', 'cookie'], likes: ['coffee', 'bread'],
    stories: [P('hou_s1', '{本|ほん} ^は {時間|じかん} ^を {越|こ}えて {話|はな}しかけて くる。', 'Books speak to us across time.', 'Los libros nos hablan a través del tiempo.', []), P('hou_s2', 'ことば ^を {学|まな}ぶ ^とは、 {新|あたら}しい {窓|まど} ^を {開|ひら}く こと ^に ほかならない。', 'To learn a language is nothing other than to open a new window.', 'Aprender un idioma no es otra cosa que abrir una ventana nueva.', [], 3)],
    routine: [{ from: 0, to: 24, node: 'dojo', activity: 'work' }], tint: '#5E5044',
  },
  {
    id: 'momi', species: 'deer', extra: 'apron',
    name: { en: 'Momi', es: 'Momi', ja: 'モミ' },
    title: { en: 'Morning-market grocer', es: 'Tendera del mercado matutino', ja: '朝市の八百屋' },
    personality: { en: 'Practical, quick with numbers, and worried about every yen.', es: 'Práctica, rápida con los números y pendiente de cada yen.', ja: '現実的で計算が速い。一円でも気になる。' },
    colors: { main: '#C9965E', accent: '#8A6448', belly: '#FBEEDC', nose: '#3A2A22' },
    voice: { pitch: 270, speed: 1.15 }, favorites: ['apple', 'carrot'], likes: ['strawberry', 'milk'],
    stories: [P('momi_s1', '{朝市|あさいち} ^は {雪|ゆき} ^の {日|ひ} ^でも {休|やす}みません ^よ。', 'The morning market doesn\'t close even on snowy days.', 'El mercado matutino no cierra ni los días de nieve.', ['asaichi']), P('momi_s2', '{節約|せつやく} ^は {大事|だいじ}。 でも {使|つか}う べき とき ^には {使|つか}う ^の。', 'Saving is important. But when you should spend, you spend.', 'Ahorrar es importante. Pero cuando toca gastar, se gasta.', ['setsuyaku'])],
    routine: [{ from: 0, to: 24, node: 'market', activity: 'work' }], tint: '#8A6448',
  },
  {
    id: 'haku', species: 'owl', extra: 'cap',
    name: { en: 'Haku', es: 'Haku', ja: 'ハク' },
    title: { en: 'Editor of the village paper', es: 'Editor del periódico del pueblo', ja: '村の新聞の編集長' },
    personality: { en: 'A snowy owl who believes in facts, deadlines and very strong coffee.', es: 'Un búho nival que cree en los hechos, los plazos y el café muy cargado.', ja: '事実と締め切りと濃いコーヒーを信じるシロフクロウ。' },
    colors: { main: '#ECEAE6', accent: '#8E8A86', belly: '#FFFFFF', nose: '#3A3E4A' },
    voice: { pitch: 180, speed: 1.1 }, favorites: ['coffee', 'sandwich'], likes: ['tea', 'cookie'],
    stories: [P('haku_s1', '{記事|きじ} ^は {事実|じじつ} ^に {基|もと}づいて {書|か}く。 それ ^が {私|わたし} ^の {信念|しんねん} だ。', 'Articles are written based on facts. That\'s my creed.', 'Los artículos se escriben basándose en hechos. Es mi lema.', ['kiji', 'jijitsu']), P('haku_s2', '{若|わか}い ころ ^は {都会|とかい} ^の {新聞社|しんぶんしゃ} ^に いた ^んだ。', 'When I was young I worked at a city newspaper.', 'De joven trabajé en un periódico de la ciudad.', ['shinbunsha'])],
    routine: [{ from: 0, to: 24, node: 'post', activity: 'work' }], tint: '#8E8A86',
  },
  {
    id: 'koharu', species: 'deer', extra: 'bow',
    name: { en: 'Koharu', es: 'Koharu', ja: 'コハル' },
    title: { en: 'Hot-spring inn owner', es: 'Dueña de la posada termal', ja: '温泉旅館の女将' },
    personality: { en: 'Graceful, warm and quietly stubborn. Everyone ends up talking at her inn.', es: 'Elegante, cálida y discretamente terca. Todo el mundo acaba charlando en su posada.', ja: '上品であたたかく、静かに頑固。みんな最後は彼女の旅館で話す。' },
    colors: { main: '#D9A57A', accent: '#9E6E4E', belly: '#FFF2E4', nose: '#3A2A22' },
    voice: { pitch: 240, speed: 0.95 }, favorites: ['tea', 'cake'], likes: ['honey', 'strawberry'],
    stories: [P('koharu_s1', 'うち ^の {温泉|おんせん} ^は {三百年|さんびゃくねん} {湧|わ}き{続|つづ}けて いる ^の ^よ。', 'Our hot spring has been flowing for three hundred years.', 'Nuestras termas llevan trescientos años manando.', ['onsen']), P('koharu_s2', 'お{客|きゃく}さま ^の {笑顔|えがお} ^が {一番|いちばん} ^の ごほうび です。', 'A guest\'s smile is the best reward.', 'La sonrisa de un huésped es la mejor recompensa.', [])],
    routine: [{ from: 0, to: 24, node: 'kitchen', activity: 'work' }], tint: '#9E6E4E',
  },
  {
    id: 'popo', species: 'owl', extra: 'none',
    name: { en: 'Popo', es: 'Popo', ja: 'ポポ' },
    title: { en: 'Hou\'s little apprentice', es: 'El pequeño aprendiz de Hou', ja: 'ホウの小さな弟子' },
    personality: { en: 'An owlet who reads under the covers and asks "why?" forty times a day.', es: 'Un búho pequeño que lee bajo las sábanas y pregunta "¿por qué?" cuarenta veces al día.', ja: '布団の中で本を読み、一日四十回「なんで？」と聞くひなフクロウ。' },
    colors: { main: '#A8988A', accent: '#6E6054', belly: '#FAF2E6', nose: '#E9A92A' },
    voice: { pitch: 440, speed: 1.25 }, favorites: ['cookie', 'milk'], likes: ['cake', 'apple'],
    stories: [P('popo_s1', 'ぼく、 {図書館|としょかん} ^の {秘密|ひみつ} ^の {部屋|へや} ^を {知|し}って いる ^よ！', 'I know a secret room in the library!', '¡Conozco una habitación secreta de la biblioteca!', ['toshokan']), P('popo_s2', 'いつか ホウ{先生|せんせい} ^みたいに、 {何|なん} ^でも {知|し}って いる フクロウ ^に なりたい。', 'Someday I want to be an owl who knows everything, like Hou-sensei.', 'Algún día quiero ser un búho que lo sabe todo, como el maestro Hou.', [])],
    routine: [{ from: 0, to: 24, node: 'park', activity: 'stroll' }], tint: '#6E6054', scale: 0.7,
  },
];

// ------------------------------------------------------------------ chapter dialogue
// 1 · A crack in the belfry
const c1 = [
  C('s1_yuki', [
    say(P('yuki_hello', 'まあ…！ この {雪|ゆき} ^の {中|なか}、 よく いらっしゃいました。', 'Oh my…! Welcome, all the way out here in this snow.', '¡Vaya…! Bienvenido, con toda esta nieve.', [], 1), 'surprised'),
    say(P('yuki_im', 'ユキ ^と {申|もう}します。 この {里|さと} ^の {村長|そんちょう} ^を {務|つと}めて おります。', 'My name is Yuki. I serve as chief of this village.', 'Me llamo Yuki. Soy la alcaldesa de este pueblo.', ['sonchou']), 'happy'),
    say(P('yuki_crack', '{実|じつ} ^は {先週|せんしゅう}、 {鐘楼|しょうろう} ^の {梁|はり} ^に ひび ^が {見|み}つかった ^のです。', 'Actually, last week a crack was found in the belfry\'s beam.', 'La verdad es que la semana pasada encontramos una grieta en la viga del campanario.', ['shourou', 'hari', 'hibi'], 3), 'sad'),
    say(P('yuki_cant_leave', '{大晦日|おおみそか} ^まで ひと{月|つき}。 このまま {放置|ほうち}する わけ ^には いきません。', 'New Year\'s Eve is a month away. We can\'t just leave it like this.', 'Falta un mes para Nochevieja. No podemos dejarlo así.', ['oomisoka', 'houchi'], 3), 'thinking'),
    meaning('s_yuki_cant_leave'),
    say(P('yuki_q', 'あなた ^なら、 どう {思|おも}います ^か。', 'What would you think?', '¿Tú qué opinas?', [])),
    reply([P('me_must_repair', '{危険|きけん} ^なら、 {修理|しゅうり}せざる ^を {得|え}ない ^と {思|おも}います。', 'If it\'s dangerous, I think there\'s no choice but to repair it.', 'Si es peligroso, creo que no queda más remedio que repararlo.', ['shuuri', 'kiken'])], [P('me_ignore', '{放置|ほうち}しても かまわない ^と {思|おも}います。', 'I think it\'s fine to leave it.', 'Creo que da igual dejarlo así.', ['houchi'])]),
    say(P('yuki_hou', '{道場|どうじょう} ^の ホウ{先生|せんせい} ^は {物知|ものし}り です。 ぜひ {会|あ}って ください。', 'Hou-sensei at the dojo knows a great deal. Please go and see him.', 'El maestro Hou del dojo sabe muchísimo. Ve a verle, por favor.', [])),
    doIt('meet', 'yuki'),
  ]),
  C('s1_hou', [
    say(P('hou_hello', 'ほう… {珍|めずら}しい。 {雪国|ゆきぐに} ^に {旅人|たびびと} ^とは。', 'Hoo… how rare. A traveler in snow country.', 'Vaya… qué raro. Un viajero en tierra de nieve.', ['yukiguni'], 1), 'surprised'),
    say(P('hou_im', 'ホウ だ。 {道場|どうじょう} ^と {図書館|としょかん} ^を {預|あず}かって いる。', 'I\'m Hou. I look after the dojo and the library.', 'Soy Hou. Me encargo del dojo y de la biblioteca.', ['toshokan'])),
    say(P('hou_can_q', '{君|きみ} ^は、 {難|むずか}しい {日本語|にほんご} ^も {読|よ}める ^のかね？', 'Can you read difficult Japanese too?', '¿Sabes leer también japonés difícil?', [])),
    reply([P('me_cant_not', '{読|よ}めない こと ^は ない ^です ^が、 まだ {時間|じかん} ^が かかります。', 'It\'s not that I can\'t, but it still takes me time.', 'No es que no sepa, pero aún me cuesta.', [])], [P('me_perfect', '{完璧|かんぺき} ^に {読|よ}めます。', 'I can read it perfectly.', 'Lo leo perfectamente.', [])]),
    say(P('hou_honest', '{正直|しょうじき} で よろしい。 では、 {一緒|いっしょ} ^に {学|まな}ぼう。 {鐘楼|しょうろう} ^の {謎|なぞ} ^も な。', 'Honest, good. Then let\'s learn together, and look into the belfry too.', 'Sincero, bien. Entonces aprendamos juntos, y también lo del campanario.', ['shourou'], 3), 'happy'),
    build('s_me_cant_not'),
    doIt('meet', 'hou'),
  ]),
];

// 2 · The village paper
const c2 = [
  C('s2_haku', [
    say(P('haku_hello', 'おっと、 {締|し}め{切|き}り {前|まえ} ^で {忙|いそが}しい ^んだ。 …{君|きみ} ^が うわさ ^の {旅人|たびびと} ^か！', 'Whoa, I\'m busy before the deadline. …Oh, you\'re the traveler everyone\'s talking about!', 'Uy, estoy liado antes del cierre. …¡Ah, eres el viajero del que todos hablan!', [], 2), 'surprised'),
    say(P('haku_survey', '{住民|じゅうみん} {百人|ひゃくにん} ^に {調査|ちょうさ} ^を した。 その {結果|けっか} ^に {基|もと}づいて {記事|きじ} ^を {書|か}いて いる ところ だ。', 'I surveyed a hundred residents. I\'m writing an article based on the results.', 'Hice una encuesta a cien vecinos. Estoy escribiendo un artículo basado en los resultados.', ['chousa', 'kekka', 'kiji'], 3), 'thinking'),
    narrate('Survey: repair the belfry 60% · rebuild it new 30% · undecided 10%.', 'Encuesta: reparar el campanario 60 % · construir uno nuevo 30 % · indecisos 10 %.', '調査：修理 60％・建て直し 30％・未定 10％'),
    quiz({ en: 'What did most residents choose?', es: '¿Qué eligió la mayoría?', ja: 'いちばん多かった意見は？' }, ['{修理|しゅうり}', '{建|た}て{直|なお}し', '{未定|みてい}']),
    say(P('haku_trigger', '{去年|きょねん} ^の {雪崩|なだれ} ^を きっかけ ^に、 {安全|あんぜん} ^を {心配|しんぱい}する {人|ひと} ^が {増|ふ}えた ^んだ。', 'Since last year\'s avalanche, more people worry about safety.', 'A raíz del alud del año pasado, hay más gente preocupada por la seguridad.', ['kikkake'], 3)),
    reply([P('me_based_facts', '{事実|じじつ} ^に {基|もと}づいた {記事|きじ} ^なら、 みんな ^も {納得|なっとく}する ^と {思|おも}います。', 'If the article is based on facts, I think everyone will be convinced.', 'Si el artículo se basa en hechos, creo que todos quedarán convencidos.', ['jijitsu', 'kiji', 'nattoku'])], [P('me_make_up', '{面白|おもしろ}く なる よう ^に {結果|けっか} ^を {変|か}えましょう。', 'Let\'s change the results to make it more interesting.', 'Cambiemos los resultados para que sea más interesante.', ['kekka'])]),
    say(P('haku_draft', 'その {通|とお}り。 この {原稿|げんこう} ^を {村長|そんちょう} ^に {届|とど}けて くれない ^か。', 'Exactly. Could you take this draft to the chief?', 'Exacto. ¿Puedes llevarle este borrador a la alcaldesa?', ['sonchou']), 'happy'),
    doIt('giveItem', 's_draft'),
    doIt('meet', 'haku'),
  ]),
  C('s2_yuki', [
    reply([P('me_deliver_draft', 'ハクさん ^から {記事|きじ} ^の {原稿|げんこう} ^を {預|あず}かって きました。', 'I\'m bringing an article draft from Haku.', 'Te traigo el borrador del artículo de Haku.', ['kiji'])], ['s_me_ignore']),
    doIt('takeItem', 's_draft'),
    say(P('yuki_read', '{六割|ろくわり} ^が {修理|しゅうり} ^に {賛成|さんせい}… {住民|じゅうみん} ^の {意見|いけん} ^が {変|か}わり つつ ある ^のね。', 'Sixty percent in favor of repair… The residents\' views are shifting.', 'Un sesenta por ciento a favor de reparar… La opinión de los vecinos está cambiando.', ['sansei', 'juumin'], 3), 'thinking'),
    say(P('yuki_meeting', '{旅館|りょかん} ^で {村|むら} ^の {会議|かいぎ} ^を {開|ひら}きましょう。 あなた ^も {来|き}て ください。', 'Let\'s hold a village meeting at the inn. Please come too.', 'Celebremos una reunión del pueblo en la posada. Ven tú también.', ['ryokan', 'kaigi'])),
    doIt('giveCoins', 80),
  ]),
];

// 3 · The meeting at the inn
const c3 = [
  C('s3_koharu', [
    say(P('koharu_hello', 'あら、 ようこそ {雪月|ゆきづき} {旅館|りょかん} ^へ。 {女将|おかみ} ^の コハル です。', 'Oh, welcome to the Snowmoon Inn. I\'m Koharu, the owner.', 'Oh, bienvenido a la posada Lunanieve. Soy Koharu, la dueña.', ['ryokan', 'okami'], 2), 'surprised'),
    say(P('koharu_storm', '{吹雪|ふぶき} ^にも かかわらず、 こんな ^に {大勢|おおぜい} {集|あつ}まって くださって…', 'Despite the blizzard, so many people have come…', 'Pese a la ventisca, ha venido muchísima gente…', ['fubuki'], 3), 'happy'),
    narrate('The meeting goes on for three hours. Some want to repair the old belfry, others to build a new steel one. No one agrees.', 'La reunión dura tres horas. Unos quieren reparar el viejo campanario; otros, construir uno nuevo de acero. Nadie se pone de acuerdo.', '会議は三時間続いた。古い鐘楼を直したい人、鉄で新しく建てたい人。意見はまとまらない。'),
    say(P('koharu_no_end', '{話|はな}し{合|あ}った もの ^の、 {結論|けつろん} ^は {出|で}ません でした ^ね。', 'We talked it through, but no conclusion was reached.', 'Lo hemos hablado, pero no se ha llegado a ninguna conclusión.', ['ketsuron'], 3), 'sad'),
    say(P('koharu_view_q', 'あなた ^は どちら ^に {賛成|さんせい} です ^か。', 'Which side are you on?', '¿A favor de qué estás tú?', ['sansei'])),
    reply([P('me_old_precious', '{古|ふる}い から ^こそ {大切|たいせつ} ^に したい。 {修理|しゅうり} ^に {賛成|さんせい} です。', 'Precisely because it\'s old, I want to cherish it. I\'m for repairing it.', 'Precisamente porque es antiguo, quiero cuidarlo. Estoy a favor de repararlo.', ['shuuri', 'sansei'])], [P('me_dont_care', 'どちら ^でも {興味|きょうみ} ^が ありません。', 'I\'m not interested either way.', 'Me da igual una cosa que la otra.', ['kyoumi'])]),
    say(P('koharu_agree', '{私|わたし} ^も です。 {意見|いけん} ^が {違|ちが}う から ^こそ、 {話|はな}し{合|あ}い ^を {続|つづ}けましょう。', 'Me too. It\'s precisely because we disagree that we should keep talking.', 'Yo también. Precisamente porque no estamos de acuerdo, sigamos hablando.', [], 3), 'love'),
    doIt('meet', 'koharu'),
  ]),
  C('s3_hou', [
    reply([P('me_meeting_report', '{会議|かいぎ} ^では {意見|いけん} ^が {対立|たいりつ}して、 {結論|けつろん} ^が {出|で}ません でした。', 'At the meeting opinions clashed and there was no conclusion.', 'En la reunión hubo enfrentamiento y no se llegó a ninguna conclusión.', ['kaigi', 'tairitsu', 'ketsuron'])], ['s_me_dont_care']),
    say(P('hou_records', 'ふむ。 {必要|ひつよう} ^なのは {意見|いけん} ^ではなく、 {記録|きろく} ^かも しれん ^な。', 'Hmm. What we need may not be opinions, but records.', 'Mmm. Puede que lo que necesitemos no sean opiniones, sino registros.', ['kiroku'], 3), 'thinking'),
    say(P('hou_popo', 'ポポ ^が {図書館|としょかん} ^で {何|なに} ^か {見|み}つけた ^と {騒|さわ}いで いた。 {話|はなし} ^を {聞|き}いて みなさい。', 'Popo was making a fuss about finding something in the library. Go and hear him out.', 'Popo andaba alborotado diciendo que encontró algo en la biblioteca. Ve a escucharle.', ['toshokan'], 3)),
  ]),
];

// 4 · The old records
const c4 = [
  C('s4_popo', [
    say(P('popo_hi', 'わあっ！ あ、 あなた ^が {旅人|たびびと} さん？', 'Waah! Oh, are you the traveler?', '¡Uaaa! Ah, ¿eres tú el viajero?', [], 1), 'surprised'),
    say(P('popo_found', '{図書館|としょかん} ^の {地下|ちか} ^で、 {古|ふる}い {紙|かみ} ^を {見|み}つけた ^の！ {字|じ} ^が {難|むずか}しくて {読|よ}めない ^けど…', 'I found old papers in the library basement! The writing\'s too hard for me to read, though…', '¡Encontré papeles viejos en el sótano de la biblioteca! Pero la letra es demasiado difícil…', ['toshokan'], 2), 'happy'),
    narrate('The papers are the original blueprints of the belfry, two hundred years old, along with a carpenter\'s diary.', 'Los papeles son los planos originales del campanario, de hace doscientos años, junto con el diario de un carpintero.', 'それは二百年前の鐘楼の設計図と、大工の日記だった。'),
    reply([P('me_blueprint', 'これ ^は {鐘楼|しょうろう} ^の {設計図|せっけいず} ^どころか、 {大工|だいく} ^の {日記|にっき} ^まで ある！', 'These aren\'t just the belfry blueprints. There\'s even a carpenter\'s diary!', '¡No son solo los planos del campanario! ¡Hasta hay un diario del carpintero!', ['sekkeizu', 'daiku'])], [P('me_just_paper', 'ただ ^の {古|ふる}い {紙|かみ} です ^ね。', 'They\'re just old papers.', 'Son solo papeles viejos.', [])]),
    say(P('popo_proud', 'すごい！ ぼく、 {役|やく} ^に {立|た}った？', 'Amazing! Was I helpful?', '¡Genial! ¿He sido útil?', []), 'love'),
    reply([P('me_popo_great', 'とても {貴重|きちょう} ^な {発見|はっけん} だ ^よ。 ありがとう！', 'It\'s a very valuable discovery. Thank you!', '¡Es un descubrimiento valiosísimo! ¡Gracias!', ['kichou', 'hakken'])], ['s_me_just_paper']),
    doIt('giveItem', 's_blueprint'),
    doIt('meet', 'popo'),
  ]),
  C('s4_hou', [
    reply([P('me_show_blueprint', 'ポポくん ^が {鐘楼|しょうろう} ^の {設計図|せっけいず} ^を {見|み}つけました。', 'Popo found the belfry blueprints.', 'Popo encontró los planos del campanario.', ['sekkeizu'])], ['s_me_meeting_report']),
    say(P('hou_amazing', 'なんと… {釘|くぎ} ^を {一本|いっぽん} ^も {使|つか}わない {伝統的|でんとうてき} ^な {技術|ぎじゅつ} ^だ。', 'Remarkable… A traditional technique that uses not a single nail.', 'Asombroso… Una técnica tradicional que no usa ni un solo clavo.', ['dentouteki', 'gijutsu'], 3), 'surprised'),
    say(P('hou_not_only', 'これ ^が あれ ^ば、 {修理|しゅうり} ^が できる ばかりか、 {昔|むかし} ^より {頑丈|がんじょう} ^に できる。', 'With this, not only can we repair it, we can make it sturdier than before.', 'Con esto no solo podemos repararlo, sino dejarlo más resistente que antes.', ['shuuri', 'ganjou'], 3), 'happy'),
    quiz({ en: 'What is special about the old technique?', es: '¿Qué tiene de especial la técnica antigua?', ja: '昔の技術の特別なところは？' }, ['{釘|くぎ} ^を {使|つか}わない', '{鉄|てつ} ^だけ ^を {使|つか}う', '{雪|ゆき} ^で {作|つく}る']),
  ]),
  C('s4_yuki', [
    reply([P('me_can_repair', '{設計図|せっけいず} ^に {基|もと}づけ ^ば、 {鐘楼|しょうろう} ^を {修理|しゅうり} できます！', 'Based on the blueprints, we can repair the belfry!', '¡Con los planos podemos reparar el campanario!', ['sekkeizu', 'shuuri'])], ['s_me_ignore']),
    doIt('takeItem', 's_blueprint'),
    say(P('yuki_hope', 'これ ^は {村|むら} ^に {限|かぎ}らず、 {雪国|ゆきぐに} {全体|ぜんたい} ^の {宝|たから} です ^わ。', 'This is a treasure not only for our village, but for all of snow country.', 'Esto es un tesoro no solo para el pueblo, sino para toda la tierra de nieve.', ['yukiguni'], 3), 'love'),
    doIt('giveCoins', 100),
  ]),
];

// 5 · Counting the cost
const c5 = [
  C('s5_momi', [
    say(P('momi_hello', 'あら、 {朝市|あさいち} ^へ ようこそ！ モミ です。', 'Oh, welcome to the morning market! I\'m Momi.', '¡Oh, bienvenido al mercado matutino! Soy Momi.', ['asaichi'], 2), 'surprised'),
    say(P('momi_worry', '{修理|しゅうり} ^の {話|はなし} ^は {聞|き}いた ^けど… {費用|ひよう} ^は どう する ^の？ {村|むら} ^の {予算|よさん} ^は {少|すく}ない ^のに。', 'I heard about the repair, but… what about the cost? The village budget is small.', 'He oído lo de la reparación, pero… ¿y el coste? El presupuesto del pueblo es pequeño.', ['hiyou', 'yosan'], 3), 'thinking'),
    narrate('The carpenter\'s estimate: repair costs less than half of rebuilding.', 'Presupuesto del carpintero: reparar cuesta menos de la mitad que reconstruir.', '大工の見積もり：修理の費用は建て直しの半分以下。'),
    say(P('momi_cheap', 'あら、 {工事|こうじ} ^の {大|おお}きさ ^の わり ^に {安|やす}い ^のね！', 'Oh, it\'s cheap considering the size of the job!', '¡Anda, es barato para lo grande que es la obra!', ['kouji'], 3), 'happy'),
    say(P('momi_still', 'でも、 {足|た}りない {分|ぶん} ^は どう する？', 'But what about the shortfall?', 'Pero ¿y lo que falta?', [])),
    reply([P('me_donate', '{寄付|きふ} ^を {集|あつ}める ^のは どう です ^か。 {一人|ひとり} ^で {負担|ふたん}する こと ^は ありません。', 'How about collecting donations? No one has to bear it alone.', '¿Y si recogemos donativos? Nadie tiene que cargar con todo solo.', ['kifu', 'futan'])], [P('me_raise_price', '{朝市|あさいち} ^の {値段|ねだん} ^を {値上|ねあ}げ しましょう。', 'Let\'s raise the prices at the morning market.', 'Subamos los precios del mercado.', ['neage'])]),
    say(P('momi_resolve', 'そう ^ね。 やる から ^には、 {私|わたし} ^も {協力|きょうりょく}する ^わ！', 'You\'re right. Now that we\'re doing it, I\'ll help too!', '¡Tienes razón! ¡Ya que lo hacemos, yo también colaboro!', [], 3), 'love'),
    doIt('meet', 'momi'),
  ]),
  C('s5_koharu', [
    reply([P('me_ask_donation', '{鐘楼|しょうろう} ^の {修理|しゅうり} ^の ために、 {寄付|きふ} ^を {集|あつ}めて います。', 'We\'re collecting donations to repair the belfry.', 'Estamos recogiendo donativos para reparar el campanario.', ['kifu', 'shuuri'])], ['s_me_raise_price']),
    say(P('koharu_donate', 'もちろん！ {旅館|りょかん} ^の {売|う}り{上|あ}げ ^の {一部|いちぶ} ^を {寄付|きふ}します ^わ。', 'Of course! I\'ll donate part of the inn\'s earnings.', '¡Por supuesto! Donaré parte de los ingresos de la posada.', ['ryokan', 'kifu'], 3), 'love'),
    say(P('koharu_no_worry', 'お{金|かね} ^の こと ^で {心配|しんぱい}する こと ^は ない ^わ ^よ。', 'There\'s no need to worry about money.', 'No hace falta preocuparse por el dinero.', [], 3), 'happy'),
    doIt('giveCoins', 90),
  ]),
];

// 6 · The blizzard
const c6 = [
  C('s6_haku', [
    say(P('haku_warning', '{号外|ごうがい} だ！ {今夜|こんや} ^は {大|おお}きな {吹雪|ふぶき} ^に なる おそれ ^が ある。', 'Extra edition! There\'s a risk of a big blizzard tonight.', '¡Edición especial! Esta noche hay riesgo de una gran ventisca.', ['fubuki'], 3), 'surprised'),
    say(P('haku_avalanche', '{北|きた} ^の {斜面|しゃめん} ^では {雪崩|なだれ} ^が {起|お}き かねない。 {鐘楼|しょうろう} ^へ ^の {道|みち} ^も {危険|きけん} だ。', 'Avalanches could well happen on the north slope. The path to the belfry is dangerous too.', 'En la ladera norte podría haber aludes. El camino al campanario también es peligroso.', ['nadare', 'kiken'], 3), 'thinking'),
    quiz({ en: 'Where could avalanches happen?', es: '¿Dónde podría haber aludes?', ja: 'どこで雪崩が起きるかもしれない？' }, ['{北|きた} ^の {斜面|しゃめん}', '{旅館|りょかん} ^の {中|なか}', '{朝市|あさいち}']),
    say(P('haku_popo', 'それ ^なのに、 ポポ ^が 「{鐘楼|しょうろう} ^を {守|まも}る」 ^と {言|い}って {出|で}かけ ^よう ^と して いる ^んだ！', 'And yet Popo is trying to head out, saying he\'ll "protect the belfry"!', '¡Y aun así Popo quiere salir diciendo que va a "proteger el campanario"!', ['shourou'], 3), 'sad'),
  ]),
  C('s6_popo', [
    say(P('popo_go', '{鐘楼|しょうろう} ^が {倒|たお}れ ちゃう ^かも！ ぼく ^が {見|み}に {行|い}く！', 'The belfry might fall down! I\'ll go and check!', '¡El campanario podría caerse! ¡Voy a ir a mirar!', ['shourou']), 'sad'),
    reply([P('me_stop_popo', '{今|いま} {行|い}く ^と {危険|きけん} だ ^よ。 {吹雪|ふぶき} ^が {弱|よわ}まり つつ ある から、 {朝|あさ} ^まで {待|ま}とう。', 'It\'s dangerous to go now. The blizzard is starting to weaken, so let\'s wait till morning.', 'Ahora es peligroso. La ventisca está amainando, así que esperemos a mañana.', ['kiken', 'fubuki'])], [P('me_go_together', 'いっしょ ^に {今|いま} すぐ {行|い}こう！', 'Let\'s go together right now!', '¡Vamos juntos ahora mismo!', [])]),
    say(P('popo_ok', '…うん。 わかった。 {油断|ゆだん}しちゃ だめ ^だ ^よ ^ね。', '…OK. I understand. We mustn\'t get careless, right?', '…Vale. Lo entiendo. No hay que descuidarse, ¿verdad?', ['yuudan'], 2), 'thinking'),
    narrate('That night, the blizzard howls. By dawn it has passed, and the belfry still stands.', 'Esa noche aúlla la ventisca. Al amanecer ha pasado y el campanario sigue en pie.', 'その夜、吹雪がうなった。夜明けには通りすぎ、鐘楼はまだ立っていた。'),
    say(P('popo_thanks', '{止|と}めて くれて ありがとう。 {本当|ほんとう} ^に {助|たす}かった ^よ。', 'Thanks for stopping me. You really saved me.', 'Gracias por pararme. Me salvaste.', ['tasukaru']), 'love'),
  ]),
  C('s6_hou', [
    say(P('hou_thanks', 'ポポ ^を {止|と}めて くれた ^そう だ ^な。 {礼|れい} ^を {言|い}う。', 'I hear you stopped Popo. I thank you.', 'Me han dicho que paraste a Popo. Te lo agradezco.', [], 2), 'love'),
    say(P('hou_nature', '{自然|しぜん} ^の {前|まえ} ^では、 {慎重|しんちょう}すぎる くらい ^が ちょうど いい。', 'Before nature, being almost too careful is just right.', 'Ante la naturaleza, pecar de prudente es lo justo.', ['shizen', 'shinchou'], 3), 'thinking'),
    doIt('giveCoins', 100),
  ]),
];

// 7 · The repair
const c7 = [
  C('s7_yuki', [
    say(P('yuki_start', '{吹雪|ふぶき} ^が {去|さ}りました。 {木材|もくざい} ^が {届|とど}き {次第|しだい}、 {工事|こうじ} ^を {始|はじ}めます。', 'The blizzard has gone. We\'ll start work as soon as the timber arrives.', 'La ventisca se ha ido. Empezaremos las obras en cuanto llegue la madera.', ['mokuzai', 'kouji'], 3), 'happy'),
    say(P('yuki_momi', 'モミさん ^が {木材|もくざい} ^を {手配|てはい}して くれた ^の。 {受|う}け{取|と}って きて くれます ^か。', 'Momi arranged the timber for us. Could you go and collect it?', 'Momi nos ha conseguido la madera. ¿Puedes ir a recogerla?', ['mokuzai'], 3)),
  ]),
  C('s7_momi', [
    reply([P('me_pickup_timber', '{村長|そんちょう} ^に {頼|たの}まれて、 {木材|もくざい} ^を {受|う}け{取|と}りに {来|き}ました。', 'The chief asked me to come and collect the timber.', 'La alcaldesa me ha pedido que venga a por la madera.', ['mokuzai'])], ['s_me_raise_price']),
    say(P('momi_timber', 'はい、 どうぞ！ {雪|ゆき} ^の {量|りょう} ^に {応|おう}じて、 {運|はこ}び{方|かた} ^を {変|か}えて ^ね。 {今日|きょう} ^は ソリ ^が いい ^わ。', 'Here you go! Change how you carry it depending on the snow. Today a sled\'s best.', '¡Aquí tienes! Cambia la forma de llevarla según la nieve. Hoy mejor en trineo.', [], 3), 'happy'),
    doIt('giveItem', 's_timber'),
  ]),
  C('s7_hou', [
    doIt('takeItem', 's_timber'),
    say(P('hou_procedure', '{手順|てじゅん} ^を {確認|かくにん}した {上|うえ} ^で、 {作業|さぎょう} ^に {入|はい}ろう。', 'Let\'s get to work after checking the procedure.', 'Pongámonos manos a la obra tras comprobar el procedimiento.', ['tejun', 'sagyou'], 3), 'thinking'),
    narrate('Following the old blueprints, the carpenters fit new timber into the beam without a single nail. You hold the ropes steady.', 'Siguiendo los planos antiguos, los carpinteros encajan la madera nueva en la viga sin un solo clavo. Tú sujetas las cuerdas.', '古い設計図どおり、大工たちは釘を使わずに新しい木材を梁にはめた。あなたはロープを支えた。'),
    say(P('hou_done', '{完成|かんせい} ^だ。 {昔|むかし} ^より {頑丈|がんじょう} ^に なった。', 'It\'s finished. It\'s sturdier than before.', 'Terminado. Ha quedado más resistente que antes.', ['kansei', 'ganjou']), 'love'),
    reply([P('me_no_words', 'ことば ^では {言|い}い よう ^が ない ^ほど うれしい です。', 'I\'m so happy there are no words for it.', 'Estoy tan contento que no hay palabras.', [])], ['s_me_go_together']),
    doIt('giveCoins', 120),
  ]),
];

// 8 · Year's end
const c8 = [
  C('s8_yuki', [
    say(P('yuki_ready', '{大晦日|おおみそか} ^に {間|ま}に{合|あ}いました。 みなさん ^を {除夜|じょや} ^の {鐘|かね} ^に {誘|さそ}って くれます ^か。', 'We made it in time for New Year\'s Eve. Will you invite everyone to the year-end bell?', 'Hemos llegado a tiempo para Nochevieja. ¿Invitarás a todos a las campanadas?', ['oomisoka', 'joyanokane'], 3), 'happy'),
    reply([P('me_will_invite_all', 'はい、 {必|かなら}ず みんな ^を {誘|さそ}います。', 'Yes, I\'ll be sure to invite everyone.', 'Sí, invitaré a todos sin falta.', ['kanarazu'])], ['s_me_dont_care']),
  ]),
  C('s8_momi', [
    reply([P('me_invite_bell', '{大晦日|おおみそか} ^の {夜|よる}、 {鐘楼|しょうろう} ^に {来|き}て ください。', 'Please come to the belfry on New Year\'s Eve.', 'Ven al campanario en Nochevieja, por favor.', ['oomisoka', 'shourou'])], ['s_me_raise_price']),
    say(P('momi_come', '{行|い}く ^わ！ {忙|いそが}しい {一方|いっぽう} ^で、 {年越|としこ}し ^は {家族|かぞく} ^と {過|す}ごしたい もの。', 'I\'ll come! Busy as I am, I want to see out the year with family.', '¡Iré! Aunque esté liada, quiero despedir el año con la familia.', ['toshikoshi', 'ippou'], 3), 'love'),
  ]),
  C('s8_haku', [
    reply(['s_me_invite_bell'], ['s_me_make_up']),
    say(P('haku_come', '{行|い}こう。 {新聞|しんぶん} ^の {一面|いちめん} ^は {決|き}まり ^だ ^な。 「{鐘|かね}、 {再|ふたた}び {響|ひび}く」！', 'I\'ll come. That settles tomorrow\'s front page: "The bell rings out again"!', 'Iré. Ya tengo la portada: "¡La campana vuelve a sonar!"', ['hibiku'], 3), 'happy'),
  ]),
  C('s8_koharu', [
    reply(['s_me_invite_bell'], ['s_me_ask_donation']),
    say(P('koharu_come', 'ええ、 {鐘|かね} ^の {後|あと} ^は {温泉|おんせん} ^で {年越|としこ}し そば ^を ご{用意|ようい}します ^ね。', 'Yes, and after the bell I\'ll have year-end soba ready at the hot spring.', 'Sí, y después de las campanadas tendré soba de fin de año en las termas.', ['onsen', 'toshikoshi'], 3), 'love'),
  ]),
  C('s8_hou', [
    say(P('hou_ready_q', '{準備|じゅんび} ^は {整|ととの}った ^かね？', 'Is everything ready?', '¿Está todo listo?', [])),
    reply([P('me_all_coming', 'みんな {来|き}て くれる ^そう です！', 'Everyone says they\'ll come!', '¡Dicen que vendrán todos!', [])], ['s_me_perfect']),
    say(P('hou_exam', 'では {最後|さいご} ^に {雪山|ゆきやま} ^の {試験|しけん} ^を {受|う}けなさい。 {合格|ごうかく}すれ ^ば、 {最初|さいしょ} ^の {一打|いちだ} ^は {君|きみ} ^に {任|まか}せよう。', 'Then, lastly, take the Snowcap Exam. If you pass, the first strike of the bell is yours.', 'Entonces, por último, haz el Examen de los Picos Nevados. Si apruebas, la primera campanada será tuya.', [], 3), 'happy'),
  ]),
];

// 9 · The year-end bell
const finale = [
  C('s9_bell', [
    narrate('Snow falls softly on lanterns and steaming hot springs. The whole village waits beneath the mended belfry.', 'La nieve cae suave sobre farolillos y termas humeantes. Todo el pueblo espera bajo el campanario reparado.', '提灯と湯気の立つ温泉に、雪が静かに降る。村じゅうが直った鐘楼の下で待っている。'),
    say(P('yuki_speak', 'さあ、 あなた ^の ことば ^で {新|あたら}しい {年|とし} ^を {迎|むか}えて ください。', 'Now, welcome the new year with your own words.', 'Ahora, recibe el año nuevo con tus propias palabras.', [], 2), 'happy'),
    build(P('me_new_year', 'みんな ^の {絆|きずな} ^に {感謝|かんしゃ}して、 {新|あたら}しい {年|とし} ^を {迎|むか}えます。', 'Grateful for the bonds between us all, I welcome the new year.', 'Agradecido por los lazos que nos unen, recibo el año nuevo.', ['kizuna', 'kansha'])),
    doIt('ringBell'),
    say(P('yuki_rang', '{鐘|かね} ^が {響|ひび}きました！ {明|あ}けまして おめでとう ございます！', 'The bell resounds! Happy New Year!', '¡Resuena la campana! ¡Feliz Año Nuevo!', ['hibiku']), 'love'),
  ]),
];

export const SNOWCAP_CONVOS: Record<string, Step[]> = Object.fromEntries([...c1, ...c2, ...c3, ...c4, ...c5, ...c6, ...c7, ...c8, ...finale]);

export const SNOWCAP_QUESTS: QuestDef[] = [
  chapter('snowcap', 1, '❄️', obj('A Crack in the Belfry', 'Una grieta en el campanario', '鐘楼のひび'), obj('Meet the chief and learn about the cracked beam.', 'Conoce a la alcaldesa y entérate de la viga rota.', '村長に会って、梁のひびのことを聞こう。'), [
    { talk: { yuki: 's1_yuki' }, objective: obj('Greet Chief Yuki', 'Saluda a la alcaldesa Yuki', 'ユキ村長にあいさつしよう') },
    { talk: { hou: 's1_hou' }, objective: obj('Visit Hou-sensei at the dojo', 'Visita al maestro Hou en el dojo', '道場のホウ先生をたずねよう') },
    { dojo: 'lesson_1', objective: obj('Finish Lesson 1: obligation', 'Termina la Lección 1: obligación', 'レッスン1：義務') },
  ], { coins: 100, xp: 70 }),
  chapter('snowcap', 2, '📰', obj('The Village Paper', 'El periódico del pueblo', '村の新聞'), obj('Help Haku publish the survey results.', 'Ayuda a Haku a publicar la encuesta.', 'ハクの調査記事を手伝おう。'), [
    { dojo: 'lesson_2', objective: obj('Finish Lesson 2: basis and change', 'Termina la Lección 2: base y cambio', 'レッスン2：根拠と変化') },
    { talk: { haku: 's2_haku' }, objective: obj('Visit Haku at the newspaper office', 'Visita a Haku en el periódico', '新聞社のハクをたずねよう') },
    { talk: { yuki: 's2_yuki' }, objective: obj('Bring the draft to Chief Yuki', 'Lleva el borrador a la alcaldesa Yuki', 'ユキ村長に原稿を届けよう') },
  ], { coins: 110, xp: 75 }),
  chapter('snowcap', 3, '♨️', obj('The Meeting at the Inn', 'La reunión en la posada', '旅館の会議'), obj('Join the village debate at the hot-spring inn.', 'Únete al debate del pueblo en la posada termal.', '温泉旅館の会議に参加しよう。'), [
    { talk: { koharu: 's3_koharu' }, objective: obj('Join the meeting at Koharu\'s inn', 'Ve a la reunión en la posada de Koharu', 'コハルの旅館の会議に出よう') },
    { dojo: 'lesson_3', objective: obj('Finish Lesson 3: contrast', 'Termina la Lección 3: contraste', 'レッスン3：逆接') },
    { talk: { hou: 's3_hou' }, objective: obj('Tell Hou-sensei how it went', 'Cuéntale al maestro Hou cómo fue', 'ホウ先生に報告しよう') },
  ], { coins: 110, xp: 75 }),
  chapter('snowcap', 4, '📜', obj('The Old Records', 'Los registros antiguos', '古い記録'), obj('Popo found something under the library.', 'Popo encontró algo bajo la biblioteca.', 'ポポが図書館の地下で何かを見つけた。'), [
    { talk: { popo: 's4_popo' }, objective: obj('Talk to Popo near the park', 'Habla con Popo cerca del parque', '公園の近くでポポと話そう') },
    { dojo: 'lesson_4', objective: obj('Finish Lesson 4: not only…', 'Termina la Lección 4: no solo…', 'レッスン4：〜ばかりか・〜どころか') },
    { talk: { hou: 's4_hou' }, objective: obj('Show the blueprints to Hou-sensei', 'Enseña los planos al maestro Hou', 'ホウ先生に設計図を見せよう') },
    { talk: { yuki: 's4_yuki' }, objective: obj('Bring the good news to Chief Yuki', 'Lleva la buena noticia a la alcaldesa Yuki', 'ユキ村長に知らせよう') },
  ], { coins: 120, xp: 80 }),
  chapter('snowcap', 5, '💴', obj('Counting the Cost', 'Hacer cuentas', '費用の計算'), obj('Find a way to pay for the repair.', 'Encuentra cómo pagar la reparación.', '修理の費用をどうするか考えよう。'), [
    { dojo: 'lesson_5', objective: obj('Finish Lesson 5: cost and advice', 'Termina la Lección 5: costes y consejos', 'レッスン5：〜わりに・〜からには') },
    { talk: { momi: 's5_momi' }, objective: obj('Talk to Momi at the morning market', 'Habla con Momi en el mercado matutino', '朝市のモミと話そう') },
    { talk: { koharu: 's5_koharu' }, objective: obj('Ask Koharu for a donation', 'Pide un donativo a Koharu', 'コハルに寄付をお願いしよう') },
  ], { coins: 130, xp: 85 }),
  chapter('snowcap', 6, '🌨️', obj('The Blizzard', 'La ventisca', '吹雪'), obj('A blizzard is coming, and Popo wants to go out in it.', 'Llega una ventisca y Popo quiere salir.', '吹雪が来る。ポポが外へ出ようとしている。'), [
    { talk: { haku: 's6_haku' }, objective: obj('Read Haku\'s extra edition', 'Lee la edición especial de Haku', 'ハクの号外を読もう') },
    { dojo: 'lesson_6', objective: obj('Finish Lesson 6: risk and change', 'Termina la Lección 6: riesgo y cambio', 'レッスン6：〜おそれがある・〜かねない') },
    { talk: { popo: 's6_popo' }, objective: obj('Stop Popo from going out', 'Impide que Popo salga', 'ポポを止めよう') },
    { talk: { hou: 's6_hou' }, objective: obj('Check in with Hou-sensei', 'Ve a ver al maestro Hou', 'ホウ先生のところへ') },
  ], { coins: 140, xp: 90 }),
  chapter('snowcap', 7, '🪵', obj('The Repair', 'La reparación', '修理'), obj('Mend the belfry the old way.', 'Repara el campanario a la antigua.', '昔のやり方で鐘楼を直そう。'), [
    { talk: { yuki: 's7_yuki' }, objective: obj('Talk to Chief Yuki', 'Habla con la alcaldesa Yuki', 'ユキ村長と話そう') },
    { dojo: 'lesson_7', objective: obj('Finish Lesson 7: procedure', 'Termina la Lección 7: procedimiento', 'レッスン7：〜次第・〜上で') },
    { talk: { momi: 's7_momi' }, objective: obj('Collect the timber from Momi', 'Recoge la madera de Momi', 'モミから木材を受け取ろう') },
    { talk: { hou: 's7_hou' }, objective: obj('Repair the belfry with Hou-sensei', 'Repara el campanario con el maestro Hou', 'ホウ先生と鐘楼を直そう') },
  ], { coins: 150, xp: 95 }),
  chapter('snowcap', 8, '🎍', obj('Year\'s End', 'Fin de año', '年の瀬'), obj('Invite everyone to the year-end bell.', 'Invita a todos a las campanadas.', 'みんなを除夜の鐘にさそおう。'), [
    { talk: { yuki: 's8_yuki' }, objective: obj('Talk to Chief Yuki', 'Habla con la alcaldesa Yuki', 'ユキ村長と話そう') },
    { dojo: 'lesson_8', objective: obj('Finish Lesson 8: nuance', 'Termina la Lección 8: matices', 'レッスン8：〜とは限らない・〜一方で') },
    { talk: { momi: 's8_momi', haku: 's8_haku', koharu: 's8_koharu' }, objective: obj('Invite Momi, Haku and Koharu', 'Invita a Momi, Haku y Koharu', 'モミ、ハク、コハルをさそおう') },
    { talk: { hou: 's8_hou' }, objective: obj('Tell Hou-sensei you\'re ready', 'Dile al maestro Hou que estás listo', 'ホウ先生に準備ができたと伝えよう') },
  ], { coins: 180, xp: 100 }),
  chapter('snowcap', 9, '🔔', obj('The Year-End Bell', 'Las campanadas de fin de año', '除夜の鐘'), obj('Pass the Snowcap Exam (80%) and strike the first bell of the new year.', 'Aprueba el Examen de los Picos Nevados (80 %) y da la primera campanada del año.', '雪山の試験（80%）に合格して、新年最初の鐘をつこう。'), [
    { dojo: 'exam', objective: obj('Pass the Snowcap Exam at the dojo', 'Aprueba el Examen de los Picos Nevados en el dojo', '道場で雪山の試験に合格しよう') },
    { talk: { yuki: 's9_bell' }, objective: obj('Ring the year-end bell', 'Toca la campana de fin de año', '除夜の鐘をつこう') },
  ], { coins: 360, xp: 260, items: ['bed'] }),
];
