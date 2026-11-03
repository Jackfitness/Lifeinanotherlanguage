import type { LText } from '../core/types';

export interface QuestStep {
  /** Talk to every listed NPC (each runs its own conversation). */
  talk?: Record<string, string>;
  /** Collect world pickups (item ids) placed at SPOTS.lost. */
  collect?: string[];
  objective: LText;
  /** Optional target-language hint phrase shown in the quest log (reading practice). */
  hints?: string[];
}

export interface QuestDef {
  id: string;
  icon: string;
  title: LText;
  summary: LText;
  after?: string[];
  steps: QuestStep[];
  reward: { coins: number; xp: number; items?: string[]; friend?: [string, number] };
}

export const QUESTS: QuestDef[] = [
  {
    id: 'q_hello', icon: '👋',
    title: { en: 'Hello, Neighbors!', es: '¡Hola, vecinos!', ja: 'こんにちは、ご近所さん！' },
    summary: {
      en: 'Introduce yourself to the villagers.',
      es: 'Preséntate a los vecinos del pueblo.',
      ja: '村のみんなに自己紹介しよう。',
    },
    steps: [
      { talk: { biscuit: 'intro_biscuit' }, objective: { en: 'Say hello to Biscuit by the café', es: 'Saluda a Bizcocho junto a la cafetería', ja: 'カフェのそばでビスケットにあいさつしよう' } },
      { talk: { pip: 'intro_pip', yuzu: 'intro_yuzu' }, objective: { en: 'Meet Pip at the store and Yuzu at the pond', es: 'Conoce a Pip en la tienda y a Yuzu en el estanque', ja: 'お店のピップと池のゆずに会おう' }, hints: ['go_say_hello'] },
    ],
    reward: { coins: 60, xp: 40 },
  },
  {
    id: 'q_tea', icon: '🍵', after: ['q_hello'],
    title: { en: 'Tea for Yuzu', es: 'Un té para Yuzu', ja: 'ゆずにお茶を' },
    summary: {
      en: 'Yuzu looks chilly. Maybe something warm would help?',
      es: 'Yuzu parece tener frío. ¿Algo calentito ayudaría?',
      ja: 'ゆずが寒そう。あたたかいものがあればいいかも？',
    },
    steps: [
      { talk: { yuzu: 'tea_yuzu1' }, objective: { en: 'Check on Yuzu at the pond', es: 'Visita a Yuzu en el estanque', ja: '池にいるゆずの様子を見に行こう' } },
      { talk: { biscuit: 'tea_biscuit' }, objective: { en: 'Order what Yuzu wanted at the café', es: 'Pide en la cafetería lo que quería Yuzu', ja: 'カフェでゆずがほしいものを注文しよう' }, hints: ['want_hot_tea'] },
      { talk: { yuzu: 'tea_yuzu2' }, objective: { en: 'Bring the drink to Yuzu', es: 'Lleva la bebida a Yuzu', ja: '飲み物をゆずに届けよう' } },
    ],
    reward: { coins: 80, xp: 60, friend: ['yuzu', 20] },
  },
  {
    id: 'q_lost', icon: '🔎', after: ['q_hello'],
    title: { en: "Pip's Lost Things", es: 'Las cosas perdidas de Pip', ja: 'ピップのおとしもの' },
    summary: {
      en: 'Pip has misplaced three things around the village.',
      es: 'Pip perdió tres cosas por el pueblo.',
      ja: 'ピップが村のどこかで三つのものをなくしたみたい。',
    },
    steps: [
      { talk: { pip: 'lost_pip1' }, objective: { en: 'Find out what is bothering Pip', es: 'Averigua qué le pasa a Pip', ja: 'ピップがこまっている理由を聞こう' } },
      { collect: ['key', 'book', 'umbrella'], objective: { en: 'Find the three lost things', es: 'Encuentra las tres cosas perdidas', ja: 'なくしもの三つを見つけよう' }, hints: ['key_fountain', 'book_tree', 'umbrella_bridge'] },
      { talk: { pip: 'lost_pip2' }, objective: { en: 'Return everything to Pip', es: 'Devuélvele todo a Pip', ja: 'ピップに全部返そう' } },
    ],
    reward: { coins: 120, xp: 60, items: ['lamp'], friend: ['pip', 20] },
  },
];

export const questDef = (id: string) => QUESTS.find((q) => q.id === id)!;
