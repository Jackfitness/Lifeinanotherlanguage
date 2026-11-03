import type { Phrase } from '../../phrases';
import type { NpcDef } from '../../characters';
import type { QuestDef } from '../../quests';
import type { Step } from '../../dialogues';
import { chapter, storyKit } from '../types';

/**
 * Lantern Hills story: "The Thousand Lights". Days before the Festival of a Thousand Lanterns,
 * lanterns start vanishing from the hill paths. The neighbors blame a fox ghost. You follow
 * rumors and clues to little Koro, who has been lighting a path for his grandmother.
 */
export const LANTERN_PHRASES: Phrase[] = [];
const { P, say, reply, build, meaning, narrate, quiz, doIt, C, obj } = storyKit(LANTERN_PHRASES, 'l_', 'n3_');

export const LANTERN_NPCS: NpcDef[] = [
  {
    id: 'kon', species: 'fox', extra: 'bowtie',
    name: { en: 'Elder Kon', es: 'Anciano Kon', ja: 'コン{長老|ちょうろう}' },
    title: { en: 'Elder of Lantern Hills', es: 'Anciano de las Colinas de Faroles', ja: 'ちょうちん丘の長老' },
    personality: { en: 'Wise, slow-talking and fond of old stories. Secretly afraid of the dark.', es: 'Sabio, habla despacio y adora las historias antiguas. En secreto le da miedo la oscuridad.', ja: 'ものしりで、ゆっくり話す。昔話が好き。実は暗いのが苦手。' },
    colors: { main: '#D9823B', accent: '#B5523F', belly: '#FFF4E6', nose: '#3A2A22' },
    voice: { pitch: 150, speed: 0.8 }, favorites: ['tea', 'cake'], likes: ['bread', 'honey'],
    stories: [P('kon_s1', '{千灯祭|せんとうさい} ^は {私|わたし} ^の {祖父|そふ} ^の {時代|じだい} ^から {続|つづ}いて いる。', 'The Thousand Lantern Festival has continued since my grandfather\'s time.', 'El Festival de los Mil Farolillos existe desde la época de mi abuelo.', ['tsuzukeru']), P('kon_s2', '{実|じつ} ^は、 {暗|くら}い ところ ^が {少|すこ}し {怖|こわ}い ^のじゃ。', 'Truth is, I\'m a little afraid of dark places.', 'La verdad es que me dan un poco de miedo los sitios oscuros.', ['kowai'])],
    routine: [{ from: 0, to: 24, node: 'hall', activity: 'work' }], tint: '#B5523F',
  },
  {
    id: 'gin', species: 'fox', extra: 'glasses',
    name: { en: 'Gin-sensei', es: 'Maestra Gin', ja: 'ギン{先生|せんせい}' },
    title: { en: 'Dojo master', es: 'Maestra del dojo', ja: '道場の先生' },
    personality: { en: 'A silver fox with a sharp mind. Doesn\'t believe in ghosts, only in evidence.', es: 'Una zorra plateada de mente aguda. No cree en fantasmas, solo en pruebas.', ja: '頭の切れる銀ギツネ。幽霊は信じない、信じるのは証拠だけ。' },
    colors: { main: '#C9CED6', accent: '#8E96A3', belly: '#FFFFFF', nose: '#3A3E4A' },
    voice: { pitch: 200, speed: 0.9 }, favorites: ['tea', 'trout'], likes: ['cookie', 'strawberry'],
    stories: [P('gin_s1', '{謎|なぞ} ^を {解|と}く ^の ^と ことば ^を {学|まな}ぶ ^の ^は {似|に}て いる ^わ。', 'Solving mysteries and learning words are alike.', 'Resolver misterios y aprender palabras se parecen.', ['nazo']), P('gin_s2', '{証拠|しょうこ} ^さえ あれば、 {何|なに} ^でも {信|しん}じる ^わ ^よ。', 'As long as there\'s evidence, I\'ll believe anything.', 'Con tal de que haya pruebas, me creo lo que sea.', ['shouko', 'shinjiru'], 3)],
    routine: [{ from: 0, to: 24, node: 'dojo', activity: 'work' }], tint: '#8E96A3',
  },
  {
    id: 'poko', species: 'raccoon', extra: 'apron',
    name: { en: 'Poko', es: 'Poko', ja: 'ポコ' },
    title: { en: 'Night-market lantern seller', es: 'Vendedor de farolillos del mercado nocturno', ja: '夜市の提灯屋' },
    personality: { en: 'A born salesman who loves a good haggle. Talks fast, laughs louder.', es: 'Vendedor nato al que le encanta regatear. Habla rápido y ríe aún más fuerte.', ja: '根っからの商売人。値切りの話が大好き。' },
    colors: { main: '#8E8A86', accent: '#3E3A38', belly: '#ECE6DC', nose: '#2A2624' },
    voice: { pitch: 230, speed: 1.25 }, favorites: ['cake', 'apple'], likes: ['coffee', 'crab'],
    stories: [P('poko_s1', '{提灯|ちょうちん} ^は {全部|ぜんぶ} {自分|じぶん} ^で {作|つく}って いる ^んだ ^よ。', 'I make every lantern myself, you know.', 'Hago todos los farolillos yo mismo, ¿sabes?', ['chouchin', 'jibun']), P('poko_s2', '{値引|ねび}き ^は {苦手|にがて} だ ^けど、 {友|とも}だち ^なら {特別|とくべつ} だ！', 'I\'m bad at discounts, but for friends it\'s special!', 'Odio hacer descuentos, ¡pero a los amigos sí!', ['nebiki'])],
    routine: [{ from: 0, to: 24, node: 'market', activity: 'work' }], tint: '#3E3A38',
  },
  {
    id: 'tsune', species: 'fox', extra: 'cap',
    name: { en: 'Tsune', es: 'Tsune', ja: 'ツネ' },
    title: { en: 'Night courier', es: 'Mensajera nocturna', ja: '夜の配達屋' },
    personality: { en: 'Quick, nosy and the source of half the rumors in town.', es: 'Rápida, cotilla y la fuente de la mitad de los rumores del pueblo.', ja: '足が速くて好奇心おうせい。町のうわさの半分はツネから。' },
    colors: { main: '#E3A45E', accent: '#5E6E8E', belly: '#FFF6EA', nose: '#3A2A22' },
    voice: { pitch: 320, speed: 1.35 }, favorites: ['sandwich', 'strawberry'], likes: ['milk', 'cookie'],
    stories: [P('tsune_s1', '{夜|よる} ^の {丘|おか} ^を {走|はし}る ^の ^が {大好|だいす}き！', 'I love running over the hills at night!', '¡Me encanta correr por las colinas de noche!', ['oka', 'yoru']), P('tsune_s2', 'うわさ ^は {半分|はんぶん} ^だけ {信|しん}じて ^ね。', 'Only believe half of the rumors, OK?', 'Créete solo la mitad de los rumores, ¿vale?', ['uwasa', 'shinjiru'])],
    routine: [{ from: 0, to: 24, node: 'post', activity: 'work' }], tint: '#5E6E8E',
  },
  {
    id: 'tama', species: 'raccoon', extra: 'bow',
    name: { en: 'Tama', es: 'Tama', ja: 'タマ' },
    title: { en: 'Ramen shop owner', es: 'Dueña del puesto de ramen', ja: 'ラーメン屋の店長' },
    personality: { en: 'Strict in the kitchen, soft with family. Koro is her nephew; she raised him.', es: 'Estricta en la cocina, tierna con la familia. Crió a su sobrino Koro.', ja: '厨房ではきびしく、家族にはやさしい。甥のコロを育てている。' },
    colors: { main: '#9A8E80', accent: '#4E4640', belly: '#F2EADF', nose: '#2A2624' },
    voice: { pitch: 240, speed: 1.0 }, favorites: ['soup', 'honey'], likes: ['bread', 'milk'],
    stories: [P('tama_s1', 'スープ ^は {三日|みっか} {煮込|にこ}む ^のが {秘密|ひみつ} な ^の。', 'The secret is simmering the soup for three days.', 'El secreto es cocer la sopa tres días.', ['nikomu']), P('tama_s2', 'コロ ^には {厳|きび}しく して いる ^けど、 {本当|ほんとう} ^は {自慢|じまん} ^の {甥|おい} ^よ。', 'I\'m strict with Koro, but honestly I\'m proud of him.', 'Soy estricta con Koro, pero en realidad estoy orgullosa de él.', [], 3)],
    routine: [{ from: 0, to: 24, node: 'kitchen', activity: 'work' }], tint: '#4E4640',
  },
  {
    id: 'koro', species: 'raccoon', extra: 'none',
    name: { en: 'Koro', es: 'Koro', ja: 'コロ' },
    title: { en: 'Tama\'s nephew', es: 'Sobrino de Tama', ja: 'タマの甥' },
    personality: { en: 'Seven years old, shy, stubborn and full of secret plans.', es: 'Tiene siete años; tímido, cabezota y lleno de planes secretos.', ja: '7歳。はずかしがりで頑固、ひみつの計画がいっぱい。' },
    colors: { main: '#A39A90', accent: '#4A4440', belly: '#F4EEE6', nose: '#2A2624' },
    voice: { pitch: 420, speed: 1.25 }, favorites: ['cookie', 'goldfish'], likes: ['cake', 'apple'],
    stories: [P('koro_s1', 'ぼく、 おばあちゃん ^が {大好|だいす}き なんだ。', 'I really love my grandma.', 'Quiero muchísimo a mi abuela.', ['sobo']), P('koro_s2', '{大|おお}きく なったら、 {一番|いちばん} {明|あか}るい {提灯|ちょうちん} ^を {作|つく}る！', 'When I grow up, I\'ll make the brightest lantern ever!', '¡De mayor haré el farolillo más brillante!', ['chouchin'])],
    routine: [{ from: 0, to: 24, node: 'park', activity: 'stroll' }], tint: '#4A4440', scale: 0.72,
  },
];

