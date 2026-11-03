import type { Expr, LText } from '../core/types';

/**
 * Conversation scripts. Each step is rendered by ui/dialogue.ts.
 * - say: villager speaks a phrase (target language + meaning + audio)
 * - reply: player picks what to say back (ok = acceptable, bad = distractors)
 * - build: player arranges word tiles into a phrase
 * - name: player names the shown item; listen: player hears a word and picks the picture
 * - meaning: player picks what the villager's last line meant
 * - ask: native-language comprehension question answered with pictures
 * - do: game side effects (rewards, items, quest flags)
 */
export type Step =
  | { t: 'say'; p: string; e?: Expr; item?: string }
  | { t: 'narrate'; text: LText; icon?: string }
  | { t: 'reply'; ok: string[]; bad?: string[]; e?: Expr; item?: string }
  | { t: 'build'; p: string; item?: string }
  | { t: 'name'; w: string; opts?: string[]; due?: boolean }
  | { t: 'listen'; w: string; opts?: string[]; due?: boolean }
  | { t: 'meaning'; p: string }
  | { t: 'ask'; q: LText; w: string; opts: string[] }
  | { t: 'quiz'; q: LText; options: string[]; answer: number }
  | { t: 'do'; fn: string; arg?: unknown };

export const CONVOS: Record<string, Step[]> = {
  intro_biscuit: [
    { t: 'say', p: 'surprise_biscuit', e: 'surprised' },
    { t: 'say', p: 'hello', e: 'happy' },
    { t: 'say', p: 'welcome_village', e: 'happy' },
    { t: 'say', p: 'im_biscuit' },
    { t: 'say', p: 'whats_your_name' },
    { t: 'reply', ok: ['my_name_is'], bad: ['thanks', 'see_you'] },
    { t: 'say', p: 'nice_meet', e: 'happy' },
    { t: 'reply', ok: ['nice_meet_too'], bad: ['good_evening', 'whats_this'] },
    { t: 'say', p: 'cookie_for_you', e: 'love' },
    { t: 'do', fn: 'giveItem', arg: 'cookie' },
    { t: 'build', p: 'thanks' },
    { t: 'say', p: 'go_say_hello', e: 'happy' },
    { t: 'meaning', p: 'go_say_hello' },
    { t: 'do', fn: 'meet', arg: 'biscuit' },
  ],
  intro_pip: [
    { t: 'say', p: 'surprise_pip', e: 'surprised' },
    { t: 'say', p: 'im_pip', e: 'happy' },
    { t: 'say', p: 'how_are_you', e: 'surprised' },
    { t: 'reply', ok: ['im_fine', 'im_sleepy'], bad: ['see_you', 'whats_your_name'] },
    { t: 'say', p: 'this_my_store', e: 'happy' },
    { t: 'meaning', p: 'this_my_store' },
    { t: 'say', p: 'come_anytime', e: 'love' },
    { t: 'reply', ok: ['thanks'], bad: ['good_morning', 'not_really'] },
    { t: 'do', fn: 'meet', arg: 'pip' },
  ],
  intro_yuzu: [
    { t: 'say', p: 'surprise_yuzu', e: 'surprised' },
    { t: 'say', p: 'yuzu_hello', e: 'sleepy' },
    { t: 'reply', ok: ['hello'], bad: ['see_you', 'thanks'] },
    { t: 'say', p: 'im_yuzu' },
    { t: 'say', p: 'like_fish_q', e: 'surprised' },
    { t: 'reply', ok: ['yes_like', 'not_really'], bad: ['good_morning', 'cookie_for_you'] },
    { t: 'say', p: 'pond_calm', e: 'happy' },
    { t: 'say', p: 'talk_anytime', e: 'sleepy' },
    { t: 'build', p: 'see_you' },
    { t: 'do', fn: 'meet', arg: 'yuzu' },
  ],

  tea_yuzu1: [
    { t: 'say', p: 'a_bit_cold', e: 'sad' },
    { t: 'say', p: 'want_hot_tea', e: 'thinking' },
    { t: 'ask', q: { en: 'What does Yuzu want?', es: '¿Qué quiere Yuzu?', ja: 'ゆずは何がほしい？' }, w: 'tea', opts: ['tea', 'coffee', 'cake'] },
    { t: 'say', p: 'buy_at_cafe' },
    { t: 'reply', ok: ['of_course'], bad: ['see_you', 'im_sleepy'] },
    { t: 'do', fn: 'giveCoins', arg: 5 },
    { t: 'narrate', icon: '🪙', text: { en: 'Yuzu presses 5 coins into your paw.', es: 'Yuzu te da 5 monedas.', ja: 'ゆずが5コインをくれた。' } },
  ],
  tea_biscuit: [
    { t: 'say', p: 'what_would_you_like', e: 'happy' },
    { t: 'reply', ok: ['order_tea'], bad: ['order_coffee', 'order_cake'] },
    { t: 'say', p: 'hot_or_iced', e: 'thinking' },
    { t: 'reply', ok: ['hot_please'], bad: ['iced_please'] },
    { t: 'say', p: 'thats_5' },
    { t: 'do', fn: 'pay', arg: 5 },
    { t: 'say', p: 'here_you_go', e: 'happy' },
    { t: 'do', fn: 'giveItem', arg: 'hot_tea' },
    { t: 'build', p: 'thanks_lot' },
  ],
  tea_yuzu2: [
    { t: 'narrate', icon: '🍵', text: { en: 'You hold out the steaming cup.', es: 'Le ofreces la taza humeante.', ja: '湯気の立つカップを差し出した。' } },
    { t: 'reply', ok: ['heres_tea'], bad: ['heres_coffee', 'whats_this'] },
    { t: 'do', fn: 'takeItem', arg: 'hot_tea' },
    { t: 'say', p: 'warm_thanks', e: 'love' },
    { t: 'say', p: 'rod_for_you', e: 'happy' },
    { t: 'do', fn: 'giveItem', arg: 'rod' },
    { t: 'say', p: 'lets_fish', e: 'happy' },
    { t: 'reply', ok: ['of_course'], bad: ['whats_your_name', 'good_morning'] },
  ],

  lost_pip1: [
    { t: 'say', p: 'oh_no', e: 'surprised' },
    { t: 'say', p: 'lost_three', e: 'sad' },
    { t: 'say', p: 'key_fountain', e: 'thinking' },
    { t: 'say', p: 'book_tree', e: 'thinking' },
    { t: 'say', p: 'umbrella_bridge', e: 'thinking' },
    { t: 'ask', q: { en: 'Where is the key?', es: '¿Dónde está la llave?', ja: '鍵はどこ？' }, w: 'fountain', opts: ['fountain', 'tree', 'bridge'] },
    { t: 'say', p: 'can_you_help', e: 'sad' },
    { t: 'reply', ok: ['of_course'], bad: ['see_you', 'im_sleepy'] },
    { t: 'do', fn: 'spawnLost' },
  ],
  lost_pip2: [
    { t: 'say', p: 'what_did_you_find', e: 'surprised' },
    { t: 'build', p: 'i_found_it' },
    { t: 'name', w: 'key', opts: ['key', 'book', 'umbrella'] },
    { t: 'name', w: 'book', opts: ['book', 'key', 'umbrella'] },
    { t: 'name', w: 'umbrella', opts: ['umbrella', 'book', 'key'] },
    { t: 'do', fn: 'takeItem', arg: 'key' },
    { t: 'do', fn: 'takeItem', arg: 'book' },
    { t: 'do', fn: 'takeItem', arg: 'umbrella' },
    { t: 'say', p: 'youre_best', e: 'love' },
  ],
};
