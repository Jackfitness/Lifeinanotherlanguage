import type { Reading } from '../types';

/** Starlight City reading passages (N1): editorials, reviews and letters. The first option is right. */
const R = (id: string, unit: number, text: string, q: Reading['q'], options: Reading['options']): Reading => ({ id, unit, text, q, options });

export const STARLIGHT_READINGS: Reading[] = [
  R('xr_closing', 1,
    '{創業|そうぎょう} {百年|ひゃくねん} ^の {星|ほし}あかり{座|ざ} ^が、 {今季|こんき} ^を {最後|さいご} ^に {閉鎖|へいさ}される ^こと ^に なった。 {市長|しちょう} ^は 「{老舗|しにせ} ならでは ^の {魅力|みりょく} ^を {失|うしな}う ^のは {痛恨|つうこん} ^の {極|きわ}み」 ^と {述|の}べた ^が、 {建物|たてもの} ^の {老朽化|ろうきゅうか} ^と {観客|かんきゃく} ^の {減少|げんしょう} ^に ^は {抗|あらが}えなかった。',
    { en: 'Why is the theater closing?', es: '¿Por qué cierra el teatro?' },
    [{ en: 'The building is old and audiences have declined', es: 'El edificio está viejo y ha bajado el público' }, { en: 'The mayor dislikes theater', es: 'Al alcalde no le gusta el teatro' }, { en: 'It is being moved to another city', es: 'Se traslada a otra ciudad' }, { en: 'The actors went on strike', es: 'Los actores están en huelga' }]),
  R('xr_rain', 2,
    '{最終|さいしゅう} {公演|こうえん} ^と あって、 {当日|とうじつ} ^は {台風|たいふう} ^の {接近|せっきん} ^を もの ^とも せず、 {開場|かいじょう} {前|まえ} ^から {長蛇|ちょうだ} ^の {列|れつ} ^が できた。 {関係者|かんけいしゃ} ^の {心配|しんぱい} ^を よそ ^に、 {客席|きゃくせき} ^は {満員|まんいん} だった。',
    { en: 'What happened on the day of the final performance?', es: '¿Qué pasó el día de la última función?' },
    [{ en: 'A long line formed despite the approaching typhoon', es: 'Se formó una larga cola pese al tifón' }, { en: 'The show was cancelled because of the typhoon', es: 'Se canceló por el tifón' }, { en: 'Only staff attended', es: 'Solo asistió el personal' }, { en: 'The theater opened late at night', es: 'El teatro abrió de madrugada' }]),
  R('xr_review', 3,
    '{批評家|ひひょうか} ^の {記事|きじ} ^が {掲載|けいさい}される や {否|いな}や、 「{見逃|みのが}す べからず」 ^の {一文|いちぶん} ^が {瞬|またた}く {間|ま} ^に {拡散|かくさん}された。 {追加|ついか} {公演|こうえん} ^の {発表|はっぴょう} ^が {早|はや}いか、 {切符|きっぷ} ^は {数分|すうふん} ^で {売|う}り{切|き}れた。',
    { en: 'What happened after the extra shows were announced?', es: '¿Qué pasó al anunciarse funciones extra?' },
    [{ en: 'Tickets sold out within minutes', es: 'Las entradas se agotaron en minutos' }, { en: 'Nobody bought tickets', es: 'Nadie compró entradas' }, { en: 'The critic withdrew the review', es: 'El crítico retiró la reseña' }, { en: 'The theater closed early', es: 'El teatro cerró antes' }]),
  R('xr_pipes', 4,
    '{公演|こうえん} {中|ちゅう}、 {天井|てんじょう} ^の {配管|はいかん} ^が {破裂|はれつ}し、 {劇場|げきじょう} ^は {休館|きゅうかん} ^を {余儀|よぎ}なく された。 {支配人|しはいにん} ^は 「{皆様|みなさま} ^の {支援|しえん} ^に {感謝|かんしゃ}し、 {一日|いちにち} ^も {早|はや}い {再開|さいかい} ^を {願|ねが}って やまない」 ^と コメント ^を {発表|はっぴょう}した。',
    { en: 'What forced the theater to close?', es: '¿Qué obligó a cerrar el teatro?' },
    [{ en: 'A burst pipe in the ceiling', es: 'Una tubería reventada en el techo' }, { en: 'A fire on stage', es: 'Un incendio en el escenario' }, { en: 'A lack of actors', es: 'La falta de actores' }, { en: 'A decision by the sponsors', es: 'Una decisión de los patrocinadores' }]),
  R('xr_bistro', 5,
    '{物価|ぶっか} ^の {高騰|こうとう} ^が {続|つづ}く {都心|としん} ^に あって、 レオ ^の ビストロ ^は {開店|かいてん} {以来|いらい} {値段|ねだん} ^を {変|か}えて いない。 {週末|しゅうまつ} ^とも なる ^と {役者|やくしゃ} ^や {記者|きしゃ} ^で {賑|にぎ}わい、 {常連|じょうれん} ^に {至|いた}って ^は {毎晩|まいばん} {同|おな}じ {席|せき} ^に {座|すわ}る ^という。',
    { en: 'What is notable about Leo\'s bistro?', es: '¿Qué tiene de destacable el bistró de Leo?' },
    [{ en: 'It hasn\'t raised prices since it opened', es: 'No ha subido los precios desde que abrió' }, { en: 'It only opens on weekends', es: 'Solo abre los fines de semana' }, { en: 'It refuses to serve actors', es: 'No sirve a actores' }, { en: 'It is the most expensive in the city', es: 'Es el más caro de la ciudad' }]),
  R('xr_sign', 6,
    '{舞台|ぶたい} {裏|うら} ^の {扉|とびら} ^には 「{関係者|かんけいしゃ} {以外|いがい} {立|た}ち{入|い}る べからず」 ^と ある。 {無断|むだん} ^で {入|はい}る ^のは {劇団員|げきだんいん} ^として ある まじき {行為|こうい} ^だ ^が、 ココ ^は {夢|ゆめ} ^を かなえ ん ^が ため、 その {扉|とびら} ^を {開|あ}けた。',
    { en: 'What does the sign on the backstage door say?', es: '¿Qué dice el cartel de la puerta trasera?' },
    [{ en: 'Staff only, no entry', es: 'Solo personal autorizado, prohibido el paso' }, { en: 'Welcome, everyone', es: 'Bienvenidos todos' }, { en: 'Tickets sold here', es: 'Venta de entradas' }, { en: 'Closed for repairs', es: 'Cerrado por obras' }]),
  R('xr_script', 7,
    '{旧|きゅう} {脚本|きゃくほん} ^は {名作|めいさく} ^と {言|い}われ ながら ^も、 {説明|せつめい} ^が {多|おお}すぎる きらい ^が あった。 {新|しん} {脚本|きゃくほん} ^は {台詞|せりふ} ^を {削|けず}り、 {沈黙|ちんもく} ^で {感情|かんじょう} ^を {表現|ひょうげん}する。 {批評家|ひひょうか} ^は 「{再演|さいえん} ^に {足|た}る {傑作|けっさく}」 ^と {評|ひょう}した。',
    { en: 'How does the new script differ from the old one?', es: '¿En qué se diferencia el nuevo guion del antiguo?' },
    [{ en: 'It cuts lines and uses silence to show emotion', es: 'Recorta diálogos y usa el silencio para expresar emociones' }, { en: 'It adds more explanation', es: 'Añade más explicaciones' }, { en: 'It is a comedy instead of a drama', es: 'Es una comedia en vez de un drama' }, { en: 'It has no actors', es: 'No tiene actores' }]),
  R('xr_curtain', 8,
    '{幕|まく} ^が {下|お}りる ^と、 {観客|かんきゃく} ^は 「{待|ま}って いた」 ^と ばかり ^に {総立|そうだ}ち ^に なった。 {閉鎖|へいさ} ^が {決|き}まった とき、 だれか ^が {声|こえ} ^を {上|あ}げて いれ ^ば ^と {悔|く}やむ {人|ひと} ^も いた ^が、 {今|いま} ^や {劇場|げきじょう} ^は {街|まち} ^の {誇|ほこ}り ^として {復活|ふっかつ}した。',
    { en: 'How did the audience react at the end?', es: '¿Cómo reaccionó el público al final?' },
    [{ en: 'They all stood up, as if they\'d been waiting for this', es: 'Se pusieron todos en pie, como si lo hubieran estado esperando' }, { en: 'They left in silence', es: 'Se marcharon en silencio' }, { en: 'They demanded refunds', es: 'Pidieron que les devolvieran el dinero' }, { en: 'They fell asleep', es: 'Se quedaron dormidos' }]),
];