// ------------------------------------------------------------------ chapter dialogue
// 1 · The thousand lights
const c1 = [
  C('l1_kon', [
    say(P('kon_hello', 'おお…！ {旅|たび} ^の {方|かた} ^か。 {驚|おどろ}いた ^わい。', 'Oh…! A traveler? You startled me.', '¡Oh…! ¿Un viajero? Qué susto.', [], 1), 'surprised'),
    say(P('kon_im', 'わし ^は コン。 この {丘|おか} ^の {長老|ちょうろう} ^じゃ。', 'I am Kon, elder of these hills.', 'Soy Kon, el anciano de estas colinas.', ['oka', 'chourou']), 'happy'),
    say(P('kon_festival', '{来週|らいしゅう} ^は {千灯祭|せんとうさい}。 {千|せん} ^の {提灯|ちょうちん} ^を {灯|とも}す {伝統|でんとう} ^の {祭|まつ}り ^じゃ。', 'Next week is the Thousand Lantern Festival, a tradition where we light a thousand lanterns.', 'La semana que viene es el Festival de los Mil Farolillos, una tradición en la que encendemos mil farolillos.', ['chouchin', 'tomosu', 'dentou'], 3)),
    say(P('kon_problem', 'ところが、 {毎晩|まいばん} {提灯|ちょうちん} ^が {一|ひと}つずつ {消|き}えて しまう ^のじゃ。', 'But every night, lanterns vanish one by one.', 'Pero cada noche desaparecen farolillos, uno a uno.', ['kieru'], 3), 'sad'),
    meaning('l_kon_problem'),
    say(P('kon_goal_q', 'お{主|ぬし} ^は {何|なに} ^を しに {来|き}た ^のか ^な？', 'And what have you come here to do?', '¿Y a qué has venido tú?', [])),
    reply([P('me_came_study', '{日本語|にほんご} ^を {勉強|べんきょう}する ために {来|き}ました。', 'I came to study Japanese.', 'He venido para estudiar japonés.', [])], [P('me_came_ghost', '{幽霊|ゆうれい} ^を {見|み}る こと ^に しました。', 'I\'ve decided to see a ghost.', 'He decidido ver un fantasma.', ['yuurei'])]),
    say(P('kon_gin', 'それ ^なら、 {道場|どうじょう} ^の ギン{先生|せんせい} ^を {訪|たず}ねる ^と よい。', 'In that case, you should visit Gin-sensei at the dojo.', 'En ese caso, deberías visitar a la maestra Gin en el dojo.', [])),
    doIt('meet', 'kon'),
  ]),
  C('l1_gin', [
    say(P('gin_hello', 'あら、 {新|あたら}しい {生徒|せいと} ^かしら。 ギン ^よ。', 'Oh, a new student? I\'m Gin.', 'Vaya, ¿una alumna nueva? Soy Gin.', [], 1), 'surprised'),
    say(P('gin_ghost', '{長老|ちょうろう} ^は {幽霊|ゆうれい} ^の しわざ だ ^と {思|おも}って いる ^けど、 {私|わたし} ^は {信|しん}じない ^わ。', 'The elder thinks it\'s a ghost\'s doing, but I don\'t believe it.', 'El anciano cree que es cosa de un fantasma, pero yo no me lo creo.', ['yuurei', 'shinjiru'], 3), 'thinking'),
    say(P('gin_resolve_q', 'この {丘|おか} ^で、 {何|なに} ^を {目標|もくひょう} ^に する？', 'What will you set as your goal here on the hill?', '¿Qué objetivo te pondrás aquí en la colina?', ['mokuhyou'])),
    reply([P('me_resolve', '{毎日|まいにち} {練習|れんしゅう}する よう ^に します。', 'I\'ll make a point of practicing every day.', 'Procuraré practicar cada día.', [])], [P('me_quit', 'すぐ やめる こと ^に しました。', 'I\'ve decided to quit right away.', 'He decidido dejarlo enseguida.', ['yameru'])]),
    say(P('gin_good', 'いい {心|こころ}がけ ^ね。 {努力|どりょく} ^を {続|つづ}ければ、 {謎|なぞ} ^も ことば ^も {解|と}ける ^わ。', 'Good attitude. If you keep up the effort, you\'ll crack both the mystery and the language.', 'Buena actitud. Si sigues esforzándote, resolverás el misterio y el idioma.', ['doryoku', 'tsuzukeru', 'nazo'], 3), 'happy'),
    build('l_me_resolve'),
    doIt('meet', 'gin'),
  ]),
];

