/**
 * Sample banks: one decoded AudioBuffer per bank, played by sprite name.
 * Banks are embedded as base64 WAV (no network fetch), so they work offline and in sandboxed embeds.
 */
export class SampleBank {
  private buffer: AudioBuffer | null = null;
  constructor(private sprite: Record<string, [number, number]>, private wav: string) {}

  async load(ctx: AudioContext) {
    if (this.buffer) return;
    const bin = atob(this.wav);
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    this.buffer = await ctx.decodeAudioData(bytes.buffer);
  }

  has(name: string) { return !!this.buffer && name in this.sprite; }

  /** Play a sprite. rate shifts pitch and speed together (villager voices use this). */
  play(ctx: AudioContext, out: AudioNode, name: string, opts: { rate?: number; gain?: number; when?: number; jitter?: number; pan?: number } = {}) {
    if (!this.buffer || !(name in this.sprite)) return 0;
    const [start, dur] = this.sprite[name];
    const src = ctx.createBufferSource();
    src.buffer = this.buffer;
    const jitter = opts.jitter ?? 0;
    const rate = (opts.rate ?? 1) * (1 + (Math.random() * 2 - 1) * jitter);
    src.playbackRate.value = rate;
    const g = ctx.createGain();
    g.gain.value = opts.gain ?? 1;
    let node: AudioNode = src.connect(g);
    if (opts.pan && ctx.createStereoPanner) {
      const p = ctx.createStereoPanner();
      p.pan.value = Math.max(-1, Math.min(1, opts.pan));
      node = node.connect(p);
    }
    node.connect(out);
    const when = opts.when ?? ctx.currentTime;
    src.start(when, start, dur);
    return dur / rate;
  }
}

// ------------------------------------------------------------ babble syllables
const ONSET: Record<string, string> = {};
for (const c of 'kgtdpbcj') ONSET[c] = 'p';
for (const c of 'szhfvx') ONSET[c] = 'f';
for (const c of 'nmñ') ONSET[c] = 'm';
for (const c of 'rlwyq') ONSET[c] = 'l';
const VOWEL_MAP: Record<string, string> = { a: 'a', á: 'a', e: 'e', é: 'e', i: 'i', í: 'i', y: 'i', o: 'o', ó: 'o', u: 'u', ú: 'u', ü: 'u' };

/**
 * Turn romanized/Latin text into voice-bank syllable names ("pa", "fi", "_o", "_n" …).
 * Each syllable keeps the onset class of its first consonant and its vowel, so the babble
 * follows the rhythm and vowels of the real line.
 */
export function toSyllables(text: string): string[] {
  const out: string[] = [];
  const s = text.toLowerCase().normalize('NFC');
  let onset = '';
  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    const v = VOWEL_MAP[ch];
    if (v && !(ch === 'y' && VOWEL_MAP[s[i + 1]])) {
      out.push((onset || '_') + v);
      onset = '';
      while (VOWEL_MAP[s[i + 1]] && s[i + 1] !== 'y') i++; // diphthongs count once
    } else if (ONSET[ch]) {
      if (!onset) onset = ONSET[ch];
    } else if (/[\s.,!?¡¿…~、。！？]/.test(ch)) {
      if (onset === 'm') out.push('_n');
      onset = '';
      if (/[.,!?…。！？、]/.test(ch)) out.push('');
    }
  }
  if (onset === 'm') out.push('_n');
  return out;
}
