import type { Phrase } from '../../phrases';
import type { NpcDef } from '../../characters';
import type { QuestDef } from '../../quests';
import type { Step } from '../../dialogues';
import { chapter, storyKit } from '../types';

/**
 * Starlight City story: "Curtain Call". The century-old Starlight Theater is playing its final
 * season. A storm-defying crowd, a viral review, a burst pipe and a puppy with a big dream turn
 * the last season into a revival, and the tower bell rings for opening night.
 */
export const STARLIGHT_PHRASES: Phrase[] = [];
const { P, say, reply, build, meaning, narrate, quiz, doIt, C, obj } = storyKit(STARLIGHT_PHRASES, 'x_', 'n1_');

export const STARLIGHT_NPCS: NpcDef[] = [
  {
    id: 'kuro', species: 'cat', extra: 'bowtie',
    name: { en: 'Mayor Kuro', es: 'Alcalde Kuro', ja: 'クロ{市長|しちょう}' },
    title: { en: 'Mayor of Starlight City', es: 'Alcalde de Ciudad Estrella', ja: '星あかりの街の市長' },
    personality: { en: 'Elegant, precise and secretly a huge theater fan who knows every play by heart.', es: 'Elegante, preciso y, en secreto, un gran aficionado que se sabe todas las obras de memoria.', ja: '上品で几帳面。実は大の芝居好きで、どの作品もそらで言える。' },
    colors: { main: '#3A3A44', accent: '#8E8A9E', belly: '#F4F0EA', nose: '#E8A0A8' },
    voice: { pitch: 170, speed: 0.85 }, favorites: ['coffee', 'cake'], likes: ['tea', 'trout'],
    stories: [P('kuro_s1', '{子|こ}ども ^の ころ、 {初|はじ}めて {観|み}た {芝居|しばい} ^が {星|ほし}あかり{座|ざ} だった。', 'The first play I ever saw as a child was at the Starlight Theater.', 'La primera obra que vi de niño fue en el Teatro Estrella.', []), P('kuro_s2', '{市長|しちょう} ^と いえども、 {一人|ひとり} ^の {観客|かんきゃく} ^に {過|す}ぎない ^のです。', 'Mayor or not, I am just one member of the audience.', 'Por mucho que sea alcalde, no soy más que un espectador.', ['shichou'], 3)],
    routine: [{ from: 0, to: 24, node: 'hall', activity: 'work' }], tint: '#8E8A9E',
  },
  {
    id: 'shiba', species: 'dog', extra: 'glasses',
    name: { en: 'Shiba-sensei', es: 'Maestro Shiba', ja: 'シバ{先生|せんせい}' },
    title: { en: 'Dojo master and retired playwright', es: 'Maestro del dojo y dramaturgo retirado', ja: '道場の先生・元劇作家' },
    personality: { en: 'Gruff, honest and fiercely loyal. Wrote the theater\'s most famous play forty years ago.', es: 'Brusco, sincero y leal a muerte. Escribió la obra más famosa del teatro hace cuarenta años.', ja: 'ぶっきらぼうで正直、とても義理堅い。四十年前、劇場で一番有名な芝居を書いた。' },
    colors: { main: '#D9A05B', accent: '#B5803E', belly: '#FFF4E4', nose: '#2A2624' },
    voice: { pitch: 140, speed: 0.85 }, favorites: ['tea', 'bread'], likes: ['coffee', 'carp'],
    stories: [P('shiba_s1', 'ことば ^は {削|けず}れ ^ば {削|けず}る ほど {強|つよ}く なる。', 'The more you cut words, the stronger they become.', 'Cuanto más recortas las palabras, más fuerza tienen.', []), P('shiba_s2', 'あの {脚本|きゃくほん} ^は、 {若|わか}い ころ ^の {未熟|みじゅく}さ ^に ほか ならない。', 'That script is nothing but the immaturity of my youth.', 'Aquel guion no es más que la inmadurez de mi juventud.', ['kyakuhon'], 3)],
    routine: [{ from: 0, to: 24, node: 'dojo', activity: 'work' }], tint: '#B5803E',
  },
  {
    id: 'mike', species: 'cat', extra: 'apron',
    name: { en: 'Mike', es: 'Mike', ja: 'ミケ' },
    title: { en: 'Florist at the flower market', es: 'Florista del mercado de flores', ja: '花市場の花屋' },
    personality: { en: 'A calico with a big laugh. Has sent opening-night bouquets to the theater for twenty years.', es: 'Una gata tricolor de risa contagiosa. Lleva veinte años enviando ramos de estreno al teatro.', ja: '笑い声の大きい三毛猫。二十年間、初日の花束を劇場に届けてきた。' },
    colors: { main: '#F4ECE0', accent: '#E08A3C', belly: '#FFFFFF', nose: '#E8A0A8' },
    voice: { pitch: 290, speed: 1.15 }, favorites: ['flower', 'strawberry'], likes: ['honey', 'milk'],
    stories: [P('mike_s1', '{花束|はなたば} ^には、 ことば ^に できない {気持|きも}ち ^を {込|こ}める ^の。', 'In a bouquet, I put feelings that words can\'t hold.', 'En un ramo pongo sentimientos que no caben en palabras.', ['hanataba']), P('mike_s2', '{雨|あめ} ^の {日|ひ} ^も {風|かぜ} ^の {日|ひ} ^も、 {店|みせ} ^は {開|あ}けて きた ^わ。', 'Rain or wind, I\'ve always opened the shop.', 'Llueva o haga viento, siempre he abierto la tienda.', [])],
    routine: [{ from: 0, to: 24, node: 'market', activity: 'work' }], tint: '#E08A3C',
  },
  {
    id: 'pochi', species: 'dog', extra: 'cap',
    name: { en: 'Pochi', es: 'Pochi', ja: 'ポチ' },
    title: { en: 'Editor-in-chief of Starlight Weekly', es: 'Redactor jefe del Semanario Estrella', ja: '週刊星あかりの編集長' },
    personality: { en: 'Excitable, sharp and prone to exaggeration. His headlines can make or break a show.', es: 'Exaltado, agudo y dado a exagerar. Sus titulares pueden hundir o lanzar una obra.', ja: '熱くなりやすく、鋭く、大げさに書きがち。見出し一つで芝居の運命が変わる。' },
    colors: { main: '#F2E6D2', accent: '#8A6448', belly: '#FFFFFF', nose: '#2A2624' },
    voice: { pitch: 250, speed: 1.3 }, favorites: ['coffee', 'sandwich'], likes: ['cookie', 'crab'],
    stories: [P('pochi_s1', '{見出|みだ}し ^は {三秒|さんびょう} ^で {決|き}める。 それ ^が プロ ^だ！', 'A headline is decided in three seconds. That\'s being a pro!', '¡Un titular se decide en tres segundos! ¡Eso es ser profesional!', []), P('pochi_s2', '{大|おお}げさ ^に {書|か}く きらい ^が ある ^って、 よく {言|い}われる ^んだ ^よ ^な。', 'People often say I tend to exaggerate.', 'Me dicen a menudo que tiendo a exagerar.', [], 3)],
    routine: [{ from: 0, to: 24, node: 'post', activity: 'work' }], tint: '#8A6448',
  },
  {
    id: 'leo', species: 'cat', extra: 'none',
    name: { en: 'Leo', es: 'Leo', ja: 'レオ' },
    title: { en: 'Bistro chef', es: 'Chef del bistró', ja: 'ビストロの料理長' },
    personality: { en: 'Quiet, perfectionist and generous. Every actor in the city owes him at least one free dinner.', es: 'Callado, perfeccionista y generoso. Todos los actores de la ciudad le deben al menos una cena gratis.', ja: '無口で完璧主義、でも気前がいい。街の役者はみんな、彼にただ飯の借りがある。' },
    colors: { main: '#E9B872', accent: '#C98A3E', belly: '#FFF6E8', nose: '#E8A0A8' },
    voice: { pitch: 180, speed: 0.9 }, favorites: ['soup', 'trout'], likes: ['bread', 'honey'],
    stories: [P('leo_s1', '{旬|しゅん} ^の {食材|しょくざい} ^しか {使|つか}わない。 それ ^が {僕|ぼく} ^の こだわり ^だ。', 'I only use seasonal ingredients. That\'s my one obsession.', 'Solo uso ingredientes de temporada. Es mi manía.', ['kodawari']), P('leo_s2', '{腹|はら} ^が {減|へ}って いて ^は、 いい {芝居|しばい} ^は できない ^からね。', 'You can\'t act well on an empty stomach.', 'Con el estómago vacío no se puede actuar bien.', [])],
    routine: [{ from: 0, to: 24, node: 'kitchen', activity: 'work' }], tint: '#C98A3E',
  },
  {
    id: 'coco', species: 'dog', extra: 'bow',
    name: { en: 'Coco', es: 'Coco', ja: 'ココ' },
    title: { en: 'Aspiring actress', es: 'Aspirante a actriz', ja: '女優の卵' },
    personality: { en: 'A puppy who practices lines on the bus, in the bath and in her sleep.', es: 'Una cachorra que ensaya sus frases en el autobús, en el baño y en sueños.', ja: 'バスでもお風呂でも寝言でも台詞を練習する子犬。' },
    colors: { main: '#F6E6D0', accent: '#C9A27A', belly: '#FFFFFF', nose: '#2A2624' },
    voice: { pitch: 420, speed: 1.25 }, favorites: ['cookie', 'cake'], likes: ['strawberry', 'milk'],
    stories: [P('coco_s1', 'いつか {星|ほし}あかり{座|ざ} ^の {舞台|ぶたい} ^に {立|た}つ ^のが {夢|ゆめ} なの！', 'My dream is to stand on the Starlight Theater stage someday!', '¡Mi sueño es actuar algún día en el escenario del Teatro Estrella!', ['butai', 'yume']), P('coco_s2', '{緊張|きんちょう}すると、 しっぽ ^が {勝手|かって} ^に {動|うご}いちゃう ^の。', 'When I\'m nervous, my tail wags on its own.', 'Cuando me pongo nerviosa, la cola se me mueve sola.', ['kinchou'])],
    routine: [{ from: 0, to: 24, node: 'park', activity: 'stroll' }], tint: '#C9A27A', scale: 0.74,
  },
];