// 2 · The night market
const c2 = [
  C('l2_poko', [
    say(P('poko_hello', 'へい、 らっしゃい！ ポコ ^の {提灯|ちょうちん} ^は {丘|おか} ^で {一番|いちばん} だ ^よ！', 'Hey, welcome! Poko\'s lanterns are the best on the hill!', '¡Eh, bienvenido! ¡Los farolillos de Poko son los mejores de la colina!', ['chouchin'], 2), 'surprised'),
    say(P('poko_need', '{長老|ちょうろう} ^から ^の {注文|ちゅうもん} ^だ ^ね？ {消|き}えた {分|ぶん} ^を {買|か}い{足|た}す ^んだろう？', 'An order from the elder, right? You\'re replacing the ones that vanished?', 'Un encargo del anciano, ¿no? ¿Vas a reponer los que desaparecieron?', ['kieru'], 3)),
    say(P('poko_price', '{一|ひと}つ {八百円|はっぴゃくえん}。 でも {三|みっ}つ ^なら {二千円|にせんえん} ^に して あげる ^よ。', 'They\'re 800 yen each. But for three, I\'ll make it 2,000.', 'Son 800 yenes cada uno. Pero si te llevas tres, te los dejo en 2000.', [], 3), 'happy'),
    quiz({ en: 'How much are three lanterns?', es: '¿Cuánto cuestan tres farolillos?', ja: '提灯三つでいくら？' }, ['{二千円|にせんえん}', '{二千四百円|にせんよんひゃくえん}', '{八百円|はっぴゃくえん}']),
    reply([P('me_haggle', '{三|みっ}つ ^なら お{得|とく} です ^ね。 {全部|ぜんぶ} ください。', 'Three is a good deal. I\'ll take them all.', 'Tres sale a cuenta. Me los llevo.', ['otoku', 'zenbu'])], [P('me_only_red', '{赤|あか}い ^の ^ばかり {買|か}います。', 'I\'ll buy nothing but red ones.', 'Solo compraré rojos.', [])]),
    say(P('poko_sold', 'まいど！ {昨日|きのう} {作|つく}った ばかり ^の {新品|しんぴん} だ ^よ。', 'Thanks! Brand new, I only made them yesterday.', '¡Gracias! Son nuevos, los hice ayer mismo.', []), 'love'),
    doIt('pay', 60),
    doIt('giveItem', 'l_lanterns'),
    doIt('meet', 'poko'),
  ]),
  C('l2_kon', [
    reply([P('me_bought', 'ポコさん ^の {店|みせ} ^で {提灯|ちょうちん} ^を {三|みっ}つ {買|か}って きました。', 'I bought three lanterns at Poko\'s stall.', 'He comprado tres farolillos en el puesto de Poko.', ['chouchin'])], ['l_me_only_red']),
    doIt('takeItem', 'l_lanterns'),
    say(P('kon_thanks', 'ありがたい。 {提灯|ちょうちん} ^さえ {揃|そろ}えば、 {祭|まつ}り ^は {大丈夫|だいじょうぶ} ^じゃ。', 'Much obliged. As long as we have all the lanterns, the festival will be fine.', 'Muy agradecido. Con tal de tener todos los farolillos, el festival saldrá bien.', ['chouchin'], 3), 'happy'),
    doIt('giveCoins', 70),
  ]),
];

