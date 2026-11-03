import type { LText } from '../core/types';

/**
 * Phrase bank. Placeholders: $name (player's name), $item (a lexeme inserted at runtime).
 * Japanese markup: chunks separated by spaces, {漢字|よみ} ruby, ^ marks a particle
 * (so は/へ/を romanize as wa/e/o).
 */
export interface Phrase {
  id: string;
  lvl: 1 | 2 | 3;
  /** Lexemes appearing in this phrase (for word chips + tracking). */
  words?: string[];
  t: LText;
}

const P = (id: string, lvl: 1 | 2 | 3, words: string[], en: string, es: string, ja: string): Phrase =>
  ({ id, lvl, words, t: { en, es, ja } });

export const PHRASES: Phrase[] = [
  // ---- Greetings & basics
  P('hello', 1, [], 'Hello!', '¡Hola!', 'こんにちは！'),
  P('good_morning', 1, [], 'Good morning!', '¡Buenos días!', 'おはよう ございます！'),
  P('good_afternoon', 1, [], 'Good afternoon!', '¡Buenas tardes!', 'こんにちは！'),
  P('good_evening', 1, [], 'Good evening!', '¡Buenas noches!', 'こんばんは！'),
  P('see_you', 1, [], 'See you later!', '¡Hasta luego!', 'また ね！'),
  P('thanks', 1, [], 'Thank you!', '¡Gracias!', 'ありがとう！'),
  P('thanks_lot', 1, [], 'Thank you very much!', '¡Muchas gracias!', 'どうも ありがとう ございます！'),
  P('of_course', 1, [], 'Of course!', '¡Claro!', 'もちろん！'),
  P('yes_it_is', 1, [], 'Yes, it is!', '¡Sí, es verdad!', 'そう です ^ね！'),
  P('im_sleepy', 1, ['sleepy'], "I'm a little sleepy.", 'Tengo un poco de sueño.', 'ちょっと ねむい です。'),

  // ---- First meeting: startled reactions (shown after the "!")
  P('surprise_biscuit', 1, [], 'Oh my! A new face!', '¡Ay, qué sorpresa! ¡Una cara nueva!', 'あら！ はじめて {見|み}る {顔|かお} ^ね！'),
  P('surprise_pip', 1, [], 'Whoa! Who are YOU?!', '¡Guau! ¿Y tú quién eres?', 'わっ！ きみ、 だれ？！'),
  P('surprise_yuzu', 1, [], '...Oh! You surprised me.', '...¡Ay! Me asustaste.', '…わっ。 びっくり した。'),

  // ---- Introductions (Hello, Neighbors!)
  P('welcome_village', 1, [], 'Welcome to our village!', '¡Bienvenidos a nuestro pueblo!', 'わたしたち ^の {村|むら} ^へ ようこそ！'),
  P('im_biscuit', 1, [], 'My name is Biscuit.', 'Me llamo Bizcocho.', '{私|わたし} ^は ビスケット です。'),
  P('whats_your_name', 1, [], "What's your name?", '¿Cómo te llamas?', 'お{名前|なまえ} ^は？'),
  P('my_name_is', 1, [], 'My name is $name.', 'Me llamo $name.', '{私|わたし} ^は $name です。'),
  P('nice_meet', 1, [], 'Nice to meet you!', '¡Mucho gusto!', 'はじめまして！'),
  P('nice_meet_too', 1, [], 'Nice to meet you, too!', '¡Igualmente!', 'こちらこそ、 よろしく おねがいします。'),
  P('cookie_for_you', 1, ['cookie'], 'Here, a cookie for you.', 'Toma, una galleta para ti.', 'はい、 クッキー ^を どうぞ。'),
  P('go_say_hello', 2, [], 'Go say hello to Pip and Yuzu!', '¡Ve a saludar a Pip y a Yuzu!', 'ピップ ^と ゆず ^に あいさつ して ね！'),
  P('im_pip', 1, [], "Hi! I'm Pip!", '¡Hola! ¡Soy Pip!', 'やあ！ ピップ だよ！'),
  P('how_are_you', 1, [], 'How are you?', '¿Cómo estás?', 'お{元気|げんき} です ^か？'),
  P('im_fine', 1, [], "I'm fine, thank you!", '¡Bien, gracias!', '{元気|げんき} です、 ありがとう！'),
  P('this_my_store', 1, ['store'], 'This is my store!', '¡Esta es mi tienda!', 'ここ ^は ぼく ^の {店|みせ} だよ！'),
  P('come_anytime', 1, [], 'Come by anytime!', '¡Ven cuando quieras!', 'いつでも {来|き}て ね！'),
  P('yuzu_hello', 1, [], '...Oh. Hello.', '...Ah. Hola.', '…あ。 こんにちは。'),
  P('im_yuzu', 1, ['go_fishing'], "I'm Yuzu. I like fishing.", 'Soy Yuzu. Me gusta pescar.', 'ゆず です。 {釣|つ}り ^が {好|す}き です。'),
  P('like_fish_q', 1, ['fish'], 'Do you like fish?', '¿Te gustan los peces?', '{魚|さかな} ^は {好|す}き？'),
  P('yes_like', 1, [], 'Yes, I like them!', '¡Sí, me gustan!', 'はい、 {好|す}き です！'),
  P('not_really', 1, [], 'Not really...', 'No mucho...', 'あまり…'),
  P('pond_calm', 2, ['pond'], 'This pond is calm. I like calm.', 'Este estanque es tranquilo. Me gusta la calma.', 'この {池|いけ} ^は しずか です。 しずか ^が {好|す}き。'),
  P('talk_anytime', 2, [], 'Come talk to me anytime.', 'Háblame cuando quieras.', 'いつでも {話|はな}しかけて ね。'),

  // ---- Tea for Yuzu
  P('a_bit_cold', 1, ['cold'], "Brr... I'm a little cold.", 'Brr... Tengo un poco de frío.', 'ブルル… ちょっと {寒|さむ}い。'),
  P('want_hot_tea', 1, ['tea', 'hot'], "I'd like a hot tea.", 'Quisiera un té caliente.', 'あたたかい お{茶|ちゃ} ^が {飲|の}みたい。'),
  P('buy_at_cafe', 2, ['cafe'], 'Could you buy one at the café?', '¿Puedes comprar uno en la cafetería?', 'カフェ ^で {買|か}って きて くれる？'),
  P('what_would_you_like', 1, [], 'Welcome! What would you like?', '¡Hola! ¿Qué te gustaría?', 'いらっしゃいませ！ {何|なに} ^に します ^か？'),
  P('order_tea', 1, ['tea'], 'A tea, please.', 'Un té, por favor.', 'お{茶|ちゃ} ^を ください。'),
  P('order_coffee', 1, ['coffee'], 'A coffee, please.', 'Un café, por favor.', 'コーヒー ^を ください。'),
  P('order_cake', 1, ['cake'], 'A cake, please.', 'Un pastel, por favor.', 'ケーキ ^を ください。'),
  P('hot_or_iced', 1, [], 'Hot or iced?', '¿Caliente o frío?', 'ホット ^と アイス、 どちら です ^か？'),
  P('hot_please', 1, ['hot'], 'Hot, please.', 'Caliente, por favor.', 'ホット ^で おねがいします。'),
  P('iced_please', 1, ['cold'], 'Iced, please.', 'Frío, por favor.', 'アイス ^で おねがいします。'),
  P('thats_5', 1, ['coin'], "That's 5 coins.", 'Son cinco monedas.', '{五|ご} コイン です。'),
  P('here_you_go', 1, [], 'Here you go. Enjoy!', 'Aquí tienes. ¡Disfrútalo!', 'はい、 どうぞ！'),
  P('heres_tea', 1, ['tea'], "Here's your tea!", '¡Aquí está tu té!', 'お{茶|ちゃ} ^を どうぞ！'),
  P('heres_coffee', 1, ['coffee'], "Here's your coffee!", '¡Aquí está tu café!', 'コーヒー ^を どうぞ！'),
  P('warm_thanks', 1, [], 'Ahh... so warm. Thank you, $name.', 'Ahh... qué calentito. Gracias, $name.', 'ああ… あたたかい。 ありがとう、 $name。'),
  P('rod_for_you', 2, ['rod'], 'Here. A fishing rod, for you.', 'Toma. Una caña de pescar para ti.', 'これ、 {釣|つ}り{竿|ざお}。 あげる。'),
  P('lets_fish', 2, ['go_fishing'], "Let's fish together sometime.", 'Pesquemos juntos algún día.', 'こんど いっしょ ^に {釣|つ}り ^を しよう。'),

  // ---- Pip's Lost Things
  P('oh_no', 1, [], 'Oh no! Oh no!', '¡Ay, no! ¡Ay, no!', 'わあ！ どうしよう！'),
  P('lost_three', 2, [], 'I lost three things!', '¡Perdí tres cosas!', '{三|みっ}つ ^の もの ^を なくしちゃった！'),
  P('key_fountain', 2, ['key', 'fountain'], 'My key is near the fountain.', 'Mi llave está cerca de la fuente.', '{鍵|かぎ} ^は {噴水|ふんすい} ^の {近|ちか}く。'),
  P('book_tree', 2, ['book', 'tree', 'big'], 'My book is under the big tree.', 'Mi libro está debajo del árbol grande.', '{本|ほん} ^は {大|おお}きい {木|き} ^の {下|した}。'),
  P('umbrella_bridge', 2, ['umbrella', 'bridge'], 'My umbrella is next to the bridge.', 'Mi paraguas está al lado del puente.', '{傘|かさ} ^は {橋|はし} ^の {横|よこ}。'),
  P('can_you_help', 1, [], 'Can you help me?', '¿Me puedes ayudar?', '{手伝|てつだ}って くれる？'),
  P('what_did_you_find', 1, [], 'What did you find?', '¿Qué encontraste?', '{何|なに} ^を {見|み}つけた ^の？'),
  P('i_found_it', 1, [], 'I found it!', '¡Lo encontré!', '{見|み}つけた よ！'),
  P('youre_best', 1, [], "You're the best! Take this!", '¡Eres lo máximo! ¡Toma esto!', '{最高|さいこう}！ これ、 あげる！'),

  // ---- Daily chat
  P('whats_this', 1, [], "What's this?", '¿Qué es esto?', 'これ ^は {何|なん} です ^か？'),
  P('weather_sunny', 1, ['sun'], "It's a nice day today, isn't it?", 'Hoy hace buen tiempo, ¿verdad?', '{今日|きょう} ^は いい {天気|てんき} です ^ね。'),
  P('weather_rain', 1, ['rain'], "It's raining today, isn't it?", 'Hoy está lloviendo, ¿verdad?', '{今日|きょう} ^は {雨|あめ} です ^ね。'),
  P('weather_cloudy', 1, ['cloud'], "It's cloudy today, isn't it?", 'Hoy está nublado, ¿verdad?', '{今日|きょう} ^は くもり です ^ね。'),
  P('weather_snow', 1, ['snow'], "Look! It's snowing!", '¡Mira! ¡Está nevando!', '{見|み}て！ {雪|ゆき} だ よ！'),
  P('well_done', 1, [], 'Well done!', '¡Muy bien!', 'よく できました！'),
  P('almost', 1, [], 'Hmm, almost!', 'Mmm, ¡casi!', 'うーん、 おしい！'),
  P('gift_thanks', 1, [], 'Wow, for me? Thank you!', '¡Guau! ¿Para mí? ¡Gracias!', 'わあ、 くれる ^の？ ありがとう！'),
  P('gift_love', 1, ['happy'], "This is my favorite! I'm so happy!", '¡Es mi favorito! ¡Qué feliz estoy!', 'これ、 {大好|だいす}き！ うれしい！'),
  P('i_like_item', 1, [], 'I like $item.', 'Me gusta $item.', '$item ^が {好|す}き です。'),
  P('heres_gift', 1, [], 'This is for you!', '¡Esto es para ti!', 'これ、 どうぞ！'),

  // ---- Shops
  P('want_item', 1, [], "I'd like the $item, please.", 'Quisiera $item, por favor.', '$item ^を ください。'),
  P('pip_shop_welcome', 1, [], 'Welcome! Take a look!', '¡Hola! ¡Mira lo que tengo!', 'いらっしゃい！ {見|み}て いって ね！'),
  P('biscuit_menu', 1, [], "Everything's fresh today!", '¡Todo está fresco hoy!', '{今日|きょう} ^も ぜんぶ できたて です ^よ！'),
  P('which_one', 1, [], 'Which one would you like?', '¿Cuál quieres?', 'どれ ^に する？'),
  P('thanks_purchase', 1, [], 'Thank you! Enjoy it!', '¡Gracias! ¡Disfrútalo!', 'まいど ありがとう！'),
  P('not_enough', 1, ['coin'], "Oh... you don't have enough coins.", 'Ay... no tienes suficientes monedas.', 'あ… コイン ^が {足|た}りない ^よ。'),

  // ---- Fishing
  P('nice_catch', 1, [], 'Nice catch!', '¡Buena pesca!', 'やった ^ね！'),
  P('what_fish', 1, ['fish'], 'What is it?', '¿Qué es?', '{何|なに} ^が {釣|つ}れた？'),
  P('slowly_fine', 2, [], "There's no need to hurry.", 'No hay prisa.', '{急|いそ}がなくて いい ^よ。'),

  // ---- Friendship stories (unlocked with hearts)
  P('b_s1', 1, ['bread'], 'I bake bread every morning.', 'Hago pan todas las mañanas.', '{毎朝|まいあさ}、 パン ^を {焼|や}きます。'),
  P('b_s2', 2, ['honey', 'cake'], 'My favorite food is honey cake.', 'Mi comida favorita es el pastel de miel.', '{好|す}きな {食|た}べもの ^は はちみつケーキ です。'),
  P('b_s3', 3, [], 'When I was little, my grandma taught me to bake.', 'Cuando era pequeña, mi abuela me enseñó a hornear.', '{小|ちい}さい ころ、 おばあちゃん ^が パン ^の {焼|や}き{方|かた} ^を {教|おし}えて くれました。'),
  P('b_s4', 3, [], "You're like family to me now, $name.", 'Ahora eres como de la familia, $name.', '$name ^は もう {家族|かぞく} ^の よう です ^ね。'),
  P('p_s1', 1, ['carrot'], 'I love carrots! Crunch crunch!', '¡Me encantan las zanahorias! ¡Crunch, crunch!', 'にんじん、 {大好|だいす}き！ ポリポリ！'),
  P('p_s2', 2, ['flower', 'garden'], 'I grow flowers in the garden.', 'Cultivo flores en el jardín.', '{庭|にわ} ^で {花|はな} ^を {育|そだ}てて いる ^よ。'),
  P('p_s3', 3, ['store', 'big'], 'Someday I want to open a store in a big city!', '¡Algún día quiero abrir una tienda en una gran ciudad!', 'いつか {大|おお}きな {町|まち} ^で {店|みせ} ^を {開|ひら}きたい！'),
  P('p_s4', 3, [], "But... I'd miss everyone here.", 'Pero... extrañaría a todos aquí.', 'でも… みんな ^と はなれる ^の ^は さびしい ^な。'),
  P('y_s1', 1, ['hot'], 'I love warm baths.', 'Me encantan los baños calientes.', 'あたたかい お{風呂|ふろ} ^が {大好|だいす}き。'),
  P('y_s2', 2, ['star'], 'At night, I watch the stars.', 'Por la noche, miro las estrellas.', '{夜|よる} ^は {星|ほし} ^を {見|み}る ^の。'),
  P('y_s3', 2, [], 'Slowly is fine. Slowly is good.', 'Despacio está bien. Despacio es bueno.', 'ゆっくり で いい。 ゆっくり ^が いい。'),
  P('y_s4', 3, ['pond'], 'With a friend here, even the pond feels warmer.', 'Con un amigo aquí, hasta el estanque se siente más cálido.', '{友|とも}だち ^が いる ^と、 {池|いけ} ^も あたたかい。'),

  // ---- Notice board
  P('n_cake', 2, ['cafe', 'cake', 'strawberry'], "Today at the café: strawberry cake! Only 8 coins.", 'Hoy en la cafetería: ¡pastel de fresa! Solo ocho monedas.', '{今日|きょう} ^の カフェ： いちごケーキ！ {八|はち} コイン です。'),
  P('n_umbrella', 2, ['umbrella', 'red', 'store'], 'Lost: a red umbrella. Please bring it to the store.', 'Perdido: un paraguas rojo. Por favor, tráelo a la tienda.', 'おとしもの： {赤|あか}い {傘|かさ}。 {店|みせ} ^に もって きて ください。'),
  P('n_stars', 2, ['star', 'pond'], 'Tonight: stargazing at the pond with Yuzu.', 'Esta noche: mirar las estrellas en el estanque con Yuzu.', '{今夜|こんや}： ゆず ^と {池|いけ} ^で {星|ほし} ^を {見|み}よう。'),
  P('n_chair', 2, ['chair', 'green', 'store'], "New at Pip's store: a green chair!", 'Nuevo en la tienda de Pip: ¡una silla verde!', 'ピップ ^の {店|みせ} ^に {新|あたら}しい {緑|みどり} ^の {椅子|いす}！'),
  P('n_rain', 2, ['rain', 'umbrella'], "Rain is coming. Don't forget your umbrella!", 'Va a llover. ¡No olvides tu paraguas!', '{雨|あめ} ^が {降|ふ}ります。 {傘|かさ} ^を わすれないで！'),
];

const byId = new Map(PHRASES.map((p) => [p.id, p]));
export const phrase = (id: string): Phrase => {
  const p = byId.get(id);
  if (!p) throw new Error('Unknown phrase ' + id);
  return p;
};
/** Add town dialogue lines to the shared phrase bank. */
export function registerPhrases(list: Phrase[]) {
  for (const p of list) if (!byId.has(p.id)) { PHRASES.push(p); byId.set(p.id, p); }
}