// ------------------------------------------------------------------ chapter dialogue
// 1 · The last season
const c1 = [
  C('x1_kuro', [
    say(P('kuro_hello', 'おや…！ {失礼|しつれい}、 {見慣|みな}れない {方|かた} ^だった ^もの ^で。', 'Oh…! Pardon me, I didn\'t recognize you.', '¡Oh…! Disculpe, no le conocía.', [], 1), 'surprised'),
    say(P('kuro_im', '{市長|しちょう} ^の クロ ^と {申|もう}します。 {星|ほし}あかり ^の {街|まち} ^へ ようこそ。', 'I am Kuro, the mayor. Welcome to Starlight City.', 'Soy Kuro, el alcalde. Bienvenido a Ciudad Estrella.', ['shichou']), 'happy'),
    say(P('kuro_closing', '{残念|ざんねん} ^ながら、 {百年|ひゃくねん} {続|つづ}いた {星|ほし}あかり{座|ざ} ^が {今季|こんき} ^で {閉鎖|へいさ}される ^のです。', 'Regrettably, the Starlight Theater, which has run for a hundred years, will close after this season.', 'Por desgracia, el Teatro Estrella, con cien años de historia, cerrará tras esta temporada.', ['heisa', 'gekijou'], 3), 'sad'),
    say(P('kuro_unique', 'あの {劇場|げきじょう} ならでは ^の {余韻|よいん} ^は、 {他|ほか} ^の どこ ^にも ない。', 'The afterglow that only that theater gives can be found nowhere else.', 'El regusto que solo deja ese teatro no se encuentra en ningún otro sitio.', ['gekijou', 'yoin'], 3), 'thinking'),
    meaning('x_kuro_unique'),
    say(P('kuro_q', '{芝居|しばい} ^は お{好|す}き ですか。', 'Do you like theater?', '¿Le gusta el teatro?', [])),
    reply([P('me_love_theater', 'はい。 {生|なま} ^の {舞台|ぶたい} ならでは ^の {感動|かんどう} ^が {好|す}き です。', 'Yes. I love the emotion only live theater gives.', 'Sí. Me encanta la emoción propia del teatro en vivo.', ['butai'])], [P('me_theater_boring', '{劇場|げきじょう} ^は {閉鎖|へいさ}されて {当然|とうぜん} です。', 'It\'s only natural the theater should close.', 'Es lógico que cierre el teatro.', ['heisa'])]),
    say(P('kuro_shiba', 'では、 {道場|どうじょう} ^の シバ{先生|せんせい} ^を {訪|たず}ねて ください。 あの {劇場|げきじょう} ^の {名作|めいさく} ^を {書|か}いた {方|かた} です。', 'Then please visit Shiba-sensei at the dojo. He wrote that theater\'s masterpiece.', 'Entonces visite al maestro Shiba en el dojo. Escribió la obra maestra de ese teatro.', [])),
    doIt('meet', 'kuro'),
  ]),
  C('x1_shiba', [
    say(P('shiba_hello', 'む… {客|きゃく} ^か。 {珍|めずら}しい ^な。', 'Hm… a visitor? That\'s rare.', 'Mm… ¿una visita? Qué raro.', [], 1), 'surprised'),
    say(P('shiba_play', '{星|ほし}あかり{座|ざ} ^が {閉|し}まる ^と {聞|き}いた。 {老舗|しにせ} ^と いえども、 {時代|じだい} ^には {勝|か}てん ^か。', 'I hear the Starlight Theater is closing. Even an old institution can\'t beat the times, eh?', 'He oído que cierra el Teatro Estrella. Ni siquiera un clásico puede contra los tiempos, ¿eh?', ['shinise'], 3), 'sad'),
    say(P('shiba_q', '{君|きみ} ^は {何|なに} ^を {求|もと}めて ここ ^へ {来|き}た？', 'What did you come here seeking?', '¿Qué has venido a buscar aquí?', [])),
    reply([P('me_seek_essence', 'ことば ^の {本質|ほんしつ} ^を {学|まな}びたくて {来|き}ました。', 'I came wanting to learn the essence of language.', 'He venido porque quiero aprender la esencia del idioma.', ['honshitsu'])], [P('me_seek_nothing', '{特|とく} ^に {意欲|いよく} ^は ありません。', 'I\'m not particularly motivated.', 'No tengo especial interés.', ['iyoku'])]),
    say(P('shiba_ok', 'ふん、 {大|おお}きく {出|で}た ^な。 {面白|おもしろ}い。 {鍛|きた}えて やろう。', 'Hmph, bold words. Interesting. I\'ll train you.', 'Vaya, palabras mayores. Interesante. Te entrenaré.', [], 2), 'happy'),
    build('x_me_seek_essence'),
    doIt('meet', 'shiba'),
  ]),
];