// 3 · Rumors
const c3 = [
  C('l3_tsune', [
    say(P('tsune_hello', 'ねえねえ！ {聞|き}いた？ あ、 {初|はじ}めまして、 ツネ だ ^よ！', 'Hey hey! Did you hear? Oh, nice to meet you, I\'m Tsune!', '¡Oye, oye! ¿Te has enterado? Ah, encantada, ¡soy Tsune!', [], 1), 'surprised'),
    say(P('tsune_rumor', '{昨日|きのう} ^の {夜|よる}、 {丘|おか} ^の {上|うえ} ^で {小|ちい}さい {影|かげ} ^を {見|み}た {人|ひと} ^が いる らしい ^よ。', 'Apparently someone saw a small shadow at the top of the hill last night.', 'Al parecer, anoche alguien vio una sombra pequeña en lo alto de la colina.', ['kage'], 3), 'thinking'),
    say(P('tsune_fox', 'みんな 「{狐|きつね} ^の {幽霊|ゆうれい} だ」 って {騒|さわ}いで る ^の。', 'Everyone\'s making a fuss, saying "It\'s a fox ghost."', 'Todos andan alborotados diciendo "Es un zorro fantasma".', ['kitsune', 'yuurei', 'sawagu'], 3)),
    say(P('tsune_think_q', 'あなた ^は どう {思|おも}う？', 'What do you think?', '¿Tú qué opinas?', [])),
    reply([P('me_child_maybe', '{影|かげ} ^が {小|ちい}さい なら、 {子|こ}ども みたい です ^ね。', 'If the shadow was small, it sounds like a child.', 'Si la sombra era pequeña, parece un niño.', ['kage'])], [P('me_ghost_sure', '{幽霊|ゆうれい} ^に {違|ちが}いない ^と {信|しん}じます。', 'I\'m sure it must be a ghost.', 'Estoy seguro de que es un fantasma.', ['yuurei', 'shinjiru'])]),
    say(P('tsune_hmm', 'へえ、 なるほど！ ギン{先生|せんせい} ^みたいな こと ^を {言|い}う ^ね。', 'Huh, I see! You sound just like Gin-sensei.', '¡Anda, ya veo! Hablas como la maestra Gin.', []), 'happy'),
    doIt('meet', 'tsune'),
  ]),
  C('l3_gin', [
    reply([P('me_rumor_report', '{丘|おか} ^の {上|うえ} ^で {小|ちい}さい {影|かげ} ^を {見|み}た ^という うわさ ^を {聞|き}きました。', 'I heard a rumor that a small shadow was seen at the top of the hill.', 'He oído el rumor de que vieron una sombra pequeña en lo alto de la colina.', ['kage', 'uwasa'])], ['l_me_ghost_sure']),
    say(P('gin_interesting', 'おもしろい ^わ ^ね。 {幽霊|ゆうれい} ^に {影|かげ} ^は ない はず ^よ。', 'Interesting. Ghosts shouldn\'t have shadows.', 'Interesante. Los fantasmas no deberían tener sombra.', ['yuurei', 'kage']), 'thinking'),
    say(P('gin_investigate', '{今夜|こんや}、 {一緒|いっしょ} ^に {丘|おか} ^を {調|しら}べましょう。', 'Tonight, let\'s investigate the hill together.', 'Esta noche investiguemos juntos la colina.', ['oka']), 'happy'),
  ]),
];

// 4 · The mystery
const c4 = [
  C('l4_gin', [
    narrate('Under the moon, you find tiny footprints by the empty lantern post.', 'Bajo la luna, encontráis huellas diminutas junto al poste vacío del farolillo.', '月明かりの下、空っぽの提灯の柱のそばに小さな足跡を見つけた。'),
    say(P('gin_footprints', '{見|み}て。 {小|ちい}さい {足跡|あしあと}。 {犯人|はんにん} ^は {子|こ}ども ^に {違|ちが}いない ^わ。', 'Look. Tiny footprints. The culprit must be a child.', 'Mira. Huellas diminutas. El culpable tiene que ser un niño.', ['ashiato', 'hannin'], 3), 'thinking'),
    say(P('gin_where_q', '{足跡|あしあと} ^は どこ ^へ {続|つづ}いて いる？', 'Where do the footprints lead?', '¿Adónde llevan las huellas?', ['ashiato', 'tsuzukeru'])),
    reply([P('me_to_house', '{丘|おか} ^の {上|うえ} ^の {古|ふる}い {家|いえ} ^の {方|ほう} ^へ {続|つづ}いて います。', 'They lead toward the old house at the top of the hill.', 'Llevan hacia la casa vieja de lo alto de la colina.', ['oka', 'tsuzukeru'])], [P('me_to_river', '{川|かわ} ^に {消|き}えて います。', 'They vanish into the river.', 'Desaparecen en el río.', ['kieru'])]),
    say(P('gin_house', 'あそこ ^は タマさん ^の お{母|かあ}さん ^の {家|いえ} ^よ。 {何|なに} ^か {理由|りゆう} ^が ある はず ^ね。', 'That\'s the house of Tama\'s mother. There must be some reason.', 'Esa es la casa de la madre de Tama. Debe de haber alguna razón.', ['riyuu'], 3)),
    doIt('giveItem', 'l_clue'),
  ]),
  C('l4_poko', [
    reply([P('me_show_clue', 'この {足跡|あしあと} ^に ついて {何|なに} ^か {知|し}って います ^か。', 'Do you know anything about these footprints?', '¿Sabes algo de estas huellas?', ['ashiato'])], ['l_me_haggle']),
    say(P('poko_koro', 'う〜ん… そう いえば、 コロ ^が {毎晩|まいばん} {夜市|よいち} ^の {近|ちか}く ^を うろうろ して いる ^な。', 'Hmm… now that you mention it, Koro\'s been hanging around near the night market every night.', 'Mmm… ahora que lo dices, Koro anda rondando el mercado nocturno cada noche.', ['yoichi'], 3), 'thinking'),
    say(P('poko_not_bad', 'でも、 あの {子|こ} ^が {悪|わる}い こと ^を する わけ ^が ない ^よ。', 'But there\'s no way that kid would do something bad.', 'Pero es imposible que ese niño haga algo malo.', [], 3)),
    quiz({ en: 'What does Poko think of Koro?', es: '¿Qué piensa Poko de Koro?', ja: 'ポコはコロのことをどう思っている？' }, ['{悪|わる}い {子|こ} ^じゃ ない', '{犯人|はんにん} ^に {違|ちが}いない', '{幽霊|ゆうれい} だ']),
  ]),
];

