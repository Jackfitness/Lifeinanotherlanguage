import type { LText, Species } from '../core/types';

export interface RoutineSlot { from: number; to: number; node: string; activity: 'work' | 'stroll' | 'fish' | 'rest' | 'garden' | 'stargaze' }

export interface NpcDef {
  id: string;
  species: Species;
  name: LText;
  title: LText;
  personality: LText;
  colors: { main: string; accent: string; belly: string; nose: string };
  extra: 'apron' | 'yuzu' | 'bow';
  /** Voice blip base frequency (Hz) and speed multiplier. */
  voice: { pitch: number; speed: number };
  favorites: string[];
  likes: string[];
  /** Story phrases unlocked at 1..4 hearts. */
  stories: string[];
  routine: RoutineSlot[];
  tint: string;
}

export const NPCS: NpcDef[] = [
  {
    id: 'biscuit', species: 'bear',
    name: { en: 'Biscuit', es: 'Bizcocho', ja: 'ビスケット' },
    title: { en: 'Café baker', es: 'Panadera del café', ja: 'カフェのパン屋さん' },
    personality: {
      en: 'Warm and motherly. Bakes before sunrise and remembers everyone\'s favorite treat.',
      es: 'Cálida y maternal. Hornea antes del amanecer y recuerda el dulce favorito de todos.',
      ja: 'あたたかくて面倒見がいい。日の出前にパンを焼き、みんなの好物を覚えている。',
    },
    colors: { main: '#C98F5E', accent: '#8A5A3B', belly: '#F2DCC0', nose: '#4A2E22' },
    extra: 'apron',
    voice: { pitch: 190, speed: 0.9 },
    favorites: ['strawberry', 'honey'],
    likes: ['cake', 'cookie', 'bread', 'apple', 'milk'],
    stories: ['b_s1', 'b_s2', 'b_s3', 'b_s4'],
    routine: [
      { from: 5, to: 19, node: 'cafe', activity: 'work' },
      { from: 19, to: 22, node: 'plazaW', activity: 'stroll' },
      { from: 22, to: 29, node: 'biscuitHome', activity: 'rest' },
    ],
    tint: '#E3A574',
  },
  {
    id: 'pip', species: 'bunny',
    name: { en: 'Pip', es: 'Pip', ja: 'ピップ' },
    title: { en: 'General store keeper', es: 'Dueño de la tienda', ja: 'よろず屋の店主' },
    personality: {
      en: 'Bouncy, chatty, and a little scatterbrained. Dreams of big-city adventures.',
      es: 'Saltarín, conversador y algo despistado. Sueña con aventuras en la gran ciudad.',
      ja: '元気でおしゃべり、ちょっとそそっかしい。大きな町での冒険にあこがれている。',
    },
    colors: { main: '#F4ECE2', accent: '#F2B2B8', belly: '#FFFFFF', nose: '#E58C98' },
    extra: 'bow',
    voice: { pitch: 360, speed: 1.25 },
    favorites: ['carrot', 'flower'],
    likes: ['apple', 'strawberry', 'cookie', 'sandwich'],
    stories: ['p_s1', 'p_s2', 'p_s3', 'p_s4'],
    routine: [
      { from: 7, to: 12, node: 'store', activity: 'work' },
      { from: 12, to: 14, node: 'garden', activity: 'garden' },
      { from: 14, to: 20, node: 'store', activity: 'work' },
      { from: 20, to: 31, node: 'pipHome', activity: 'rest' },
    ],
    tint: '#F2A7B0',
  },
  {
    id: 'yuzu', species: 'capybara',
    name: { en: 'Yuzu', es: 'Yuzu', ja: 'ゆず' },
    title: { en: 'Pond philosopher', es: 'Filósofa del estanque', ja: '池の哲学者' },
    personality: {
      en: 'Calm, sleepy, and kind. Believes there is never a reason to hurry.',
      es: 'Tranquila, dormilona y amable. Cree que nunca hay razón para apurarse.',
      ja: 'のんびりで眠たがり、そしてやさしい。急ぐ理由なんてないと思っている。',
    },
    colors: { main: '#B98A5E', accent: '#7E5A3C', belly: '#D9B48E', nose: '#3E2A20' },
    extra: 'yuzu',
    voice: { pitch: 150, speed: 0.7 },
    favorites: ['tea', 'apple'],
    likes: ['soup', 'milk', 'water', 'honey'],
    stories: ['y_s1', 'y_s2', 'y_s3', 'y_s4'],
    routine: [
      { from: 6, to: 17, node: 'dockEnd', activity: 'fish' },
      { from: 17, to: 20, node: 'pondS', activity: 'stroll' },
      { from: 20, to: 30, node: 'dockEnd', activity: 'stargaze' },
    ],
    tint: '#D9A15E',
  },
];

export const npcDef = (id: string) => NPCS.find((n) => n.id === id)!;

/** Friendship points needed for each heart (index = hearts). */
export const HEART_THRESHOLDS = [0, 20, 50, 100, 170, 260];
export const heartsFor = (pts: number) => HEART_THRESHOLDS.filter((t) => pts >= t).length - 1;