// 2 · Against the odds
const c2 = [
  C('x2_mike', [
    say(P('mike_hello', 'いらっしゃい！ あら、 {新顔|しんがお} ^ね。 ミケ ^よ ^ろしく！', 'Welcome! Oh, a new face. I\'m Mike, nice to meet you!', '¡Bienvenido! Anda, cara nueva. ¡Soy Mike, encantada!', [], 1), 'surprised'),
    say(P('mike_typhoon', '{台風|たいふう} ^が {来|き}て いる ^のに、 {劇場|げきじょう} ^の {前|まえ} ^には {長|なが}い {列|れつ} ^が できて いる ^の ^よ。', 'There\'s a typhoon coming, and yet a long line has formed outside the theater.', 'Se acerca un tifón y aun así hay una cola larguísima delante del teatro.', ['gekijou'], 3), 'thinking'),
    say(P('mike_last', '{最後|さいご} ^の {公演|こうえん} ^と あって、 みんな {必死|ひっし} ^なの ^ね。', 'Being the final performance, everyone\'s desperate to get in.', 'Como es la última función, todos están desesperados por entrar.', ['saigo', 'kouen'], 3)),
    quiz({ en: 'Why is there a long line?', es: '¿Por qué hay una cola larga?', ja: 'どうして長い列ができている？' }, ['{最後|さいご} ^の {公演|こうえん} だ から', '{花|はな} ^が {安|やす}い から', '{台風|たいふう} ^を {見|み}る ため']),
    reply([P('me_undaunted', 'みんな {台風|たいふう} ^を もの ^とも せず {並|なら}んで いる ^んです ^ね。', 'They\'re all lining up, undaunted by the typhoon.', 'Hacen cola sin dejarse amedrentar por el tifón.', [])], [P('me_go_home', '{危|あぶ}ない ^から、 みんな {帰|かえ}る べき です。', 'It\'s dangerous, so everyone should go home.', 'Es peligroso; todos deberían irse a casa.', [])]),
    say(P('mike_bouquet', 'この {花束|はなたば} ^を {劇場|げきじょう} ^に {届|とど}けて くれる？ {毎年|まいとし} ^の {約束|やくそく} ^なの。', 'Could you deliver this bouquet to the theater? It\'s a promise I keep every year.', '¿Puedes llevar este ramo al teatro? Es una promesa que cumplo cada año.', ['hanataba']), 'love'),
    doIt('giveItem', 'x_bouquet'),
    doIt('meet', 'mike'),
  ]),
  C('x2_kuro', [
    reply([P('me_bring_bouquet', 'ミケさん ^から {劇場|げきじょう} ^へ ^の {花束|はなたば} ^を {預|あず}かって きました。', 'I\'m bringing Mike\'s bouquet for the theater.', 'Traigo el ramo de Mike para el teatro.', ['hanataba'])], ['x_me_theater_boring']),
    doIt('takeItem', 'x_bouquet'),
    say(P('kuro_moved', '{周囲|しゅうい} ^の {心配|しんぱい} ^を よそ ^に、 {彼女|かのじょ} ^は {二十年|にじゅうねん} {欠|か}かさず {花|はな} ^を {届|とど}けて くれる。', 'Paying no heed to anyone\'s worries, she has sent flowers without fail for twenty years.', 'Haciendo caso omiso de las preocupaciones ajenas, lleva veinte años enviando flores sin falta.', [], 3), 'love'),
    say(P('kuro_hope', 'この {熱気|ねっき}… もしか したら、 まだ {望|のぞ}み ^は ある ^かも しれません。', 'This enthusiasm… perhaps there is still hope.', 'Este entusiasmo… quizá aún haya esperanza.', [], 3), 'thinking'),
    doIt('giveCoins', 100),
  ]),
];

