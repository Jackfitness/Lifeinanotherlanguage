import { audio } from './audio';

/**
 * Pre-rendered pronunciation (see tools/voice/render_tts.py). Loads one sprite for the target
 * language at the chosen speed; anything missing (or offline) falls back to the device voice.
 */
class VoicePack {
  private key = '';
  private buf: AudioBuffer | null = null;
  private map: Record<string, [number, number]> = {};
  private current: AudioBufferSourceNode | null = null;

  /** Load `voice/<lang>-<speed>.mp3/json` if not already loaded. Safe to call often. */
  ensure(lang: string, speed: 'normal' | 'slow') {
    const key = `${lang}-${speed}`;
    if (key === this.key) return;
    this.key = key;
    this.buf = null;
    this.map = {};
    void (async () => {
      try {
        const ctx = audio.ctx;
        if (!ctx) return;
        const [j, a] = await Promise.all([fetch(`voice/${key}.json`), fetch(`voice/${key}.mp3`)]);
        if (!j.ok || !a.ok) return;
        const map = await j.json();
        const buf = await ctx.decodeAudioData(await a.arrayBuffer());
        if (this.key === key) { this.map = map; this.buf = buf; }
      } catch { /* no pack available: device voice is used */ }
    })();
  }

  ready() { return !!this.buf; }
  has(clip: string) { return !!this.buf && clip in this.map; }

  /** Play a clip; returns false if it isn't available so the caller can fall back. */
  play(clip: string, onEnd?: () => void): boolean {
    const ctx = audio.ctx;
    if (!ctx || !this.buf || !(clip in this.map)) return false;
    this.stop();
    const [start, dur] = this.map[clip];
    const src = ctx.createBufferSource();
    src.buffer = this.buf;
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