// 5 · The ramen shop
const c5 = [
  C('l5_tama', [
    say(P('tama_hello', 'あら、 いらっしゃい！ ちょうど {店|みせ} ^を {開|あ}ける ところ だった ^の。', 'Oh, welcome! I was just about to open the shop.', '¡Oh, bienvenido! Justo iba a abrir.', [], 2), 'surprised'),
    say(P('tama_busy', '{祭|まつ}り ^の {前|まえ} ^に {材料|ざいりょう} ^を {準備|じゅんび}して おかない ^と…', 'I have to get the ingredients ready before the festival…', 'Tengo que dejar listos los ingredientes antes del festival…', ['zairyou']), 'thinking'),
    narrate('A burning smell drifts from the kitchen.', 'Un olor a quemado sale de la cocina.', '厨房からこげたにおいがしてきた。'),
    say(P('tama_burnt', 'あっ！ スープ ^を {焦|こ}がして しまった！', 'Oh no! I\'ve burnt the soup!', '¡Ay, no! ¡Se me ha quemado la sopa!', ['kogasu']), 'sad'),
    reply([P('me_help_cook', '{手伝|てつだ}います。 {何|なに} ^を して おけば いい です ^か。', 'I\'ll help. What should I get ready?', 'Te ayudo. ¿Qué dejo preparado?', [])], [P('me_ate_all', '{全部|ぜんぶ} {食|た}べて しまいました。', 'I ate it all.', 'Me lo he comido todo.', ['zenbu'])]),
    say(P('tama_thanks', 'じゃあ、 {野菜|やさい} ^を {切|き}って おいて。 {私|わたし} ^は {新|あたら}しく スープ ^を {作|つく}る ^わ。', 'Then chop the vegetables for me. I\'ll make a new soup.', 'Entonces córtame la verdura. Yo haré una sopa nueva.', [], 2), 'happy'),
    doIt('meet', 'tama'),
  ]),
  C('l5_tama2', [
    narrate('Together you finish a fresh pot. Tama tastes it and nods.', 'Juntos termináis una olla nueva. Tama la prueba y asiente.', 'いっしょに新しいスープを作った。タマは味見してうなずいた。'),
    reply([P('me_ask_koro', 'コロくん ^は {毎晩|まいばん} どこ ^へ {行|い}って いる ^んですか。', 'Where does Koro go every night?', '¿Adónde va Koro cada noche?', [])], ['l_me_to_river']),
    say(P('tama_koro', '{実|じつ} ^は {私|わたし} ^も {心配|しんぱい} して いた ^の。 {夜|よる}、 みんな ^が {寝|ね}て いる {間|あいだ} ^に {出|で}かけて いる みたい…', 'Actually, I\'ve been worried too. He seems to go out at night while everyone\'s asleep…', 'La verdad es que yo también estaba preocupada. Parece que sale de noche mientras todos duermen…', ['aida'], 3), 'sad'),
    say(P('tama_mother', '{最近|さいきん}、 {母|はは} ^の {目|め} ^が {悪|わる}く なって ^ね。 コロ ^は おばあちゃん っ{子|こ} だ から…', 'Lately my mother\'s eyesight has gotten worse. Koro\'s a real grandma\'s boy…', 'Últimamente mi madre ve peor. Y Koro está muy unido a su abuela…', ['me'], 3), 'thinking'),
    doIt('giveCoins', 80),
  ]),
];

// 6 · Koro's secret
const c6 = [
  C('l6_koro', [
    say(P('koro_hi', 'わっ！ な、 {何|なに}？', 'Whoa! Wh-what?', '¡Uy! ¿Q-qué pasa?', [], 1), 'surprised'),
    reply([P('me_saw_prints', '{丘|おか} ^で {小|ちい}さい {足跡|あしあと} ^を {見|み}つけた ^んだ。', 'I found small footprints on the hill.', 'Encontré unas huellas pequeñas en la colina.', ['ashiato'])], ['l_me_came_ghost']),
    say(P('koro_confess', '…ごめんなさい。 {提灯|ちょうちん} ^を {持|も}って いった ^のは ぼく です。', '…I\'m sorry. I\'m the one who took the lanterns.', '…Lo siento. Fui yo quien se llevó los farolillos.', ['chouchin'], 2), 'sad'),
    say(P('koro_why', 'おばあちゃん ^に {祭|まつ}り ^を {見|み}て ほしかった ^んだ。 でも {夜|よる} ^の {坂道|さかみち} ^は {暗|くら}くて {危|あぶ}ない から…', 'I wanted Grandma to see the festival. But the hill road at night is dark and dangerous…', 'Quería que la abuela viera el festival. Pero la cuesta de noche está oscura y es peligrosa…', ['sakamichi'], 3), 'sad'),
    meaning('l_koro_why'),
    say(P('koro_path', 'ちょっとずつ {提灯|ちょうちん} ^を {集|あつ}めて、 おばあちゃん ^の {家|いえ} ^から ^の {道|みち} ^を {明|あか}るく したかった ^の。', 'I was gathering lanterns bit by bit to light the path from Grandma\'s house.', 'Iba juntando farolillos poco a poco para iluminar el camino desde casa de la abuela.', ['chouchin'], 3)),
    reply([P('me_lets_tell', 'いっしょ ^に タマさん ^に {話|はな}そう。 きっと わかって くれる ^よ。', 'Let\'s tell Tama together. I\'m sure she\'ll understand.', 'Vamos a contárselo juntos a Tama. Seguro que lo entiende.', [])], ['l_me_quit']),
    doIt('meet', 'koro'),
  ]),
  C('l6_tama', [
    say(P('tama_scold', 'コロ！ {夜|よる} {一人|ひとり} ^で {出|で}かけちゃ だめ ^って {言|い}った ^でしょう！', 'Koro! I told you not to go out alone at night!', '¡Koro! ¡Te dije que no salieras solo de noche!', ['shikaru']), 'sad'),
    reply([P('me_forgive', 'コロくん ^は おばあちゃん ^の ために がんばって いた ^んです。 {許|ゆる}して あげて ください。', 'Koro was trying hard for his grandma. Please forgive him.', 'Koro lo hacía por su abuela. Perdónale, por favor.', ['yurusu'])], [P('me_make_clean', 'コロくん ^に {掃除|そうじ} ^を させましょう。', 'Let\'s make Koro do the cleaning.', 'Hagamos que Koro limpie.', ['souji'])]),
    say(P('tama_soft', '…そう だった ^の。 {叱|しか}って ごめん ^ね、 コロ。', '…So that\'s what it was. I\'m sorry I scolded you, Koro.', '…Así que era eso. Perdona por regañarte, Koro.', ['shikaru']), 'thinking'),
    say(P('tama_but', 'でも {提灯|ちょうちん} ^は {長老|ちょうろう} ^に {返|かえ}さなきゃ。 それから、 みんな ^に {協力|きょうりょく}して もらいましょう。', 'But we have to return the lanterns to the elder. And then let\'s ask everyone to help.', 'Pero hay que devolverle los farolillos al anciano. Y luego pediremos ayuda a todos.', ['kyouryoku'], 3), 'happy'),
    doIt('giveItem', 'l_lanterns'),
  ]),
];