// 3 · The first reviews
const c3 = [
  C('x3_pochi', [
    say(P('pochi_hello', 'うおっ！ {君|きみ} ^か、 {劇場|げきじょう} ^に {花|はな} ^を {届|とど}けた ^のは！ ポチ だ、 {週刊|しゅうかん} {星|ほし}あかり ^の！', 'Whoa! You\'re the one who brought flowers to the theater! I\'m Pochi, from Starlight Weekly!', '¡Uau! ¡Tú eres quien llevó flores al teatro! ¡Soy Pochi, del Semanario Estrella!', [], 1), 'surprised'),
    say(P('pochi_viral', '{僕|ぼく} ^の {批評|ひひょう} ^が {出|で}る や {否|いな}や、 {大反響|だいはんきょう} だ！ 「{見逃|みのが}す べからず」 ^と {書|か}いた ^から ^な！', 'No sooner did my review come out than it caused a sensation! I wrote "Not to be missed"!', '¡Nada más salir mi crítica, ha sido un bombazo! ¡Escribí "Imprescindible"!', ['hihyou'], 3), 'happy'),
    say(P('pochi_sold', '{追加|ついか} {公演|こうえん} ^の {発表|はっぴょう} ^が {早|はや}いか、 {切符|きっぷ} ^は {完売|かんばい} ^さ！', 'The instant the extra shows were announced, they sold out!', '¡En cuanto se anunciaron funciones extra, se agotaron!', ['kouen'], 3)),
    quiz({ en: 'What happened when the extra shows were announced?', es: '¿Qué pasó al anunciar funciones extra?', ja: '追加公演を発表したら？' }, ['すぐ {売|う}り{切|き}れた', 'だれ ^も {来|こ}なかった', '{中止|ちゅうし} ^に なった']),
    say(P('pochi_q', '{君|きみ} ^は どう {思|おも}う？ {僕|ぼく} ^の {記事|きじ} ^は {誇張|こちょう} ^だ ^と {言|い}う {人|ひと} ^も いる ^が…', 'What do you think? Some say my article was an exaggeration…', '¿Tú qué opinas? Hay quien dice que mi artículo exageraba…', ['kochou'], 3), 'thinking'),
    reply([P('me_not_exaggerate', '{観客|かんきゃく} ^の {拍手|はくしゅ} ^を {聞|き}けば、 {誇張|こちょう} ^では ない ^と わかります。', 'Anyone who heard the applause would know it wasn\'t an exaggeration.', 'Quien oyera los aplausos sabría que no era exageración.', ['kankyaku', 'hakushu', 'kochou'])], [P('me_all_lies', '{全部|ぜんぶ} {嘘|うそ} だ ^と {思|おも}います。', 'I think it\'s all lies.', 'Creo que es todo mentira.', [])]),
    doIt('meet', 'pochi'),
  ]),
  C('x3_shiba', [
    reply([P('me_review_news', 'ポチさん ^の {批評|ひひょう} ^を {読|よ}んだ {人|ひと} ^が、 {劇場|げきじょう} ^に {押|お}し{寄|よ}せて います。', 'People who read Pochi\'s review are flocking to the theater.', 'La gente que ha leído la crítica de Pochi se agolpa en el teatro.', ['hihyou'])], ['x_me_all_lies']),
    say(P('shiba_grumble', 'ふん。 あいつ ^は {大|おお}げさ ^に {書|か}く きらい ^が ある ^が…', 'Hmph. He does tend to exaggerate, but…', 'Bah. Ese tiende a exagerar, pero…', [], 3), 'thinking'),
    say(P('shiba_soft', '{観客|かんきゃく} ^が {戻|もど}って {来|く}る ^のは、 {悪|わる}く ない。', 'It\'s not bad, seeing the audience come back.', 'No está mal ver que vuelve el público.', ['kankyaku']), 'happy'),
  ]),
];

// 4 · Forced to close
const c4 = [
  C('x4_kuro', [
    say(P('kuro_disaster', '{大変|たいへん} です。 {公演|こうえん} {中|ちゅう} ^に {配管|はいかん} ^が {破裂|はれつ}して、 {劇場|げきじょう} ^は {休館|きゅうかん} ^を {余儀|よぎ}なく されました。', 'Terrible news. A pipe burst during a performance, and the theater has been forced to close.', 'Es terrible. Reventó una tubería en plena función y el teatro se ha visto obligado a cerrar.', ['haikan'], 3), 'sad'),
    say(P('kuro_sponsor', 'スポンサー ^も {撤退|てったい} ^を {考|かんが}えて いる そう です。 {絶望|ぜつぼう} {的|てき} です…', 'I hear the sponsors are considering pulling out too. It\'s hopeless…', 'Dicen que los patrocinadores también piensan retirarse. Es desesperante…', ['sponsaa', 'tettai'], 3), 'sad'),
    quiz({ en: 'Why did the theater have to close?', es: '¿Por qué tuvo que cerrar el teatro?', ja: '劇場はどうして休館した？' }, ['{配管|はいかん} ^が {破裂|はれつ}した', '{火事|かじ} ^が {起|お}きた', '{役者|やくしゃ} ^が いなく なった']),
    reply([P('me_appeal', '{街|まち} ^の {人|ひと} ^に {支援|しえん} ^を {訴|うった}えましょう。 この {熱気|ねっき} ^は {人|ひと} ^を {動|うご}かさず ^には おかない はず です。', 'Let\'s appeal to the city for support. This enthusiasm is bound to move people.', 'Pidamos apoyo a la ciudad. Este entusiasmo no dejará de mover a la gente.', ['shien', 'uttaeru'])], [P('me_give_up', 'もう {諦|あきら}める しか ありません。', 'There\'s nothing to do but give up.', 'No queda más que rendirse.', [])]),
    say(P('kuro_resolve', '…そう です ^ね。 {再開|さいかい} ^を {願|ねが}って やまない {市民|しみん} ^が いる ^のです から。', '…You\'re right. There are citizens who never cease to hope for its reopening.', '…Tiene razón. Hay ciudadanos que no dejan de desear su reapertura.', ['negau'], 3), 'thinking'),
  ]),
  C('x4_pochi', [
    reply([P('me_ask_article', '{劇場|げきじょう} ^の {危機|きき} ^に ついて、 {記事|きじ} ^を {書|か}いて いただけません ^か。', 'Would you write an article about the theater\'s crisis?', '¿Podría escribir un artículo sobre la crisis del teatro?', ['kiki'])], ['x_me_give_up']),
    say(P('pochi_yes', 'まかせろ！ {今度|こんど} ^は {誇張|こちょう} ^なし ^で、 {事実|じじつ} ^だけ ^を {書|か}く。 それ ^で {十分|じゅうぶん} {心|こころ} ^を {打|う}つ はず ^だ！', 'Leave it to me! This time no exaggeration, just the facts. That\'s enough to touch hearts!', '¡Déjamelo a mí! Esta vez sin exagerar, solo hechos. ¡Con eso basta para conmover!', ['kochou'], 3), 'happy'),
    narrate('Pochi\'s article runs on the front page. Within a day, donations pour in from all over the city.', 'El artículo de Pochi sale en portada. En un día llueven donativos de toda la ciudad.', 'ポチの記事は一面に載った。一日で、街中から寄付が集まった。'),
    doIt('giveCoins', 120),
  ]),
];

