import type { DrillItem, GrammarPoint } from '../types';

/** Starlight City grammar (JLPT N1): three points per chapter. */
const D = (q: string, a: string, wrong: string[], en: string, es: string): DrillItem => ({ q, a, wrong, m: { en, es } });

export const STARLIGHT_GRAMMAR: GrammarPoint[] = [
  // ---- 1 · Essence
  {
    id: 'x_naradewa', unit: 1,
    title: { en: '〜ならではの: unique to', es: '〜ならではの: propio de' },
    note: { en: 'Noun + ならではの + noun = "something only … could have / offer". Praise for what is special.', es: 'Sustantivo + ならではの + sustantivo = "algo que solo … puede ofrecer". Elogio de lo especial.' },
    example: 'これ ^は {老舗|しにせ} {劇場|げきじょう} ならでは ^の {雰囲気|ふんいき} だ。', exampleM: { en: 'This atmosphere is something only an old theater has.', es: 'Este ambiente es propio de un teatro con solera.' },
    items: [
      D('{生|なま} ^の {舞台|ぶたい} ＿＿ ^の {感動|かんどう} ^が ある。', 'ならでは', ['ばかり', 'ずくめ'], 'There\'s an emotion only live theater can give.', 'Hay una emoción propia del teatro en vivo.'),
      D('{職人|しょくにん} ならでは ^の ＿＿ ^が {光|ひか}る {作品|さくひん} だ。', '{技|わざ}', ['{技|わざ}^に', '{技|わざ}^を'], 'It\'s a work that shines with true craftsmanship.', 'Es una obra en la que brilla la maestría artesana.'),
      D('この {街|まち} ＿＿ ^の {夜景|やけい} ^を {楽|たの}しんで ください。', 'ならでは', ['ながら', 'といえども'], 'Please enjoy the night view unique to this city.', 'Disfrute de las vistas nocturnas propias de esta ciudad.'),
    ],
  },
  {
    id: 'x_nihokanaranai', unit: 1,
    title: { en: '〜にほかならない: nothing other than', es: '〜にほかならない: no es otra cosa que' },
    note: { en: 'Noun / reason + にほかならない = "is none other than / is precisely". Strong, formal assertion.', es: 'Sustantivo / razón + にほかならない = "no es otra cosa que / es precisamente". Afirmación tajante y formal.' },
    example: '{劇場|げきじょう} ^が {残|のこ}った ^のは、 {観客|かんきゃく} ^の {支|ささ}え ^に ほか ならない。', exampleM: { en: 'The theater survived thanks to nothing other than its audience\'s support.', es: 'Si el teatro sobrevivió fue, ni más ni menos, por el apoyo del público.' },
    items: [
      D('{成功|せいこう} ^の {理由|りゆう} ^は {努力|どりょく} ^に ほか ＿＿。', 'ならない', ['ない', 'ならず'], 'The reason for success is nothing other than effort.', 'La razón del éxito no es otra que el esfuerzo.'),
      D('{彼|かれ} ^が {厳|きび}しい ^のは、 {期待|きたい}して いる から ^に ＿＿ ならない。', 'ほか', ['こそ', 'すら'], 'He\'s strict precisely because he has high hopes.', 'Si es estricto es precisamente porque espera mucho.'),
      D('これ ^は {文化|ぶんか} ^の {破壊|はかい} ＿＿ ほかならない。', 'に', ['を', 'が'], 'This is nothing short of the destruction of culture.', 'Esto no es otra cosa que la destrucción de la cultura.'),
    ],
  },
  {
    id: 'x_toiedomo', unit: 1,
    title: { en: '〜といえども: even though, even if', es: '〜といえども: aunque sea' },
    note: { en: 'Noun / plain form + といえども = "even (an expert / a mayor)…, still…". Formal; often with でも-type contrast.', es: 'Sustantivo / forma simple + といえども = "aunque sea (un experto / un alcalde)…, aun así…". Formal.' },
    example: '{市長|しちょう} ^と いえども、 {劇場|げきじょう} ^を {救|すく}う ^のは {簡単|かんたん} ^では ない。', exampleM: { en: 'Even for the mayor, saving the theater is not easy.', es: 'Aunque sea el alcalde, salvar el teatro no es fácil.' },
    items: [
      D('{名優|めいゆう} ＿＿、 {初日|しょにち} ^は {緊張|きんちょう}する ^もの だ。', 'といえども', ['ならでは', 'ずくめ'], 'Even great actors get nervous on opening night.', 'Hasta los grandes actores se ponen nerviosos el día del estreno.'),
      D('{子|こ}ども ^と いえども、 ＿＿ ^は {守|まも}る べき だ。', '{規則|きそく}', ['{規則|きそく}^に', '{規則|きそく}^が'], 'Even children should follow the rules.', 'Aunque sean niños, deben respetar las normas.'),
      D('{一日|いちにち} ^と いえども、 {練習|れんしゅう} ^を ＿＿ わけ ^には いかない。', '{休|やす}む', ['{休|やす}んで', '{休|やす}み'], 'Even for one day, I can\'t skip practice.', 'Ni un solo día puedo saltarme el ensayo.'),
    ],
  },
  // ---- 2 · Defiance
  {
    id: 'x_womonotomosezu', unit: 2,
    title: { en: '〜をものともせず: undaunted by', es: '〜をものともせず: sin dejarse amedrentar por' },
    note: { en: 'Noun + をものともせず = "in defiance of / undaunted by (a hardship)". Used admiringly about others.', es: 'Sustantivo + をものともせず = "sin arredrarse ante (una dificultad)". Se usa con admiración hacia otros.' },
    example: '{観客|かんきゃく} ^は {大雨|おおあめ} ^を もの ^とも せず、 {劇場|げきじょう} ^に {集|あつ}まった。', exampleM: { en: 'Undaunted by the heavy rain, the audience gathered at the theater.', es: 'Sin dejarse amedrentar por la lluvia, el público acudió al teatro.' },
    items: [
      D('{彼女|かのじょ} ^は けが ＿＿ ものともせず、 {舞台|ぶたい} ^に {立|た}った。', 'を', ['に', 'が'], 'Undaunted by her injury, she took the stage.', 'Sin arredrarse por la lesión, salió al escenario.'),
      D('{困難|こんなん} ^を ＿＿ {挑戦|ちょうせん}し{続|つづ}けた。', 'ものともせず', ['よそに', 'とあって'], 'He kept on trying, undaunted by the difficulties.', 'Siguió intentándolo sin arredrarse ante las dificultades.'),
      D('{批判|ひはん} ^を ものともせず、 {自分|じぶん} ^の {道|みち} ^を ＿＿。', '{進|すす}んだ', ['{進|すす}もう', '{進|すす}みたい'], 'Undaunted by criticism, she went her own way.', 'Sin amedrentarse por las críticas, siguió su camino.'),
    ],
  },
  {
    id: 'x_woyosoni', unit: 2,
    title: { en: '〜をよそに: ignoring, regardless of', es: '〜をよそに: haciendo caso omiso de' },
    note: { en: 'Noun + をよそに = "paying no heed to (others\' worries / advice)". Often slightly critical.', es: 'Sustantivo + をよそに = "sin hacer caso de (preocupaciones / consejos ajenos)". A menudo algo crítico.' },
    example: '{家族|かぞく} ^の {心配|しんぱい} ^を よそ ^に、 ココ ^は {劇場|げきじょう} ^に {通|かよ}い{続|つづ}けた。', exampleM: { en: 'Ignoring her family\'s worries, Coco kept going to the theater.', es: 'Haciendo caso omiso de la preocupación de su familia, Coco siguió yendo al teatro.' },
    items: [
      D('{周囲|しゅうい} ^の {反対|はんたい} ＿＿ よそに、 {計画|けいかく} ^は {進|すす}められた。', 'を', ['に', 'と'], 'Regardless of the opposition around them, the plan went ahead.', 'Haciendo caso omiso de la oposición, el plan siguió adelante.'),
      D('{医者|いしゃ} ^の {忠告|ちゅうこく} ^を ＿＿、 {彼|かれ} ^は {働|はたら}き{続|つづ}けた。', 'よそに', ['ものともせず', 'めぐって'], 'Ignoring the doctor\'s advice, he kept working.', 'Haciendo caso omiso del médico, siguió trabajando.'),
      D('{不安|ふあん} ^を よそに、 {初日|しょにち} ^は {大成功|だいせいこう} ^に ＿＿。', '{終|お}わった', ['{終|お}わろう', '{終|お}わらせ'], 'Despite everyone\'s worries, opening night was a great success.', 'Contra todo temor, el estreno fue un gran éxito.'),
    ],
  },
  {
    id: 'x_toatte', unit: 2,
    title: { en: '〜とあって: because (of a special situation)', es: '〜とあって: dado que (por ser algo especial)' },
    note: { en: 'Noun / plain form + とあって = "because it\'s (a special occasion), naturally…". Common in reporting.', es: 'Sustantivo / forma simple + とあって = "como se trata de (algo especial), naturalmente…". Frecuente en crónicas.' },
    example: '{最後|さいご} ^の {公演|こうえん} ^と あって、 {劇場|げきじょう} ^は {満員|まんいん} だった。', exampleM: { en: 'Being the final performance, the theater was packed.', es: 'Al tratarse de la última función, el teatro estaba lleno.' },
    items: [
      D('{連休|れんきゅう} ＿＿、 {街|まち} ^は {人|ひと} ^で あふれて いた。', 'とあって', ['といえども', 'ならでは'], 'It being a long weekend, the city was overflowing with people.', 'Al ser puente, la ciudad estaba a rebosar.'),
      D('{人気|にんき} {俳優|はいゆう} ^が {出|で}る ^と あって、 {切符|きっぷ} ^は すぐ ＿＿。', '{売|う}り{切|き}れた', ['{売|う}り{切|き}れよう', '{売|う}り{切|き}れたい'], 'Since a popular actor was appearing, tickets sold out at once.', 'Como actuaba un actor famoso, las entradas se agotaron enseguida.'),
      D('{初|はつ}{公開|こうかい} ^と ＿＿、 {記者|きしゃ} ^が {大勢|おおぜい} {集|あつ}まった。', 'あって', ['いって', 'して'], 'As it was a first showing, many reporters came.', 'Al ser un estreno, acudieron muchos periodistas.'),
    ],
  },
  // ---- 3 · Immediacy
  {
    id: 'x_yainaya', unit: 3,
    title: { en: '〜や否や: no sooner… than', es: '〜や否や: nada más' },
    note: { en: 'Dictionary form + や否や (or や) = "as soon as A happened, B immediately happened". Written style.', es: 'Forma de diccionario + や否や (o や) = "en cuanto pasó A, pasó B de inmediato". Estilo escrito.' },
    example: '{批評|ひひょう} ^が {出|で}る や {否|いな}や、 {切符|きっぷ} ^は {売|う}り{切|き}れた。', exampleM: { en: 'No sooner had the review come out than the tickets sold out.', es: 'Nada más salir la crítica, se agotaron las entradas.' },
    items: [
      D('{幕|まく} ^が {上|あ}がる ＿＿ {否|いな}や、 {拍手|はくしゅ} ^が {起|お}こった。', 'や', ['か', 'と'], 'No sooner had the curtain risen than applause broke out.', 'Nada más alzarse el telón, estalló el aplauso.'),
      D('ニュース ^を {聞|き}く や {否|いな}や、 {彼|かれ} ^は {家|いえ} ^を ＿＿。', '{飛|と}び{出|だ}した', ['{飛|と}び{出|だ}そう', '{飛|と}び{出|だ}して'], 'The moment he heard the news, he rushed out of the house.', 'En cuanto oyó la noticia, salió disparado de casa.'),
      D('{席|せき} ^に {着|つ}く や ＿＿、 {劇|げき} ^が {始|はじ}まった。', '{否|いな}や', ['{否|いな}か', 'すら'], 'No sooner had I sat down than the play began.', 'Nada más sentarme, empezó la obra.'),
    ],
  },
  {
    id: 'x_gahayaika', unit: 3,
    title: { en: '〜が早いか: the instant', es: '〜が早いか: en el instante en que' },
    note: { en: 'Dictionary / た form + が早いか = "the instant A, B" (very quick succession, not about yourself).', es: 'Forma de diccionario / た + が早いか = "en el instante en que A, B" (sucesión rapidísima, no sobre uno mismo).' },
    example: '{雑誌|ざっし} ^が {届|とど}く ^が {早|はや}いか、 ポチ ^は {批評|ひひょう} ^を {読|よ}み{始|はじ}めた。', exampleM: { en: 'The instant the magazine arrived, Pochi began reading the review.', es: 'En el instante en que llegó la revista, Pochi empezó a leer la crítica.' },
    items: [
      D('ベル ^が {鳴|な}る ＿＿ {早|はや}いか、 {子|こ}ども たち ^は {走|はし}り{出|だ}した。', 'が', ['を', 'に'], 'The instant the bell rang, the children ran off.', 'En el instante en que sonó el timbre, los niños echaron a correr.'),
      D('{料理|りょうり} ^が {出|で}る ^が ＿＿、 あっという{間|ま} ^に なくなった。', '{早|はや}いか', ['{早|はや}く', '{早|はや}ければ'], 'The moment the food came out, it was gone in a flash.', 'Nada más servir la comida, desapareció en un abrir y cerrar de ojos.'),
      D('{店|みせ} ^が {開|ひら}く が {早|はや}いか、 {客|きゃく} ^が ＿＿。', '{押|お}し{寄|よ}せた', ['{押|お}し{寄|よ}せよう', '{押|お}し{寄|よ}せる^な'], 'The instant the shop opened, customers flooded in.', 'En cuanto abrió la tienda, la clientela se abalanzó.'),
    ],
  },
  {
    id: 'x_nari', unit: 3,
    title: { en: '〜なり: as soon as (and then, unexpectedly)', es: '〜なり: nada más (y de repente)' },
    note: { en: 'Dictionary form + なり = "as soon as A, (someone) did B (surprisingly)". Subject is usually a third person.', es: 'Forma de diccionario + なり = "nada más A, (alguien) hizo B (inesperadamente)". El sujeto suele ser otra persona.' },
    example: 'ミケ ^は {舞台|ぶたい} ^を {見|み}る なり、 {泣|な}き{出|だ}した。', exampleM: { en: 'As soon as Mike saw the stage, she burst into tears.', es: 'Nada más ver el escenario, Mike rompió a llorar.' },
    items: [
      D('{彼|かれ} ^は {部屋|へや} ^に {入|はい}る ＿＿、 {倒|たお}れ{込|こ}んだ。', 'なり', ['ながら', 'ならでは'], 'As soon as he entered the room, he collapsed.', 'Nada más entrar en la habitación, se desplomó.'),
      D('{手紙|てがみ} ^を {読|よ}む なり、 {彼女|かのじょ} ^は ＿＿。', '{笑|わら}い{出|だ}した', ['{笑|わら}おう', '{笑|わら}いたい'], 'As soon as she read the letter, she burst out laughing.', 'Nada más leer la carta, se echó a reír.'),
      D('{顔|かお} ^を {見|み}る ＿＿ {怒|おこ}り{出|だ}した。', 'なり', ['とあって', 'をよそに'], 'The moment he saw my face, he got angry.', 'Nada más verme la cara, se enfadó.'),
    ],
  },
  // ---- 4 · Force and feeling
  {
    id: 'x_woyoginaku', unit: 4,
    title: { en: '〜を余儀なくされる: be forced to', es: '〜を余儀なくされる: verse obligado a' },
    note: { en: 'Action noun + を余儀なくされる = "be forced (by circumstances) to…": 閉鎖を余儀なくされる.', es: 'Sustantivo de acción + を余儀なくされる = "verse obligado (por las circunstancias) a…": 閉鎖を余儀なくされる.' },
    example: '{配管|はいかん} ^の {故障|こしょう} ^で、 {劇場|げきじょう} ^は {休館|きゅうかん} ^を {余儀|よぎ}なく された。', exampleM: { en: 'A plumbing failure forced the theater to close temporarily.', es: 'Una avería en las tuberías obligó al teatro a cerrar temporalmente.' },
    items: [
      D('{悪天候|あくてんこう} ^の ため、 {公演|こうえん} ^は {中止|ちゅうし} ＿＿ {余儀|よぎ}なく された。', 'を', ['に', 'が'], 'Due to bad weather, the performance had to be cancelled.', 'Por el mal tiempo, hubo que suspender la función.'),
      D('{資金|しきん} {不足|ぶそく} ^で、 {計画|けいかく} ^の {変更|へんこう} ^を ＿＿。', '{余儀|よぎ}なく された', ['{余儀|よぎ}なく した', '{余儀|よぎ}ない'], 'A lack of funds forced a change of plan.', 'La falta de fondos obligó a cambiar el plan.'),
      D('けが ^で {引退|いんたい} ^を {余儀|よぎ}なく ＿＿ {選手|せんしゅ} ^も いる。', 'される', ['させる', 'する'], 'Some athletes are forced to retire by injury.', 'Hay deportistas obligados a retirarse por lesión.'),
    ],
  },
  {
    id: 'x_zunihaokanai', unit: 4,
    title: { en: '〜ずにはおかない: will surely (cause)', es: '〜ずにはおかない: no dejará de' },
    note: { en: 'ない-stem + ずにはおかない (する → せずにはおかない) = "is bound to / will inevitably (move, provoke…)". Often about emotions it causes.', es: 'Raíz ない + ずにはおかない (する → せずにはおかない) = "no dejará de / provocará sin falta". Suele referirse a emociones.' },
    example: 'この {芝居|しばい} ^は {観客|かんきゃく} ^を {感動|かんどう}させず ^には おかない だろう。', exampleM: { en: 'This play is bound to move the audience.', es: 'Esta obra no dejará de emocionar al público.' },
    items: [
      D('{彼|かれ} ^の {演技|えんぎ} ^は {人|ひと} ^を {泣|な}かせ＿＿ ^には おかない。', 'ず', ['ない', 'ぬ'], 'His acting is bound to make people cry.', 'Su interpretación no dejará de hacer llorar.'),
      D('この {事件|じけん} ^は {社会|しゃかい} ^に {影響|えいきょう} ^を {与|あた}えず ^には ＿＿。', 'おかない', ['いられない', 'ならない'], 'This incident is bound to affect society.', 'Este suceso no dejará de influir en la sociedad.'),
      D('{真実|しんじつ} ^を {明|あき}らか ^に せ＿＿ ^には おかない。', 'ず', ['ずに', 'ない'], 'I will surely bring the truth to light.', 'Sacaré la verdad a la luz sin falta.'),
    ],
  },
  {
    id: 'x_teyamanai', unit: 4,
    title: { en: '〜てやまない: never cease to', es: '〜てやまない: no dejar de (desear)' },
    note: { en: 'て-form of feeling verbs (願う, 祈る, 愛する) + やまない = "deeply and constantly (hope / love)…". Very formal.', es: 'Forma て de verbos de sentimiento (願う, 祈る, 愛する) + やまない = "desear / amar profunda y constantemente". Muy formal.' },
    example: '{劇場|げきじょう} ^の {再開|さいかい} ^を {願|ねが}って やまない。', exampleM: { en: 'I never cease to hope for the theater\'s reopening.', es: 'No dejo de desear la reapertura del teatro.' },
    items: [
      D('みなさま ^の ご{健康|けんこう} ^を {祈|いの}って ＿＿。', 'やみません', ['いられません', 'おきません'], 'I sincerely pray for everyone\'s health.', 'Rezo de corazón por la salud de todos.'),
      D('{彼|かれ} ^は {故郷|こきょう} ^を {愛|あい}して ＿＿ {詩人|しじん} だった。', 'やまない', ['おかない', 'たまらない'], 'He was a poet who never ceased to love his hometown.', 'Era un poeta que no dejaba de amar su tierra.'),
      D('{皆|みな} ^の {成功|せいこう} ^を {願|ねが}って ＿＿。', 'やまない', ['やめない', 'やまず'], 'I deeply hope for everyone\'s success.', 'Deseo de corazón el éxito de todos.'),
    ],
  },
  // ---- 5 · Circumstance
  {
    id: 'x_niatte', unit: 5,
    title: { en: '〜にあって: in (a situation)', es: '〜にあって: en (tal situación)' },
    note: { en: 'Noun + にあって = "being in (a special situation / place), …". Formal; often contrasts with the result.', es: 'Sustantivo + にあって = "estando en (una situación / lugar especial), …". Formal.' },
    example: '{物価|ぶっか} ^の {高|たか}い {都会|とかい} ^に あって、 レオ ^の {店|みせ} ^は {良心的|りょうしんてき} だ。', exampleM: { en: 'Even in a city with high prices, Leo\'s restaurant is reasonable.', es: 'En una ciudad tan cara, el restaurante de Leo tiene precios razonables.' },
    items: [
      D('{逆境|ぎゃっきょう} ＿＿ あって、 {彼|かれ} ^は {笑顔|えがお} ^を {忘|わす}れなかった。', 'に', ['を', 'で'], 'Even in adversity, he never forgot to smile.', 'En plena adversidad, nunca perdió la sonrisa.'),
      D('{厳|きび}しい {競争|きょうそう} ^の {中|なか} ^に ＿＿、 {老舗|しにせ} ^は {生|い}き{残|のこ}った。', 'あって', ['いって', 'おいて'], 'Amid fierce competition, the old shop survived.', 'En medio de una competencia feroz, el establecimiento sobrevivió.'),
      D('{非常時|ひじょうじ} ^に あって ^は、 {冷静|れいせい} ^な {判断|はんだん} ^が ＿＿ だ。', '{必要|ひつよう}', ['{必要|ひつよう}^な', '{必要|ひつよう}^に'], 'In an emergency, calm judgment is needed.', 'En una emergencia, hace falta juicio sereno.'),
    ],
  },
  {
    id: 'x_tomonaruto', unit: 5,
    title: { en: '〜ともなると: when it comes to (a higher level)', es: '〜ともなると: cuando se trata de (un nivel superior)' },
    note: { en: 'Noun + ともなると / ともなれば = "once you reach (a certain level / role), naturally…".', es: 'Sustantivo + ともなると / ともなれば = "cuando se llega a (cierto nivel / cargo), naturalmente…".' },
    example: '{料理長|りょうりちょう} ^と も なる ^と、 {責任|せきにん} ^も {重|おも}く なる。', exampleM: { en: 'When you become head chef, the responsibility grows heavier too.', es: 'Cuando eres jefe de cocina, la responsabilidad también pesa más.' },
    items: [
      D('{週末|しゅうまつ} ＿＿、 この {店|みせ} ^は {常連|じょうれん} ^で いっぱい だ。', 'ともなると', ['といえども', 'にあって'], 'On weekends, this place fills up with regulars.', 'Los fines de semana, el local se llena de habituales.'),
      D('プロ ^と も ＿＿、 {一日|いちにち} {十時間|じゅうじかん} ^の {練習|れんしゅう} ^も {珍|めずら}しく ない。', 'なると', ['すると', 'あると'], 'At the professional level, ten hours of practice a day isn\'t unusual.', 'En el nivel profesional, entrenar diez horas al día no es raro.'),
      D('{主役|しゅやく} ^と も なれ ^ば、 {台詞|せりふ} ^も ＿＿。', '{多|おお}い', ['{多|おお}く', '{多|おお}くて'], 'When you\'re the lead, you have lots of lines.', 'Si eres el protagonista, tienes muchas líneas.'),
    ],
  },
  {
    id: 'x_niitattewa', unit: 5,
    title: { en: '〜に至っては: as for (the extreme case)', es: '〜に至っては: en cuanto a (el caso extremo)' },
    note: { en: 'Noun + に至っては = "and as for X (the most extreme example)…". Used to add a striking case.', es: 'Sustantivo + に至っては = "y en cuanto a X (el caso más extremo)…". Añade un ejemplo llamativo.' },
    example: '{役者|やくしゃ} たち ^は みな {疲|つか}れて いた。 {主役|しゅやく} ^に {至|いた}って ^は、 {三日|みっか} {寝|ね}て いない。', exampleM: { en: 'The actors were all exhausted. As for the lead, he hadn\'t slept in three days.', es: 'Los actores estaban agotados. Y el protagonista, en concreto, llevaba tres días sin dormir.' },
    items: [
      D('{兄|あに} ^は {料理|りょうり} ^が {苦手|にがて} だ。 {弟|おとうと} ^に ＿＿ ^は、 お{湯|ゆ} ^も わかせない。', '{至|いた}って', ['{限|かぎ}って', 'あって'], 'My older brother can\'t cook. My younger one can\'t even boil water.', 'Mi hermano mayor cocina mal. Y el pequeño ni siquiera sabe hervir agua.'),
      D('{客|きゃく} ^は {少|すく}なかった。 {平日|へいじつ} ^に {至|いた}って ^は、 {一人|ひとり} ^も ＿＿ {日|ひ} ^も あった。', '{来|こ}ない', ['{来|く}る', '{来|き}て'], 'Customers were few. On weekdays there were days when not a single one came.', 'Venía poca gente. Entre semana, hubo días sin ni un cliente.'),
      D('{費用|ひよう} ＿＿ {至|いた}って ^は、 {予算|よさん} ^の {三倍|さんばい} だった。', 'に', ['を', 'が'], 'As for the cost, it was three times the budget.', 'En cuanto al coste, triplicaba el presupuesto.'),
    ],
  },
  // ---- 6 · Propriety
  {
    id: 'x_majiki', unit: 6,
    title: { en: '〜まじき: unbefitting', es: '〜まじき: impropio de' },
    note: { en: 'Noun + として + dictionary form + まじき + noun = "an act unbefitting a…". する → すまじき. Very formal.', es: 'Sustantivo + として + forma de diccionario + まじき + sustantivo = "un acto impropio de…". する → すまじき. Muy formal.' },
    example: '{観客|かんきゃく} ^を {待|ま}たせる ^のは、 {役者|やくしゃ} ^として ある まじき こと だ。', exampleM: { en: 'Keeping the audience waiting is unbefitting an actor.', es: 'Hacer esperar al público es impropio de un actor.' },
    items: [
      D('{教師|きょうし} ^として {許|ゆる}す ＿＿ {行為|こうい} だ。', 'まじき', ['べからず', 'ならでは'], 'It\'s behavior a teacher can\'t tolerate.', 'Es una conducta que un profesor no puede tolerar.'),
      D('{嘘|うそ} ^を つく ^のは、 {記者|きしゃ} ^として ＿＿ まじき ことだ。', 'ある', ['いる', 'する'], 'Lying is unbefitting a journalist.', 'Mentir es impropio de un periodista.'),
      D('{市長|しちょう} ^に ＿＿ まじき {発言|はつげん} ^だった。', 'ある', ['なる', 'する'], 'It was a remark unbefitting a mayor.', 'Fue una declaración impropia de un alcalde.'),
    ],
  },
  {
    id: 'x_bekarazu', unit: 6,
    title: { en: '〜べからず: must not (signs)', es: '〜べからず: prohibido (carteles)' },
    note: { en: 'Dictionary form + べからず = strong prohibition on signs and rules: 立ち入るべからず "Keep out". する → すべからず.', es: 'Forma de diccionario + べからず = prohibición tajante en carteles: 立ち入るべからず "Prohibido el paso". する → すべからず.' },
    example: '{関係者|かんけいしゃ} {以外|いがい}、 {立|た}ち{入|い}る べからず。', exampleM: { en: 'Staff only. Keep out.', es: 'Solo personal autorizado. Prohibido el paso.' },
    items: [
      D('{芝生|しばふ} ^に {入|はい}る ＿＿。', 'べからず', ['まじき', 'やまない'], 'Keep off the grass.', 'Prohibido pisar el césped.'),
      D('{初心|しょしん} {忘|わす}る ＿＿。', 'べからず', ['べき', 'まい'], 'Never forget your beginner\'s spirit.', 'No olvides nunca el espíritu del principiante.'),
      D('ここ ^で ゴミ ^を {捨|す}てる ＿＿。', 'べからず', ['べからざる', 'べし'], 'Do not dump trash here.', 'Prohibido tirar basura aquí.'),
    ],
  },
  {
    id: 'x_nganTame', unit: 6,
    title: { en: '〜んがため: in order to (literary)', es: '〜んがため: con el fin de (literario)' },
    note: { en: 'ない-stem + んがため(に) = "in order to (achieve)" with strong will. する → せんがため. Literary.', es: 'Raíz ない + んがため(に) = "con el fin de (lograr)" con fuerte voluntad. する → せんがため. Literario.' },
    example: '{夢|ゆめ} ^を かなえ ん ^が ため、 ココ ^は {毎日|まいにち} {稽古|けいこ} ^を {続|つづ}けた。', exampleM: { en: 'To make her dream come true, Coco rehearsed every day.', es: 'Con el fin de cumplir su sueño, Coco ensayaba cada día.' },
    items: [
      D('{勝|か}た＿＿ がため ^に、 {必死|ひっし} ^に {練習|れんしゅう}した。', 'ん', ['ず', 'ぬ'], 'He practiced desperately in order to win.', 'Entrenó a muerte con el fin de ganar.'),
      D('{真実|しんじつ} ^を {知|し}ら ん ＿＿ ため、 {彼|かれ} ^は {旅|たび} ^に {出|で}た。', 'が', ['を', 'の'], 'To learn the truth, he set out on a journey.', 'Con el fin de conocer la verdad, emprendió un viaje.'),
      D('{合格|ごうかく} ＿＿ がため、 {寝|ね}る {間|ま} ^も {惜|お}しんで {勉強|べんきょう}した。', 'せん', ['しん', 'さん'], 'In order to pass, she studied, begrudging even sleep.', 'Con el fin de aprobar, estudió quitándole horas al sueño.'),
    ],
  },
  // ---- 7 · Evaluation
  {
    id: 'x_kiraigaaru', unit: 7,
    title: { en: '〜きらいがある: tend to (bad habit)', es: '〜きらいがある: tener tendencia a (algo malo)' },
    note: { en: 'Dictionary form / noun + の + きらいがある = "has an (undesirable) tendency to…".', es: 'Forma de diccionario / sustantivo + の + きらいがある = "tiende a… (algo negativo)".' },
    example: 'ポチ ^は {物事|ものごと} ^を {大|おお}げさ ^に {書|か}く きらい ^が ある。', exampleM: { en: 'Pochi has a tendency to exaggerate when he writes.', es: 'Pochi tiende a exagerar cuando escribe.' },
    items: [
      D('{彼|かれ} ^は {人|ひと} ^の {話|はなし} ^を {聞|き}かない ＿＿ ^が ある。', 'きらい', ['おそれ', 'かぎり'], 'He has a tendency not to listen to others.', 'Tiende a no escuchar a los demás.'),
      D('{最近|さいきん} ^の {作品|さくひん} ^は {説明|せつめい} {過多|かた} ^の きらい ＿＿ ある。', 'が', ['を', 'に'], 'Recent works tend to over-explain.', 'Las obras recientes tienden a explicarlo todo demasiado.'),
      D('{完璧|かんぺき} ^を {求|もと}め すぎる きらい ^が ＿＿。', 'ある', ['いる', 'する'], 'He tends to demand too much perfection.', 'Tiende a exigir demasiada perfección.'),
    ],
  },
  {
    id: 'x_zukume', unit: 7,
    title: { en: '〜ずくめ: nothing but, full of', es: '〜ずくめ: lleno de, solo' },
    note: { en: 'Noun + ずくめ = "entirely / nothing but…": 黒ずくめ "all in black", いいことずくめ "nothing but good things".', es: 'Sustantivo + ずくめ = "todo… / solo…": 黒ずくめ "de negro de pies a cabeza", いいことずくめ "solo cosas buenas".' },
    example: '{今年|ことし} ^は {劇場|げきじょう} ^に とって いい こと ずくめ だった。', exampleM: { en: 'This year was nothing but good news for the theater.', es: 'Este año solo trajo cosas buenas para el teatro.' },
    items: [
      D('{黒|くろ}＿＿ ^の {服|ふく} ^を {着|き}た {男|おとこ} ^が {現|あらわ}れた。', 'ずくめ', ['ばかり', 'だらけ'], 'A man dressed all in black appeared.', 'Apareció un hombre vestido de negro de pies a cabeza.'),
      D('{結婚|けっこん}、 {昇進|しょうしん}、 {新居|しんきょ}。 めでたい こと ＿＿ だ。', 'ずくめ', ['ならでは', 'きらい'], 'Marriage, promotion, a new home: nothing but happy events.', 'Boda, ascenso, casa nueva: todo son alegrías.'),
      D('{規則|きそく} ずくめ ^の {生活|せいかつ} ^は ＿＿。', '{息苦|いきぐる}しい', ['{息苦|いきぐる}しく', '{息苦|いきぐる}しさ'], 'A life full of rules is stifling.', 'Una vida llena de normas resulta asfixiante.'),
    ],
  },
  {
    id: 'x_nitaru', unit: 7,
    title: { en: '〜に足る: worthy of', es: '〜に足る: digno de' },
    note: { en: 'Dictionary form / noun + に足る + noun = "worthy of / deserving…": 信頼に足る人物 "a person worthy of trust". Negative: に足らない.', es: 'Forma de diccionario / sustantivo + に足る + sustantivo = "digno de…": 信頼に足る人物 "persona digna de confianza". Negativo: に足らない.' },
    example: 'これ ^は {観客|かんきゃく} ^に {見|み}せる ^に {足|た}る {脚本|きゃくほん} だ。', exampleM: { en: 'This is a script worthy of showing an audience.', es: 'Este guion es digno de mostrarse al público.' },
    items: [
      D('{彼|かれ} ^は {信頼|しんらい} ^に ＿＿ {人物|じんぶつ} だ。', '{足|た}る', ['{足|た}りる', '{足|た}らず'], 'He is a person worthy of trust.', 'Es una persona digna de confianza.'),
      D('{取|と}る ^に {足|た}ら ＿＿ {問題|もんだい} だ。', 'ない', ['ず', 'ぬ'], 'It\'s a trivial problem.', 'Es un problema insignificante.'),
      D('{満足|まんぞく}する ^に {足|た}る ＿＿ ^が {出|で}た。', '{結果|けっか}', ['{結果|けっか}^に', '{結果|けっか}^を'], 'We got a result worth being satisfied with.', 'Obtuvimos un resultado satisfactorio.'),
    ],
  },
  // ---- 8 · Emotion and nuance
  {
    id: 'x_nagaramo', unit: 8,
    title: { en: '〜ながらも: although, while', es: '〜ながらも: aunque, pese a' },
    note: { en: 'Verb stem / adjective / noun + ながらも = "although…, still…". Often with mixed feelings: 小さいながらも "small, but…".', es: 'Raíz verbal / adjetivo / sustantivo + ながらも = "aunque…, aun así…". 小さいながらも "pequeño, pero…".' },
    example: '{小|ちい}さい ながら ^も、 {心|こころ} ^の こもった {舞台|ぶたい} だった。', exampleM: { en: 'Small as it was, it was a stage full of heart.', es: 'Aunque pequeño, era un escenario lleno de corazón.' },
    items: [
      D('{緊張|きんちょう}し ＿＿ も、 {最後|さいご} ^まで {演|えん}じきった。', 'ながら', ['なり', 'ずくめ'], 'Though nervous, she performed to the very end.', 'Aunque nerviosa, actuó hasta el final.'),
      D('{悪|わる}い ^と {知|し}り ながら ^も、 ＿＿ しまった。', 'やって', ['やる', 'やろう'], 'I knew it was wrong, but I did it anyway.', 'Aun sabiendo que estaba mal, lo hice.'),
      D('{狭|せま}い ながら ^も ＿＿ {我|わ}が{家|や}。', '{楽|たの}しい', ['{楽|たの}しく', '{楽|たの}しさ'], 'Small but happy, our home.', 'Pequeño pero feliz, nuestro hogar.'),
    ],
  },
  {
    id: 'x_monowo', unit: 8,
    title: { en: '〜ものを: if only… (regret)', es: '〜ものを: si al menos… (lamento)' },
    note: { en: 'Plain form + ものを = "if only…, (but it didn\'t happen)". Expresses regret or reproach.', es: 'Forma simple + ものを = "si tan solo…, (pero no pasó)". Expresa lamento o reproche.' },
    example: '{言|い}って くれれ ^ば {手伝|てつだ}った もの ^を。', exampleM: { en: 'If only you\'d told me, I would have helped.', es: 'Si me lo hubieras dicho, te habría ayudado.' },
    items: [
      D('もっと {早|はや}く {来|く}れ ^ば {間|ま}に{合|あ}った ＿＿。', 'ものを', ['ものの', 'ものか'], 'If only you\'d come earlier, you\'d have made it.', 'Si hubieras venido antes, habrías llegado a tiempo.'),
      D('{謝|あやま}れ ^ば {許|ゆる}して あげた ものを、 {彼|かれ} ^は ＿＿。', '{黙|だま}って いた', ['{黙|だま}ろう', '{黙|だま}りたい'], 'I\'d have forgiven him if he\'d apologized, but he said nothing.', 'Le habría perdonado si se hubiera disculpado, pero se quedó callado.'),
      D('{知|し}って いれ ^ば {止|と}めた ＿＿。', 'ものを', ['ものなら', 'ものだ'], 'If only I\'d known, I\'d have stopped it.', 'De haberlo sabido, lo habría impedido.'),
    ],
  },
  {
    id: 'x_tobakarini', unit: 8,
    title: { en: '〜とばかりに: as if to say', es: '〜とばかりに: como diciendo' },
    note: { en: 'Quote / plain form + とばかりに = "(acting) as if to say…". Describes someone\'s visible attitude.', es: 'Cita / forma simple + とばかりに = "(actuar) como diciendo…". Describe la actitud visible de alguien.' },
    example: '{観客|かんきゃく} ^は 「もう {一度|いちど}！」 ^と ばかり ^に {拍手|はくしゅ} ^を {続|つづ}けた。', exampleM: { en: 'The audience kept clapping as if to say "One more time!"', es: 'El público siguió aplaudiendo como diciendo "¡Otra vez!".' },
    items: [
      D('{彼女|かのじょ} ^は 「{待|ま}って いました」 ^と ＿＿ {立|た}ち{上|あ}がった。', 'ばかりに', ['ながらも', 'あって'], 'She stood up as if to say "I\'ve been waiting for this."', 'Se levantó como diciendo "Lo estaba esperando".'),
      D('{犬|いぬ} ^は {遊|あそ}んで ^と ばかりに ＿＿ ^を {振|ふ}った。', 'しっぽ', ['しっぽ^に', 'しっぽ^が'], 'The dog wagged its tail as if to say "Play with me."', 'El perro movía la cola como diciendo "Juega conmigo".'),
      D('{今|いま} ^が チャンス ^と ＿＿、 {彼|かれ} ^は {話|はな}し{始|はじ}めた。', 'ばかりに', ['ものを', 'ならでは'], 'As if seizing the moment, he began to speak.', 'Como quien ve su oportunidad, empezó a hablar.'),
    ],
  },
];
