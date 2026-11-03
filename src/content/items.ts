/** Every item maps to a lexeme so buying, gifting, and collecting all reinforce vocabulary. */
export type ItemKind = 'food' | 'furniture' | 'clothing' | 'fish' | 'tool' | 'quest' | 'nature';

export interface ItemDef {
  id: string;
  lex: string;
  kind: ItemKind;
  price?: number;
  sell?: number;
  shop?: 'cafe' | 'store';
  minLevel?: number;
  /** Furniture footprint in grid cells [w, d]. */
  size?: [number, number];
  color?: string;
  /** Fishing weight & time-of-day availability. */
  fish?: { weight: number; night?: boolean; day?: boolean };
  slot?: 'hat' | 'neck' | 'face';
}

export const ITEMS: ItemDef[] = [
  // Café menu
  { id: 'bread', lex: 'bread', kind: 'food', price: 4, shop: 'cafe' },
  { id: 'cookie', lex: 'cookie', kind: 'food', price: 3, shop: 'cafe' },
  { id: 'croissant', lex: 'croissant', kind: 'food', price: 6, shop: 'cafe' },
  { id: 'cake', lex: 'cake', kind: 'food', price: 8, shop: 'cafe' },
  { id: 'coffee', lex: 'coffee', kind: 'food', price: 5, shop: 'cafe' },
  { id: 'tea', lex: 'tea', kind: 'food', price: 5, shop: 'cafe' },
  { id: 'milk', lex: 'milk', kind: 'food', price: 3, shop: 'cafe' },
  { id: 'soup', lex: 'soup', kind: 'food', price: 7, shop: 'cafe', minLevel: 2 },
  { id: 'sandwich', lex: 'sandwich', kind: 'food', price: 7, shop: 'cafe', minLevel: 2 },
  { id: 'honey', lex: 'honey', kind: 'food', price: 6, shop: 'cafe', minLevel: 2 },
  // General store
  { id: 'apple', lex: 'apple', kind: 'food', price: 3, shop: 'store' },
  { id: 'strawberry', lex: 'strawberry', kind: 'food', price: 4, shop: 'store' },
  { id: 'carrot', lex: 'carrot', kind: 'food', price: 3, shop: 'store' },
  { id: 'chair', lex: 'chair', kind: 'furniture', price: 40, shop: 'store', size: [1, 1], color: '#E9B872' },
  { id: 'table', lex: 'table', kind: 'furniture', price: 60, shop: 'store', size: [1, 1], color: '#D9A066' },
  { id: 'lamp', lex: 'lamp', kind: 'furniture', price: 50, shop: 'store', size: [1, 1], color: '#F6C9A8' },
  { id: 'plant', lex: 'plant', kind: 'furniture', price: 35, shop: 'store', size: [1, 1], color: '#7FB77E' },
  { id: 'rug', lex: 'rug', kind: 'furniture', price: 45, shop: 'store', size: [2, 2], color: '#E8A7A0' },
  { id: 'bed', lex: 'bed', kind: 'furniture', price: 120, shop: 'store', size: [1, 2], color: '#9CC5E8' },
  { id: 'radio', lex: 'radio', kind: 'furniture', price: 70, shop: 'store', size: [1, 1], color: '#E6896B' },
  { id: 'clock', lex: 'clock', kind: 'furniture', price: 80, shop: 'store', size: [1, 1], color: '#B88A5E', minLevel: 2 },
  { id: 'bookshelf', lex: 'bookshelf', kind: 'furniture', price: 90, shop: 'store', size: [1, 1], color: '#C8956A', minLevel: 2 },
  { id: 'sofa', lex: 'sofa', kind: 'furniture', price: 140, shop: 'store', size: [2, 1], color: '#B6A3D9', minLevel: 3 },
  { id: 'plush', lex: 'plush', kind: 'furniture', price: 100, shop: 'store', size: [1, 1], color: '#D7A27A', minLevel: 3 },
  { id: 'hat', lex: 'hat', kind: 'clothing', price: 60, shop: 'store', slot: 'hat', color: '#EED8A0' },
  { id: 'cap', lex: 'cap', kind: 'clothing', price: 45, shop: 'store', slot: 'hat', color: '#7FB0D9' },
  { id: 'ribbon', lex: 'ribbon', kind: 'clothing', price: 40, shop: 'store', slot: 'hat', color: '#F28FA6' },
  { id: 'scarf', lex: 'scarf', kind: 'clothing', price: 50, shop: 'store', slot: 'neck', color: '#E5735F' },
  { id: 'glasses', lex: 'glasses', kind: 'clothing', price: 55, shop: 'store', slot: 'face', color: '#5B4636', minLevel: 2 },
  { id: 'crown', lex: 'crown', kind: 'clothing', price: 300, shop: 'store', slot: 'hat', color: '#F2C94C', minLevel: 4 },
  // Pond
  { id: 'goldfish', lex: 'goldfish', kind: 'fish', sell: 30, fish: { weight: 3 } },
  { id: 'carp', lex: 'carp', kind: 'fish', sell: 40, fish: { weight: 3 } },
  { id: 'trout', lex: 'trout', kind: 'fish', sell: 50, fish: { weight: 2, day: true } },
  { id: 'catfish', lex: 'catfish', kind: 'fish', sell: 70, fish: { weight: 2, night: true } },
  { id: 'crab', lex: 'crab', kind: 'fish', sell: 35, fish: { weight: 2 } },
  { id: 'turtle', lex: 'turtle', kind: 'fish', sell: 90, fish: { weight: 1 } },
  { id: 'frog', lex: 'frog', kind: 'fish', sell: 25, fish: { weight: 2 } },
  { id: 'shrimp', lex: 'shrimp', kind: 'fish', sell: 20, fish: { weight: 2 } },
  { id: 'boot', lex: 'boot', kind: 'fish', sell: 5, fish: { weight: 1 } },
  // Found around the village
  { id: 'flower', lex: 'flower', kind: 'nature', sell: 5 },
  { id: 'mushroom', lex: 'mushroom', kind: 'nature', sell: 15 },
  // Tools & quest items
  { id: 'rod', lex: 'rod', kind: 'tool' },
  { id: 'hot_tea', lex: 'tea', kind: 'quest' },
  { id: 'key', lex: 'key', kind: 'quest' },
  { id: 'book', lex: 'book', kind: 'quest' },
  { id: 'umbrella', lex: 'umbrella', kind: 'quest' },
  // Clover Meadow story items
  { id: 'eggs_basket', lex: 'n5_tamago', kind: 'quest' },
  { id: 'letter_hana', lex: 'n5_tegami', kind: 'quest' },
  { id: 'letter_kuu', lex: 'n5_tegami', kind: 'quest' },
  { id: 'letter_pon', lex: 'n5_tegami', kind: 'quest' },
  { id: 'honey_jar', lex: 'honey', kind: 'quest' },
  { id: 'lanterns', lex: 'n5_chouchin', kind: 'quest' },
];

const byId = new Map(ITEMS.map((i) => [i.id, i]));
export const item = (id: string) => {
  const i = byId.get(id);
  if (!i) throw new Error('Unknown item ' + id);
  return i;
};

export const WALLPAPERS = [
  { id: 'cream', color: '#FBEBD5', accent: '#F3D9B8', pattern: 'stripes' },
  { id: 'mint', color: '#D8EEDC', accent: '#C2E2C8', pattern: 'dots' },
  { id: 'peach', color: '#FBD9CC', accent: '#F6C3B2', pattern: 'gingham' },
  { id: 'sky', color: '#D6E9F6', accent: '#BFDAEE', pattern: 'clouds' },
] as const;
export const FLOORS = [
  { id: 'oak', color: '#D9A877', accent: '#C9925F', pattern: 'planks' },
  { id: 'checker', color: '#F5E6CF', accent: '#E8B9A6', pattern: 'checker' },
  { id: 'moss', color: '#BBD5A0', accent: '#A8C78C', pattern: 'carpet' },
] as const;