// 5 · Leo's bistro
const c5 = [
  C('x5_leo', [
    say(P('leo_hello', '…いらっしゃい。 {君|きみ} ^が うわさ ^の。 レオ ^だ。', '…Welcome. So you\'re the one everyone\'s talking about. I\'m Leo.', '…Bienvenido. Así que eres tú de quien todos hablan. Soy Leo.', [], 1), 'surprised'),
    say(P('leo_actors', '{劇場|げきじょう} ^が {閉|し}まって から、 {役者|やくしゃ} たち ^は {毎晩|まいばん} ここ ^に {集|あつ}まって いる。', 'Since the theater closed, the actors gather here every night.', 'Desde que cerró el teatro, los actores se reúnen aquí cada noche.', ['yakusha'], 3), 'thinking'),
    say(P('leo_hard', '{物価|ぶっか} ^の {高|たか}い {都会|とかい} ^に あって、 {役者|やくしゃ} ^の {暮|く}らし ^は {楽|らく} ^じゃ ない。 {若手|わかて} ^に {至|いた}って ^は、 {食事|しょくじ} ^も {満足|まんぞく} ^に {取|と}れない。', 'In a city with high prices, actors don\'t have it easy. As for the young ones, they can\'t even eat properly.', 'En una ciudad tan cara, los actores no lo tienen fácil. Los jóvenes, en concreto, ni siquiera comen bien.', ['bukka', 'tokai', 'yakusha'], 3), 'sad'),
    reply([P('me_leo_kind', 'だから レオさん ^は {安|やす}い {値段|ねだん} ^で {料理|りょうり} ^を {出|だ}して いる ^んです ^ね。', 'So that\'s why you serve food at low prices.', 'Por eso sirves comida a precios bajos.', [])], [P('me_raise_price2', '{値段|ねだん} ^を {上|あ}げる べき です。', 'You should raise your prices.', 'Deberías subir los precios.', [])]),
    say(P('leo_weekend', '{週末|しゅうまつ} ^とも なる ^と、 {満席|まんせき} ^で {大変|たいへん} ^だ ^が ^な。', 'When the weekend comes, it\'s packed and exhausting, though.', 'Aunque los fines de semana se llena y es agotador.', [], 3), 'happy'),
    doIt('meet', 'leo'),
  ]),
  C('x5_leo2', [
    say(P('leo_benefit', '{劇場|げきじょう} ^の ため ^に、 {一晩|ひとばん} ^だけ ^の {特別|とくべつ} ディナー ^を {開|ひら}こう ^と {思|おも}う。 {売|う}り{上|あ}げ ^は {全部|ぜんぶ} {寄付|きふ} ^だ。', 'For the theater, I\'m thinking of holding a one-night special dinner. All proceeds go to the theater.', 'Por el teatro, pienso organizar una cena especial de una noche. Todo lo recaudado será donado.', [], 3), 'thinking'),
    reply([P('me_help_dinner', '{私|わたし} ^も {手伝|てつだ}います！', 'I\'ll help too!', '¡Yo también ayudo!', [])], ['x_me_raise_price2']),
    narrate('The benefit dinner fills every seat. Actors wait tables in costume, and the kitchen runs until dawn.', 'La cena benéfica llena todas las mesas. Los actores sirven disfrazados y la cocina trabaja hasta el amanecer.', 'チャリティーディナーは満席。役者たちは衣装のまま給仕し、厨房は夜明けまで動いた。'),
    say(P('leo_thanks', '{逆境|ぎゃっきょう} ^に あって こそ、 {人|ひと} ^は {団結|だんけつ}する ^もの ^だ ^な。', 'It\'s in adversity that people truly come together.', 'Es en la adversidad cuando la gente de verdad se une.', ['gyakkyou'], 3), 'love'),
    doIt('giveCoins', 120),
  ]),
];

// 6 · Coco's dream
const c6 = [
  C('x6_coco', [
    say(P('coco_hi', 'きゃっ！ び、 びっくり した…', 'Eek! Y-you startled me…', '¡Ay! Q-qué susto…', [], 1), 'surprised'),
    say(P('coco_secret', '{実|じつ} ^は ね… {毎晩|まいばん}、 {閉|し}まった {劇場|げきじょう} ^に こっそり {入|はい}って、 {舞台|ぶたい} ^で {稽古|けいこ} ^して いる ^の。', 'Actually… every night, I sneak into the closed theater and rehearse on the stage.', 'La verdad es que… cada noche me cuelo en el teatro cerrado y ensayo en el escenario.', ['butai', 'keiko'], 3), 'sad'),
    say(P('coco_sign', '{扉|とびら} ^には 「{立|た}ち{入|い}る べからず」 ^って {書|か}いて ある ^の ^は {知|し}って いる ^けど…', 'I know the door says "Keep out," but…', 'Sé que en la puerta pone "Prohibido el paso", pero…', ['tachiiri'], 3)),
    reply([P('me_not_proper', '{夢|ゆめ} ^は わかる ^けど、 {無断|むだん} ^で {入|はい}る ^のは {役者|やくしゃ} ^として ある まじき こと だ ^よ。', 'I understand your dream, but entering without permission is unbefitting an actor.', 'Entiendo tu sueño, pero entrar sin permiso es impropio de una actriz.', ['yume', 'yakusha'])], [P('me_sneak_too', '{私|わたし} ^も {一緒|いっしょ} ^に {忍|しの}び{込|こ}む ^よ。', 'I\'ll sneak in with you.', 'Me colaré contigo.', [])]),
    say(P('coco_sorry', '…そう ^だ ^よ ^ね。 ごめんなさい。 でも、 {夢|ゆめ} ^を かなえ ん ^が ため ^に、 どう しても {舞台|ぶたい} ^に {立|た}ちたかった ^の。', '…You\'re right. I\'m sorry. But I wanted so badly to stand on that stage, to make my dream come true.', '…Tienes razón. Perdón. Pero quería tanto pisar ese escenario para cumplir mi sueño…', ['yume', 'butai'], 3), 'sad'),
    doIt('meet', 'coco'),
  ]),
  C('x6_shiba', [
    reply([P('me_tell_coco', 'ココちゃん ^が {夜|よる}、 {舞台|ぶたい} ^で {一人|ひとり} ^で {稽古|けいこ}して いました。', 'Coco has been rehearsing alone on stage at night.', 'Coco ha estado ensayando sola en el escenario por las noches.', ['butai', 'keiko'])], ['x_me_sneak_too']),
    say(P('shiba_young', '{若|わか}い ^な… {昔|むかし} ^の {俺|おれ} ^と {同|おな}じ ^だ。', 'So young… just like I used to be.', 'Qué joven… igual que yo en su día.', [], 2), 'thinking'),
    say(P('shiba_rule', '{規則|きそく} ^を {破|やぶ}った ^のは いかん。 ^が、 その {情熱|じょうねつ} ^は {本物|ほんもの} ^だ。 {会|あ}って みよう。', 'Breaking the rules is wrong. But that passion is real. I\'ll meet her.', 'Romper las normas está mal. Pero esa pasión es auténtica. Hablaré con ella.', [], 3), 'happy'),
    doIt('giveCoins', 100),
  ]),
];

