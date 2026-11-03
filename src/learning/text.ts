import type { JaScript, LangCode } from '../core/types';
import { langInfo } from '../content/languages';

/**
 * Text rendering for content strings.
 *
 * Japanese markup: chunks separated by spaces; {漢字|かな} gives a reading; a chunk starting
 * with ^ is a particle (romanized は→wa, へ→e, を→o). Display modes:
 *  - kana: readings only, chunks spaced (wakachigaki, like children's books and games)
 *  - furigana: kanji with ruby readings
 *  - kanji: kanji only (readings revealed on tap)
 */
export interface RenderOpts { jaScript: JaScript; romaji: boolean; name: string; item?: string; showRuby?: boolean }

const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]!));
export const sanitizeName = (n: string) => n.replace(/[{}|^$<>]/g, '').trim().slice(0, 12).replace(/ /g, ' ');

interface Seg { base: string; reading?: string }
interface Chunk { segs: Seg[]; particle: boolean }

function substitute(src: string, o: Pick<RenderOpts, 'name' | 'item'>) {
  let s = src.split('$name').join(sanitizeName(o.name || ''));
  if (o.item !== undefined) s = s.split('$item').join(o.item);
  return s;
}

function parseJa(s: string): Chunk[] {
  return s.split(' ').filter(Boolean).map((raw) => {
    const particle = raw.startsWith('^');
    const body = particle ? raw.slice(1) : raw;
    const segs: Seg[] = [];
    const re = /\{([^|}]+)\|([^}]+)\}|([^{]+)/g;
    let m: RegExpExecArray | null;
    while ((m = re.exec(body))) segs.push(m[3] !== undefined ? { base: m[3] } : { base: m[1], reading: m[2] });
    return { segs, particle };
  });
}

const chunkHTML = (c: Chunk, mode: JaScript, ruby: boolean) =>
  c.segs.map((g) => {
    if (!g.reading) return esc(g.base);
    if (mode === 'kana') return esc(g.reading);
    if (mode === 'furigana' || ruby) return `<ruby>${esc(g.base)}<rt>${esc(g.reading)}</rt></ruby>`;
    return esc(g.base);
  }).join('');

const chunkPlain = (c: Chunk, mode: JaScript | 'reading') =>
  c.segs.map((g) => (mode === 'kana' || mode === 'reading' ? g.reading ?? g.base : g.base)).join('');

/** HTML for a target-language string. */
export function renderTarget(src: string, lang: LangCode, o: RenderOpts): string {
  const s = substitute(src, o);
  if (!langInfo(lang).japaneseScripts) return esc(s);
  const chunks = parseJa(s);
  const sep = o.jaScript === 'kana' ? ' ' : '';
  let html = chunks.map((c) => `<span class="jc">${chunkHTML(c, o.jaScript, !!o.showRuby)}</span>`).join(sep);
  if (o.romaji) html += `<span class="romaji">${esc(romajiOf(s))}</span>`;
  return html;
}

/** HTML for text in the player's native language (no learning aids). */
export function renderNative(src: string, lang: LangCode, o: Pick<RenderOpts, 'name' | 'item'>): string {
  const s = substitute(src, o);
  if (!langInfo(lang).japaneseScripts) return esc(s);
  return parseJa(s).map((c) => chunkHTML(c, 'kanji', false)).join('');
}

/** Plain text for speech synthesis and comparisons. */
export function plainText(src: string, lang: LangCode, o: Pick<RenderOpts, 'name' | 'item'>, mode: JaScript | 'reading' = 'kanji'): string {
  const s = substitute(src, o);
  if (!langInfo(lang).japaneseScripts) return s;
  return parseJa(s).map((c) => chunkPlain(c, mode)).join(mode === 'kana' ? ' ' : '');
}

/** Latin-letter version of a line (romaji for Japanese), used to drive villager babble. */
export function romanized(src: string, lang: LangCode, o: Pick<RenderOpts, 'name' | 'item'>): string {
  const s = substitute(src, o);
  return langInfo(lang).japaneseScripts ? romajiOf(s) : s;
}

/** Word tiles for sentence building. Japanese tiles are chunks; others split on spaces. */
export function tilesOf(src: string, lang: LangCode, o: RenderOpts): { html: string; key: string }[] {
  const s = substitute(src, o);
  if (!langInfo(lang).japaneseScripts) return s.split(' ').filter(Boolean).map((w) => ({ html: esc(w), key: w }));
  return parseJa(s).map((c) => ({ html: chunkHTML(c, o.jaScript, false), key: chunkPlain(c, 'kanji') }));
}