// 7 · A path of light
const c7 = [
  C('l7_kon', [
    reply([P('me_return', 'コロくん ^が {提灯|ちょうちん} ^を {返|かえ}しに {来|き}ました。 おばあちゃん ^の ため だった ^んです。', 'Koro came to return the lanterns. It was for his grandma.', 'Koro ha venido a devolver los farolillos. Era por su abuela.', ['chouchin'])], ['l_me_make_clean']),
    doIt('takeItem', 'l_lanterns'),
    say(P('kon_moved', 'なんと… {迷|まよ}った {人|ひと} ^を {家|いえ} ^へ {導|みちび}く。 それ ^こそ {千灯祭|せんとうさい} ^の {心|こころ} ^じゃ。', 'Why… guiding lost people home. That is the very heart of the festival.', 'Vaya… guiar a casa a quien se pierde. Ese es el verdadero espíritu del festival.', ['michibiku'], 3), 'love'),
    say(P('kon_plan', '{暗|くら}く ならない うち ^に、 {坂道|さかみち} ^に {提灯|ちょうちん} ^を {並|なら}べよう。 ツネ ^に {知|し}らせて くれ。', 'Let\'s line the hill road with lanterns before it gets dark. Go tell Tsune.', 'Pongamos farolillos en la cuesta antes de que oscurezca. Avisa a Tsune.', ['sakamichi'], 3)),
  ]),
  C('l7_tsune', [
    reply([P('me_tell_tsune', '{暗|くら}く なる {前|まえ} ^に、 {坂道|さかみち} ^に {提灯|ちょうちん} ^を {並|なら}べる こと ^に なりました。', 'It\'s been decided we\'ll line the hill road with lanterns before dark.', 'Se ha decidido poner farolillos en la cuesta antes de que oscurezca.', ['sakamichi'])], ['l_me_ghost_sure']),
    say(P('tsune_go', 'まかせて！ {町|まち} ^の みんな ^に すぐ {知|し}らせる ^よ！', 'Leave it to me! I\'ll tell everyone in town right away!', '¡Déjamelo a mí! ¡Aviso a todo el pueblo ya mismo!', []), 'happy'),
    narrate('Before the sun sets, the whole town carries lanterns up the slope. The moment it gets dark, the path glows like a river of light.', 'Antes de que se ponga el sol, todo el pueblo sube farolillos por la cuesta. En cuanto oscurece, el camino brilla como un río de luz.', '日が暮れないうちに、町のみんなで坂道に提灯を運んだ。暗くなったとたん、道は光の川のように輝いた。'),
    quiz({ en: 'When did the path start to glow?', es: '¿Cuándo empezó a brillar el camino?', ja: '道はいつ輝いた？' }, ['{暗|くら}く なった とたん', '{朝|あさ} ^に なって から', '{雨|あめ} ^が {降|ふ}って いる {間|あいだ}']),
    doIt('giveCoins', 90),
  ]),
  C('l7_koro', [
    say(P('koro_grandma', 'おばあちゃん ^が ね、 「{星|ほし} ^の {道|みち} ^みたい」 って {言|い}った ^よ！', 'Grandma said, "It\'s like a road of stars!"', '¡La abuela dijo: "Es como un camino de estrellas"!', []), 'love'),
    say(P('koro_thanks', 'ありがとう。 あなた ^が いて くれて よかった。', 'Thank you. I\'m glad you were here.', 'Gracias. Me alegro de que estuvieras aquí.', []), 'love'),
    reply([P('me_proud', 'コロくん ^の {勇気|ゆうき} ^の おかげ だ ^よ。', 'It\'s all thanks to your courage, Koro.', 'Es gracias a tu valentía, Koro.', [])], ['l_me_only_red']),
  ]),
];