// 7 · Rewriting the script
const c7 = [
  C('x7_shiba', [
    say(P('shiba_rewrite', '{決|き}めた。 {再開|さいかい} {公演|こうえん} ^の ため、 {俺|おれ} ^の {古|ふる}い {脚本|きゃくほん} ^を {書|か}き{直|なお}す。', 'I\'ve decided. For the reopening, I\'ll rewrite my old script.', 'Lo he decidido. Para la reapertura, reescribiré mi viejo guion.', ['kyakuhon', 'kakinaosu'], 3), 'happy'),
    say(P('shiba_flaw', '{昔|むかし} ^の {俺|おれ} ^は、 {台詞|せりふ} ^で {全部|ぜんぶ} {説明|せつめい}する きらい ^が あった。', 'The young me had a tendency to explain everything with dialogue.', 'De joven tendía a explicarlo todo con diálogos.', [], 3), 'thinking'),
    say(P('shiba_help_q', '{君|きみ} ^の {目|め} ^で {読|よ}んで くれ。 どこ ^を {削|けず}る べき ^だ？', 'Read it with your own eyes. What should I cut?', 'Léelo con tus propios ojos. ¿Qué debería recortar?', [])),
    reply([P('me_cut_lines', '{台詞|せりふ} ^を {減|へ}らして、 {沈黙|ちんもく} ^で {感情|かんじょう} ^を {表現|ひょうげん}して は どう です ^か。', 'How about cutting lines and expressing emotion through silence?', '¿Y si recortas diálogos y expresas las emociones con silencios?', ['kanjou', 'hyougen'])], [P('me_add_more', 'もっと {説明|せつめい} ^を {増|ふ}やす べき です。', 'You should add more explanation.', 'Deberías añadir más explicaciones.', [])]),
    say(P('shiba_yes', 'それ ^だ。 ことば ^は {削|けず}れ ^ば {削|けず}る ほど {強|つよ}く なる。', 'That\'s it. The more you cut words, the stronger they become.', 'Eso es. Cuanto más recortas las palabras, más fuerza tienen.', [], 3), 'love'),
  ]),
  C('x7_pochi', [
    reply([P('me_new_script', 'シバ{先生|せんせい} ^が {脚本|きゃくほん} ^を {書|か}き{直|なお}しました。 {読|よ}んで みて ください。', 'Shiba-sensei has rewritten the script. Please have a read.', 'El maestro Shiba ha reescrito el guion. Léalo, por favor.', ['kyakuhon', 'kakinaosu'])], ['x_me_all_lies']),
    say(P('pochi_wow', '…すごい。 {欠点|けってん} ^が ひとつ ^も ない。 これ ^は {再演|さいえん} ^に {足|た}る {傑作|けっさく} ^だ！', '…Incredible. Not a single flaw. This is a masterpiece worthy of revival!', '…Increíble. Ni un solo defecto. ¡Es una obra maestra digna de reestrenarse!', ['ketten'], 3), 'surprised'),
    say(P('pochi_good_news', 'スポンサー ^も {戻|もど}って {来|き}た ^し、 {配管|はいかん} ^も {直|なお}った。 いい こと ずくめ ^だ ^な！', 'The sponsors are back and the pipes are fixed. Nothing but good news!', '¡Los patrocinadores han vuelto y las tuberías están arregladas! ¡Todo son buenas noticias!', ['sponsaa', 'haikan'], 3), 'love'),
    doIt('giveItem', 'x_script'),
  ]),
  C('x7_coco', [
    doIt('takeItem', 'x_script'),
    reply([P('me_coco_role', 'シバ{先生|せんせい} ^から ^の {伝言|でんごん} だ ^よ。 {新|あたら}しい {脚本|きゃくほん} ^に、 ココちゃん ^の {役|やく} ^が ある ^って！', 'A message from Shiba-sensei: there\'s a part for you in the new script!', '¡Un mensaje del maestro Shiba! ¡Hay un papel para ti en el nuevo guion!', ['kyakuhon'])], ['x_me_sneak_too']),
    say(P('coco_role', 'え… {本当|ほんとう}？ わ、 わたし ^が {星|ほし}あかり{座|ざ} ^の {舞台|ぶたい} ^に？', 'Wh… really? Me, on the Starlight Theater stage?', '¿E… en serio? ¿Yo, en el escenario del Teatro Estrella?', ['butai']), 'surprised'),
    say(P('coco_tears', '{緊張|きんちょう}し ながら ^も、 {精一杯|せいいっぱい} がんばります！', 'Nervous as I am, I\'ll give it everything I\'ve got!', '¡Aunque esté nerviosa, lo daré todo!', ['kinchou'], 3), 'love'),
  ]),
];

