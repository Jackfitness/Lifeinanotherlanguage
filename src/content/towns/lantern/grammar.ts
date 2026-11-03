import type { DrillItem, GrammarPoint } from '../types';

/** Lantern Hills grammar (JLPT N3): three points per chapter. */
const D = (q: string, a: string, wrong: string[], en: string, es: string): DrillItem => ({ q, a, wrong, m: { en, es } });

export const LANTERN_GRAMMAR: GrammarPoint[] = [
  // ---- 1 · Arrival & resolutions
  {
    id: 'l_koto_ni_suru', unit: 1,
    title: { en: '〜ことにする: decide to', es: '〜ことにする: decidir' },
    note: { en: 'Dictionary / ない form + ことにする = "I\'ve decided to…" (your own choice). ことにしている = a personal rule.', es: 'Forma de diccionario / ない + ことにする = "he decidido…" (decisión propia). ことにしている = una norma personal.' },
    example: '{毎晩|まいばん} {提灯|ちょうちん} ^を {灯|とも}す こと ^に しました。', exampleM: { en: 'I\'ve decided to light a lantern every night.', es: 'He decidido encender un farolillo cada noche.' },
    items: [
      D('{今年|ことし} ^は {日本語|にほんご} ^を {続|つづ}ける ＿＿ ^に しました。', 'こと', ['よう', 'ため'], 'This year I\'ve decided to keep studying Japanese.', 'Este año he decidido seguir con el japonés.'),
      D('{夜|よる} ^は {甘|あま}い もの ^を {食|た}べない こと ^に ＿＿ います。', 'して', ['なって', 'あって'], 'I make it a rule not to eat sweets at night.', 'Tengo por norma no comer dulces por la noche.'),
      D('{祭|まつ}り ^に {参加|さんか}する ＿＿ ^に した。', 'こと', ['もの', 'ところ'], 'I decided to take part in the festival.', 'Decidí participar en el festival.'),
    ],
  },
  {
    id: 'l_you_ni_suru', unit: 1,
    title: { en: '〜ようにする: make an effort to', es: '〜ようにする: procurar' },
    note: { en: 'Dictionary / ない form + ようにする = "try to make a habit of…". Softer and more ongoing than ことにする.', es: 'Forma de diccionario / ない + ようにする = "procurar…". Más suave y continuo que ことにする.' },
    example: '{毎日|まいにち} {新|あたら}しい ことば ^を {覚|おぼ}える よう ^に して います。', exampleM: { en: 'I try to learn new words every day.', es: 'Procuro aprender palabras nuevas cada día.' },
    items: [
      D('{夜|よる} {遅|おそ}く {出|で}かけない よう ^に ＿＿ います。', 'して', ['なって', 'できて'], 'I try not to go out late at night.', 'Procuro no salir tarde por la noche.'),
      D('{早|はや}く {寝|ね}る ＿＿ ^に して ください。', 'よう', ['こと', 'ため'], 'Please try to go to bed early.', 'Procura acostarte pronto.'),
      D('{遅|おく}れない よう ^に ＿＿。', 'します', ['なります', 'あります'], 'I\'ll make sure not to be late.', 'Procuraré no llegar tarde.'),
    ],
  },
  {
    id: 'l_tame_ni', unit: 1,
    title: { en: '〜ために: in order to / for', es: '〜ために: para' },
    note: { en: 'Dictionary form or noun + の + ために = purpose ("in order to…") when you control the action. Also "for the sake of".', es: 'Forma de diccionario o sustantivo + の + ために = finalidad ("para…") cuando controlas la acción. También "por el bien de".' },
    example: '{祭|まつ}り ^の ために、 みんな ^で {提灯|ちょうちん} ^を {作|つく}ります。', exampleM: { en: 'Everyone makes lanterns for the festival.', es: 'Todos hacen farolillos para el festival.' },
    items: [
      D('{目標|もくひょう} ^を {守|まも}る ＿＿、 {毎日|まいにち} {練習|れんしゅう}します。', 'ために', ['ように', 'ばかり'], 'I practice every day to keep my goal.', 'Practico cada día para cumplir mi objetivo.'),
      D('{家族|かぞく} ＿＿ ために {働|はたら}いて います。', 'の', ['が', 'に'], 'I work for my family.', 'Trabajo por mi familia.'),
      D('{夜市|よいち} ^で {売|う}る ＿＿ ^に、 たくさん {作|つく}りました。', 'ため', ['よう', 'こと'], 'I made lots to sell at the night market.', 'Hice muchos para venderlos en el mercado nocturno.'),
    ],
  },
  // ---- 2 · The night market
  {
    id: 'l_bakari', unit: 2,
    title: { en: '〜ばかり: nothing but / just did', es: '〜ばかり: solo / acabar de' },
    note: { en: 'Noun + ばかり = "nothing but…". て-form + ばかりいる = "do nothing but…". た-form + ばかり = "just did".', es: 'Sustantivo + ばかり = "solo…". Forma て + ばかりいる = "no hacer más que…". Forma た + ばかり = "acabar de".' },
    example: 'この {屋台|やたい} ^は {珍|めずら}しい もの ^ばかり です ^ね。', exampleM: { en: 'This stall has nothing but unusual things.', es: 'Este puesto solo tiene cosas raras.' },
    items: [
      D('コロ ^は {遊|あそ}んで ＿＿ いる。', 'ばかり', ['だけ', 'しか'], 'Koro does nothing but play.', 'Koro no hace más que jugar.'),
      D('この {提灯|ちょうちん} ^は {買|か}った ＿＿ です。', 'ばかり', ['ため', 'はず'], 'I just bought this lantern.', 'Acabo de comprar este farolillo.'),
      D('{夜市|よいち} ^は お{客|きゃく}さん ＿＿ でした。', 'ばかり', ['しか', 'ほど'], 'The night market was full of customers.', 'El mercado nocturno estaba lleno de clientes.'),
    ],
  },
  {
    id: 'l_nara', unit: 2,
    title: { en: '〜なら: if it\'s… / if you\'re going to', es: '〜なら: si es… / si vas a' },
    note: { en: 'Noun or plain form + なら picks up a topic and gives advice about it: "If it\'s lanterns you want, go to Poko."', es: 'Sustantivo o forma simple + なら retoma un tema y da un consejo: "Si buscas farolillos, ve a Poko".' },
    example: '{提灯|ちょうちん} ^なら、 ポコ ^の {店|みせ} ^が {一番|いちばん} です。', exampleM: { en: 'If it\'s lanterns you want, Poko\'s shop is the best.', es: 'Si buscas farolillos, la tienda de Poko es la mejor.' },
    items: [
      D('ラーメン ＿＿、 タマ ^の {店|みせ} ^が おいしい ^よ。', 'なら', ['ので', 'ても'], 'If it\'s ramen, Tama\'s shop is delicious.', 'Si es ramen, el de Tama está buenísimo.'),
      D('{丘|おか} ^へ {行|い}く ＿＿、 {提灯|ちょうちん} ^を {持|も}って いきなさい。', 'なら', ['のに', 'ばかり'], 'If you\'re going up the hill, take a lantern.', 'Si vas a la colina, llévate un farolillo.'),
      D('{安|やす}い ＿＿、 {全部|ぜんぶ} {買|か}います。', 'なら', ['ので', 'ために'], 'If they\'re cheap, I\'ll buy them all.', 'Si son baratos, los compro todos.'),
    ],
  },
  {
    id: 'l_sae', unit: 2,
    title: { en: '〜さえ〜ば: as long as', es: '〜さえ〜ば: con tal de que' },
    note: { en: 'Noun + さえ + ば-form = "as long as / if only…". さえ alone means "even".', es: 'Sustantivo + さえ + forma ば = "con tal de que / basta con…". さえ solo significa "incluso".' },
    example: 'お{金|かね} ^さえ あれば、 {全部|ぜんぶ} {買|か}える ^のに。', exampleM: { en: 'If only I had the money, I could buy them all.', es: 'Si tuviera dinero, podría comprarlos todos.' },
    items: [
      D('{時間|じかん} ＿＿ あれば、 {何|なん} ^でも できます。', 'さえ', ['ばかり', 'まで'], 'As long as I have time, I can do anything.', 'Con tal de tener tiempo, puedo hacer lo que sea.'),
      D('この {道|みち} ^さえ {覚|おぼ}え＿＿、 {迷|まよ}いません。', 'れば', ['たら', 'ても'], 'As long as you remember this road, you won\'t get lost.', 'Basta con recordar este camino para no perderse.'),
      D('{子|こ}ども ＿＿ {知|し}って いる {話|はなし} です。', 'さえ', ['なら', 'ほど'], 'It\'s a story even children know.', 'Es una historia que hasta los niños conocen.'),
    ],
  },
  // ---- 3 · Rumors
  {
    id: 'l_rashii', unit: 3,
    title: { en: '〜らしい: apparently / typical of', es: '〜らしい: al parecer / típico de' },
    note: { en: 'Plain form + らしい = "apparently, it seems" (based on what you heard). Noun + らしい = "typical of / like a real…".', es: 'Forma simple + らしい = "al parecer" (por lo que se oye). Sustantivo + らしい = "típico de / un auténtico…".' },
    example: '{夜|よる} ^に {提灯|ちょうちん} ^が {消|き}える らしい です。', exampleM: { en: 'Apparently lanterns vanish at night.', es: 'Al parecer, los farolillos desaparecen de noche.' },
    items: [
      D('{犯人|はんにん} ^は {狐|きつね} ^の {幽霊|ゆうれい} ＿＿ です。', 'らしい', ['ように', 'ばかり'], 'Apparently the culprit is a fox ghost.', 'Al parecer, el culpable es un zorro fantasma.'),
      D('{今日|きょう} ^は {本当|ほんとう} ^に {秋|あき}＿＿ {天気|てんき} です ^ね。', 'らしい', ['みたい', 'ようだ'], 'Today is real autumn weather, isn\'t it.', 'Hoy hace un tiempo muy otoñal, ¿verdad?'),
      D('ポコ ^は {昨日|きのう} {夜市|よいち} ^を {休|やす}んだ ＿＿。', 'らしい', ['らしく', 'ように'], 'Apparently Poko took yesterday off from the night market.', 'Al parecer Poko no abrió ayer en el mercado.'),
    ],
  },
  {
    id: 'l_mitai', unit: 3,
    title: { en: '〜みたい / 〜ようだ: seems like', es: '〜みたい / 〜ようだ: parece que' },
    note: { en: 'Plain form + みたい (casual) or ようだ (written) = "it seems / looks like" from your own impression. Noun + みたい / のようだ.', es: 'Forma simple + みたい (coloquial) o ようだ (escrito) = "parece que" según tu impresión. Sustantivo + みたい / のようだ.' },
    example: 'だれか ^が {隠|かく}れて いる みたい。', exampleM: { en: 'It seems like someone is hiding.', es: 'Parece que alguien se esconde.' },
    items: [
      D('あの {影|かげ} ^は {子|こ}ども ＿＿ ようだ。', 'の', ['な', 'が'], 'That shadow looks like a child.', 'Esa sombra parece de un niño.'),
      D('{雨|あめ} ^が {降|ふ}る ＿＿ です ^ね。', 'みたい', ['らしく', 'ばかり'], 'It seems like it\'s going to rain.', 'Parece que va a llover.'),
      D('この {提灯|ちょうちん}、 {星|ほし} ＿＿ きれい！', 'みたいに', ['みたいな', 'らしい'], 'This lantern is pretty, like a star!', '¡Este farolillo es precioso, como una estrella!'),
    ],
  },
  {
    id: 'l_to_iu', unit: 3,
    title: { en: '〜という / 〜って: called, that says', es: '〜という / 〜って: llamado, que dice' },
    note: { en: 'A という B = "a B called A" or "the B that says A". In speech, って is the casual version.', es: 'A という B = "un B llamado A" o "el B que dice A". Al hablar, って es la versión coloquial.' },
    example: '「{狐|きつね} ^の {提灯|ちょうちん}」 ^という {話|はなし} ^を {知|し}って います ^か。', exampleM: { en: 'Do you know the story called "The Fox\'s Lantern"?', es: '¿Conoces la historia llamada "El farolillo del zorro"?' },
    items: [
      D('{提灯|ちょうちん} ^が {消|き}えた ＿＿ うわさ ^を {聞|き}きました。', 'という', ['ために', 'ばかり'], 'I heard a rumor that the lanterns disappeared.', 'Oí el rumor de que los farolillos desaparecieron.'),
      D('コロ ＿＿ {子|こ} ^を {見|み}なかった？', 'って', ['なら', 'さえ'], 'Did you see a kid called Koro?', '¿Has visto a un niño llamado Koro?'),
      D('ギン ＿＿ {先生|せんせい} ^に {会|あ}いました。', 'という', ['らしい', 'みたい'], 'I met a teacher called Gin.', 'Conocí a una maestra llamada Gin.'),
    ],
  },
  // ---- 4 · The mystery
  {
    id: 'l_hazu', unit: 4,
    title: { en: '〜はずだ / 〜はずがない: should / can\'t be', es: '〜はずだ / 〜はずがない: debería / no puede ser' },
    note: { en: 'Plain form + はずだ = "it should be…" (logical expectation). はずがない = "there\'s no way…".', es: 'Forma simple + はずだ = "debería…" (expectativa lógica). はずがない = "es imposible que…".' },
    example: '{幽霊|ゆうれい} ^が {提灯|ちょうちん} ^を {盗|ぬす}む はず ^が ありません。', exampleM: { en: 'There\'s no way a ghost would steal lanterns.', es: 'Es imposible que un fantasma robe farolillos.' },
    items: [
      D('ポコ ^は {夜市|よいち} ^に いる ＿＿ です。', 'はず', ['ばかり', 'ため'], 'Poko should be at the night market.', 'Poko debería estar en el mercado nocturno.'),
      D('ツネ ^が {嘘|うそ} ^を つく はず ^が ＿＿。', 'ない', ['ある', 'いる'], 'There\'s no way Tsune would lie.', 'Es imposible que Tsune mienta.'),
      D('{足跡|あしあと} ^が {小|ちい}さい ので、 {犯人|はんにん} ^は {子|こ}ども ＿＿ はずだ。', 'の', ['な', 'が'], 'The footprints are small, so the culprit must be a child.', 'Las huellas son pequeñas, así que el culpable debe de ser un niño.'),
    ],
  },
  {
    id: 'l_wake', unit: 4,
    title: { en: '〜わけだ / 〜わけではない: no wonder / not that', es: '〜わけだ / 〜わけではない: con razón / no es que' },
    note: { en: 'Plain form + わけだ = "so that\'s why / no wonder". わけではない = "it\'s not (necessarily) that…".', es: 'Forma simple + わけだ = "con razón / por eso". わけではない = "no es que…".' },
    example: 'コロ ^が {毎晩|まいばん} {出|で}かけて いた わけ だ。', exampleM: { en: 'So that\'s why Koro went out every night.', es: 'Con razón Koro salía cada noche.' },
    items: [
      D('{提灯|ちょうちん} ^が {嫌|きら}い な ＿＿ ^では ありません。', 'わけ', ['はず', 'ため'], 'It\'s not that I dislike lanterns.', 'No es que no me gusten los farolillos.'),
      D('{全部|ぜんぶ} {売|う}り{切|き}れ。 {人気|にんき} ^が ある ＿＿ です ^ね。', 'わけ', ['はず', 'こと'], 'All sold out. No wonder, they\'re popular.', 'Todo agotado. Con razón, son muy populares.'),
      D('{怖|こわ}い わけ ^では ＿＿ ^けど、 {夜|よる} ^は {一人|ひとり} ^で {行|い}きたく ない。', 'ない', ['ある', 'いる'], 'It\'s not that I\'m scared, but I don\'t want to go alone at night.', 'No es que tenga miedo, pero no quiero ir solo de noche.'),
    ],
  },
  {
    id: 'l_ni_chigainai', unit: 4,
    title: { en: '〜に違いない: must be (I\'m sure)', es: '〜に違いない: seguro que' },
    note: { en: 'Plain form (no だ after nouns) + に違いない = "it must be…, I\'m certain".', es: 'Forma simple (sin だ tras sustantivos) + に違いない = "seguro que…, no cabe duda".' },
    example: 'これ ^は {犯人|はんにん} ^の {足跡|あしあと} ^に {違|ちが}いない。', exampleM: { en: 'These must be the culprit\'s footprints.', es: 'Seguro que son las huellas del culpable.' },
    items: [
      D('コロ ^は {何|なに} ^か ^を {隠|かく}して いる ＿＿ {違|ちが}いない。', 'に', ['を', 'が'], 'Koro must be hiding something.', 'Seguro que Koro esconde algo.'),
      D('この {匂|にお}い ^は タマ ^の ラーメン ＿＿。', '^に {違|ちが}いない', ['^は {違|ちが}う', 'らしく'], 'This smell must be Tama\'s ramen.', 'Este olor tiene que ser el ramen de Tama.'),
      D('{理由|りゆう} ^が ある ^に ＿＿。', '{違|ちが}いない', ['{違|ちが}って', '{違|ちが}えない'], 'There must be a reason.', 'Seguro que hay una razón.'),
    ],
  },
  // ---- 5 · The ramen shop
  {
    id: 'l_te_shimau', unit: 5,
    title: { en: '〜てしまう: end up / completely', es: '〜てしまう: acabar / sin querer' },
    note: { en: 'て-form + しまう = "end up doing (regretfully)" or "finish completely". Casual: ちゃう / じゃう.', es: 'Forma て + しまう = "acabar haciendo (con pena)" o "terminar del todo". Coloquial: ちゃう / じゃう.' },
    example: 'スープ ^を {焦|こ}がして しまいました！', exampleM: { en: 'I\'ve burnt the soup!', es: '¡Se me ha quemado la sopa!' },
    items: [
      D('{熱|あつ}い スープ ^が こぼれて ＿＿。', 'しまった', ['おいた', 'あった'], 'The hot soup spilled.', 'Se derramó la sopa caliente.'),
      D('ラーメン ^を {全部|ぜんぶ} {食|た}べ＿＿。', 'ちゃった', ['ておく', 'たばかり'], 'I ate all the ramen.', 'Me comí todo el ramen.'),
      D('{大事|だいじ} ^な {提灯|ちょうちん} ^を {壊|こわ}して ＿＿。', 'しまいました', ['おきました', 'みました'], 'I broke the precious lantern.', 'He roto sin querer el farolillo tan importante.'),
    ],
  },
  {
    id: 'l_te_oku', unit: 5,
    title: { en: '〜ておく: do in advance', es: '〜ておく: dejar hecho' },
    note: { en: 'て-form + おく = do something ahead of time, or leave something as it is. Casual: とく.', es: 'Forma て + おく = hacer algo con antelación o dejar algo como está. Coloquial: とく.' },
    example: '{祭|まつ}り ^の {前|まえ} ^に {材料|ざいりょう} ^を {買|か}って おきます。', exampleM: { en: 'I\'ll buy the ingredients before the festival.', es: 'Compraré los ingredientes antes del festival.' },
    items: [
      D('お{客|きゃく}さん ^が {来|く}る {前|まえ} ^に {片付|かたづ}けて ＿＿。', 'おきます', ['しまいます', 'みます'], 'I\'ll tidy up before the customers come.', 'Recogeré antes de que lleguen los clientes.'),
      D('{窓|まど} ^は {開|あ}けて おいて ＿＿。', 'ください', ['しまう', 'ある'], 'Please leave the window open.', 'Deja la ventana abierta, por favor.'),
      D('{予約|よやく} ^を し＿＿ ^ね。', 'とく', ['ちゃう', 'たり'], 'I\'ll make a reservation, OK?', 'Haré una reserva, ¿vale?'),
    ],
  },
  {
    id: 'l_tokoro', unit: 5,
    title: { en: '〜ところだ: about to / in the middle of / just', es: '〜ところだ: a punto de / justo' },
    note: { en: 'Dictionary form + ところ = about to. ている + ところ = in the middle of. た-form + ところ = just finished.', es: 'Forma de diccionario + ところ = a punto de. ている + ところ = en medio de. Forma た + ところ = acabar de.' },
    example: '{今|いま}、 スープ ^を {煮込|にこ}んで いる ところ です。', exampleM: { en: 'I\'m simmering the soup right now.', es: 'Ahora mismo estoy cociendo la sopa.' },
    items: [
      D('ちょうど {店|みせ} ^を {開|あ}ける ＿＿ です。', 'ところ', ['ばかり', 'はず'], 'I\'m just about to open the shop.', 'Estoy a punto de abrir la tienda.'),
      D('{今|いま}、 {帰|かえ}った ＿＿ です。', 'ところ', ['ため', 'わけ'], 'I just got back.', 'Acabo de volver.'),
      D('{味見|あじみ} ^を して いる ところ ＿＿ ^に、 ギン{先生|せんせい} ^が {来|き}た。', 'へ', ['を', 'が'], 'Just as I was tasting it, Gin-sensei came in.', 'Justo cuando lo estaba probando, llegó la maestra Gin.'),
    ],
  },
  // ---- 6 · Favors & causative
  {
    id: 'l_saseru', unit: 6,
    title: { en: 'Causative 〜させる: make / let', es: 'Causativo 〜させる: hacer / dejar' },
    note: { en: 'う-verbs: ない-stem + せる (行かせる). る-verbs: させる (食べさせる). する → させる. "Make or let someone do".', es: 'Verbos う: raíz ない + せる (行かせる). Verbos る: させる (食べさせる). する → させる. "Hacer o dejar que alguien haga".' },
    example: 'タマ ^は コロ ^に {店|みせ} ^の {掃除|そうじ} ^を させました。', exampleM: { en: 'Tama made Koro clean the shop.', es: 'Tama hizo que Koro limpiara la tienda.' },
    items: [
      D('{先生|せんせい} ^は {学生|がくせい} ^に {毎日|まいにち} {練習|れんしゅう} ^を ＿＿。', 'させます', ['されます', 'します'], 'The teacher makes the students practice every day.', 'La maestra hace practicar a los alumnos cada día.'),
      D('{子|こ}ども ^を {自由|じゆう} ^に {遊|あそ}ば＿＿ ください。', 'せて', ['れて', 'させ'], 'Please let the children play freely.', 'Dejad que los niños jueguen libremente.'),
      D('{私|わたし} ^に {運|はこ}ば＿＿ ください。', 'せて', ['させて', 'れて'], 'Please let me carry it.', 'Déjame llevarlo, por favor.'),
    ],
  },
  {
    id: 'l_saserareru', unit: 6,
    title: { en: 'Causative-passive 〜させられる: be made to', es: 'Causativo-pasivo 〜させられる: verse obligado' },
    note: { en: 'The person forced to do something becomes the subject: 掃除させられた "I was made to clean". う-verbs often shorten: 行かされる.', es: 'La persona obligada pasa a ser el sujeto: 掃除させられた "me hicieron limpiar". En verbos う se acorta: 行かされる.' },
    example: 'コロ ^は {毎朝|まいあさ} {早|はや}く {起|お}きさせられます。', exampleM: { en: 'Koro is made to get up early every morning.', es: 'A Koro le obligan a levantarse temprano cada mañana.' },
    items: [
      D('{子|こ}ども ^の ころ、 {野菜|やさい} ^を {食|た}べ＿＿。', 'させられた', ['させた', 'られた'], 'As a kid, I was made to eat vegetables.', 'De pequeño me obligaban a comer verdura.'),
      D('{店長|てんちょう} ^に {重|おも}い {荷物|にもつ} ^を {運|はこ}ば＿＿。', 'された', ['せた', 'れた'], 'The manager made me carry heavy loads.', 'El encargado me hizo cargar bultos pesados.'),
      D('{一時間|いちじかん} ^も {待|ま}た＿＿ ました。', 'され', ['せ', 'れ'], 'I was made to wait a whole hour.', 'Me hicieron esperar una hora entera.'),
    ],
  },
  {
    id: 'l_te_hoshii', unit: 6,
    title: { en: '〜てほしい: want someone to', es: '〜てほしい: querer que alguien' },
    note: { en: 'Person + に + て-form + ほしい = "I want (someone) to…". ないでほしい = "I don\'t want (you) to…".', es: 'Persona + に + forma て + ほしい = "quiero que (alguien)…". ないでほしい = "no quiero que…".' },
    example: 'おばあちゃん ^に {祭|まつ}り ^を {見|み}て ほしい ^んだ。', exampleM: { en: 'I want Grandma to see the festival.', es: 'Quiero que la abuela vea el festival.' },
    items: [
      D('{先生|せんせい} ^に {意見|いけん} ^を {聞|き}いて ＿＿ です。', 'ほしい', ['たい', 'ほしがる'], 'I want the teacher to hear my opinion.', 'Quiero que la maestra escuche mi opinión.'),
      D('{心配|しんぱい} ^を かけないで ＿＿。', 'ほしい', ['ほしくて', 'たい'], 'I don\'t want you to make people worry.', 'No quiero que preocupes a nadie.'),
      D('みんな ＿＿ {協力|きょうりょく}して ほしい です。', 'に', ['が', 'を'], 'I want everyone to cooperate.', 'Quiero que todos colaboren.'),
    ],
  },
  // ---- 7 · Before it's too late
  {
    id: 'l_uchi_ni', unit: 7,
    title: { en: '〜うちに: while (before it changes)', es: '〜うちに: mientras (antes de que cambie)' },
    note: { en: '〜うちに = do it while a state lasts, before it changes: 明るいうちに "while it\'s still light". ないうちに = before…', es: '〜うちに = hacerlo mientras dura algo, antes de que cambie: 明るいうちに "mientras hay luz". ないうちに = antes de que…' },
    example: '{明|あか}るい うち ^に {坂道|さかみち} ^を {上|のぼ}りましょう。', exampleM: { en: 'Let\'s climb the hill while it\'s still light.', es: 'Subamos la cuesta mientras haya luz.' },
    items: [
      D('{暗|くら}く ならない ＿＿ ^に {帰|かえ}りなさい。', 'うち', ['あいだ', 'ところ'], 'Go home before it gets dark.', 'Vuelve antes de que oscurezca.'),
      D('{熱|あつ}い うち ^に ＿＿ ください。', '{食|た}べて', ['{食|た}べた', '{食|た}べる'], 'Please eat it while it\'s hot.', 'Cómelo mientras está caliente.'),
      D('{若|わか}い ＿＿ ^に いろいろ {経験|けいけん}した ほう ^が いい。', 'うち', ['ばかり', 'わけ'], 'It\'s good to experience lots while you\'re young.', 'Conviene vivir muchas cosas mientras eres joven.'),
    ],
  },
  {
    id: 'l_aida', unit: 7,
    title: { en: '〜間 / 〜間に: during / while', es: '〜間 / 〜間に: durante / mientras' },
    note: { en: '〜間 = throughout the whole time. 〜間に = at some point during that time.', es: '〜間 = durante todo el tiempo. 〜間に = en algún momento de ese tiempo.' },
    example: 'みんな ^が {寝|ね}て いる {間|あいだ} ^に、 コロ ^は {出|で}かけました。', exampleM: { en: 'While everyone was asleep, Koro went out.', es: 'Mientras todos dormían, Koro salió.' },
    items: [
      D('{祭|まつ}り ^の {間|あいだ}、 ＿＿ {提灯|ちょうちん} ^が {輝|かがや}いて いた。', 'ずっと', ['すぐ', 'ちょっと'], 'The lanterns shone the whole time during the festival.', 'Los farolillos brillaron todo el festival.'),
      D('{留守|るす} ^の ＿＿ ^に {荷物|にもつ} ^が {届|とど}いた。', '{間|あいだ}', ['うち', 'ところ'], 'A parcel came while I was out.', 'Llegó un paquete mientras estaba fuera.'),
      D('{夏休|なつやす}み ^の {間|あいだ}、 {毎日|まいにち} ＿＿。', '{泳|およ}いだ', ['{泳|およ}いだら', '{泳|およ}げば'], 'I swam every day during summer vacation.', 'Nadé cada día durante las vacaciones.'),
    ],
  },
  {
    id: 'l_totan', unit: 7,
    title: { en: '〜たとたん: the moment', es: '〜たとたん: en cuanto' },
    note: { en: 'た-form + とたん(に) = "just as / the moment A happened, B (unexpectedly) happened".', es: 'Forma た + とたん(に) = "justo cuando pasó A, pasó B (de golpe)".' },
    example: '{外|そと} ^に {出|で}た とたん、 {明|あ}かり ^が {消|き}えた。', exampleM: { en: 'The moment I stepped outside, the lights went out.', es: 'En cuanto salí, se apagaron las luces.' },
    items: [
      D('{立|た}ち{上|あ}がった ＿＿、 {転|ころ}んで しまった。', 'とたん', ['うちに', 'あいだ'], 'The moment I stood up, I fell over.', 'Nada más levantarme, me caí.'),
      D('{鐘|かね} ^が {鳴|な}った とたん ＿＿、 みんな ^が {歌|うた}い{始|はじ}めた。', 'に', ['を', 'で'], 'The moment the bell rang, everyone began to sing.', 'En cuanto sonó la campana, todos empezaron a cantar.'),
      D('{家|いえ} ^に ＿＿ とたん、 {雨|あめ} ^が {降|ふ}って きた。', '{着|つ}いた', ['{着|つ}く', '{着|つ}いて'], 'The moment I got home, it started raining.', 'Justo al llegar a casa, empezó a llover.'),
    ],
  },
  // ---- 8 · The festival
  {
    id: 'l_ba_hodo', unit: 8,
    title: { en: '〜ば〜ほど: the more… the more', es: '〜ば〜ほど: cuanto más… más' },
    note: { en: 'ば-form + dictionary form of the same word + ほど: "the more you…, the more…".', es: 'Forma ば + forma de diccionario del mismo verbo + ほど: "cuanto más…, más…".' },
    example: '{提灯|ちょうちん} ^は {多|おお}けれ ^ば {多|おお}い ほど きれい です。', exampleM: { en: 'The more lanterns, the prettier.', es: 'Cuantos más farolillos, más bonito.' },
    items: [
      D('{練習|れんしゅう}すれ ^ば ＿＿ ほど {上手|じょうず} ^に なる。', 'する', ['した', 'して'], 'The more you practice, the better you get.', 'Cuanto más practicas, mejor lo haces.'),
      D('この ラーメン ^は {食|た}べれ ^ば {食|た}べる ＿＿ おいしい。', 'ほど', ['ばかり', 'だけ'], 'The more you eat this ramen, the tastier it gets.', 'Cuanto más comes este ramen, más rico está.'),
      D('{考|かんが}えれ ^ば ＿＿ ほど わからなく なる。', '{考|かんが}える', ['{考|かんが}えた', '{考|かんが}えて'], 'The more I think, the less I understand.', 'Cuanto más lo pienso, menos lo entiendo.'),
    ],
  },
  {
    id: 'l_ni_tsuite', unit: 8,
    title: { en: '〜について / 〜に対して: about / toward', es: '〜について / 〜に対して: sobre / hacia' },
    note: { en: '〜について = about (a topic). 〜に対して = toward / against (a person or thing), or "in contrast to".', es: '〜について = sobre (un tema). 〜に対して = hacia / contra (alguien o algo), o "en contraste con".' },
    example: '{祭|まつ}り ^の {歴史|れきし} ^に ついて {話|はな}しましょう。', exampleM: { en: 'Let\'s talk about the history of the festival.', es: 'Hablemos de la historia del festival.' },
    items: [
      D('{長老|ちょうろう} ^は {伝統|でんとう} ^に ＿＿ よく {知|し}って いる。', 'ついて', ['たいして', 'よって'], 'The elder knows a lot about the traditions.', 'El anciano sabe mucho de las tradiciones.'),
      D('お{客|きゃく}さん ^に ＿＿ ていねい ^に {話|はな}します。', '{対|たい}して', ['ついて', 'とって'], 'I speak politely to customers.', 'Hablo con cortesía a los clientes.'),
      D('この {提灯|ちょうちん} ^に ついて ^の ご{意見|いけん} ^を ＿＿。', 'どうぞ', ['どうして', 'どこ'], 'Please share your thoughts about this lantern.', 'Díganos qué opina de este farolillo.'),
    ],
  },
  {
    id: 'l_koto_ni_naru', unit: 8,
    title: { en: '〜ことになる: it has been decided', es: '〜ことになる: se ha decidido' },
    note: { en: 'Dictionary / ない form + ことになった = "it\'s been decided (by others or circumstances) that…". Compare ことにする (your own decision).', es: 'Forma de diccionario / ない + ことになった = "se ha decidido (por otros o por las circunstancias) que…". Compara con ことにする (decisión propia).' },
    example: 'あなた ^が {鐘|かね} ^を {鳴|な}らす こと ^に なりました。', exampleM: { en: 'It\'s been decided that you will ring the bell.', es: 'Se ha decidido que tú tocarás la campana.' },
    items: [
      D('{今年|ことし} ^の {祭|まつ}り ^は {土曜日|どようび} ^に {始|はじ}まる ＿＿ ^に なった。', 'こと', ['よう', 'ため'], 'It\'s been decided the festival will start on Saturday.', 'Se ha decidido que el festival empiece el sábado.'),
      D('{雨|あめ} ^なので、 {行列|ぎょうれつ} ^は {中止|ちゅうし} ^に ＿＿。', 'なりました', ['しました', 'させました'], 'Because of the rain, the procession has been called off.', 'Por la lluvia, se ha suspendido el desfile.'),
      D('{来月|らいげつ} ^から {町|まち} ^で {働|はたら}く こと ^に ＿＿。', 'なった', ['した', 'あった'], 'It\'s been arranged that I\'ll work in town from next month.', 'Ya está decidido que trabajaré en el pueblo desde el mes que viene.'),
    ],
  },
];