// 8 · Festival eve
const c8 = [
  C('l8_kon', [
    say(P('kon_decided', '{今年|ことし} ^の {祭|まつ}り ^は、 コロ ^が {行列|ぎょうれつ} ^の {先頭|せんとう} ^を {歩|ある}く こと ^に なった ^ぞ。', 'It\'s been decided that Koro will lead the procession this year.', 'Se ha decidido que este año Koro encabece el desfile.', ['gyouretsu'], 3), 'happy'),
    say(P('kon_opinion_q', 'お{主|ぬし} ^の {意見|いけん} ^は どう ^じゃ？', 'What\'s your opinion?', '¿Qué opinas tú?', ['iken'])),
    reply([P('me_great_idea', 'すばらしい {考|かんが}え だ ^と {思|おも}います。', 'I think it\'s a wonderful idea.', 'Me parece una idea estupenda.', [])], ['l_me_to_river']),
    say(P('kon_invite', 'では、 みんな ^に {参加|さんか} ^を {呼|よ}びかけて くれる ^か。', 'Then will you call on everyone to take part?', 'Entonces, ¿animarás a todos a participar?', ['sanka'])),
  ]),
  C('l8_poko', [
    reply([P('me_join_fest', '{千灯祭|せんとうさい} ^に {参加|さんか}して くれません ^か。', 'Won\'t you take part in the festival?', '¿Participarás en el festival?', ['sanka'])], ['l_me_haggle']),
    say(P('poko_join', 'もちろん！ {提灯|ちょうちん} ^は {多|おお}けれ ^ば {多|おお}い ほど いい から ^ね。 {特別|とくべつ} ^に {全部|ぜんぶ} {無料|むりょう} だ！', 'Of course! The more lanterns the better, so they\'re all free, just this once!', '¡Claro! Cuantos más farolillos, mejor, ¡así que por esta vez son gratis!', ['zenbu'], 3), 'love'),
  ]),
  C('l8_tsune', [
    reply(['l_me_join_fest'], ['l_me_tell_tsune']),
    say(P('tsune_join', 'うん！ {祭|まつ}り ^に ついて ^の お{知|し}らせ ^は {私|わたし} ^が {配|くば}る ^ね！', 'Yes! I\'ll hand out the festival notices!', '¡Sí! ¡Yo repartiré los avisos del festival!', []), 'happy'),
  ]),
  C('l8_tama', [
    reply(['l_me_join_fest'], ['l_me_ask_koro']),
    say(P('tama_join', '{行列|ぎょうれつ} ^の {後|あと} ^は、 みんな ^に {特製|とくせい} ラーメン ^を {作|つく}って おく ^わ ^ね。', 'After the procession, I\'ll have special ramen ready for everyone.', 'Después del desfile, tendré ramen especial preparado para todos.', ['gyouretsu', 'raamen']), 'love'),
  ]),
  C('l8_gin', [
    say(P('gin_ready_q', '{準備|じゅんび} ^は できた？', 'Are you ready?', '¿Estás lista?', [])),
    reply([P('me_everyone_joins', 'みんな ^が {参加|さんか}して くれる こと ^に なりました！', 'Everyone has agreed to take part!', '¡Todos van a participar!', ['sanka'])], ['l_me_quit']),
    say(P('gin_exam', '{見事|みごと} ^ね。 {最後|さいご} ^に {丘|おか} ^の {試験|しけん} ^を {受|う}けなさい。 {合格|ごうかく}すれ ^ば、 {塔|とう} ^の {鐘|かね} ^を {鳴|な}らす {役|やく} ^は あなた ^よ。', 'Splendid. Finally, take the Hill Exam. If you pass, you\'ll ring the pagoda bell.', 'Espléndido. Por último, haz el Examen de la Colina. Si apruebas, tocarás la campana de la pagoda.', ['tou', 'kane'], 3), 'happy'),
  ]),
];

// 9 · The pagoda bell
const finale = [
  C('l9_bell', [
    narrate('A thousand lanterns glow across the hills. Koro leads the procession, holding his grandmother\'s paw.', 'Mil farolillos brillan por las colinas. Koro encabeza el desfile, de la mano de su abuela.', '千の提灯が丘いっぱいに輝く。コロはおばあちゃんの手を引いて、行列の先頭を歩いた。'),
    say(P('kon_speak', 'さあ、 お{主|ぬし} ^の ことば ^で {祭|まつ}り ^を {始|はじ}めて おくれ。', 'Now, open the festival with your own words.', 'Ahora, inaugura el festival con tus propias palabras.', ['hajimaru'], 2), 'happy'),
    build(P('me_open_fest', '{提灯|ちょうちん} ^の {光|ひかり} ^が、 みんな ^を {家|いえ} ^へ {導|みちび}きます ^よう ^に。', 'May the lanterns\' light guide everyone home.', 'Que la luz de los farolillos guíe a todos a casa.', ['chouchin', 'michibiku'])),
    doIt('ringBell'),
    say(P('kon_rang', '{鐘|かね} ^が {鳴|な}った！ {千灯祭|せんとうさい} ^の {始|はじ}まり ^じゃ！', 'The bell has rung! The Thousand Lantern Festival begins!', '¡Ha sonado la campana! ¡Empieza el Festival de los Mil Farolillos!', ['kane', 'hajimaru']), 'love'),
  ]),
];

export const LANTERN_CONVOS: Record<string, Step[]> = Object.fromEntries([...c1, ...c2, ...c3, ...c4, ...c5, ...c6, ...c7, ...c8, ...finale]);

