import type { Reading } from '../types';

/** Lantern Hills reading passages (N3). The first option is right. */
const R = (id: string, unit: number, text: string, q: Reading['q'], options: Reading['options']): Reading => ({ id, unit, text, q, options });

export const LANTERN_READINGS: Reading[] = [
  R('lr_legend', 1,
    'ちょうちん{丘|おか} ^には、 {昔|むかし} ^から 「{千灯祭|せんとうさい}」 ^という {祭|まつ}り ^が ある。 {秋|あき} ^の {夜|よる}、 {丘|おか} ^の {道|みち} ^に {千|せん} ^の {提灯|ちょうちん} ^を {灯|とも}し、 {迷|まよ}った {人|ひと} ^が {家|いえ} ^に {帰|かえ}れる よう ^に {願|ねが}う ^の ^だ。',
    { en: 'Why are the thousand lanterns lit?', es: '¿Para qué se encienden los mil farolillos?' },
    [{ en: 'So people who are lost can find their way home', es: 'Para que quien se pierda pueda volver a casa' }, { en: 'To scare away foxes', es: 'Para asustar a los zorros' }, { en: 'To sell them at the night market', es: 'Para venderlos en el mercado nocturno' }, { en: 'To celebrate the first snow', es: 'Para celebrar la primera nevada' }]),
  R('lr_market', 2,
    'ポコ ^の {屋台|やたい} ^の お{知|し}らせ： {提灯|ちょうちん} {一|ひと}つ {八百円|はっぴゃくえん}。 {三|みっ}つ {買|か}えば {二千円|にせんえん}。 {売|う}り{切|き}れ ^に なる {前|まえ} ^に ぜひ！ ※ {赤|あか}い {提灯|ちょうちん} ^は {品質|ひんしつ} ^が {特|とく} ^に いい ので、 {値引|ねび}き ^は できません。',
    { en: 'Which statement is true?', es: '¿Qué afirmación es correcta?' },
    [{ en: 'Buying three costs less than three separately', es: 'Comprar tres sale más barato que por separado' }, { en: 'Red lanterns can be discounted', es: 'Los farolillos rojos tienen descuento' }, { en: 'The lanterns are already sold out', es: 'Los farolillos ya están agotados' }, { en: 'One lantern costs 2,000 yen', es: 'Un farolillo cuesta 2000 yenes' }]),
  R('lr_rumor', 3,
    '{最近|さいきん}、 {夜|よる} ^に なる ^と {提灯|ちょうちん} ^が {一|ひと}つずつ {消|き}える らしい。 {近所|きんじょ} ^の {人|ひと} ^は 「{狐|きつね} ^の {幽霊|ゆうれい} ^の しわざ だ」 ^と {騒|さわ}いで いる ^が、 ギン{先生|せんせい} ^は 「{幽霊|ゆうれい} ^が {提灯|ちょうちん} ^を {持|も}って いく はず ^が ない」 ^と {言|い}う。',
    { en: 'What does Gin-sensei think?', es: '¿Qué piensa la maestra Gin?' },
    [{ en: 'A ghost couldn\'t be taking the lanterns', es: 'Es imposible que un fantasma se lleve los farolillos' }, { en: 'A fox ghost is to blame', es: 'La culpa es de un zorro fantasma' }, { en: 'The neighbors are stealing them', es: 'Los vecinos los roban' }, { en: 'The lanterns burn out by themselves', es: 'Los farolillos se apagan solos' }]),
  R('lr_clue', 4,
    '{提灯|ちょうちん} ^が {消|き}えた {場所|ばしょ} ^には、 いつも {小|ちい}さな {足跡|あしあと} ^が {残|のこ}って いた。 {足跡|あしあと} ^は {丘|おか} ^の {上|うえ} ^の {古|ふる}い {家|いえ} ^の {方|ほう} ^へ {続|つづ}いて いる。 {犯人|はんにん} ^は {子|こ}ども ^に {違|ちが}いない。',
    { en: 'Where do the footprints lead?', es: '¿Adónde llevan las huellas?' },
    [{ en: 'Toward an old house at the top of the hill', es: 'Hacia una casa vieja en lo alto de la colina' }, { en: 'Into the ramen shop', es: 'Al interior del ramen' }, { en: 'Down to the river', es: 'Hasta el río' }, { en: 'To the dojo gate', es: 'A la puerta del dojo' }]),
  R('lr_ramen', 5,
    'タマ ^の ラーメン ^の {作|つく}り{方|かた}： {前|まえ} ^の {日|ひ} ^に スープ ^を {煮込|にこ}んで おく。 {焦|こ}がして しまわない よう ^に、 ときどき まぜる。 お{客|きゃく}さん ^が {来|き}たら、 {熱|あつ}い うち ^に {出|だ}す。',
    { en: 'When is the soup made?', es: '¿Cuándo se prepara la sopa?' },
    [{ en: 'The day before', es: 'El día anterior' }, { en: 'When the customer arrives', es: 'Cuando llega el cliente' }, { en: 'After it cools down', es: 'Después de que se enfríe' }, { en: 'Only on festival day', es: 'Solo el día del festival' }]),
  R('lr_letter', 6,
    'コロ ^へ。 おばあちゃん ^は {最近|さいきん}、 {目|め} ^が {悪|わる}く なって、 {夜|よる} ^は {外|そと} ^に {出|で}られません。 でも、 {一度|いちど} だけ {千灯祭|せんとうさい} ^を {見|み}たい です。 {無理|むり} ^は させたく ない ので、 {心配|しんぱい}しないで ね。 おばあちゃん より',
    { en: 'Why can\'t Grandma go out at night?', es: '¿Por qué la abuela no puede salir de noche?' },
    [{ en: 'Her eyesight has gotten worse', es: 'Ha perdido vista' }, { en: 'She is too busy cooking', es: 'Está muy ocupada cocinando' }, { en: 'She is afraid of foxes', es: 'Le dan miedo los zorros' }, { en: 'Her legs are injured', es: 'Tiene las piernas heridas' }]),
  R('lr_path', 7,
    '{日|ひ} ^が {暮|く}れない うち ^に、 みんな ^で {坂道|さかみち} ^に {提灯|ちょうちん} ^を {並|なら}べた。 {暗|くら}く なった とたん、 {道|みち} ^が {光|ひかり} ^の {川|かわ} ^の よう ^に {輝|かがや}いた。 おばあちゃん ^は コロ ^に {手|て} ^を ひかれ ながら、 ゆっくり {階段|かいだん} ^を {下|お}りて きた。',
    { en: 'How did Grandma come down?', es: '¿Cómo bajó la abuela?' },
    [{ en: 'Slowly, with Koro leading her by the hand', es: 'Despacio, de la mano de Koro' }, { en: 'Running down the slope', es: 'Corriendo cuesta abajo' }, { en: 'Carried by Gin-sensei', es: 'En brazos de la maestra Gin' }, { en: 'She stayed at home', es: 'Se quedó en casa' }]),
  R('lr_festival', 8,
    '{今年|ことし} ^の {千灯祭|せんとうさい} ^は、 {例年|れいねん} ^より {参加者|さんかしゃ} ^が {多|おお}く、 {大成功|だいせいこう} だった。 {長老|ちょうろう} ^は 「{提灯|ちょうちん} ^は {多|おお}ければ {多|おお}い ほど、 {人|ひと} ^の {心|こころ} ^も {明|あか}るく なる」 ^と {話|はな}した。 {来年|らいねん} ^から、 {子|こ}ども たち ^も {行列|ぎょうれつ} ^に {参加|さんか}する こと ^に なった。',
    { en: 'What was decided for next year?', es: '¿Qué se decidió para el año que viene?' },
    [{ en: 'Children will join the procession', es: 'Los niños participarán en el desfile' }, { en: 'The festival will be cancelled', es: 'Se cancelará el festival' }, { en: 'Fewer lanterns will be used', es: 'Se usarán menos farolillos' }, { en: 'The elder will retire', es: 'El anciano se retirará' }]),
];
