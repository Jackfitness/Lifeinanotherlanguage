import type { DrillItem, GrammarPoint } from '../types';

/** Snowcap Peaks grammar (JLPT N2): three points per chapter. */
const D = (q: string, a: string, wrong: string[], en: string, es: string): DrillItem => ({ q, a, wrong, m: { en, es } });

export const SNOWCAP_GRAMMAR: GrammarPoint[] = [
  // ---- 1 · Obligation
  {
    id: 's_wake_ni_ikanai', unit: 1,
    title: { en: '〜わけにはいかない: can\'t (for social/moral reasons)', es: '〜わけにはいかない: no puedo (por motivos morales)' },
    note: { en: 'Dictionary form + わけにはいかない = "I can\'t very well…" because it would be wrong. ないわけにはいかない = "I have no choice but to".', es: 'Forma de diccionario + わけにはいかない = "no puedo…" porque no estaría bien. ないわけにはいかない = "no me queda más remedio que".' },
    example: '{鐘楼|しょうろう} ^を このまま {放置|ほうち}する わけ ^には いかない。', exampleM: { en: 'We can\'t just leave the belfry as it is.', es: 'No podemos dejar el campanario así sin más.' },
    items: [
      D('{村長|そんちょう} ^として、 {逃|に}げる ＿＿ ^には いかない。', 'わけ', ['はず', 'もの'], 'As chief, I can\'t run away.', 'Como alcalde, no puedo huir.'),
      D('{約束|やくそく} ^した {以上|いじょう}、 {行|い}かない わけ ^には ＿＿。', 'いかない', ['ならない', 'できない'], 'Having promised, I have to go.', 'Ya que lo prometí, tengo que ir.'),
      D('{大事|だいじ} ^な {会議|かいぎ} ^なので、 {休|やす}む わけ ^には ＿＿ ^ません。', 'いき', ['なり', 'し'], 'It\'s an important meeting, so I can\'t skip it.', 'Es una reunión importante, no puedo faltar.'),
    ],
  },
  {
    id: 's_zaru_wo_enai', unit: 1,
    title: { en: '〜ざるを得ない: have no choice but to', es: '〜ざるを得ない: no queda otra que' },
    note: { en: 'ない-stem + ざるを得ない (する → せざるを得ない) = "can\'t help but / am forced to". Formal and a little reluctant.', es: 'Raíz ない + ざるを得ない (する → せざるを得ない) = "no queda más remedio que". Formal y algo reticente.' },
    example: '{梁|はり} ^が {割|わ}れて いる ^なら、 {鐘|かね} ^を {止|と}めざる ^を {得|え}ない。', exampleM: { en: 'If the beam is cracked, we have no choice but to stop the bell.', es: 'Si la viga está rota, no queda otra que parar la campana.' },
    items: [
      D('{吹雪|ふぶき} ^で、 {会議|かいぎ} ^を {中止|ちゅうし} ＿＿ ^を {得|え}ない。', 'せざる', ['しざる', 'さざる'], 'Because of the blizzard, we have to cancel the meeting.', 'Por la ventisca, no queda otra que cancelar la reunión.'),
      D('この {状況|じょうきょう} ^では、 {認|みと}め ＿＿ ^を {得|え}ない。', 'ざる', ['ない', 'ず'], 'In this situation, I have to admit it.', 'En esta situación, no me queda más que admitirlo.'),
      D('{予算|よさん} ^が {足|た}りない ^ので、 {計画|けいかく} ^を {変|か}えざる ^を ＿＿。', '{得|え}ない', ['{得|え}る', 'ならない'], 'The budget is short, so we\'re forced to change the plan.', 'Falta presupuesto, así que hay que cambiar el plan.'),
    ],
  },
  {
    id: 's_nai_koto_wa_nai', unit: 1,
    title: { en: '〜ないことはない: it\'s not that I can\'t', es: '〜ないことはない: no es que no pueda' },
    note: { en: 'ない-form + ことはない = a double negative: "it\'s not impossible / I could, but…". Often hesitant.', es: 'Forma ない + ことはない = doble negación: "no es imposible / podría, pero…". Suele sonar dubitativo.' },
    example: '{一人|ひとり} ^で {直|なお}せない こと ^は ない ^けど、 {時間|じかん} ^が かかる。', exampleM: { en: 'It\'s not that I can\'t fix it alone, but it would take time.', es: 'No es que no pueda arreglarlo solo, pero tardaría.' },
    items: [
      D('{雪道|ゆきみち} ^は {歩|ある}けない ＿＿ ^は ない。', 'こと', ['わけ', 'もの'], 'It\'s not that you can\'t walk on snowy roads.', 'No es que no se pueda andar por la nieve.'),
      D('{辛|から}い もの ^は {食|た}べられない こと ^は ＿＿ ^が、 {苦手|にがて} です。', 'ない', ['ある', 'いる'], 'I can eat spicy food, but I\'m not fond of it.', 'No es que no pueda comer picante, pero no me gusta.'),
      D('{急|いそ}げ ^ば {間|ま}に{合|あ}わない こと ＿＿ ない。', 'も', ['を', 'に'], 'If we hurry, we might just make it.', 'Si nos damos prisa, no es imposible llegar.'),
    ],
  },
  // ---- 2 · Basis and change
  {
    id: 's_ni_motozuite', unit: 2,
    title: { en: '〜に基づいて: based on', es: '〜に基づいて: basándose en' },
    note: { en: 'Noun + に基づいて / に基づく + noun = "based on (data, facts, rules)".', es: 'Sustantivo + に基づいて / に基づく + sustantivo = "basándose en (datos, hechos, normas)".' },
    example: '{調査|ちょうさ} ^の {結果|けっか} ^に {基|もと}づいて {記事|きじ} ^を {書|か}きました。', exampleM: { en: 'I wrote the article based on the survey results.', es: 'Escribí el artículo basándome en los resultados de la encuesta.' },
    items: [
      D('{事実|じじつ} ^に ＿＿ {記事|きじ} ^を {書|か}く ^べき だ。', '{基|もと}づいた', ['{基|もと}づいて', '{基|もと}づき'], 'You should write articles based on facts.', 'Hay que escribir artículos basados en hechos.'),
      D('{古|ふる}い {記録|きろく} ^に {基|もと}づいて ＿＿ ^を {直|なお}す。', '{鐘楼|しょうろう}', ['{鐘楼|しょうろう}^に', '{鐘楼|しょうろう}^が'], 'We\'ll repair the belfry based on the old records.', 'Repararemos el campanario según los registros antiguos.'),
      D('データ ＿＿ {基|もと}づく {判断|はんだん} ^が {必要|ひつよう} だ。', 'に', ['を', 'で'], 'We need decisions based on data.', 'Necesitamos decisiones basadas en datos.'),
    ],
  },
  {
    id: 's_wo_kikkake_ni', unit: 2,
    title: { en: '〜をきっかけに: triggered by', es: '〜をきっかけに: a raíz de' },
    note: { en: 'Noun + をきっかけに = "with … as the trigger / opportunity", something that started a change.', es: 'Sustantivo + をきっかけに = "a raíz de / con motivo de", algo que desencadenó un cambio.' },
    example: 'あの {記事|きじ} ^を きっかけ ^に、 {村|むら} ^の {意見|いけん} ^が {変|か}わった。', exampleM: { en: 'That article triggered a change in the village\'s opinion.', es: 'A raíz de aquel artículo, cambió la opinión del pueblo.' },
    items: [
      D('{雪崩|なだれ} ^を ＿＿ ^に、 {安全|あんぜん} ^を {考|かんが}える よう ^に なった。', 'きっかけ', ['ために', 'ばかり'], 'The avalanche made us start thinking about safety.', 'A raíz del alud, empezamos a pensar en la seguridad.'),
      D('{旅行|りょこう} ^を きっかけ ＿＿、 {日本語|にほんご} ^を {始|はじ}めました。', 'に', ['で', 'が'], 'A trip got me started on Japanese.', 'Empecé japonés a raíz de un viaje.'),
      D('{何|なに} ^を きっかけ ^に {記者|きしゃ} ^に ＿＿ ^か。', 'なりました', ['しました', 'ありました'], 'What made you become a reporter?', '¿Qué te llevó a hacerte periodista?'),
    ],
  },
  {
    id: 's_ni_tomonatte', unit: 2,
    title: { en: '〜に伴って: along with, as', es: '〜に伴って: a medida que, junto con' },
    note: { en: 'Noun / dictionary form + に伴って = "as A changes, B changes too". Formal; common in news.', es: 'Sustantivo / forma de diccionario + に伴って = "a medida que cambia A, cambia B". Formal; frecuente en noticias.' },
    example: '{気温|きおん} ^の {低下|ていか} ^に {伴|ともな}って、 {雪|ゆき} ^が {増|ふ}えて いる。', exampleM: { en: 'As the temperature drops, the snow is increasing.', es: 'A medida que bajan las temperaturas, aumenta la nieve.' },
    items: [
      D('{観光客|かんこうきゃく} ^の {増加|ぞうか} ^に ＿＿、 {旅館|りょかん} ^が {忙|いそが}しく なった。', '{伴|ともな}って', ['{基|もと}づいて', 'ついて'], 'With more tourists, the inns have gotten busy.', 'Con el aumento de turistas, las posadas están más ocupadas.'),
      D('{人口|じんこう} ^が {減|へ}る ^に {伴|ともな}い、 {学校|がっこう} ^が ＿＿。', '{減|へ}った', ['{減|へ}る^ために', '{増|ふ}えるように'], 'As the population fell, schools decreased too.', 'Al bajar la población, disminuyeron las escuelas.'),
      D('{時代|じだい} ^の {変化|へんか} ＿＿ {伴|ともな}って、 {生活|せいかつ} ^も {変|か}わる。', 'に', ['を', 'が'], 'Life changes along with the times.', 'La vida cambia con los tiempos.'),
    ],
  },
  // ---- 3 · Contrast
  {
    id: 's_mono_no', unit: 3,
    title: { en: '〜ものの: although', es: '〜ものの: aunque' },
    note: { en: 'Plain form + ものの = "although…, (but the expected result didn\'t follow)". Written style.', es: 'Forma simple + ものの = "aunque…, (no pasó lo esperado)". Estilo escrito.' },
    example: '{会議|かいぎ} ^を {開|ひら}いた もの ^の、 {結論|けつろん} ^は {出|で}なかった。', exampleM: { en: 'Although we held a meeting, no conclusion was reached.', es: 'Aunque celebramos la reunión, no se llegó a ninguna conclusión.' },
    items: [
      D('{賛成|さんせい}した ＿＿、 まだ {不安|ふあん} ^が ある。', 'ものの', ['ので', 'ために'], 'Although I agreed, I still have doubts.', 'Aunque estuve de acuerdo, aún tengo dudas.'),
      D('{温泉|おんせん} ^は {有名|ゆうめい} ^な もの ^の、 {客|きゃく} ^は ＿＿。', '{少|すく}ない', ['{多|おお}い', '{多|おお}くて'], 'The hot spring is famous, but there are few guests.', 'Las termas son famosas, pero hay pocos clientes.'),
      D('{手紙|てがみ} ^を {書|か}いた ものの、 まだ ＿＿ いない。', '{出|だ}して', ['{出|だ}す', '{出|だ}した'], 'I wrote the letter but haven\'t sent it yet.', 'Escribí la carta, pero aún no la he enviado.'),
    ],
  },
  {
    id: 's_nimo_kakawarazu', unit: 3,
    title: { en: '〜にもかかわらず: despite', es: '〜にもかかわらず: a pesar de' },
    note: { en: 'Noun / plain form + にもかかわらず = "despite / even though". Stronger and more formal than のに.', es: 'Sustantivo / forma simple + にもかかわらず = "a pesar de / pese a". Más fuerte y formal que のに.' },
    example: '{吹雪|ふぶき} ^にも かかわらず、 {大勢|おおぜい} ^の {住民|じゅうみん} ^が {集|あつ}まった。', exampleM: { en: 'Despite the blizzard, many residents gathered.', es: 'Pese a la ventisca, se reunieron muchos vecinos.' },
    items: [
      D('{反対|はんたい} ^が {多|おお}い ＿＿ かかわらず、 {計画|けいかく} ^は {進|すす}んだ。', 'にも', ['には', 'でも'], 'Despite much opposition, the plan went ahead.', 'Pese a la mucha oposición, el plan siguió adelante.'),
      D('{夜|よる} {遅|おそ}く ^にも ＿＿、 {返事|へんじ} ^を くれた。', 'かかわらず', ['ともなって', 'もとづいて'], 'Even though it was late at night, they replied.', 'A pesar de ser tarde, me contestó.'),
      D('{雨|あめ} ^にも かかわらず、 {試合|しあい} ^は ＿＿。', '{行|おこな}われた', ['{中止|ちゅうし}された', '{行|おこな}うだろう'], 'Despite the rain, the match was held.', 'Pese a la lluvia, se jugó el partido.'),
    ],
  },
  {
    id: 's_kara_koso', unit: 3,
    title: { en: '〜からこそ: precisely because', es: '〜からこそ: precisamente porque' },
    note: { en: 'Plain form + からこそ stresses the reason: "it\'s exactly because…".', es: 'Forma simple + からこそ resalta la razón: "es precisamente porque…".' },
    example: '{古|ふる}い から ^こそ、 {大切|たいせつ} ^に したい ^んです。', exampleM: { en: 'It\'s precisely because it\'s old that I want to take care of it.', es: 'Precisamente porque es antiguo quiero cuidarlo.' },
    items: [
      D('{意見|いけん} ^が {違|ちが}う から ＿＿、 {話|はな}し{合|あ}う {必要|ひつよう} ^が ある。', 'こそ', ['だけ', 'ほど'], 'It\'s exactly because opinions differ that we need to talk.', 'Precisamente porque opinamos distinto hay que hablarlo.'),
      D('{好|す}き ＿＿ からこそ、 {厳|きび}しく {言|い}う ^んだ。', 'だ', ['な', 'の'], 'I\'m strict precisely because I care.', 'Si soy duro es precisamente porque me importa.'),
      D('あなた ^が いた ＿＿、 ここ ^まで {来|こ}られた。', 'からこそ', ['ものの', 'わりに'], 'It\'s precisely because you were here that we got this far.', 'Hemos llegado hasta aquí precisamente porque estabas tú.'),
    ],
  },
  // ---- 4 · Not only…
  {
    id: 's_dokoroka', unit: 4,
    title: { en: '〜どころか: far from, let alone', es: '〜どころか: lejos de, ni siquiera' },
    note: { en: 'Noun / plain form + どころか = "far from A, (actually the opposite / something more extreme)".', es: 'Sustantivo / forma simple + どころか = "lejos de A, (en realidad lo contrario / algo más extremo)".' },
    example: '{資料|しりょう} ^は {少|すく}ない どころか、 {部屋|へや} ^いっぱい ^に あった。', exampleM: { en: 'Far from there being few documents, there was a whole room full.', es: 'Lejos de haber pocos documentos, había una habitación llena.' },
    items: [
      D('{雪|ゆき} ^は {止|や}む ＿＿、 ますます {強|つよ}く なった。', 'どころか', ['ばかりか', 'ものの'], 'Far from stopping, the snow got even heavier.', 'Lejos de parar, la nieve se hizo más intensa.'),
      D('{休|やす}み ^どころか、 {寝|ね}る {時間|じかん} ＿＿ ない。', 'さえ', ['こそ', 'ばかり'], 'Forget days off, I don\'t even have time to sleep.', 'Ni días libres ni nada: no tengo ni tiempo para dormir.'),
      D('{漢字|かんじ} ^どころか、 ひらがな ＿＿ {読|よ}めない。', 'も', ['を', 'が'], 'Let alone kanji, he can\'t even read hiragana.', 'Ni kanji ni nada: no sabe leer ni hiragana.'),
    ],
  },
  {
    id: 's_bakarika', unit: 4,
    title: { en: '〜ばかりか: not only… but also', es: '〜ばかりか: no solo… sino también' },
    note: { en: 'Noun / plain form + ばかりか = "not only A, but B as well" (often B is more surprising).', es: 'Sustantivo / forma simple + ばかりか = "no solo A, sino también B" (B suele sorprender más).' },
    example: '{設計図|せっけいず} ばかりか、 {当時|とうじ} ^の {道具|どうぐ} ^まで {見|み}つかった。', exampleM: { en: 'Not only the blueprints, but even the tools of the time were found.', es: 'No solo aparecieron los planos, sino incluso las herramientas de la época.' },
    items: [
      D('{彼|かれ} ^は {英語|えいご} ＿＿、 {中国語|ちゅうごくご} ^も {話|はな}せる。', 'ばかりか', ['どころか', 'ものの'], 'He speaks not only English but Chinese too.', 'No solo habla inglés, sino también chino.'),
      D('{雪崩|なだれ} ^は {道|みち} ばかりか、 {家|いえ} ＿＿ {壊|こわ}した。', 'まで', ['しか', 'ほど'], 'The avalanche destroyed not only the road but even houses.', 'El alud destrozó no solo la carretera, sino incluso casas.'),
      D('{手伝|てつだ}って くれた ＿＿、 お{弁当|べんとう} ^まで {作|つく}って くれた。', 'ばかりか', ['からこそ', 'にもかかわらず'], 'Not only did she help, she even made me lunch.', 'No solo me ayudó, sino que hasta me hizo la comida.'),
    ],
  },
  {
    id: 's_ni_kagirazu', unit: 4,
    title: { en: '〜に限らず: not limited to', es: '〜に限らず: no solo' },
    note: { en: 'Noun + に限らず = "not only A (but more widely)". Opposite: に限る / に限って.', es: 'Sustantivo + に限らず = "no solo A (sino en general)". Lo contrario: に限る / に限って.' },
    example: 'この {図書館|としょかん} ^は {住民|じゅうみん} ^に {限|かぎ}らず、 だれ ^でも {使|つか}えます。', exampleM: { en: 'This library can be used by anyone, not just residents.', es: 'Esta biblioteca la puede usar cualquiera, no solo los vecinos.' },
    items: [
      D('{冬|ふゆ} ^に ＿＿、 {山|やま} ^は {一年中|いちねんじゅう} {危険|きけん} だ。', '{限|かぎ}らず', ['{伴|ともな}って', '{基|もと}づいて'], 'Not just in winter, the mountains are dangerous all year.', 'No solo en invierno: la montaña es peligrosa todo el año.'),
      D('{子|こ}ども ^に {限|かぎ}らず、 {大人|おとな} ＿＿ {楽|たの}しめる。', 'も', ['を', 'に'], 'Not only children, adults can enjoy it too.', 'No solo los niños: los adultos también lo disfrutan.'),
      D('{日本|にほん} ^に {限|かぎ}らず、 {世界|せかい} ＿＿ {人気|にんき} ^が ある。', 'で', ['を', 'へ'], 'It\'s popular not just in Japan but around the world.', 'Es popular no solo en Japón, sino en todo el mundo.'),
    ],
  },
  // ---- 5 · Cost and advice
  {
    id: 's_wari_ni', unit: 5,
    title: { en: '〜わりに: considering, for', es: '〜わりに: para ser' },
    note: { en: 'Plain form / noun + の + わりに = "considering…, (unexpectedly)". 安いわりにおいしい "tasty for the price".', es: 'Forma simple / sustantivo + の + わりに = "para ser…, (inesperadamente)". 安いわりにおいしい "rico para lo barato que es".' },
    example: 'この {見積|みつ}もり ^は {工事|こうじ} ^の {大|おお}きさ ^の わり ^に {安|やす}い。', exampleM: { en: 'This estimate is cheap considering the size of the job.', es: 'Este presupuesto es barato para lo grande que es la obra.' },
    items: [
      D('モミ ^は {若|わか}い ＿＿ ^に、 しっかり して いる。', 'わり', ['ばかり', 'ほど'], 'Momi is very mature for her age.', 'Momi es muy sensata para lo joven que es.'),
      D('{値段|ねだん} ^の ＿＿ ^に、 {品質|ひんしつ} ^が いい。', 'わり', ['ため', 'うち'], 'The quality is good for the price.', 'La calidad es buena para el precio.'),
      D('{勉強|べんきょう}した わり ^には、 {点数|てんすう} ^が ＿＿。', '{低|ひく}かった', ['{高|たか}かった', '{低|ひく}くて'], 'For all that studying, my score was low.', 'Para lo que estudié, saqué poca nota.'),
    ],
  },
  {
    id: 's_kara_niwa', unit: 5,
    title: { en: '〜からには: now that, since', es: '〜からには: ya que' },
    note: { en: 'Plain form + からには = "now that / since (I\'ve decided…), I must…". Shows resolve.', es: 'Forma simple + からには = "ya que / puesto que…, debo…". Expresa determinación.' },
    example: '{引|ひ}き{受|う}けた から ^には、 {最後|さいご} ^まで やります。', exampleM: { en: 'Now that I\'ve taken it on, I\'ll see it through.', es: 'Ya que lo he aceptado, lo haré hasta el final.' },
    items: [
      D('{寄付|きふ} ^を {集|あつ}める から ＿＿、 {目標|もくひょう} ^を {決|き}めよう。', '^には', ['^こそ', '^ものの'], 'Since we\'re collecting donations, let\'s set a goal.', 'Ya que recogemos donativos, fijemos un objetivo.'),
      D('{日本|にほん} ^に {来|き}た からには、 {温泉|おんせん} ^に ＿＿ たい。', '{入|はい}り', ['{入|はい}る', '{入|はい}って'], 'Now that I\'m in Japan, I want to try a hot spring.', 'Ya que estoy en Japón, quiero meterme en unas termas.'),
      D('{約束|やくそく}した ＿＿、 {守|まも}らなければ ならない。', 'からには', ['わりに', 'どころか'], 'Since I promised, I have to keep it.', 'Ya que lo prometí, tengo que cumplirlo.'),
    ],
  },
  {
    id: 's_koto_wa_nai', unit: 5,
    title: { en: '〜ことはない: there\'s no need to', es: '〜ことはない: no hace falta' },
    note: { en: 'Dictionary form + ことはない = "there\'s no need to…" (reassuring advice).', es: 'Forma de diccionario + ことはない = "no hace falta…" (consejo tranquilizador).' },
    example: 'そんな ^に {心配|しんぱい}する こと ^は ない ^よ。', exampleM: { en: 'There\'s no need to worry so much.', es: 'No hace falta que te preocupes tanto.' },
    items: [
      D('{一人|ひとり} ^で {全部|ぜんぶ} {負担|ふたん}する ＿＿ ^は ない。', 'こと', ['もの', 'わけ'], 'There\'s no need to bear it all alone.', 'No hace falta que lo cargues todo tú solo.'),
      D('{謝|あやま}る こと ^は ＿＿ ^よ。 あなた ^の せい ^じゃない。', 'ない', ['ある', 'いい'], 'No need to apologize. It\'s not your fault.', 'No tienes que disculparte. No es culpa tuya.'),
      D('{急|いそ}ぐ ＿＿ ありません。 ゆっくり どうぞ。', 'ことは', ['わけは', 'ものは'], 'There\'s no need to hurry. Take your time.', 'No hay prisa. Tómatelo con calma.'),
    ],
  },
  // ---- 6 · Risk and change
  {
    id: 's_osore_ga_aru', unit: 6,
    title: { en: '〜おそれがある: there\'s a risk of', es: '〜おそれがある: hay riesgo de' },
    note: { en: 'Dictionary form / noun + の + おそれがある = "there\'s a danger that… (something bad)". Used in warnings and news.', es: 'Forma de diccionario / sustantivo + の + おそれがある = "hay riesgo de que… (algo malo)". Típico de avisos y noticias.' },
    example: '{今夜|こんや} ^は {雪崩|なだれ} ^の おそれ ^が あります。', exampleM: { en: 'There\'s a risk of avalanches tonight.', es: 'Esta noche hay riesgo de aludes.' },
    items: [
      D('{大雪|おおゆき} ^で {道|みち} ^が {通|とお}れなく なる ＿＿ ^が ある。', 'おそれ', ['わけ', 'はず'], 'Heavy snow may make the roads impassable.', 'Hay riesgo de que la nevada corte las carreteras.'),
      D('{強風|きょうふう} ^の おそれ ^が ある ので、 {外出|がいしゅつ} ^は ＿＿ ください。', 'ひかえて', ['ひかえる', 'ひかえた'], 'There\'s a risk of strong winds, so please avoid going out.', 'Hay riesgo de fuertes vientos; eviten salir, por favor.'),
      D('この {梁|はり} ^は {折|お}れる おそれ ＿＿ ある。', 'が', ['を', 'に'], 'There\'s a risk this beam will snap.', 'Hay riesgo de que esta viga se parta.'),
    ],
  },
  {
    id: 's_kanenai', unit: 6,
    title: { en: '〜かねない: could well (bad result)', es: '〜かねない: podría llegar a' },
    note: { en: 'Verb stem + かねない = "it could well end up…" (a bad outcome). Careful: the negative form has a positive-ish meaning.', es: 'Raíz del verbo + かねない = "podría acabar…" (algo malo). Ojo: la forma negativa tiene sentido "posible".' },
    example: '{油断|ゆだん}する ^と、 {大|おお}きな {事故|じこ} ^に なり かねない。', exampleM: { en: 'If you get careless, it could turn into a serious accident.', es: 'Si te descuidas, podría acabar en un accidente grave.' },
    items: [
      D('このまま ^では、 {鐘楼|しょうろう} ^が {倒|たお}れ ＿＿。', 'かねない', ['かねる', 'がたい'], 'At this rate, the belfry could collapse.', 'Si sigue así, el campanario podría venirse abajo.'),
      D('{無理|むり} ^を すれ ^ば、 {病気|びょうき} ^に ＿＿ かねない。', 'なり', ['なる', 'なって'], 'If you overdo it, you could get sick.', 'Si te excedes, podrías enfermar.'),
      D('その {言|い}い{方|かた} ^は {誤解|ごかい} ^を {招|まね}き ＿＿ ^よ。', 'かねない', ['かねます', 'つつある'], 'That way of putting it could cause misunderstandings.', 'Decirlo así podría dar lugar a malentendidos.'),
    ],
  },
  {
    id: 's_tsutsu_aru', unit: 6,
    title: { en: '〜つつある: is in the process of', es: '〜つつある: está en proceso de' },
    note: { en: 'Verb stem + つつある = a change steadily underway: "is gradually…". Formal.', es: 'Raíz del verbo + つつある = un cambio en marcha: "está poco a poco…". Formal.' },
    example: '{天気|てんき} ^は {回復|かいふく}し つつ ある。', exampleM: { en: 'The weather is gradually recovering.', es: 'El tiempo se está recuperando poco a poco.' },
    items: [
      D('{吹雪|ふぶき} ^は {弱|よわ}まり ＿＿ ある。', 'つつ', ['ながら', 'たり'], 'The blizzard is gradually weakening.', 'La ventisca va amainando.'),
      D('{村|むら} ^の {人口|じんこう} ^は {減|へ}り つつ ＿＿。', 'ある', ['いる', 'なる'], 'The village population is steadily declining.', 'La población del pueblo va disminuyendo.'),
      D('{新|あたら}しい {時代|じだい} ^が ＿＿ つつ ある。', '{始|はじ}まり', ['{始|はじ}まる', '{始|はじ}まって'], 'A new era is beginning.', 'Está comenzando una nueva era.'),
    ],
  },
  // ---- 7 · Procedure
  {
    id: 's_shidai', unit: 7,
    title: { en: '〜次第: as soon as / depending on', es: '〜次第: en cuanto / según' },
    note: { en: 'Verb stem + 次第 = "as soon as…" (formal). Noun + 次第だ = "it depends on…".', es: 'Raíz del verbo + 次第 = "en cuanto…" (formal). Sustantivo + 次第だ = "depende de…".' },
    example: '{木材|もくざい} ^が {届|とど}き {次第|しだい}、 {工事|こうじ} ^を {始|はじ}めます。', exampleM: { en: 'We\'ll start work as soon as the timber arrives.', es: 'Empezaremos las obras en cuanto llegue la madera.' },
    items: [
      D('{結果|けっか} ^が わかり ＿＿、 ご{連絡|れんらく} します。', '{次第|しだい}', ['{上|うえ}で', 'うちに'], 'I\'ll contact you as soon as I know the results.', 'Le avisaré en cuanto sepa el resultado.'),
      D('{成功|せいこう}する ^か どう ^か ^は、 あなた ＿＿ だ。', '{次第|しだい}', ['{限|かぎ}り', 'ばかり'], 'Whether it succeeds depends on you.', 'Que salga bien depende de ti.'),
      D('{天気|てんき} {次第|しだい} ^で、 {予定|よてい} ^を ＿＿ かも しれない。', '{変|か}える', ['{変|か}えて', '{変|か}えた'], 'Depending on the weather, we may change plans.', 'Según el tiempo, puede que cambiemos los planes.'),
    ],
  },
  {
    id: 's_ue_de', unit: 7,
    title: { en: '〜上で: after / in doing', es: '〜上で: tras / a la hora de' },
    note: { en: 'た-form + 上で = "after doing A (as a necessary step), B". Dictionary form + 上で = "when it comes to doing…".', es: 'Forma た + 上で = "tras hacer A (paso necesario), B". Forma de diccionario + 上で = "a la hora de…".' },
    example: '{手順|てじゅん} ^を {確認|かくにん}した {上|うえ} ^で、 {作業|さぎょう} ^を {始|はじ}めて ください。', exampleM: { en: 'Please start work after checking the procedure.', es: 'Empiecen la tarea tras comprobar el procedimiento.' },
    items: [
      D('よく {考|かんが}えた ＿＿ ^で、 {決|き}めます。', '{上|うえ}', ['{次第|しだい}', 'わり'], 'I\'ll decide after thinking it over carefully.', 'Lo decidiré tras pensarlo bien.'),
      D('{仕事|しごと} ^を する {上|うえ} ^で、 {一番|いちばん} {大切|たいせつ} ^な ^の ^は ＿＿ だ。', '{信頼|しんらい}', ['{信頼|しんらい}^に', '{信頼|しんらい}^を'], 'When it comes to work, the most important thing is trust.', 'A la hora de trabajar, lo más importante es la confianza.'),
      D('{家族|かぞく} ^と {相談|そうだん}した {上|うえ} ^で、 ＿＿ します。', 'お{返事|へんじ}', ['お{返事|へんじ}^に', 'お{返事|へんじ}^が'], 'I\'ll give you my answer after talking it over with my family.', 'Le daré una respuesta tras hablarlo con mi familia.'),
    ],
  },
  {
    id: 's_ni_oujite', unit: 7,
    title: { en: '〜に応じて: in accordance with', es: '〜に応じて: según, de acuerdo con' },
    note: { en: 'Noun + に応じて = "according to / in response to (each case)": 予算に応じて "depending on the budget".', es: 'Sustantivo + に応じて = "según / en función de": 予算に応じて "según el presupuesto".' },
    example: '{雪|ゆき} ^の {量|りょう} ^に {応|おう}じて、 {作業|さぎょう} ^の {時間|じかん} ^を {変|か}えます。', exampleM: { en: 'We\'ll adjust working hours according to the amount of snow.', es: 'Ajustaremos el horario según la cantidad de nieve.' },
    items: [
      D('{年齢|ねんれい} ^に ＿＿ {料金|りょうきん} ^が {違|ちが}います。', '{応|おう}じて', ['{限|かぎ}らず', '{伴|ともな}って'], 'Prices differ according to age.', 'Los precios varían según la edad.'),
      D('お{客|きゃく}さま ^の {希望|きぼう} ^に {応|おう}じて、 ＿＿ ^を {作|つく}ります。', '{料理|りょうり}', ['{料理|りょうり}^に', '{料理|りょうり}^が'], 'We cook according to guests\' wishes.', 'Cocinamos según los deseos de los clientes.'),
      D('{状況|じょうきょう} ＿＿ {応|おう}じて {対応|たいおう}する。', 'に', ['を', 'で'], 'Respond according to the situation.', 'Actuar según la situación.'),
    ],
  },
  // ---- 8 · Nuance
  {
    id: 's_towa_kagiranai', unit: 8,
    title: { en: '〜とは限らない: not necessarily', es: '〜とは限らない: no necesariamente' },
    note: { en: 'Plain form + とは限らない = "it\'s not always the case that…". Often with 必ずしも.', es: 'Forma simple + とは限らない = "no siempre es cierto que…". Suele ir con 必ずしも.' },
    example: '{古|ふる}い もの ^が {必|かなら}ずしも {弱|よわ}い ^とは {限|かぎ}らない。', exampleM: { en: 'Old things aren\'t necessarily weak.', es: 'Lo antiguo no es necesariamente débil.' },
    items: [
      D('{高|たか}い {物|もの} ^が いい ^とは ＿＿。', '{限|かぎ}らない', ['{限|かぎ}る', 'ちがいない'], 'Expensive things aren\'t necessarily good.', 'Lo caro no siempre es bueno.'),
      D('{専門家|せんもんか} ^の {意見|いけん} ^が {正|ただ}しい ＿＿ {限|かぎ}らない。', 'とは', ['には', 'では'], 'Experts aren\'t always right.', 'La opinión de los expertos no siempre es correcta.'),
      D('{晴|は}れて いて ^も、 {雪崩|なだれ} ^が ＿＿ とは {限|かぎ}らない。', '{起|お}きない', ['{起|お}きる', '{起|お}きて'], 'Even if it\'s sunny, it doesn\'t mean there won\'t be avalanches.', 'Aunque haga sol, no significa que no vaya a haber aludes.'),
    ],
  },
  {
    id: 's_ippou_de', unit: 8,
    title: { en: '〜一方で: while, on the other hand', es: '〜一方で: mientras que, por otro lado' },
    note: { en: 'Plain form + 一方(で) contrasts two sides: "while A, on the other hand B".', es: 'Forma simple + 一方(で) contrasta dos aspectos: "mientras que A, por otro lado B".' },
    example: '{観光|かんこう} ^は {村|むら} ^を {豊|ゆた}か ^に する {一方|いっぽう} ^で、 {自然|しぜん} ^を {壊|こわ}す ことも ある。', exampleM: { en: 'Tourism enriches the village, but on the other hand it can damage nature.', es: 'El turismo enriquece el pueblo, pero por otro lado puede dañar la naturaleza.' },
    items: [
      D('{都会|とかい} ^は {便利|べんり} ^な ＿＿ ^で、 {疲|つか}れる。', '{一方|いっぽう}', ['わり', 'うち'], 'The city is convenient, but on the other hand tiring.', 'La ciudad es cómoda, pero por otro lado cansa.'),
      D('{賛成|さんせい}する {人|ひと} ^が いる {一方|いっぽう}、 {反対|はんたい}する {人|ひと} ＿＿ いる。', 'も', ['を', 'が'], 'While some agree, others oppose.', 'Mientras unos están a favor, otros están en contra.'),
      D('{雪|ゆき} ^は {美|うつく}しい {一方|いっぽう} ^で、 ＿＿ ^も ある。', '{危険|きけん}', ['{危険|きけん}^な', '{危険|きけん}^に'], 'Snow is beautiful, but it\'s also dangerous.', 'La nieve es bonita, pero también peligrosa.'),
    ],
  },
  {
    id: 's_you_ga_nai', unit: 8,
    title: { en: '〜ようがない: there\'s no way to', es: '〜ようがない: no hay manera de' },
    note: { en: 'Verb stem + ようがない = "there\'s no way to… / can\'t possibly". 言いようがない = "beyond words".', es: 'Raíz del verbo + ようがない = "no hay manera de… / es imposible". 言いようがない = "indescriptible".' },
    example: 'この {感謝|かんしゃ} ^は ことば ^では {言|い}い よう ^が ない。', exampleM: { en: 'There\'s no way to put this gratitude into words.', es: 'Esta gratitud no hay palabras para expresarla.' },
    items: [
      D('{連絡先|れんらくさき} ^が わからない ので、 {連絡|れんらく} ^の し ＿＿ ^が ない。', 'よう', ['わけ', 'こと'], 'I don\'t have their contact, so there\'s no way to reach them.', 'No tengo su contacto, así que no hay forma de avisarle.'),
      D('ここ ^まで {壊|こわ}れたら、 {直|なお}し よう ^が ＿＿。', 'ない', ['ある', 'いる'], 'Once it\'s this broken, there\'s no way to fix it.', 'Si está así de roto, no hay manera de arreglarlo.'),
      D('{美|うつく}しい ^としか ＿＿ ようがない {景色|けしき} だ。', '{言|い}い', ['{言|い}う', '{言|い}って'], 'It\'s a view you can only describe as beautiful.', 'Es un paisaje que solo se puede describir como precioso.'),
    ],
  },
];