export const LANTERN_QUESTS: QuestDef[] = [
  chapter('lantern', 1, '🏮', obj('The Thousand Lights', 'Las mil luces', '千の灯り'), obj('Meet the elder and hear about the vanishing lanterns.', 'Conoce al anciano y entérate de los farolillos que desaparecen.', '長老に会って、消える提灯の話を聞こう。'), [
    { talk: { kon: 'l1_kon' }, objective: obj('Greet Elder Kon', 'Saluda al anciano Kon', 'コン長老にあいさつしよう') },
    { talk: { gin: 'l1_gin' }, objective: obj('Visit Gin-sensei at the dojo', 'Visita a la maestra Gin en el dojo', '道場のギン先生をたずねよう') },
    { dojo: 'lesson_1', objective: obj('Finish Lesson 1: decisions and goals', 'Termina la Lección 1: decisiones y objetivos', 'レッスン1：決心と目標') },
  ], { coins: 90, xp: 60 }),
  chapter('lantern', 2, '🛍️', obj('The Night Market', 'El mercado nocturno', '夜市'), obj('Buy replacement lanterns from Poko.', 'Compra farolillos nuevos a Poko.', 'ポコから新しい提灯を買おう。'), [
    { dojo: 'lesson_2', objective: obj('Finish Lesson 2: the night market', 'Termina la Lección 2: el mercado nocturno', 'レッスン2：夜市') },
    { talk: { poko: 'l2_poko' }, objective: obj('Buy lanterns at Poko\'s stall', 'Compra farolillos en el puesto de Poko', 'ポコの屋台で提灯を買おう') },
    { talk: { kon: 'l2_kon' }, objective: obj('Bring the lanterns to Elder Kon', 'Lleva los farolillos al anciano Kon', 'コン長老に提灯を届けよう') },
  ], { coins: 100, xp: 65 }),
  chapter('lantern', 3, '👻', obj('Rumors in the Dark', 'Rumores en la oscuridad', '暗やみのうわさ'), obj('Everyone says a fox ghost is to blame. Is it true?', 'Todos culpan a un zorro fantasma. ¿Será verdad?', 'みんなは狐の幽霊のせいだと言う。本当？'), [
    { talk: { tsune: 'l3_tsune' }, objective: obj('Hear the latest rumor from Tsune', 'Escucha el último rumor de Tsune', 'ツネから最新のうわさを聞こう') },
    { dojo: 'lesson_3', objective: obj('Finish Lesson 3: rumors and impressions', 'Termina la Lección 3: rumores e impresiones', 'レッスン3：うわさと印象') },
    { talk: { gin: 'l3_gin' }, objective: obj('Report to Gin-sensei', 'Informa a la maestra Gin', 'ギン先生に報告しよう') },
  ], { coins: 100, xp: 65 }),
  chapter('lantern', 4, '🔍', obj('Footprints', 'Huellas', '足跡'), obj('Investigate the hill with Gin-sensei.', 'Investiga la colina con la maestra Gin.', 'ギン先生と丘を調べよう。'), [
    { talk: { gin: 'l4_gin' }, objective: obj('Search the hill with Gin-sensei', 'Registra la colina con la maestra Gin', 'ギン先生と丘を調べよう') },
    { dojo: 'lesson_4', objective: obj('Finish Lesson 4: deduction', 'Termina la Lección 4: deducción', 'レッスン4：推理') },
    { talk: { poko: 'l4_poko' }, objective: obj('Ask Poko about the footprints', 'Pregunta a Poko por las huellas', 'ポコに足跡のことを聞こう') },
  ], { coins: 110, xp: 70 }),
  chapter('lantern', 5, '🍜', obj('The Ramen Shop', 'El puesto de ramen', 'ラーメン屋'), obj('Help Tama in the kitchen and learn about Koro.', 'Ayuda a Tama en la cocina y entérate de lo de Koro.', 'タマの厨房を手伝って、コロのことを聞こう。'), [
    { talk: { tama: 'l5_tama' }, objective: obj('Visit Tama\'s ramen shop', 'Visita el ramen de Tama', 'タマのラーメン屋に行こう') },
    { dojo: 'lesson_5', objective: obj('Finish Lesson 5: in the kitchen', 'Termina la Lección 5: en la cocina', 'レッスン5：〜てしまう・〜ておく') },
    { talk: { tama: 'l5_tama2' }, objective: obj('Finish the soup with Tama', 'Termina la sopa con Tama', 'タマとスープを仕上げよう') },
  ], { coins: 110, xp: 70 }),
  chapter('lantern', 6, '🦝', obj('Koro\'s Secret', 'El secreto de Koro', 'コロのひみつ'), obj('Find out why Koro has been taking lanterns.', 'Descubre por qué Koro se lleva los farolillos.', 'コロが提灯を持っていく理由を知ろう。'), [
    { dojo: 'lesson_6', objective: obj('Finish Lesson 6: favors and causatives', 'Termina la Lección 6: favores y causativos', 'レッスン6：使役') },
    { talk: { koro: 'l6_koro' }, objective: obj('Talk to Koro near the park', 'Habla con Koro cerca del parque', '公園の近くでコロと話そう') },
    { talk: { tama: 'l6_tama' }, objective: obj('Tell Tama the truth together', 'Contadle juntos la verdad a Tama', 'いっしょにタマに本当のことを話そう') },
  ], { coins: 130, xp: 75 }),
  chapter('lantern', 7, '✨', obj('A Path of Light', 'Un camino de luz', '光の道'), obj('Light a path for Koro\'s grandmother.', 'Ilumina un camino para la abuela de Koro.', 'コロのおばあちゃんのために道を照らそう。'), [
    { talk: { kon: 'l7_kon' }, objective: obj('Return the lanterns to Elder Kon', 'Devuelve los farolillos al anciano Kon', 'コン長老に提灯を返そう') },
    { dojo: 'lesson_7', objective: obj('Finish Lesson 7: while there\'s time', 'Termina la Lección 7: mientras hay tiempo', 'レッスン7：〜うちに・〜とたん') },
    { talk: { tsune: 'l7_tsune' }, objective: obj('Spread the word with Tsune', 'Corre la voz con Tsune', 'ツネとみんなに知らせよう') },
    { talk: { koro: 'l7_koro' }, objective: obj('See how Koro is doing', 'Ve a ver cómo está Koro', 'コロのようすを見よう') },
  ], { coins: 140, xp: 80 }),
  chapter('lantern', 8, '🎐', obj('Festival Eve', 'Víspera del festival', '祭りの前夜'), obj('Ask everyone to join the festival.', 'Pide a todos que participen en el festival.', 'みんなを祭りにさそおう。'), [
    { talk: { kon: 'l8_kon' }, objective: obj('Talk to Elder Kon', 'Habla con el anciano Kon', 'コン長老と話そう') },
    { dojo: 'lesson_8', objective: obj('Finish Lesson 8: the more, the better', 'Termina la Lección 8: cuanto más, mejor', 'レッスン8：〜ば〜ほど') },
    { talk: { poko: 'l8_poko', tsune: 'l8_tsune', tama: 'l8_tama' }, objective: obj('Invite Poko, Tsune and Tama', 'Invita a Poko, Tsune y Tama', 'ポコ、ツネ、タマをさそおう') },
    { talk: { gin: 'l8_gin' }, objective: obj('Tell Gin-sensei you\'re ready', 'Dile a la maestra Gin que estás listo', 'ギン先生に準備ができたと伝えよう') },
  ], { coins: 170, xp: 95 }),
  chapter('lantern', 9, '🔔', obj('The Pagoda Bell', 'La campana de la pagoda', '塔の鐘'), obj('Pass the Hill Exam (80%) and ring the pagoda bell.', 'Aprueba el Examen de la Colina (80 %) y toca la campana de la pagoda.', '丘の試験（80%）に合格して、塔の鐘を鳴らそう。'), [
    { dojo: 'exam', objective: obj('Pass the Hill Exam at the dojo', 'Aprueba el Examen de la Colina en el dojo', '道場で丘の試験に合格しよう') },
    { talk: { kon: 'l9_bell' }, objective: obj('Ring the pagoda bell', 'Toca la campana de la pagoda', '塔の鐘を鳴らそう') },
  ], { coins: 340, xp: 240, items: ['bookshelf'] }),
];