// ---------------------------------------------------------------- romaji
const KANA: Record<string, string> = {
  あ: 'a', い: 'i', う: 'u', え: 'e', お: 'o', か: 'ka', き: 'ki', く: 'ku', け: 'ke', こ: 'ko',
  さ: 'sa', し: 'shi', す: 'su', せ: 'se', そ: 'so', た: 'ta', ち: 'chi', つ: 'tsu', て: 'te', と: 'to',
  な: 'na', に: 'ni', ぬ: 'nu', ね: 'ne', の: 'no', は: 'ha', ひ: 'hi', ふ: 'fu', へ: 'he', ほ: 'ho',
  ま: 'ma', み: 'mi', む: 'mu', め: 'me', も: 'mo', や: 'ya', ゆ: 'yu', よ: 'yo',
  ら: 'ra', り: 'ri', る: 'ru', れ: 're', ろ: 'ro', わ: 'wa', を: 'o', ん: 'n',
  が: 'ga', ぎ: 'gi', ぐ: 'gu', げ: 'ge', ご: 'go', ざ: 'za', じ: 'ji', ず: 'zu', ぜ: 'ze', ぞ: 'zo',
  だ: 'da', ぢ: 'ji', づ: 'zu', で: 'de', ど: 'do', ば: 'ba', び: 'bi', ぶ: 'bu', べ: 'be', ぼ: 'bo',
  ぱ: 'pa', ぴ: 'pi', ぷ: 'pu', ぺ: 'pe', ぽ: 'po', ゔ: 'vu',
  ぁ: 'a', ぃ: 'i', ぅ: 'u', ぇ: 'e', ぉ: 'o', ゃ: 'ya', ゅ: 'yu', ょ: 'yo',
};
const PUNCT: Record<string, string> = { '。': '.', '、': ',', '！': '!', '？': '?', '…': '...', '：': ':', '～': '~', '・': ' ', '「': '"', '」': '"', ' ': ' ' };
const toHira = (ch: string) => {
  const c = ch.charCodeAt(0);
  return c >= 0x30a1 && c <= 0x30f6 ? String.fromCharCode(c - 0x60) : ch;
};

function kanaToRomaji(src: string): string {
  const chars = [...src].map(toHira);
  let out = '';
  for (let i = 0; i < chars.length; i++) {
    const ch = chars[i], nx = chars[i + 1];
    if (ch === 'っ') {
      const r = KANA[nx] ?? '';
      out += r.startsWith('ch') ? 't' : r[0] ?? '';
      continue;
    }
    if (ch === 'ー') { const v = out.match(/[aiueo](?=[^aiueo]*$)/); out += v ? v[0] : ''; continue; }
    if (PUNCT[ch] !== undefined) { out += PUNCT[ch]; continue; }
    let r = KANA[ch];
    if (r === undefined) { out += ch; continue; }
    if (nx && 'ゃゅょ'.includes(nx) && r.endsWith('i') && r.length > 1) {
      const stem = r.slice(0, -1);
      const v = KANA[nx].slice(1);
      r = ['sh', 'ch', 'j'].includes(stem) ? stem + v : stem + 'y' + v;
      i++;
    } else if (nx && 'ぁぃぅぇぉ'.includes(nx) && r.length > 1) {
      const stem = r === 'fu' ? 'f' : r === 'shi' ? 'sh' : r === 'chi' ? 'ch' : r === 'ji' ? 'j' : r === 'u' ? 'w' : r.slice(0, -1);
      r = stem + KANA[nx];
      i++;
    } else if (ch === 'ん' && nx && (/[aiueoy]/.test(KANA[nx]?.[0] ?? ''))) {
      r = "n'";
    }
    out += r;
  }
  return out;
}

export function romajiOf(src: string): string {
  return parseJa(src).map((c) => {
    const reading = chunkPlain(c, 'reading');
    if (c.particle) {
      const special: Record<string, string> = { は: 'wa', へ: 'e', を: 'o' };
      const head = [...reading][0];
      if (special[head]) return special[head] + kanaToRomaji(reading.slice(head.length));
    }
    return kanaToRomaji(reading);
  }).join(' ').replace(/ ([.,!?])/g, '$1')
    // Set greetings keep their historical particle は (read "wa").
    .replace(/konnichiha/g, 'konnichiwa').replace(/konbanha/g, 'konbanwa');
}
