import { audio } from './audio';

type Pack = { buf: AudioBuffer; map: Record<string, [number, number]> };

/**
 * Pre-rendered pronunciation (see tools/voice/render_tts.py). The base pack (starter village and
 * Clover Meadow) is always loaded; each Village Pass town has its own pack, loaded while you are
 * there and released when you leave so phones don't hold every town in memory. Anything missing
 * (or offline) falls back to the device voice.
 */
class VoicePack {
  private lang = '';
  private speed: 'normal' | 'slow' = 'normal';
  private town = '';
  private packs = new Map<string, Pack>();
  private loading = new Set<string>();
  private current: AudioBufferSourceNode | null = null;

  /** Make sure the base pack (and the town pack, if any) for this language and speed are loaded. */
  ensure(lang: string, speed: 'normal' | 'slow', town = this.town) {
    if (lang !== this.lang || speed !== this.speed) { this.packs.clear(); this.loading.clear(); }
    this.lang = lang; this.speed = speed; this.town = town;
    const want = [`${lang}-${speed}`, ...(town && town !== 'clover' && town !== 'home' ? [`${lang}-${town}-${speed}`] : [])];
    for (const k of [...this.packs.keys()]) if (!want.includes(k)) this.packs.delete(k);
    for (const key of want) if (!this.packs.has(key) && !this.loading.has(key)) void this.load(key);
  }

  /** Switch the town pack (call when travelling). */
  setTown(town: string) { if (this.lang) this.ensure(this.lang, this.speed, town); else this.town = town; }

  private async load(key: string) {
    this.loading.add(key);
    try {
      const ctx = audio.ctx;
      if (!ctx) return;
      const [j, a] = await Promise.all([fetch(`voice/${key}.json`), fetch(`voice/${key}.mp3`)]);
      if (!j.ok || !a.ok) return;
      const map = await j.json();
      const buf = await ctx.decodeAudioData(await a.arrayBuffer());
      if (this.loading.has(key)) this.packs.set(key, { buf, map });
    } catch { /* no pack available: device voice is used */ } finally { this.loading.delete(key); }
  }

  private find(clip: string) {
    for (const p of this.packs.values()) if (clip in p.map) return p;
    return null;
  }

  ready() { return this.packs.size > 0; }
  has(clip: string) { return !!this.find(clip); }

  /** Play a clip; returns false if it isn't available so the caller can fall back. */
  play(clip: string, onEnd?: () => void): boolean {
    const ctx = audio.ctx;
    const p = this.find(clip);
    if (!ctx || !p) return false;
    this.stop();
    const [start, dur] = p.map[clip];
    const src = ctx.createBufferSource();
    src.buffer = p.buf;
    src.connect(audio.speechOut());
    // A little slack on both sides absorbs MP3 encoder delay differences between browsers.
    src.start(ctx.currentTime, Math.max(0, start - 0.03), dur + 0.1);
    src.onended = () => { if (this.current === src) this.current = null; onEnd?.(); };
    this.current = src;
    return true;
  }

  stop() {
    try { this.current?.stop(); } catch { /* already stopped */ }
    this.current = null;
  }
}

export const voicePack = new VoicePack();