// 8 · Curtain call
const c8 = [
  C('x8_kuro', [
    say(P('kuro_reopen', '{星|ほし}あかり{座|ざ}、 {再開|さいかい} ^が {決|き}まりました！ {初日|しょにち} ^の {夜|よる}、 みなさん ^を {招待|しょうたい} したい ^のです。', 'The Starlight Theater will reopen! I\'d like to invite everyone to opening night.', '¡El Teatro Estrella reabrirá! Quiero invitar a todos a la noche del estreno.', [], 3), 'love'),
    reply([P('me_invite_all2', '{私|わたし} ^が みなさん ^を お{誘|さそ}い します。', 'I\'ll invite everyone.', 'Yo invitaré a todos.', [])], ['x_me_give_up']),
  ]),
  C('x8_mike', [
    reply([P('me_invite_opening', '{星|ほし}あかり{座|ざ} ^の {初日|しょにち} ^に、 ぜひ いらして ください。', 'Please come to the Starlight Theater\'s opening night.', 'Venga sin falta al estreno del Teatro Estrella, por favor.', [])], ['x_me_go_home']),
    say(P('mike_come', 'もちろん！ {今年|ことし} ^は {一番|いちばん} {大|おお}きな {花束|はなたば} ^を {作|つく}る ^わ！ {去年|きょねん} もっと {早|はや}く {声|こえ} ^を {上|あ}げて いれ ^ば よかった もの ^を…', 'Of course! This year I\'ll make the biggest bouquet ever! If only I\'d spoken up sooner last year…', '¡Claro! ¡Este año haré el ramo más grande! Si al menos hubiera alzado la voz antes el año pasado…', ['hanataba'], 3), 'love'),
  ]),
  C('x8_pochi', [
    reply(['x_me_invite_opening'], ['x_me_add_more']),
    say(P('pochi_come', '{行|い}く ^に {決|き}まって いる！ {見出|みだ}し ^は もう {考|かんが}えて ある。 「{星|ほし}あかり、 {再|ふたた}び」！', 'Of course I\'m going! I already have the headline: "Starlight, Once Again"!', '¡Pues claro que voy! Ya tengo el titular: "¡Estrella, otra vez!"', [], 3), 'happy'),
  ]),
  C('x8_leo', [
    reply(['x_me_invite_opening'], ['x_me_raise_price2']),
    say(P('leo_come', '{終演|しゅうえん} ^の {後|あと}、 {全員|ぜんいん} ^に {料理|りょうり} ^を {振|ふ}る{舞|ま}おう。 {今夜|こんや} ^は {僕|ぼく} ^の おごり ^だ。', 'After the show, I\'ll treat everyone to dinner. Tonight\'s on me.', 'Tras la función invitaré a todos a cenar. Esta noche invito yo.', ['shuuen'], 3), 'love'),
  ]),
  C('x8_shiba', [
    say(P('shiba_ready_q', '{準備|じゅんび} ^は いい ^か。', 'Are you ready?', '¿Estás listo?', [])),
    reply([P('me_ready_all', 'はい。 みんな {来|き}て くれる そう です。', 'Yes. Everyone says they\'ll come.', 'Sí. Dicen que vendrán todos.', [])], ['x_me_seek_nothing']),
    say(P('shiba_exam', 'では {最後|さいご} ^に {星|ほし}あかり ^の {試験|しけん} ^を {受|う}けろ。 {合格|ごうかく}すれ ^ば、 {開演|かいえん} ^の {鐘|かね} ^は {君|きみ} ^が {鳴|な}らせ。', 'Then lastly, take the Starlight Exam. If you pass, you\'ll ring the bell for curtain up.', 'Entonces, por último, haz el Examen Estrella. Si apruebas, tú tocarás la campana del comienzo.', ['kaien', 'kane'], 3), 'happy'),
  ]),
];

// 9 · Opening night
const finale = [
  C('x9_bell', [
    narrate('The tower glows over the city. Outside the Starlight Theater, the whole town gathers in its best clothes, holding Mike\'s flowers.', 'La torre brilla sobre la ciudad. Ante el Teatro Estrella, todo el mundo se reúne con sus mejores galas y las flores de Mike.', '塔が街を照らす。星あかり座の前に、みんなが晴れ着で、ミケの花を手に集まった。'),
    say(P('kuro_speak', 'さあ、 あなた ^の ことば ^で {幕|まく} ^を {開|あ}けて ください。', 'Now, raise the curtain with your own words.', 'Ahora, levante el telón con sus propias palabras.', ['maku'], 2), 'happy'),
    build(P('me_curtain_up', 'この {劇場|げきじょう} ^が {再|ふたた}び {輝|かがや}く ^のは、 みなさん ^の おかげ ^に ほか なりません。', 'That this theater shines again is thanks to none other than all of you.', 'Que este teatro vuelva a brillar es gracias, ni más ni menos, a todos ustedes.', ['gekijou'])),
    doIt('ringBell'),
    say(P('kuro_rang', '{鐘|かね} ^が {鳴|な}りました！ {開演|かいえん} です！', 'The bell has rung! Curtain up!', '¡Ha sonado la campana! ¡Comienza la función!', ['kane', 'kaien']), 'love'),
  ]),
];

export const STARLIGHT_CONVOS: Record<string, Step[]> = Object.fromEntries([...c1, ...c2, ...c3, ...c4, ...c5, ...c6, ...c7, ...c8, ...finale]);

