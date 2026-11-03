import type { Reading } from '../types';

/** Maple Harbor reading passages (N4): notices, letters and diary entries. The first option is right. */
const R = (id: string, unit: number, text: string, q: Reading['q'], options: Reading['options']): Reading => ({ id, unit, text, q, options });

export const HARBOR_READINGS: Reading[] = [
  R('hr_welcome', 1,
    'もみじ{港|みなと} ^へ ようこそ！ この {町|まち} ^に ^は ペンギン ^と カワウソ ^が {住|す}んで います。 {灯台|とうだい} ^は {百年|ひゃくねん} {前|まえ} ^に できました。 {夜|よる} ^は {灯台|とうだい} ^の {光|ひかり} ^が {船|ふね} ^を {守|まも}ります。',
    { en: 'What does the lighthouse do at night?', es: '¿Qué hace el faro por la noche?' },
    [{ en: 'Its light protects the ships', es: 'Su luz protege los barcos' }, { en: 'It rings a bell', es: 'Toca una campana' }, { en: 'It sells tickets', es: 'Vende billetes' }, { en: 'It closes for a hundred years', es: 'Cierra cien años' }]),
  R('hr_market', 2,
    '{魚市場|うおいちば} ^の お{知|し}らせ： {朝|あさ} {五時|ごじ} ^から {十時|じゅうじ} ^まで です。 {今日|きょう} ^は たこ ^が {安|やす}い です。 えび ^は {少|すく}ない ので、 {早|はや}く {来|き}て ください。',
    { en: 'Why should you come early?', es: '¿Por qué conviene ir temprano?' },
    [{ en: 'There are only a few shrimp', es: 'Quedan pocas gambas' }, { en: 'Octopus is expensive today', es: 'Hoy el pulpo es caro' }, { en: 'The market opens at ten', es: 'El mercado abre a las diez' }, { en: 'Fish are free in the morning', es: 'Por la mañana el pescado es gratis' }]),
  R('hr_rules', 3,
    'フェリー ^の {規則|きそく}： 1. {出発|しゅっぱつ} ^の {十分|じゅっぷん} {前|まえ} ^に {乗|の}らなければ なりません。 2. {船|ふね} ^の {上|うえ} ^で {走|はし}っては いけません。 3. {写真|しゃしん} ^を {撮|と}っても いい です。',
    { en: 'Which of these is allowed on the ferry?', es: '¿Qué está permitido en el ferry?' },
    [{ en: 'Taking photos', es: 'Hacer fotos' }, { en: 'Running on deck', es: 'Correr por la cubierta' }, { en: 'Boarding one minute before departure', es: 'Subir un minuto antes de la salida' }, { en: 'Swimming next to the boat', es: 'Nadar junto al barco' }]),
  R('hr_map', 4,
    'ペンさん ^へ。 {手紙|てがみ} ^を ありがとう。 {私|わたし} ^の {家|いえ} ^は、 {橋|はし} ^を {渡|わた}って、 {二|ふた}つ{目|め} ^の {角|かど} ^を {左|ひだり} ^に {曲|ま}がる ^と あります。 {青|あお}い {屋根|やね} です。 サワ より',
    { en: 'How do you get to Sawa\'s house?', es: '¿Cómo se llega a casa de Sawa?' },
    [{ en: 'Cross the bridge, then turn left at the second corner', es: 'Cruzar el puente y girar a la izquierda en la segunda esquina' }, { en: 'Turn right at the first corner', es: 'Girar a la derecha en la primera esquina' }, { en: 'Go straight to the lighthouse', es: 'Ir recto hasta el faro' }, { en: 'Take the ferry to the island', es: 'Tomar el ferry a la isla' }]),
  R('hr_forecast', 5,
    '{天気予報|てんきよほう}： {今日|きょう} ^は {午後|ごご} ^から {曇|くも}って、 {夜|よる} ^は {嵐|あらし} ^に なる でしょう。 {波|なみ} ^が {高|たか}い ので、 {船|ふね} ^に {乗|の}らない ほう ^が いい です。 {明日|あした} ^の {朝|あさ} ^は {晴|は}れる と {思|おも}われます。',
    { en: 'What does the forecast advise?', es: '¿Qué aconseja el pronóstico?' },
    [{ en: 'Not to take boats tonight', es: 'No subir a barcos esta noche' }, { en: 'To go swimming this afternoon', es: 'Ir a nadar esta tarde' }, { en: 'To watch fireworks tonight', es: 'Ver fuegos artificiales esta noche' }, { en: 'To wait for snow tomorrow', es: 'Esperar la nieve mañana' }]),
  R('hr_diary', 6,
    '{今日|きょう}、 チャプ ^が {迷子|まいご} ^に なりました。 みんな ^で {探|さが}しました。 チャプ ^は {林|はやし} ^で {貝殻|かいがら} ^を {集|あつ}めながら {歌|うた}って いました。 {見|み}つかって、 {本当|ほんとう} ^に {安心|あんしん}しました。',
    { en: 'What was Chapu doing when he was found?', es: '¿Qué hacía Chapu cuando lo encontraron?' },
    [{ en: 'Collecting shells and singing', es: 'Recogiendo conchas y cantando' }, { en: 'Crying on the ferry', es: 'Llorando en el ferry' }, { en: 'Swimming in the harbor', es: 'Nadando en el puerto' }, { en: 'Sleeping at the market', es: 'Durmiendo en el mercado' }]),
  R('hr_repair', 7,
    '{灯台|とうだい} ^の {電気|でんき} ^が {壊|こわ}れて、 {光|ひか}らなく なりました。 {古|ふる}い {部品|ぶひん} ^は もう {買|か}えません ^が、 ナギ{先生|せんせい} ^は {自分|じぶん} ^で {作|つく}る こと ^が できます。 {三日|みっか} ^で {直|なお}せる そう です。',
    { en: 'How will the lighthouse be fixed?', es: '¿Cómo se arreglará el faro?' },
    [{ en: 'Nagi-sensei will make the part herself', es: 'La maestra Nagi fabricará la pieza' }, { en: 'They will buy a new lighthouse', es: 'Comprarán un faro nuevo' }, { en: 'The part arrives by ferry', es: 'La pieza llega en ferry' }, { en: 'It can\'t be fixed', es: 'No se puede arreglar' }]),
  R('hr_invite', 8,
    '{港|みなと} ^の お{祭|まつ}り ^の ご{招待|しょうたい}： {土曜日|どようび} ^の {夜|よる} {七時|しちじ} ^から、 {灯台|とうだい} ^の {前|まえ} ^に {集|あつ}まって ください。 {花火|はなび} ^も ある し、 ルルさん ^の {料理|りょうり} ^も あります。 {雨|あめ} ^が {降|ふ}ったら、 {食堂|しょくどう} ^で します。',
    { en: 'What happens if it rains?', es: '¿Qué pasa si llueve?' },
    [{ en: 'The party moves to the diner', es: 'La fiesta se hace en el comedor' }, { en: 'It\'s cancelled', es: 'Se cancela' }, { en: 'It moves to Sunday', es: 'Se pasa al domingo' }, { en: 'Everyone takes the ferry', es: 'Todos toman el ferry' }]),
];
