import type { Reading } from '../types';

/** Snowcap Peaks reading passages (N2): news, notices and letters. The first option is right. */
const R = (id: string, unit: number, text: string, q: Reading['q'], options: Reading['options']): Reading => ({ id, unit, text, q, options });

export const SNOWCAP_READINGS: Reading[] = [
  R('sr_notice', 1,
    '{村|むら} ^から ^の お{知|し}らせ： {鐘楼|しょうろう} ^の {梁|はり} ^に ひび ^が {見|み}つかりました。 {安全|あんぜん} ^の ため、 {修理|しゅうり} ^が {終|お}わる ^まで {鐘|かね} ^を {鳴|な}らす こと ^は できません。 {大晦日|おおみそか} ^の {除夜|じょや} ^の {鐘|かね} ^に {間|ま}に{合|あ}う ^か どう ^か ^は、 {工事|こうじ} ^の {進|すす}み{具合|ぐあい} {次第|しだい} です。',
    { en: 'What does the New Year\'s Eve bell depend on?', es: '¿De qué depende la campanada de Nochevieja?' },
    [{ en: 'How the repair work progresses', es: 'De cómo avance la reparación' }, { en: 'How much snow falls', es: 'De cuánta nieve caiga' }, { en: 'A vote by the residents', es: 'De una votación vecinal' }, { en: 'The weather on New Year\'s Day', es: 'Del tiempo el día de Año Nuevo' }]),
  R('sr_news', 2,
    '{村|むら} ^の {新聞|しんぶん} {社説|しゃせつ}： {住民|じゅうみん} {百人|ひゃくにん} ^に {行|おこな}った {調査|ちょうさ} ^に {基|もと}づく ^と、 {鐘楼|しょうろう} ^の {修理|しゅうり} ^に {賛成|さんせい} ^の {人|ひと} ^は {六割|ろくわり}、 {新|あたら}しく {建|た}て{直|なお}す べき だ ^と {考|かんが}える {人|ひと} ^は {三割|さんわり} だった。 {昨年|さくねん} ^の {雪崩|なだれ} ^を きっかけ ^に、 {安全|あんぜん} ^への {関心|かんしん} ^が {高|たか}まって いる。',
    { en: 'What did most residents support?', es: '¿Qué apoyaba la mayoría de vecinos?' },
    [{ en: 'Repairing the belfry', es: 'Reparar el campanario' }, { en: 'Building a new belfry', es: 'Construir un campanario nuevo' }, { en: 'Stopping the bell forever', es: 'Dejar de tocar la campana para siempre' }, { en: 'Moving the bell to the library', es: 'Trasladar la campana a la biblioteca' }]),
  R('sr_meeting', 3,
    '{会議|かいぎ} ^の {記録|きろく}： {吹雪|ふぶき} ^にも かかわらず、 {四十人|よんじゅうにん} ^の {住民|じゅうみん} ^が {旅館|りょかん} ^に {集|あつ}まった。 {議論|ぎろん} ^は {三時間|さんじかん} ^に {及|およ}んだ もの ^の、 {結論|けつろん} ^は {出|で}なかった。 {女将|おかみ} ^は 「{意見|いけん} ^が {違|ちが}う から ^こそ、 {話|はな}し{合|あ}い ^を {続|つづ}けよう」 ^と {呼|よ}びかけた。',
    { en: 'What was the outcome of the meeting?', es: '¿Cuál fue el resultado de la reunión?' },
    [{ en: 'No conclusion was reached', es: 'No se llegó a ninguna conclusión' }, { en: 'Everyone agreed to rebuild', es: 'Todos acordaron reconstruir' }, { en: 'It was cancelled by the blizzard', es: 'Se canceló por la ventisca' }, { en: 'The chief resigned', es: 'El alcalde dimitió' }]),
  R('sr_library', 4,
    '{図書館|としょかん} ^の {地下|ちか} ^で、 {二百年前|にひゃくねんまえ} ^の {鐘楼|しょうろう} ^の {設計図|せっけいず} ^が {発見|はっけん}された。 {設計図|せっけいず} ばかりか、 {当時|とうじ} ^の {大工|だいく} ^の {日記|にっき} ^まで {見|み}つかり、 {釘|くぎ} ^を {一本|いっぽん} ^も {使|つか}わない {伝統的|でんとうてき} ^な {技術|ぎじゅつ} ^が わかった。',
    { en: 'What was special about the old building technique?', es: '¿Qué tenía de especial la técnica antigua?' },
    [{ en: 'It used no nails at all', es: 'No usaba ni un clavo' }, { en: 'It used only stone', es: 'Solo usaba piedra' }, { en: 'It was invented last year', es: 'Se inventó el año pasado' }, { en: 'It needed two hundred carpenters', es: 'Requería doscientos carpinteros' }]),
  R('sr_cost', 5,
    '{大工|だいく} ^の {見積|みつ}もり ^に よる ^と、 {修理|しゅうり} ^の {費用|ひよう} ^は {建|た}て{直|なお}す {場合|ばあい} ^の {半分|はんぶん} {以下|いか} だ。 {工事|こうじ} ^の {規模|きぼ} ^の わり ^に {安|やす}い ^のは、 {古|ふる}い {木材|もくざい} ^の {多|おお}く ^を そのまま {使|つか}える から だ。 {不足分|ふそくぶん} ^は {住民|じゅうみん} ^の {寄付|きふ} ^で まかなう こと ^に なった。',
    { en: 'Why is the repair relatively cheap?', es: '¿Por qué la reparación sale relativamente barata?' },
    [{ en: 'Much of the old timber can be reused', es: 'Se puede reutilizar mucha madera antigua' }, { en: 'The carpenters work for free', es: 'Los carpinteros trabajan gratis' }, { en: 'The bell will be sold', es: 'Se venderá la campana' }, { en: 'The government pays everything', es: 'El gobierno lo paga todo' }]),
  R('sr_warning', 6,
    '{気象|きしょう} {情報|じょうほう}： {今夜|こんや} ^から {明日|あす} ^に かけて {大雪|おおゆき} ^と {強風|きょうふう} ^の おそれ ^が あります。 {北|きた} ^の {斜面|しゃめん} ^では {雪崩|なだれ} ^が {発生|はっせい}し かねない ため、 {近|ちか}づかない で ください。 {明後日|あさって} ^には {天気|てんき} ^は {回復|かいふく}し つつ ある でしょう。',
    { en: 'What are people told to do?', es: '¿Qué se pide a la gente?' },
    [{ en: 'Stay away from the north slopes', es: 'No acercarse a las laderas del norte' }, { en: 'Go skiing on the north slopes', es: 'Ir a esquiar a las laderas del norte' }, { en: 'Gather at the belfry tonight', es: 'Reunirse esta noche en el campanario' }, { en: 'Open all the windows', es: 'Abrir todas las ventanas' }]),
  R('sr_repair', 7,
    '{工事|こうじ} ^の {手順|てじゅん}： ① {古|ふる}い {梁|はり} ^の {状態|じょうたい} ^を {確認|かくにん}した {上|うえ} ^で、 {交換|こうかん}する {部分|ぶぶん} ^を {決|き}める。 ② {新|あたら}しい {木材|もくざい} ^が {届|とど}き {次第|しだい}、 {補強|ほきょう} ^を {始|はじ}める。 ③ {雪|ゆき} ^の {量|りょう} ^に {応|おう}じて、 {作業|さぎょう} {時間|じかん} ^を {調整|ちょうせい}する。',
    { en: 'When does the reinforcement work start?', es: '¿Cuándo empieza el refuerzo?' },
    [{ en: 'As soon as the new timber arrives', es: 'En cuanto llegue la madera nueva' }, { en: 'After New Year\'s Day', es: 'Después de Año Nuevo' }, { en: 'When the snow is deepest', es: 'Cuando haya más nieve' }, { en: 'Before checking the old beam', es: 'Antes de comprobar la viga vieja' }]),
  R('sr_letter', 8,
    'ポポ ^へ。 {除夜|じょや} ^の {鐘|かね} ^は {百八回|ひゃくはちかい} {鳴|な}らします。 {人|ひと} ^の {煩悩|ぼんのう} ^を {一|ひと}つずつ {消|け}す ため ^と {言|い}われて いる ^けれど、 {鐘|かね} ^を {鳴|な}らす {人|ひと} ^が {必|かなら}ずしも {悩|なや}み ^が ない ^とは {限|かぎ}りません。 {大切|たいせつ} ^なのは、 {一年|いちねん} ^への {感謝|かんしゃ} ^の {気持|きも}ち です。 ホウ より',
    { en: 'According to Hou, what matters most?', es: 'Según Hou, ¿qué es lo más importante?' },
    [{ en: 'Feeling grateful for the year', es: 'Sentir gratitud por el año' }, { en: 'Ringing exactly 108 times', es: 'Tocar exactamente 108 veces' }, { en: 'Having no worries at all', es: 'No tener ninguna preocupación' }, { en: 'Ringing it as loudly as possible', es: 'Tocarla lo más fuerte posible' }]),
];
