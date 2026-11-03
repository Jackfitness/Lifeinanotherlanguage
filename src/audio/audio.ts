/**
 * All game audio is synthesized with Web Audio: soft UI sounds, villager voice blips,
 * a generative music-box score that changes with the time of day, and ambience
 * (birds by day, crickets at night, rain).
 */
type Mood = 'day' | 'evening' | 'night';

class AudioSys {
  ctx?: AudioContext;
  private master!: GainNode;
  private musicBus!: GainNode;
  private sfxBus!: GainNode;
  private ambBus!: GainNode;
  private reverb!: ConvolverNode;
  private rainGain?: GainNode;
  private noiseBuf?: AudioBuffer;
  private nextNote = 0;
  private step = 0;
  private mood: Mood = 'day';
  private raining = false;
  musicVol = 0.5;
  sfxVol = 0.7;
  muted = false;

  /** Must be called from a user gesture. */
  unlock() {
    if (this.ctx) { void this.ctx.resume(); return; }
    const AC = window.AudioContext || (window as any).webkitAudioContext;
    if (!AC) return;
    const ctx = (this.ctx = new AC());
    this.master = ctx.createGain(); this.master.gain.value = 0.9; this.master.connect(ctx.destination);
    this.reverb = ctx.createConvolver(); this.reverb.buffer = this.impulse(2.2);
    const wet = ctx.createGain(); wet.gain.value = 0.35; this.reverb.connect(wet).connect(this.master);
    this.musicBus = ctx.createGain(); this.musicBus.connect(this.master); this.musicBus.connect(this.reverb);
    this.sfxBus = ctx.createGain(); this.sfxBus.connect(this.master);
    this.ambBus = ctx.createGain(); this.ambBus.connect(this.master); this.ambBus.connect(this.reverb);
    this.noiseBuf = this.makeNoise();
    this.applyVolumes();
    this.nextNote = ctx.currentTime + 0.3;
    window.setInterval(() => this.schedule(), 100);
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) void ctx.suspend(); else void ctx.resume();
    });
  }

  applyVolumes() {
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    this.musicBus.gain.setTargetAtTime(this.muted ? 0 : this.musicVol * 0.55, t, 0.3);
    this.sfxBus.gain.setTargetAtTime(this.muted ? 0 : this.sfxVol, t, 0.05);
    this.ambBus.gain.setTargetAtTime(this.muted ? 0 : this.sfxVol * 0.6, t, 0.3);
  }

  setMood(m: Mood) { this.mood = m; }
  setRain(on: boolean) {
    if (!this.ctx || on === this.raining) return;
    this.raining = on;
    if (on) {
      const src = this.ctx.createBufferSource(); src.buffer = this.noiseBuf!; src.loop = true;
      const lp = this.ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 1400;
      const hp = this.ctx.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 300;
      this.rainGain = this.ctx.createGain(); this.rainGain.gain.value = 0;
      src.connect(lp).connect(hp).connect(this.rainGain).connect(this.ambBus);
      src.start();
      this.rainGain.gain.setTargetAtTime(0.22, this.ctx.currentTime, 1.5);
    } else if (this.rainGain) {
      this.rainGain.gain.setTargetAtTime(0, this.ctx.currentTime, 1);
    }
  }

  private impulse(sec: number) {
    const ctx = this.ctx!, len = Math.floor(ctx.sampleRate * sec);
    const b = ctx.createBuffer(2, len, ctx.sampleRate);
    for (let ch = 0; ch < 2; ch++) {
      const d = b.getChannelData(ch);
      for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3);
    }
    return b;
  }
  private makeNoise() {
    const ctx = this.ctx!, b = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
    const d = b.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    return b;
  }

  private tone(freq: number, start: number, dur: number, opts: { type?: OscillatorType; gain?: number; bus?: AudioNode; attack?: number; slideTo?: number; detune?: number } = {}) {
    const ctx = this.ctx!;
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = opts.type ?? 'sine';
    o.frequency.setValueAtTime(freq, start);
    if (opts.detune) o.detune.value = opts.detune;
    if (opts.slideTo) o.frequency.exponentialRampToValueAtTime(opts.slideTo, start + dur);
    const peak = opts.gain ?? 0.2, a = opts.attack ?? 0.008;
    g.gain.setValueAtTime(0.0001, start);
    g.gain.exponentialRampToValueAtTime(peak, start + a);
    g.gain.exponentialRampToValueAtTime(0.0001, start + dur);
    o.connect(g).connect(opts.bus ?? this.sfxBus);
    o.start(start); o.stop(start + dur + 0.05);
  }

  /** Music box pluck: sine + soft octave partial. */
  private pluck(freq: number, t: number, gain = 0.09) {
    this.tone(freq, t, 1.6, { gain, bus: this.musicBus, attack: 0.004 });
    this.tone(freq * 2, t, 0.6, { gain: gain * 0.25, bus: this.musicBus, attack: 0.004 });
    this.tone(freq * 3.01, t, 0.25, { gain: gain * 0.08, bus: this.musicBus, attack: 0.002 });
  }
  private pad(freqs: number[], t: number, dur: number) {
    for (const f of freqs) this.tone(f, t, dur, { type: 'triangle', gain: 0.018, bus: this.musicBus, attack: dur * 0.35 });
  }

  // ------------------------------------------------------------- generative score
  private schedule() {
    const ctx = this.ctx;
    if (!ctx || ctx.state !== 'running') return;
    const night = this.mood === 'night';
    const bpm = night ? 64 : this.mood === 'evening' ? 72 : 84;
    const eighth = 60 / bpm / 2;
    // I–vi–IV–V in F major by day, gentler vi–IV–I–V at night.
    const F = 349.23;
    const chords = night ? [[-3, 0, 4], [-7, -3, 0], [0, 4, 7], [2, 5, 9]] : [[0, 4, 7], [-3, 0, 4], [-7, -3, 0], [2, 5, 9]];
    const scale = [0, 2, 4, 7, 9, 12, 14, 16];
    const st = (s: number) => F * Math.pow(2, s / 12);
    while (this.nextNote < ctx.currentTime + 0.25) {
      const t = this.nextNote;
      const bar = Math.floor(this.step / 8) % 4;
      const beat = this.step % 8;
      const chord = chords[bar];
      if (beat === 0) {
        this.pad(chord.map((s) => st(s - 12)), t, eighth * 8);
        this.tone(st(chord[0] - 24), t, eighth * 6, { type: 'sine', gain: 0.07, bus: this.musicBus, attack: 0.02 });
      }
      const density = night ? 0.28 : 0.5;
      if (beat % 2 === 0 ? Math.random() < density + 0.2 : Math.random() < density * 0.5) {
        const pool = Math.random() < 0.55 ? chord.map((c) => c + 12) : scale.map((s) => s + 12);
        this.pluck(st(pool[Math.floor(Math.random() * pool.length)]), t);
      }
      if (beat === 4 && Math.random() < 0.6) this.pluck(st(chord[1] + 12), t, 0.04);
      // Ambience
      if (!this.raining && Math.random() < (night ? 0.05 : 0.025)) night ? this.cricket(t) : this.bird(t);
      this.nextNote += eighth;
      this.step++;
    }
  }

  private bird(t: number) {
    const base = 2200 + Math.random() * 1600;
    const n = 2 + Math.floor(Math.random() * 3);
    for (let i = 0; i < n; i++) this.tone(base, t + i * 0.11, 0.09, { gain: 0.025, slideTo: base * (1.2 + Math.random() * 0.4), bus: this.ambBus });
  }
  private cricket(t: number) {
    for (let i = 0; i < 6; i++) this.tone(4300, t + i * 0.045, 0.03, { gain: 0.012, bus: this.ambBus, type: 'triangle' });
  }

  // ------------------------------------------------------------- UI sounds
  private now() { return this.ctx ? this.ctx.currentTime : 0; }
  tap() { if (!this.ctx) return; this.tone(660, this.now(), 0.08, { gain: 0.12, slideTo: 880 }); }
  soft() { if (!this.ctx) return; this.tone(520, this.now(), 0.1, { gain: 0.08, type: 'triangle' }); }
  open() { if (!this.ctx) return; const t = this.now(); this.tone(440, t, 0.12, { gain: 0.08 }); this.tone(660, t + 0.06, 0.14, { gain: 0.08 }); }
  close() { if (!this.ctx) return; const t = this.now(); this.tone(660, t, 0.1, { gain: 0.07 }); this.tone(440, t + 0.05, 0.12, { gain: 0.07 }); }
  correct() {
    if (!this.ctx) return; const t = this.now();
    [784, 988, 1175].forEach((f, i) => this.tone(f, t + i * 0.07, 0.35, { gain: 0.12 }));
  }
  gentleWrong() { if (!this.ctx) return; const t = this.now(); this.tone(392, t, 0.18, { gain: 0.09, type: 'triangle' }); this.tone(349, t + 0.12, 0.25, { gain: 0.08, type: 'triangle' }); }
  coin() { if (!this.ctx) return; const t = this.now(); this.tone(1319, t, 0.1, { gain: 0.1, type: 'square' }); this.tone(1760, t + 0.07, 0.25, { gain: 0.08, type: 'square' }); }
  sparkle() { if (!this.ctx) return; const t = this.now(); [1568, 2093, 2637, 3136].forEach((f, i) => this.tone(f, t + i * 0.05, 0.3, { gain: 0.05 })); }
  fanfare() {
    if (!this.ctx) return; const t = this.now();
    [523, 659, 784, 1047, 784, 1047].forEach((f, i) => this.tone(f, t + i * 0.1, 0.4, { gain: 0.11, type: 'triangle' }));
  }
  splash() {
    if (!this.ctx) return;
    const ctx = this.ctx, src = ctx.createBufferSource(); src.buffer = this.noiseBuf!;
    const bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 900; bp.Q.value = 0.7;
    const g = ctx.createGain(); const t = ctx.currentTime;
    g.gain.setValueAtTime(0.25, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.5);
    src.connect(bp).connect(g).connect(this.sfxBus); src.start(t); src.stop(t + 0.6);
  }
  plop() { if (!this.ctx) return; this.tone(300, this.now(), 0.15, { gain: 0.15, slideTo: 120 }); }
  step2() {
    if (!this.ctx) return;
    const ctx = this.ctx, src = ctx.createBufferSource(); src.buffer = this.noiseBuf!;
    const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 500;
    const g = ctx.createGain(); const t = ctx.currentTime;
    g.gain.setValueAtTime(0.035, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.07);
    src.connect(lp).connect(g).connect(this.sfxBus); src.start(t, Math.random()); src.stop(t + 0.08);
  }
  /** Animal Crossing–style syllable blip in the villager's voice. */
  blip(pitch: number) {
    if (!this.ctx) return;
    const f = pitch * (0.85 + Math.random() * 0.4);
    this.tone(f, this.now(), 0.065, { type: 'triangle', gain: 0.07, slideTo: f * (0.9 + Math.random() * 0.25) });
  }
}

export const audio = new AudioSys();
