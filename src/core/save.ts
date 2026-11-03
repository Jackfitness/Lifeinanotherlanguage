import type { JaScript, LangCode, Level, Species } from './types';
import { bus } from './events';

export interface SrsCard {
  reps: number; ease: number; ivl: number; due: number;
  seen: number; right: number; wrong: number; first: number; last: number;
}

export interface PairProgress {
  lex: Record<string, SrsCard>;
  phr: Record<string, SrsCard>;
  notes: string[];
}

export interface SaveData {
  version: number;
  createdAt: number;
  updatedAt: number;
  profile: {
    name: string; species: Species; color: string;
    native: LangCode; target: LangCode; level: Level;
  };
  settings: {
    music: number; sfx: number; blips: boolean; autoplay: boolean;
    rate: number; textSize: 'm' | 'l' | 'xl'; jaScript: JaScript; romaji: boolean;
    timeMode: 'real' | 'day';
    font: 'cozy' | 'pop' | 'hand' | 'classic';
    showMeanings: boolean;
  };
  player: { coins: number; xp: number; x: number; z: number; place?: string; outfit: { hat?: string; neck?: string; face?: string } };
  inventory: Record<string, number>;
  home: { size: number; wallpaper: string; floor: string; placed: { uid: number; item: string; x: number; z: number; rot: number }[]; nextUid: number };
  learning: Record<string, PairProgress>;
  quests: Record<string, { state: 'active' | 'done'; step: number; talked: string[]; found: string[] }>;
  friends: Record<string, { pts: number; met: boolean; lastChat: string; lastGift: string; story: number }>;
  collection: Record<string, { caught: number; known: boolean }>;
  achievements: Record<string, number>;
  daily: { day: string; reviewCoins: number; notice: boolean; flowers: number[]; mushrooms: number[]; playSeconds: number; warned: boolean };
  stats: { streak: number; lastDay: string; days: number; correct: number; answered: number; fishCaught: number };
  flags: Record<string, boolean>;
}

/** Storage backend. Swap LocalStorageAdapter for a cloud adapter later without touching game code. */
export interface SaveAdapter {
  load(): Promise<SaveData | null>;
  save(data: SaveData): Promise<void>;
  clear(): Promise<void>;
}

const KEY = 'cozy-language-village/save';

export class LocalStorageAdapter implements SaveAdapter {
  async load() {
    try {
      const raw = localStorage.getItem(KEY);
      return raw ? (JSON.parse(raw) as SaveData) : null;
    } catch { return null; }
  }
  async save(data: SaveData) {
    try { localStorage.setItem(KEY, JSON.stringify(data)); } catch { /* storage unavailable: keep playing in memory */ }
  }
  async clear() { try { localStorage.removeItem(KEY); } catch { /* ignore */ } }
}

export const SAVE_VERSION = 1;
export const today = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

export function newSave(profile: SaveData['profile']): SaveData {
  const now = Date.now();
  return {
    version: SAVE_VERSION, createdAt: now, updatedAt: now, profile,
    settings: {
      music: 0.5, sfx: 0.7, blips: true, autoplay: true,
      rate: profile.level === 'beginner' ? 0.8 : profile.level === 'intermediate' ? 0.9 : 1,
      textSize: 'm',
      jaScript: profile.level === 'beginner' ? 'kana' : profile.level === 'intermediate' ? 'furigana' : 'kanji',
      romaji: false, timeMode: 'real', font: 'cozy', showMeanings: false,
    },
    player: { coins: 20, xp: 0, x: 1.2, z: 22.2, outfit: {} },
    inventory: {},
    home: { size: 6, wallpaper: 'cream', floor: 'oak', placed: [
      { uid: 1, item: 'bed', x: -2, z: -1.5, rot: 0 },
      { uid: 2, item: 'table', x: 1.5, z: 0.5, rot: 0 },
    ], nextUid: 3 },
    learning: {},
    quests: { q_hello: { state: 'active', step: 0, talked: [], found: [] } },
    friends: {},
    collection: {},
    achievements: {},
    daily: { day: '', reviewCoins: 0, notice: false, flowers: [], mushrooms: [], playSeconds: 0, warned: false },
    stats: { streak: 0, lastDay: '', days: 0, correct: 0, answered: 0, fishCaught: 0 },
    flags: {},
  };
}

/** Fill in fields added in later versions so older saves keep working. */
function migrate(d: SaveData): SaveData {
  const base = newSave(d.profile);
  const out = { ...base, ...d } as SaveData;
  out.settings = { ...base.settings, ...d.settings };
  // Japanese-only: everyone learns Japanese with English or Spanish as their own language.
  out.profile = { ...d.profile, target: 'ja', native: d.profile.native === 'es' ? 'es' : 'en' };
  // Saves from before the Cozy font kept the old default unless the player picked one.
  if (out.settings.font === 'pop' && !d.flags?.fontPicked) out.settings.font = 'cozy';
  out.player = { ...base.player, ...d.player, outfit: { ...(d.player?.outfit ?? {}) } };
  out.home = { ...base.home, ...d.home };
  out.daily = { ...base.daily, ...d.daily };
  out.stats = { ...base.stats, ...d.stats };
  out.version = SAVE_VERSION;
  return out;
}

class SaveStore {
  data!: SaveData;
  private adapter: SaveAdapter = new LocalStorageAdapter();
  private timer: number | undefined;

  setAdapter(a: SaveAdapter) { this.adapter = a; }
  async load(): Promise<boolean> {
    const d = await this.adapter.load();
    if (d && d.profile) { this.data = migrate(d); return true; }
    return false;
  }
  create(profile: SaveData['profile']) { this.data = newSave(profile); this.flush(); }
  /** Mark state as changed; persisted shortly after (debounced). */
  touch(reason = 'change') {
    this.data.updatedAt = Date.now();
    bus.emit('save:changed', reason);
    clearTimeout(this.timer);
    this.timer = window.setTimeout(() => this.flush(), 400);
  }
  flush() { if (this.data) void this.adapter.save(this.data); }
  async reset() { await this.adapter.clear(); }
}

export const store = new SaveStore();
export const S = () => store.data;
