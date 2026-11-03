import type { LText } from '../../../core/types';

/** Short N5 reading passages (town notices, letters, diary entries) with a comprehension question. */
export interface Reading { id: string; unit: number; text: string; q: LText; options: LText[] }

const R = (id: string, unit: number, text: string, q: LText, options: LText[]): Reading => ({ id, unit, text, q, options });

export const CLOVER_READINGS: Reading[] = [
  R('r_intro', 1,
    'はじめまして。 {私|わたし} ^は トビ です。 {郵便局|ゆうびんきょく} ^で {働|はたら}いて います。 カエル です。 どうぞ よろしく。',
    { en: 'Where does Tobi work?', es: '¿Dónde trabaja Tobi?' },
    [{ en: 'At the post office', es: 'En la oficina de correos' }, { en: 'At the market', es: 'En el mercado' }, { en: 'At the dojo', es: 'En el dojo' }, { en: 'At the hospital', es: 'En el hospital' }]),
  R('r_market', 2,
    '{市場|いちば} ^の おしらせ： {今日|きょう} ^は りんご ^が ひとつ {百|ひゃく}{円|えん} です。 たまご ^は みっつ {二百|にひゃく}{円|えん} です。',
    { en: 'How much are three eggs today?', es: '¿Cuánto cuestan hoy tres huevos?' },
    [{ en: '200 yen', es: '200 yenes' }, { en: '100 yen', es: '100 yenes' }, { en: '300 yen', es: '300 yenes' }, { en: '3 yen', es: '3 yenes' }]),
  R('r_day', 3,
    '{私|わたし} ^は {毎朝|まいあさ} {六時|ろくじ} ^に {起|お}きます。 {七時|しちじ} ^に {朝|あさ}ご{飯|はん} ^を {食|た}べます。 {八時|はちじ} ^から {五時|ごじ} ^まで {働|はたら}きます。',
    { en: 'What time does this person start work?', es: '¿A qué hora empieza a trabajar esta persona?' },
    [{ en: 'At 8:00', es: 'A las 8:00' }, { en: 'At 6:00', es: 'A las 6:00' }, { en: 'At 7:00', es: 'A las 7:00' }, { en: 'At 5:00', es: 'A las 5:00' }]),
  R('r_map', 4,
    '{駅|えき} ^を {出|で}て、 まっすぐ {行|い}って ください。 {公園|こうえん} ^の となり ^に {図書館|としょかん} ^が あります。 {図書館|としょかん} ^の {前|まえ} ^に {銀行|ぎんこう} ^が あります。',
    { en: 'Where is the bank?', es: '¿Dónde está el banco?' },
    [{ en: 'In front of the library', es: 'Delante de la biblioteca' }, { en: 'Next to the station', es: 'Al lado de la estación' }, { en: 'Inside the park', es: 'Dentro del parque' }, { en: 'Behind the school', es: 'Detrás de la escuela' }]),
  R('r_food', 5,
    'クー ^の レストラン ^は {有名|ゆうめい} です。 スープ ^は {辛|から}い です ^が、 とても おいしい です。 はちみつ ^の ケーキ ^は {甘|あま}くて、 {子|こ}ども ^に {人気|にんき} です。',
    { en: 'What is popular with children?', es: '¿Qué es popular entre los niños?' },
    [{ en: 'The honey cake', es: 'El pastel de miel' }, { en: 'The spicy soup', es: 'La sopa picante' }, { en: 'The coffee', es: 'El café' }, { en: 'The meat dish', es: 'El plato de carne' }]),
  R('r_family', 6,
    '{私|わたし} ^の {家族|かぞく} ^は {五人|ごにん} です。 {父|ちち} ^と {母|はは} ^と {兄|あに} ^と {妹|いもうと} ^が います。 {妹|いもうと} ^は {七歳|ななさい} です。',
    { en: 'How old is the younger sister?', es: '¿Cuántos años tiene la hermana menor?' },
    [{ en: 'Seven', es: 'Siete' }, { en: 'Five', es: 'Cinco' }, { en: 'Two', es: 'Dos' }, { en: 'Ten', es: 'Diez' }]),
  R('r_diary', 7,
    '{昨日|きのう} ^は {雨|あめ} でした。 {風|かぜ} ^も {強|つよ}かった です。 {寒|さむ}かった です ^から、 {家|いえ} ^で {本|ほん} ^を {読|よ}みました。',
    { en: 'What did the writer do yesterday, and why?', es: '¿Qué hizo ayer quien escribe y por qué?' },
    [{ en: 'Read at home because it was cold', es: 'Leyó en casa porque hacía frío' }, { en: 'Went to the park because it was sunny', es: 'Fue al parque porque hacía sol' }, { en: 'Worked late because it was busy', es: 'Trabajó hasta tarde porque había mucho trabajo' }, { en: 'Went shopping because it was warm', es: 'Fue de compras porque hacía calor' }]),
  R('r_invite', 8,
    'ハナさん へ。 {日曜日|にちようび} ^に お{祭|まつ}り ^が あります。 {六時|ろくじ} ^に {時計台|とけいだい} ^の {前|まえ} ^で {会|あ}いませんか。 いっしょ ^に {花火|はなび} ^を {見|み}ましょう。',
    { en: 'Where does the writer want to meet?', es: '¿Dónde quiere encontrarse quien escribe?' },
    [{ en: 'In front of the clock tower', es: 'Delante de la torre del reloj' }, { en: 'At the station', es: 'En la estación' }, { en: "At Hana's house", es: 'En casa de Hana' }, { en: 'In the park', es: 'En el parque' }]),
];
