import type { LText } from '../core/types';

/**
 * Towns beyond the starter village, unlocked by the Village Pass. Levels follow the JLPT
 * (N5 → N1) for Japanese learners and the matching CEFR levels (A1 → C1) for English and Spanish.
 */
export interface Region {
  id: string;
  jlpt: string;
  cefr: string;
  name: LText;
  blurb: LText;
  animals: { icon: string; name: LText }[];
  color: string;
  /** Position on the world map (0–100 in both axes). */
  at: [number, number];
}

export const HOME_REGION = {
  name: { en: 'Cozy Village', es: 'Pueblito Acogedor', ja: 'ほっこり村' } as LText,
  at: [50, 58] as [number, number],
};

export const REGIONS: Region[] = [
  {
    id: 'clover', jlpt: 'N5', cefr: 'A1', color: '#A8DABB', at: [22, 74],
    name: { en: 'Clover Meadow', es: 'Prado del Trébol', ja: 'クローバー草原' },
    blurb: {
      en: 'Rolling fields and a lily pond where you learn to shop, count and chat about the weather.',
      es: 'Campos ondulados y un estanque de nenúfares donde aprendes a comprar, contar y hablar del clima.',
      ja: 'なだらかな野原と睡蓮の池。買い物や数、天気の話を覚えよう。',
    },
    animals: [
      { icon: 'duck', name: { en: 'Ducks', es: 'Patos', ja: 'アヒル' } },
      { icon: 'frog', name: { en: 'Frogs', es: 'Ranas', ja: 'カエル' } },
    ],
  },
  {
    id: 'harbor', jlpt: 'N4', cefr: 'A2', color: '#9FD3E6', at: [16, 40],
    name: { en: 'Maple Harbor', es: 'Puerto Arce', ja: 'もみじ港' },
    blurb: {
      en: 'A breezy fishing port. Take the ferry, order at the fish market and plan trips with friends.',
      es: 'Un puerto pesquero con brisa. Toma el ferry, pide en el mercado y planea viajes con amigos.',
      ja: '風が気持ちいい港町。フェリーに乗ったり、市場で注文したり、旅の計画を立てたり。',
    },
    animals: [
      { icon: 'penguin', name: { en: 'Penguins', es: 'Pingüinos', ja: 'ペンギン' } },
      { icon: 'otter', name: { en: 'Otters', es: 'Nutrias', ja: 'カワウソ' } },
    ],
  },
  {
    id: 'lantern', jlpt: 'N3', cefr: 'B1', color: '#F6C343', at: [42, 20],
    name: { en: 'Lantern Hills', es: 'Colinas de Faroles', ja: 'ちょうちん丘' },
    blurb: {
      en: 'A night market glowing with paper lanterns. Haggle, tell stories and solve little mysteries.',
      es: 'Un mercado nocturno lleno de faroles. Regatea, cuenta historias y resuelve pequeños misterios.',
      ja: 'ちょうちんが灯る夜市。値切ったり、話をしたり、小さな謎を解いたり。',
    },
    animals: [
      { icon: 'fox', name: { en: 'Foxes', es: 'Zorros', ja: 'キツネ' } },
      { icon: 'raccoon', name: { en: 'Raccoons', es: 'Mapaches', ja: 'アライグマ' } },
    ],
  },
  {
    id: 'snowcap', jlpt: 'N2', cefr: 'B2', color: '#DDE8EC', at: [74, 18],
    name: { en: 'Snowcap Peaks', es: 'Picos Nevados', ja: '雪山の里' },
    blurb: {
      en: 'A mountain village of hot springs and libraries. Debate, give advice and read the local news.',
      es: 'Un pueblo de montaña con aguas termales y bibliotecas. Debate, aconseja y lee las noticias.',
      ja: '温泉と図書館のある山の里。意見を交わしたり、相談にのったり、新聞を読んだり。',
    },
    animals: [
      { icon: 'owl', name: { en: 'Owls', es: 'Búhos', ja: 'フクロウ' } },
      { icon: 'deer', name: { en: 'Deer', es: 'Ciervos', ja: 'シカ' } },
    ],
  },
  {
    id: 'starlight', jlpt: 'N1', cefr: 'C1', color: '#B6A3D9', at: [82, 50],
    name: { en: 'Starlight City', es: 'Ciudad Estrella', ja: '星あかりの街' },
    blurb: {
      en: 'The big city Pip dreams about. Job interviews, theater nights and conversations with real depth.',
      es: 'La gran ciudad con la que sueña Pip. Entrevistas, noches de teatro y conversaciones profundas.',
      ja: 'ピップが夢見る大きな街。面接や観劇、深い会話が待っている。',
    },
    animals: [
      { icon: 'cat', name: { en: 'Cats', es: 'Gatos', ja: 'ネコ' } },
      { icon: 'dog', name: { en: 'Dogs', es: 'Perros', ja: 'イヌ' } },
    ],
  },
];

export const regionLevel = (r: Region, target: string) => (target === 'ja' ? r.jlpt : r.cefr);
