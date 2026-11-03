// Exports every line that should get pre-rendered pronunciation audio, split into packs:
//   "ja"          → the starter village + Clover Meadow (loaded everywhere)
//   "ja-<town>"   → one pack per Village Pass town (loaded only while you are there)
// Usage: npm run voice:lines   (writes tools/voice/lines.json)
import { writeFileSync } from 'node:fs';
import { LEXICON } from '../../src/content/lexicon';
import { PHRASES } from '../../src/content/phrases';
import { ITEMS } from '../../src/content/items';
import { NPCS } from '../../src/content/characters';
import { TOWNS } from '../../src/content/towns';

const lexText = new Map<string, Record<string, string>>(LEXICON.map((l) => [l.id, l.t as Record<string, string>]));
for (const t of TOWNS) for (const w of t.words) lexText.set(w.id, w.t as Record<string, string>);

/** Speak the ruby readings the game teaches ({私|わたし} → わたし) so the voice never picks another reading. */
const plain = (src: string) => src.replace(/\{([^|}]+)\|([^}]+)\}/g, '$2').replace(/\^/g, '').replace(/ /g, '').trim();

const shopLex = [...new Set(ITEMS.filter((i) => i.shop).map((i) => i.lex))];
const favLex = [...new Set(NPCS.flatMap((n) => n.favorites))];
const ITEM_FILL: Record<string, string[]> = { want_item: shopLex, i_like_item: favLex };

type Line = { key: string; text: string };
function phraseLines(list: { id: string; t: Record<string, string> }[]): Line[] {
  const out: Line[] = [];
  for (const p of list) {
    const src = p.t.ja;
    if (!src || src.includes('$name')) continue; // the player's name varies: device voice handles these
    if (src.includes('$item')) {
      for (const lx of ITEM_FILL[p.id] ?? []) out.push({ key: `p:${p.id}|${lx}`, text: plain(src.split('$item').join(lexText.get(lx)?.ja ?? '')) });
      continue;
    }
    out.push({ key: `p:${p.id}`, text: plain(src) });
  }
  return out;
}

const packs: Record<string, Line[]> = {};
const clover = TOWNS.find((t) => t.id === 'clover')!;
packs.ja = [
  ...LEXICON.map((l) => ({ key: `w:${l.id}`, text: plain(l.t.ja) })),
  ...clover.words.map((w) => ({ key: `w:${w.id}`, text: plain(w.t.ja) })),
  ...phraseLines(PHRASES as never),
  ...phraseLines(clover.phrases as never),
];
for (const t of TOWNS) {
  if (t.id === 'clover') continue;
  packs[`ja-${t.id}`] = [...t.words.map((w) => ({ key: `w:${w.id}`, text: plain(w.t.ja) })), ...phraseLines(t.phrases as never)];
}
writeFileSync(new URL('./lines.json', import.meta.url), JSON.stringify(packs, null, 1));
for (const [k, v] of Object.entries(packs)) console.log(`${k}: ${v.length} lines`);
