// Exports every line that should get pre-rendered pronunciation audio.
// Usage: node --experimental-strip-types tools/voice/export-lines.mjs > tools/voice/lines.json
import { LEXICON } from '../../src/content/lexicon.ts';
import { PHRASES } from '../../src/content/phrases.ts';
import { ITEMS } from '../../src/content/items.ts';
import { NPCS } from '../../src/content/characters.ts';
import { CLOVER_WORDS } from '../../src/content/towns/clover/vocab.ts';
import { CLOVER_PHRASES } from '../../src/content/towns/clover/story.ts';

const LANGS = (process.env.LANGS || 'ja').split(',');
LEXICON.push(...CLOVER_WORDS);
PHRASES.push(...CLOVER_PHRASES);
const lexText = new Map(LEXICON.map((l) => [l.id, l.t]));

/**
 * Text to speak from content markup. Japanese uses the ruby *readings* the game teaches
 * ({私|わたし} → わたし) so the voice never picks a different reading than the text shows.
 */
function plain(src, lang) {
  let s = src.replace(/\{([^|}]+)\|([^}]+)\}/g, lang === 'ja' ? '$2' : '$1').replace(/\^/g, '');
  if (lang === 'ja') s = s.replace(/ /g, '');
  return s.trim();
}

// Items that can fill "$item" in each templated phrase.
const shopLex = [...new Set(ITEMS.filter((i) => i.shop).map((i) => i.lex))];
const favLex = [...new Set(NPCS.flatMap((n) => n.favorites))];
const ITEM_FILL = { want_item: shopLex, i_like_item: favLex };

const out = {};
for (const lang of LANGS) {
  const lines = [];
  for (const l of LEXICON) lines.push({ key: `w:${l.id}`, text: plain(l.t[lang], lang) });
  for (const p of PHRASES) {
    const src = p.t[lang];
    if (!src || src.includes('$name')) continue; // player's name varies: device voice handles these
    if (src.includes('$item')) {
      for (const lx of ITEM_FILL[p.id] ?? []) {
        lines.push({ key: `p:${p.id}|${lx}`, text: plain(src.split('$item').join(lexText.get(lx)[lang]), lang) });
      }
      continue;
    }
    lines.push({ key: `p:${p.id}`, text: plain(src, lang) });
  }
  out[lang] = lines;
}
process.stdout.write(JSON.stringify(out, null, 1));
