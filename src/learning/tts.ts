import { langInfo } from '../content/languages';
import type { LangCode } from '../core/types';

/** Pronunciation via the browser's speech synthesis, choosing the best voice per language. */
class Speech {
  private voices: SpeechSynthesisVoice[] = [];
  private warned = new Set<string>();
  rate = 0.9;
  onMissing?: (lang: LangCode) => void;

  constructor() {
    if (!('speechSynthesis' in window)) return;
    const load = () => (this.voices = speechSynthesis.getVoices());
    load();
    speechSynthesis.addEventListener?.('voiceschanged', load);
  }

  available() { return 'speechSynthesis' in window; }

  private pickVoice(lang: LangCode) {
    const prefs = langInfo(lang).tts;
    for (const p of prefs) {
      const pl = p.toLowerCase();
      const exact = this.voices.filter((v) => v.lang.toLowerCase().replace('_', '-') === pl);
      const best = exact.find((v) => /natural|premium|enhanced|google/i.test(v.name)) ?? exact[0];
      if (best) return best;
    }
    const base = prefs[prefs.length - 1].toLowerCase();
    return this.voices.find((v) => v.lang.toLowerCase().startsWith(base));
  }

  speak(text: string, lang: LangCode, opts: { rate?: number; pitch?: number; onEnd?: () => void } = {}) {
    if (!this.available() || !text) { opts.onEnd?.(); return; }
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    const v = this.pickVoice(lang);
    if (v) u.voice = v;
    else if (this.voices.length && !this.warned.has(lang)) { this.warned.add(lang); this.onMissing?.(lang); }
    u.lang = v?.lang ?? langInfo(lang).tts[0];
    u.rate = opts.rate ?? this.rate;
    u.pitch = opts.pitch ?? 1;
    if (opts.onEnd) u.onend = () => opts.onEnd!();
    speechSynthesis.speak(u);
  }

  /** iOS only allows speech after a user gesture: call this from the first tap. */
  prime() {
    if (!this.available()) return;
    const u = new SpeechSynthesisUtterance(' ');
    u.volume = 0;
    speechSynthesis.speak(u);
  }

  stop() { if (this.available()) speechSynthesis.cancel(); }
}

export const speech = new Speech();