export const STARLIGHT_QUESTS: QuestDef[] = [
  chapter('starlight', 1, '🎭', obj('The Last Season', 'La última temporada', '最後のシーズン'), obj('The century-old theater is closing. Meet the mayor and an old playwright.', 'El teatro centenario cierra. Conoce al alcalde y a un viejo dramaturgo.', '百年の劇場が閉まる。市長と元劇作家に会おう。'), [
    { talk: { kuro: 'x1_kuro' }, objective: obj('Meet Mayor Kuro at city hall', 'Conoce al alcalde Kuro en el ayuntamiento', '市役所でクロ市長に会おう') },
    { talk: { shiba: 'x1_shiba' }, objective: obj('Visit Shiba-sensei at the dojo', 'Visita al maestro Shiba en el dojo', '道場のシバ先生をたずねよう') },
    { dojo: 'lesson_1', objective: obj('Finish Lesson 1: essence', 'Termina la Lección 1: esencia', 'レッスン1：本質') },
  ], { coins: 110, xp: 80 }),
  chapter('starlight', 2, '💐', obj('Against the Odds', 'Contra viento y marea', '逆風の中で'), obj('A typhoon can\'t stop the final crowd.', 'Ni un tifón detiene al público de la última función.', '台風も最後の観客を止められない。'), [
    { dojo: 'lesson_2', objective: obj('Finish Lesson 2: defiance', 'Termina la Lección 2: desafío', 'レッスン2：〜をものともせず') },
    { talk: { mike: 'x2_mike' }, objective: obj('Visit Mike at the flower market', 'Visita a Mike en el mercado de flores', '花市場のミケをたずねよう') },
    { talk: { kuro: 'x2_kuro' }, objective: obj('Bring the bouquet to Mayor Kuro', 'Lleva el ramo al alcalde Kuro', 'クロ市長に花束を届けよう') },
  ], { coins: 120, xp: 85 }),
  chapter('starlight', 3, '📰', obj('The First Reviews', 'Las primeras críticas', '最初の批評'), obj('A viral review changes everything.', 'Una crítica viral lo cambia todo.', '話題の批評がすべてを変える。'), [
    { talk: { pochi: 'x3_pochi' }, objective: obj('Visit Pochi at the publisher', 'Visita a Pochi en la editorial', '出版社のポチをたずねよう') },
    { dojo: 'lesson_3', objective: obj('Finish Lesson 3: immediacy', 'Termina la Lección 3: inmediatez', 'レッスン3：〜や否や・〜が早いか') },
    { talk: { shiba: 'x3_shiba' }, objective: obj('Tell Shiba-sensei the news', 'Cuéntale la noticia al maestro Shiba', 'シバ先生に知らせよう') },
  ], { coins: 120, xp: 85 }),
  chapter('starlight', 4, '🚱', obj('Forced to Close', 'Cierre forzoso', '休館'), obj('A burst pipe shuts the theater. Rally the city.', 'Una tubería reventada cierra el teatro. Moviliza a la ciudad.', '配管の破裂で劇場が休館。街に呼びかけよう。'), [
    { dojo: 'lesson_4', objective: obj('Finish Lesson 4: force and feeling', 'Termina la Lección 4: obligación y sentimiento', 'レッスン4：〜を余儀なくされる') },
    { talk: { kuro: 'x4_kuro' }, objective: obj('Talk to Mayor Kuro', 'Habla con el alcalde Kuro', 'クロ市長と話そう') },
    { talk: { pochi: 'x4_pochi' }, objective: obj('Ask Pochi to write about the crisis', 'Pide a Pochi que escriba sobre la crisis', 'ポチに記事を頼もう') },
  ], { coins: 130, xp: 90 }),
  chapter('starlight', 5, '🍷', obj('Leo\'s Bistro', 'El bistró de Leo', 'レオのビストロ'), obj('Help Leo hold a benefit dinner for the theater.', 'Ayuda a Leo a organizar una cena benéfica para el teatro.', 'レオの劇場のためのディナーを手伝おう。'), [
    { talk: { leo: 'x5_leo' }, objective: obj('Visit Leo\'s bistro', 'Visita el bistró de Leo', 'レオのビストロへ行こう') },
    { dojo: 'lesson_5', objective: obj('Finish Lesson 5: circumstance', 'Termina la Lección 5: circunstancias', 'レッスン5：〜にあって・〜ともなると') },
    { talk: { leo: 'x5_leo2' }, objective: obj('Help with the benefit dinner', 'Ayuda en la cena benéfica', 'チャリティーディナーを手伝おう') },
  ], { coins: 140, xp: 95 }),
  chapter('starlight', 6, '🐶', obj('Coco\'s Dream', 'El sueño de Coco', 'ココの夢'), obj('Someone has been sneaking onto the empty stage.', 'Alguien se cuela en el escenario vacío.', 'だれかが空の舞台にしのびこんでいる。'), [
    { dojo: 'lesson_6', objective: obj('Finish Lesson 6: propriety', 'Termina la Lección 6: decoro', 'レッスン6：〜まじき・〜べからず') },
    { talk: { coco: 'x6_coco' }, objective: obj('Talk to Coco near the park', 'Habla con Coco cerca del parque', '公園の近くでココと話そう') },
    { talk: { shiba: 'x6_shiba' }, objective: obj('Tell Shiba-sensei about Coco', 'Cuéntale al maestro Shiba lo de Coco', 'シバ先生にココのことを話そう') },
  ], { coins: 150, xp: 100 }),
  chapter('starlight', 7, '✍️', obj('Rewriting the Script', 'Reescribir el guion', '脚本の書き直し'), obj('Help Shiba-sensei rewrite his old masterpiece.', 'Ayuda al maestro Shiba a reescribir su vieja obra maestra.', 'シバ先生の名作の書き直しを手伝おう。'), [
    { talk: { shiba: 'x7_shiba' }, objective: obj('Read the script with Shiba-sensei', 'Lee el guion con el maestro Shiba', 'シバ先生と脚本を読もう') },
    { dojo: 'lesson_7', objective: obj('Finish Lesson 7: evaluation', 'Termina la Lección 7: valoración', 'レッスン7：〜きらいがある・〜に足る') },
    { talk: { pochi: 'x7_pochi' }, objective: obj('Show the new script to Pochi', 'Enseña el nuevo guion a Pochi', 'ポチに新しい脚本を見せよう') },
    { talk: { coco: 'x7_coco' }, objective: obj('Bring Coco the good news', 'Lleva la buena noticia a Coco', 'ココに知らせよう') },
  ], { coins: 160, xp: 105 }),
  chapter('starlight', 8, '🎟️', obj('Curtain Call', 'El último saludo', 'カーテンコール'), obj('Invite everyone to opening night.', 'Invita a todos a la noche del estreno.', 'みんなを初日にさそおう。'), [
    { talk: { kuro: 'x8_kuro' }, objective: obj('Talk to Mayor Kuro', 'Habla con el alcalde Kuro', 'クロ市長と話そう') },
    { dojo: 'lesson_8', objective: obj('Finish Lesson 8: emotion and nuance', 'Termina la Lección 8: emoción y matices', 'レッスン8：〜ながらも・〜とばかりに') },
    { talk: { mike: 'x8_mike', pochi: 'x8_pochi', leo: 'x8_leo' }, objective: obj('Invite Mike, Pochi and Leo', 'Invita a Mike, Pochi y Leo', 'ミケ、ポチ、レオをさそおう') },
    { talk: { shiba: 'x8_shiba' }, objective: obj('Tell Shiba-sensei you\'re ready', 'Dile al maestro Shiba que estás listo', 'シバ先生に準備ができたと伝えよう') },
  ], { coins: 190, xp: 110 }),
  chapter('starlight', 9, '🔔', obj('Opening Night', 'Noche de estreno', '初日の夜'), obj('Pass the Starlight Exam (80%) and ring the bell for curtain up.', 'Aprueba el Examen Estrella (80 %) y toca la campana del comienzo.', '星あかりの試験（80%）に合格して、開演の鐘を鳴らそう。'), [
    { dojo: 'exam', objective: obj('Pass the Starlight Exam at the dojo', 'Aprueba el Examen Estrella en el dojo', '道場で星あかりの試験に合格しよう') },
    { talk: { kuro: 'x9_bell' }, objective: obj('Ring the opening-night bell', 'Toca la campana del estreno', '開演の鐘を鳴らそう') },
  ], { coins: 400, xp: 300, items: ['crown'] }),
];
