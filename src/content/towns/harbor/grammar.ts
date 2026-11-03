import type { DrillItem, GrammarPoint } from '../types';

/** Maple Harbor grammar (JLPT N4): three points per chapter. */
const D = (q: string, a: string, wrong: string[], en: string, es: string): DrillItem => ({ q, a, wrong, m: { en, es } });

export const HARBOR_GRAMMAR: GrammarPoint[] = [
  // ---- 1 · Arrival & experiences
  {
    id: 'h_ta_koto', unit: 1,
    title: { en: '〜たことがある: have done before', es: '〜たことがある: haber hecho alguna vez' },
    note: { en: 'Verb in た-form + ことがある talks about life experience: "I have (ever) done…". Use ない for "never".', es: 'Verbo en forma た + ことがある expresa experiencia: "he… alguna vez". Con ない significa "nunca".' },
    example: '{船|ふね} ^に {乗|の}った こと ^が あります。', exampleM: { en: 'I have ridden on a boat before.', es: 'He montado en barco alguna vez.' },
    items: [
      D('{島|しま} ^に {行|い}った こと ^が ＿＿。', 'あります', ['います', 'します'], 'I have been to the island.', 'He ido a la isla.'),
      D('さしみ ^を ＿＿ こと ^が ありません。', '{食|た}べた', ['{食|た}べる', '{食|た}べて'], 'I have never eaten sashimi.', 'Nunca he comido sashimi.'),
      D('{灯台|とうだい} ^を {見|み}た ＿＿ ^が あります ^か。', 'こと', ['もの', 'とき'], 'Have you ever seen a lighthouse?', '¿Has visto alguna vez un faro?'),
    ],
  },
  {
    id: 'h_te_iru', unit: 1,
    title: { en: '〜ている: ongoing state', es: '〜ている: estado continuo' },
    note: { en: 'て-form + いる shows an action in progress or a lasting state: 住んでいる "live (in)", 知っている "know".', es: 'Forma て + いる indica una acción en curso o un estado: 住んでいる "vivir en", 知っている "saber".' },
    example: 'カイト ^は {港|みなと} ^の {近|ちか}く ^に {住|す}んで います。', exampleM: { en: 'Kaito lives near the harbor.', es: 'Kaito vive cerca del puerto.' },
    items: [
      D('{私|わたし} ^は この {町|まち} ^に {住|す}んで ＿＿。', 'います', ['あります', 'します'], 'I live in this town.', 'Vivo en este pueblo.'),
      D('ペン ^の {名前|なまえ} ^を ＿＿ います ^か。', '{知|し}って', ['{知|し}り', '{知|し}る'], 'Do you know Pen\'s name?', '¿Sabes cómo se llama Pen?'),
      D('{今|いま}、 {風|かぜ} ^が ＿＿ います。', '{吹|ふ}いて', ['{吹|ふ}く', '{吹|ふ}いた'], 'The wind is blowing now.', 'Ahora sopla el viento.'),
    ],
  },
  {
    id: 'h_tai', unit: 1,
    title: { en: '〜たい / 〜たがる: want to', es: '〜たい / 〜たがる: querer hacer' },
    note: { en: 'Verb stem + たい = "I want to…". For other people, use たがっている: "he/she seems to want to…".', es: 'Raíz del verbo + たい = "quiero…". Para otras personas se usa たがっている: "parece que quiere…".' },
    example: 'いつか {島|しま} ^へ {行|い}きたい です。', exampleM: { en: 'Someday I want to go to the island.', es: 'Algún día quiero ir a la isla.' },
    items: [
      D('{海|うみ} ^で {泳|およ}ぎ＿＿ です。', 'たい', ['たがる', 'ます'], 'I want to swim in the sea.', 'Quiero nadar en el mar.'),
      D('チャプ ^は {船|ふね} ^に {乗|の}り＿＿ います。', 'たがって', ['たくて', 'たい'], 'Chapu wants to ride the boat.', 'Chapu quiere subir al barco.'),
      D('{何|なに} ^が {食|た}べ＿＿ です ^か。', 'たい', ['たかった', 'たがる'], 'What do you want to eat?', '¿Qué quieres comer?'),
    ],
  },
  // ---- 2 · The fish market
  {
    id: 'h_sugiru', unit: 2,
    title: { en: '〜すぎる: too much', es: '〜すぎる: demasiado' },
    note: { en: 'Verb stem or adjective stem (drop い / な) + すぎる = "too…, overly…".', es: 'Raíz de verbo o adjetivo (sin い / な) + すぎる = "demasiado…".' },
    example: 'この {魚|さかな} ^は {高|たか}すぎます。', exampleM: { en: 'This fish is too expensive.', es: 'Este pescado es demasiado caro.' },
    items: [
      D('この えび ^は {大|おお}き＿＿ます。', 'すぎ', ['すぎて', 'すぎる'], 'This shrimp is too big.', 'Esta gamba es demasiado grande.'),
      D('{昨日|きのう}、 {食|た}べ＿＿ました。', 'すぎ', ['たい', 'やすく'], 'I ate too much yesterday.', 'Ayer comí demasiado.'),
      D('この {道|みち} ^は {危|あぶ}な＿＿ ます。', 'すぎ', ['くて', 'そう'], 'This road is too dangerous.', 'Este camino es demasiado peligroso.'),
    ],
  },
  {
    id: 'h_yasui', unit: 2,
    title: { en: '〜やすい / 〜にくい: easy / hard to', es: '〜やすい / 〜にくい: fácil / difícil de' },
    note: { en: 'Verb stem + やすい = "easy to…", + にくい = "hard to…". They work like い-adjectives.', es: 'Raíz del verbo + やすい = "fácil de…", + にくい = "difícil de…". Funcionan como adjetivos い.' },
    example: 'この さしみ ^は {食|た}べやすい です。', exampleM: { en: 'This sashimi is easy to eat.', es: 'Este sashimi es fácil de comer.' },
    items: [
      D('たこ ^は {切|き}り＿＿ です。', 'にくい', ['すぎ', 'たい'], 'Octopus is hard to cut.', 'El pulpo es difícil de cortar.'),
      D('サワさん ^の {話|はなし} ^は わかり＿＿ です。', 'やすい', ['にくく', 'すぎ'], 'Sawa\'s explanations are easy to understand.', 'Las explicaciones de Sawa son fáciles de entender.'),
      D('この {地図|ちず} ^は {見|み}＿＿ です ^ね。', 'にくい', ['にくく', 'すぎる'], 'This map is hard to read, isn\'t it.', 'Este mapa es difícil de leer, ¿verdad?'),
    ],
  },
  {
    id: 'h_sou_look', unit: 2,
    title: { en: '〜そう: looks like', es: '〜そう: parece' },
    note: { en: 'Adjective stem + そう = "looks…" from what you see. いい becomes よさそう. With verbs: 降りそう "looks like it will…".', es: 'Raíz de adjetivo + そう = "parece…" por lo que ves. いい pasa a よさそう. Con verbos: 降りそう "parece que va a…".' },
    example: 'この {魚|さかな} ^は おいしそう です ^ね！', exampleM: { en: 'This fish looks delicious!', es: '¡Este pescado tiene buena pinta!' },
    items: [
      D('この たこ ^は {新鮮|しんせん}＿＿ です。', 'そう', ['すぎ', 'やすい'], 'This octopus looks fresh.', 'Este pulpo parece fresco.'),
      D('{雨|あめ} ^が {降|ふ}り＿＿ です。', 'そう', ['たい', 'すぎ'], 'It looks like it\'s going to rain.', 'Parece que va a llover.'),
      D('その えび、 ＿＿ です ^ね。', 'よさそう', ['いいそう', 'よそう'], 'That shrimp looks good.', 'Esa gamba tiene buena pinta.'),
    ],
  },
  // ---- 3 · Ferry rules
  {
    id: 'h_nakereba', unit: 3,
    title: { en: '〜なければならない: must', es: '〜なければならない: tener que' },
    note: { en: 'ない-form minus い + ければならない = "must, have to". In speech it often shortens to なきゃ.', es: 'Forma ない sin い + ければならない = "tener que". Al hablar se acorta a なきゃ.' },
    example: '{切符|きっぷ} ^を {買|か}わなければ なりません。', exampleM: { en: 'You must buy a ticket.', es: 'Hay que comprar un billete.' },
    items: [
      D('{七時|しちじ} ^に {着|つ}か＿＿ なりません。', 'なければ', ['なくても', 'ないで'], 'I have to arrive at seven.', 'Tengo que llegar a las siete.'),
      D('{規則|きそく} ^を {守|まも}らなければ ＿＿。', 'なりません', ['いけます', 'あります'], 'You must follow the rules.', 'Hay que cumplir las normas.'),
      D('もう {行|い}か＿＿！', 'なきゃ', ['なくて', 'ないで'], 'I\'ve got to go now!', '¡Me tengo que ir ya!'),
    ],
  },
  {
    id: 'h_temo_ii', unit: 3,
    title: { en: '〜てもいい: may, it\'s OK to', es: '〜てもいい: se puede, está bien' },
    note: { en: 'て-form + もいい gives or asks for permission. なくてもいい = "you don\'t have to".', es: 'Forma て + もいい da o pide permiso. なくてもいい = "no hace falta".' },
    example: 'ここ ^に {座|すわ}っても いい です ^か。', exampleM: { en: 'May I sit here?', es: '¿Puedo sentarme aquí?' },
    items: [
      D('{写真|しゃしん} ^を {撮|と}って＿＿ いい です ^か。', 'も', ['は', 'が'], 'May I take a photo?', '¿Puedo hacer una foto?'),
      D('{急|いそ}が＿＿ いい です ^よ。', 'なくても', ['なければ', 'ないで'], 'You don\'t have to hurry.', 'No hace falta que te des prisa.'),
      D('{窓|まど} ^を ＿＿ も いい です。', '{開|あ}けて', ['{開|あ}ける', '{開|あ}け'], 'You may open the window.', 'Puedes abrir la ventana.'),
    ],
  },
  {
    id: 'h_tewa_ikenai', unit: 3,
    title: { en: '〜てはいけない: must not', es: '〜てはいけない: no se debe' },
    note: { en: 'て-form + はいけない forbids something: "you must not…". Casual: ちゃだめ.', es: 'Forma て + はいけない prohíbe algo: "no se puede…". Coloquial: ちゃだめ.' },
    example: 'フェリー ^で {走|はし}っては いけません。', exampleM: { en: 'You must not run on the ferry.', es: 'No se puede correr en el ferry.' },
    items: [
      D('ここ ^で {泳|およ}いで＿＿ いけません。', 'は', ['も', 'を'], 'You must not swim here.', 'Aquí no se puede nadar.'),
      D('{危|あぶ}ない ^から、 さわっては ＿＿。', 'いけません', ['いいです', 'なりません'], 'It\'s dangerous, so don\'t touch it.', 'Es peligroso, no lo toques.'),
      D('{遅|おく}れ＿＿ だめ ^よ！', 'ちゃ', ['ても', 'たら'], 'Don\'t be late!', '¡No llegues tarde!'),
    ],
  },
  // ---- 4 · Directions & gifts
  {
    id: 'h_ageru', unit: 4,
    title: { en: 'あげる / くれる / もらう', es: 'あげる / くれる / もらう' },
    note: { en: 'あげる: I/someone gives to another. くれる: someone gives to me (or my group). もらう: receive from someone (に or から).', es: 'あげる: dar a otra persona. くれる: alguien me da a mí. もらう: recibir de alguien (con に o から).' },
    example: 'ペン ^が {私|わたし} ^に {貝殻|かいがら} ^を くれました。', exampleM: { en: 'Pen gave me a seashell.', es: 'Pen me dio una concha.' },
    items: [
      D('{私|わたし} ^は サワさん ^に お{土産|みやげ} ^を ＿＿。', 'あげました', ['くれました', 'もらいました'], 'I gave Sawa a souvenir.', 'Le di un recuerdo a Sawa.'),
      D('ルルさん ^が {私|わたし} ^に パン ^を ＿＿。', 'くれました', ['あげました', 'もらいました'], 'Lulu gave me bread.', 'Lulu me dio pan.'),
      D('カイトさん ＿＿ {地図|ちず} ^を もらいました。', 'から', ['で', 'を'], 'I got a map from Kaito.', 'Recibí un mapa de Kaito.'),
    ],
  },
  {
    id: 'h_te_ageru', unit: 4,
    title: { en: '〜てあげる / 〜てくれる / 〜てもらう', es: '〜てあげる / 〜てくれる / 〜てもらう' },
    note: { en: 'The same giving verbs after a て-form mean doing a favor: 教えてくれる "(they) kindly tell me".', es: 'Los mismos verbos tras la forma て expresan un favor: 教えてくれる "(alguien) me enseña amablemente".' },
    example: 'ナギ{先生|せんせい} ^が {道|みち} ^を {教|おし}えて くれました。', exampleM: { en: 'Nagi-sensei kindly showed me the way.', es: 'La maestra Nagi me indicó el camino.' },
    items: [
      D('チャプ ^に {本|ほん} ^を {読|よ}んで ＿＿。', 'あげました', ['くれました', 'もらいます'], 'I read a book to Chapu.', 'Le leí un libro a Chapu.'),
      D('ペン ^に {荷物|にもつ} ^を {持|も}って ＿＿。', 'もらいました', ['くれました', 'あげて'], 'I had Pen carry my bags.', 'Pen me llevó las maletas (se lo pedí).'),
      D('{友|とも}だち ^が {手伝|てつだ}って ＿＿。', 'くれました', ['あげました', 'もらいました'], 'My friend helped me.', 'Mi amigo me ayudó.'),
    ],
  },
  {
    id: 'h_to_cond', unit: 4,
    title: { en: '〜と: whenever / if (natural result)', es: '〜と: cuando / si (resultado natural)' },
    note: { en: 'Plain form + と = "when/if A, B always happens". Perfect for directions: 曲がると… "when you turn, …".', es: 'Forma simple + と = "cuando A, siempre B". Ideal para indicaciones: 曲がると… "al girar, …".' },
    example: '{角|かど} ^を {右|みぎ} ^に {曲|ま}がる ^と、 {郵便局|ゆうびんきょく} ^が あります。', exampleM: { en: 'Turn right at the corner and you\'ll see the post office.', es: 'Al girar a la derecha en la esquina, está correos.' },
    items: [
      D('{橋|はし} ^を {渡|わた}る ＿＿、 {港|みなと} ^が {見|み}えます。', 'と', ['ても', 'のに'], 'When you cross the bridge, you can see the harbor.', 'Al cruzar el puente se ve el puerto.'),
      D('まっすぐ {行|い}く ^と、 {海岸|かいがん} ^に ＿＿。', '{出|で}ます', ['{出|で}ましょう', '{出|で}たい'], 'Go straight and you\'ll come out at the beach.', 'Si sigues recto, llegas a la playa.'),
      D('この ボタン ^を ＿＿ ^と、 {電気|でんき} ^が つきます。', '{押|お}す', ['{押|お}した', '{押|お}して'], 'If you press this button, the light comes on.', 'Si pulsas este botón, se enciende la luz.'),
    ],
  },
  // ---- 5 · Weather & plans
  {
    id: 'h_to_omou', unit: 5,
    title: { en: '〜と思う: I think', es: '〜と思う: creo que' },
    note: { en: 'Plain form + と思います = "I think…". With だ: 嵐だと思います.', es: 'Forma simple + と思います = "creo que…". Con sustantivos: 嵐だと思います.' },
    example: '{明日|あした} ^は {晴|は}れる ^と {思|おも}います。', exampleM: { en: 'I think it will clear up tomorrow.', es: 'Creo que mañana despejará.' },
    items: [
      D('{今夜|こんや} ^は {嵐|あらし} ＿＿ ^と {思|おも}います。', 'だ', ['です', 'の'], 'I think there will be a storm tonight.', 'Creo que esta noche habrá tormenta.'),
      D('フェリー ^は {遅|おく}れる ＿＿ {思|おも}います。', 'と', ['を', 'に'], 'I think the ferry will be late.', 'Creo que el ferry llegará tarde.'),
      D('{雨|あめ} ^は もう ＿＿ ^と {思|おも}います ^よ。', '{止|や}んだ', ['{止|や}みます', '{止|や}んで'], 'I think the rain has already stopped.', 'Creo que ya ha parado de llover.'),
    ],
  },
  {
    id: 'h_tsumori', unit: 5,
    title: { en: '〜つもり: intend to', es: '〜つもり: tener la intención' },
    note: { en: 'Dictionary form + つもりです = "I plan / intend to…". ないつもり = "I don\'t intend to".', es: 'Forma de diccionario + つもりです = "tengo intención de…". ないつもり = "no pienso…".' },
    example: '{来週|らいしゅう}、 {島|しま} ^へ {行|い}く つもり です。', exampleM: { en: 'I\'m planning to go to the island next week.', es: 'Pienso ir a la isla la semana que viene.' },
    items: [
      D('{今度|こんど} ^の {休|やす}み ^に {泳|およ}ぐ ＿＿ です。', 'つもり', ['ため', 'はず'], 'I plan to swim on my next day off.', 'Pienso nadar en mis próximas vacaciones.'),
      D('{嵐|あらし} ^の {日|ひ} ^は {出|で}かけ＿＿ つもり です。', 'ない', ['ます', 'たい'], 'I don\'t intend to go out on stormy days.', 'Los días de tormenta no pienso salir.'),
      D('{何|なに} ^を ＿＿ つもり です ^か。', 'する', ['して', 'した'], 'What do you plan to do?', '¿Qué piensas hacer?'),
    ],
  },
  {
    id: 'h_volitional', unit: 5,
    title: { en: 'Volitional 〜よう: let\'s', es: 'Volitivo 〜よう: vamos a' },
    note: { en: 'Casual "let\'s…": 行こう, 食べよう, しよう, 来よう. Add と思う for "I\'m thinking of…".', es: '"Vamos a…" informal: 行こう, 食べよう, しよう, 来よう. Con と思う: "estoy pensando en…".' },
    example: 'いっしょ ^に {花火|はなび} ^を {見|み}よう！', exampleM: { en: 'Let\'s watch the fireworks together!', es: '¡Veamos los fuegos artificiales juntos!' },
    items: [
      D('{雨|あめ} ^が {止|や}んだら、 {海岸|かいがん} ^へ ＿＿。', '{行|い}こう', ['{行|い}きよう', '{行|い}くよう'], 'When the rain stops, let\'s go to the beach.', 'Cuando pare de llover, vamos a la playa.'),
      D('{明日|あした} ^は {早|はや}く {起|お}き＿＿ ^と {思|おも}います。', 'よう', ['ろう', 'たい'], 'I\'m thinking of getting up early tomorrow.', 'Estoy pensando en levantarme temprano mañana.'),
      D('{準備|じゅんび} ^を ＿＿！', 'しよう', ['すよう', 'しろう'], 'Let\'s get ready!', '¡Vamos a prepararnos!'),
    ],
  },
  // ---- 6 · The lost pup
  {
    id: 'h_nagara', unit: 6,
    title: { en: '〜ながら: while doing', es: '〜ながら: mientras' },
    note: { en: 'Verb stem + ながら = doing two things at once. The main action comes last.', es: 'Raíz del verbo + ながら = hacer dos cosas a la vez. La acción principal va al final.' },
    example: 'チャプ ^は {歌|うた}い ながら {歩|ある}いて いました。', exampleM: { en: 'Chapu was walking while singing.', es: 'Chapu caminaba cantando.' },
    items: [
      D('{泣|な}き＿＿ {母|はは} ^を {探|さが}して いました。', 'ながら', ['たり', 'すぎ'], 'He was looking for his mom while crying.', 'Buscaba a su madre llorando.'),
      D('{音楽|おんがく} ^を {聞|き}き ながら ＿＿。', '{泳|およ}ぎます', ['{泳|およ}いで', '{泳|およ}ぐ'], 'I swim while listening to music.', 'Nado escuchando música.'),
      D('{笑|わら}い ながら ＿＿ {話|はな}しました。', 'いろいろ', ['いろいろな', 'いろいろに'], 'We chatted about lots of things while laughing.', 'Hablamos de muchas cosas riéndonos.'),
    ],
  },
  {
    id: 'h_tari', unit: 6,
    title: { en: '〜たり〜たりする: things like', es: '〜たり〜たりする: cosas como' },
    note: { en: 'た-form + り, twice, then する: lists example actions, "do things like A and B".', es: 'Forma た + り, dos veces, y luego する: enumera acciones de ejemplo, "hacer cosas como A y B".' },
    example: '{海岸|かいがん} ^で {泳|およ}いだり {遊|あそ}んだり しました。', exampleM: { en: 'At the beach we swam, played and so on.', es: 'En la playa nadamos, jugamos y demás.' },
    items: [
      D('{貝殻|かいがら} ^を {拾|ひろ}っ＿＿、 {砂|すな} ^で {遊|あそ}んだり しました。', 'たり', ['ながら', 'て'], 'I picked up shells, played in the sand and so on.', 'Recogí conchas, jugué con la arena y demás.'),
      D('{休|やす}み ^は {本|ほん} ^を {読|よ}んだり、 {寝|ね}たり ＿＿。', 'します', ['あります', 'なります'], 'On days off I read books, sleep, that sort of thing.', 'Los días libres leo, duermo y cosas así.'),
      D('{泣|な}い＿＿ {笑|わら}ったり、 {忙|いそが}しい {子|こ} です ^ね。', 'たり', ['ても', 'ながら'], 'Crying one moment, laughing the next: what a busy kid.', 'Ahora llora, ahora ríe: qué niño tan movido.'),
    ],
  },
  {
    id: 'h_sou_hear', unit: 6,
    title: { en: '〜そうだ: I heard that', es: '〜そうだ: dicen que' },
    note: { en: 'Plain form + そうです reports what you heard: "apparently…". Different from the "looks like" そう: here it follows the full plain form.', es: 'Forma simple + そうです transmite lo que has oído: "dicen que…". Distinto de そう "parece": aquí va tras la forma completa.' },
    example: 'チャプ ^は {林|はやし} ^の {方|ほう} ^へ {行|い}った そう です。', exampleM: { en: 'I heard Chapu went toward the woods.', es: 'Dicen que Chapu fue hacia el bosquecillo.' },
    items: [
      D('{明日|あした} ^は {雨|あめ} ^が {降|ふ}る ＿＿ です。', 'そう', ['よう', 'つもり'], 'I heard it\'s going to rain tomorrow.', 'Dicen que mañana va a llover.'),
      D('{天気予報|てんきよほう} ^に よる ^と、 {嵐|あらし} ＿＿ そう です。', 'だ', ['な', 'の'], 'According to the forecast, there\'ll be a storm.', 'Según el pronóstico, habrá tormenta.'),
      D('ルルさん ^の スープ ^は おいしい ＿＿ です。', 'そう', ['すぎ', 'やすい'], 'I hear Lulu\'s soup is delicious.', 'Dicen que la sopa de Lulu está riquísima.'),
    ],
  },
  // ---- 7 · Fixing the light
  {
    id: 'h_potential', unit: 7,
    title: { en: 'Potential form: can do', es: 'Forma potencial: poder' },
    note: { en: 'う-verbs: う → える (直せる). る-verbs: る → られる (見られる). する → できる, 来る → 来られる.', es: 'Verbos う: う → える (直せる). Verbos る: る → られる (見られる). する → できる, 来る → 来られる.' },
    example: 'ナギ{先生|せんせい} ^は {何|なん} ^でも {直|なお}せます。', exampleM: { en: 'Nagi-sensei can fix anything.', es: 'La maestra Nagi puede arreglarlo todo.' },
    items: [
      D('{私|わたし} ^は {泳|およ}＿＿ ます。', 'げ', ['ぎ', 'ぐ'], 'I can swim.', 'Sé nadar.'),
      D('ここ ^から {灯台|とうだい} ^が {見|み}＿＿ ます。', 'られ', ['れれ', 'させ'], 'You can see the lighthouse from here.', 'Desde aquí se ve el faro.'),
      D('{一人|ひとり} ^で {準備|じゅんび} ^が ＿＿ ^か。', 'できます', ['します', 'されます'], 'Can you prepare it by yourself?', '¿Puedes prepararlo tú solo?'),
    ],
  },
  {
    id: 'h_koto_dekiru', unit: 7,
    title: { en: '〜ことができる: be able to', es: '〜ことができる: ser capaz de' },
    note: { en: 'Dictionary form + ことができる means the same as the potential form, a little more formal.', es: 'Forma de diccionario + ことができる equivale a la forma potencial, algo más formal.' },
    example: 'この {道具|どうぐ} ^で {部品|ぶひん} ^を {直|なお}す こと ^が できます。', exampleM: { en: 'You can fix the part with this tool.', es: 'Con esta herramienta se puede arreglar la pieza.' },
    items: [
      D('{夜|よる} ^でも {船|ふね} ^に {乗|の}る ＿＿ ^が できます。', 'こと', ['もの', 'の'], 'You can board the ship even at night.', 'Se puede subir al barco incluso de noche.'),
      D('{暗|くら}くて、 {何|なに} ^も {見|み}る こと ^が ＿＿。', 'できません', ['ありません', 'しません'], 'It\'s so dark I can\'t see anything.', 'Está tan oscuro que no se ve nada.'),
      D('ペン ^は {英語|えいご} ^を ＿＿ こと ^が できます。', '{話|はな}す', ['{話|はな}せる', '{話|はな}して'], 'Pen can speak English.', 'Pen sabe hablar inglés.'),
    ],
  },
  {
    id: 'h_you_ni_naru', unit: 7,
    title: { en: '〜ようになる: come to be able', es: '〜ようになる: llegar a poder' },
    note: { en: 'Dictionary or potential form + ようになる describes a change over time: "now I can…".', es: 'Forma de diccionario o potencial + ようになる describe un cambio: "ahora ya puedo…".' },
    example: '{日本語|にほんご} ^が {話|はな}せる よう ^に なりました。', exampleM: { en: 'I\'ve become able to speak Japanese.', es: 'Ya sé hablar japonés.' },
    items: [
      D('チャプ ^は {泳|およ}げる ＿＿ ^に なりました。', 'よう', ['そう', 'こと'], 'Chapu has learned to swim.', 'Chapu ya sabe nadar.'),
      D('{毎日|まいにち} {練習|れんしゅう}して、 {直|なお}せる よう ^に ＿＿。', 'なりました', ['しました', 'ありました'], 'I practiced every day and now I can fix it.', 'Practiqué cada día y ya sé arreglarlo.'),
      D('{灯台|とうだい} ^が また {光|ひか}る よう ＿＿ なりました。', 'に', ['を', 'が'], 'The lighthouse shines again.', 'El faro vuelve a brillar.'),
    ],
  },
  // ---- 8 · Invitations & reasons
  {
    id: 'h_node', unit: 8,
    title: { en: '〜ので: because (soft)', es: '〜ので: porque (suave)' },
    note: { en: 'Plain form + ので gives a reason politely. Nouns and な-adjectives take な: 嵐なので.', es: 'Forma simple + ので da una razón con suavidad. Sustantivos y adjetivos な llevan な: 嵐なので.' },
    example: '{明日|あした} ^は {都合|つごう} ^が {悪|わる}い ので、 {行|い}けません。', exampleM: { en: 'Tomorrow doesn\'t suit me, so I can\'t go.', es: 'Mañana no me viene bien, así que no puedo ir.' },
    items: [
      D('{嵐|あらし} ＿＿ ので、 フェリー ^は {休|やす}み です。', 'な', ['だ', 'の'], 'Because of the storm, the ferry isn\'t running.', 'Como hay tormenta, no hay ferry.'),
      D('{疲|つか}れた ＿＿、 {早|はや}く {寝|ね}ます。', 'ので', ['のに', 'ても'], 'I\'m tired, so I\'ll go to bed early.', 'Estoy cansado, así que me acostaré pronto.'),
      D('{静|しず}か ＿＿ ので、 ここ ^が {好|す}き です。', 'な', ['で', 'だ'], 'I like it here because it\'s quiet.', 'Me gusta este sitio porque es tranquilo.'),
    ],
  },
  {
    id: 'h_shi', unit: 8,
    title: { en: '〜し: and also (listing reasons)', es: '〜し: y además (razones)' },
    note: { en: 'Plain form + し lists several reasons: "it\'s cheap, and it\'s tasty, so…".', es: 'Forma simple + し enumera varias razones: "es barato, y además está rico, así que…".' },
    example: 'この {店|みせ} ^は {安|やす}い し、 おいしい し、 {大好|だいす}き です。', exampleM: { en: 'This shop is cheap and tasty: I love it.', es: 'Esta tienda es barata y rica: me encanta.' },
    items: [
      D('{天気|てんき} ^も いい ＿＿、 {花火|はなび} ^を {見|み}に {行|い}こう。', 'し', ['ので', 'のに'], 'The weather is nice too, so let\'s go see the fireworks.', 'Además hace buen tiempo, vamos a ver los fuegos.'),
      D('{時間|じかん} ^も ない し、 お{金|かね} ^も ＿＿。', 'ない', ['ある', 'なくて'], 'I have no time, and no money either.', 'No tengo tiempo, y tampoco dinero.'),
      D('{海|うみ} ^は きれい だ し、 {魚|さかな} ^も ＿＿ し、 {最高|さいこう} です。', 'おいしい', ['おいしくて', 'おいしく'], 'The sea is beautiful and the fish is tasty: it\'s the best.', 'El mar es precioso y el pescado está rico: es lo mejor.'),
    ],
  },
  {
    id: 'h_tara', unit: 8,
    title: { en: '〜たら / 〜ば: if, when', es: '〜たら / 〜ば: si, cuando' },
    note: { en: 'た-form + ら = "if/when…" (very common). ば-form: 行けば, 安ければ = "if…" (often for advice or conditions).', es: 'Forma た + ら = "si/cuando…" (muy común). Forma ば: 行けば, 安ければ = "si…" (para consejos o condiciones).' },
    example: '{準備|じゅんび} ^が できたら、 {鐘|かね} ^を {鳴|な}らしましょう。', exampleM: { en: 'When everything\'s ready, let\'s ring the bell.', es: 'Cuando esté todo listo, toquemos la campana.' },
    items: [
      D('{雨|あめ} ^が {降|ふ}っ＿＿、 {中|なか} ^で {遊|あそ}ぼう。', 'たら', ['たり', 'ても'], 'If it rains, let\'s play inside.', 'Si llueve, jugamos dentro.'),
      D('{急|いそ}げ＿＿、 {間|ま}に{合|あ}います ^よ。', 'ば', ['たら', 'と'], 'If you hurry, you\'ll make it.', 'Si te das prisa, llegas a tiempo.'),
      D('{安|やす}けれ＿＿ {買|か}います。', 'ば', ['たら', 'て'], 'If it\'s cheap, I\'ll buy it.', 'Si es barato, lo compro.'),
    ],
  },
];
