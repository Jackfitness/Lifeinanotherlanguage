"""
Renders the game's sound effects and villager voice bank.

Every sound is designed here with layered synthesis (music-box bells, filtered noise,
formant-synthesized vowels) and packed into two banks:
  src/audio/assets/sfx.ts    — UI, movement, fishing, home and reward sounds
  src/audio/assets/voice.ts  — syllables for villager "babble" + emotes (giggle, gasp, hmm…)

Each bank is a base64 16-bit mono WAV plus a sprite map {name: [start, duration]}.
Swap in recorded or commissioned sounds later by keeping the same names.

Run:  python3 tools/sound/render.py
"""
import base64
import io
import json
import os
import wave

import numpy as np

SR = 22050
rng = np.random.default_rng(7)
OUT = os.path.join(os.path.dirname(__file__), '..', '..', 'src', 'audio', 'assets')


# ---------------------------------------------------------------- primitives
def T(d):
    return np.arange(int(d * SR)) / SR


def silence(d):
    return np.zeros(int(d * SR))


def env(n, a=0.005, d=0.2, curve=4.0):
    """Fast attack, exponential decay envelope of n samples."""
    t = np.arange(n) / SR
    att = np.clip(t / max(a, 1e-4), 0, 1)
    dec = np.exp(-np.maximum(t - a, 0) / max(d, 1e-4) * (curve / 4))
    return att * dec


def ahr(n, a=0.01, r=0.05):
    """Attack-hold-release envelope."""
    t = np.arange(n) / SR
    dur = n / SR
    e = np.ones(n)
    e *= np.clip(t / max(a, 1e-4), 0, 1)
    e *= np.clip((dur - t) / max(r, 1e-4), 0, 1)
    return e


def osc(freq, d, shape='sine'):
    n = int(d * SR)
    f = np.full(n, freq) if np.isscalar(freq) else np.asarray(freq)[:n]
    ph = 2 * np.pi * np.cumsum(f) / SR
    if shape == 'sine':
        return np.sin(ph)
    if shape == 'tri':
        return 2 / np.pi * np.arcsin(np.sin(ph))
    if shape == 'saw':
        return 2 * ((ph / (2 * np.pi)) % 1) - 1
    if shape == 'square':
        return np.sign(np.sin(ph))
    raise ValueError(shape)


def sweep(f0, f1, d, kind='exp'):
    n = int(d * SR)
    if kind == 'exp':
        return f0 * (f1 / f0) ** (np.arange(n) / max(n - 1, 1))
    return np.linspace(f0, f1, n)


def noise(d):
    return rng.uniform(-1, 1, int(d * SR))


def _spectral(x, gain_fn):
    """Zero-phase filtering in the frequency domain (padded to avoid wrap-around)."""
    pad = int(0.25 * SR)
    n = len(x) + pad
    X = np.fft.rfft(x, n)
    f = np.fft.rfftfreq(n, 1 / SR)
    return np.fft.irfft(X * gain_fn(f), n)[: len(x)]


def lp(x, fc, order=2):
    return _spectral(x, lambda f: 1 / np.sqrt(1 + (f / fc) ** (2 * order)))


def hp(x, fc, order=2):
    return _spectral(x, lambda f: 1 / np.sqrt(1 + (fc / np.maximum(f, 1e-3)) ** (2 * order)))


def bp(x, lo, hi, order=2):
    return _spectral(x, lambda f: 1 / np.sqrt(1 + (f / hi) ** (2 * order)) / np.sqrt(1 + (lo / np.maximum(f, 1e-3)) ** (2 * order)))


def resonator(x, fc, bw):
    """Formant peak (Lorentzian magnitude)."""
    return _spectral(x, lambda f: 1 / (1 + ((f - fc) / (bw / 2)) ** 2))


def fftconvolve(a, b):
    n = len(a) + len(b) - 1
    return np.fft.irfft(np.fft.rfft(a, n) * np.fft.rfft(b, n), n)


def mix(*parts):
    n = max(len(p) for p, _ in parts)
    out = np.zeros(n)
    for p, at in parts:
        s = int(at * SR)
        if s >= n:
            continue
        seg = p[: n - s]
        out[s: s + len(seg)] += seg
    return out


def place(n, parts):
    out = np.zeros(n)
    for p, at in parts:
        s = int(at * SR)
        seg = p[: max(0, n - s)]
        out[s: s + len(seg)] += seg
    return out


def reverb(x, amt=0.18, length=0.6):
    ir_n = int(length * SR)
    ir = rng.uniform(-1, 1, ir_n) * np.exp(-np.arange(ir_n) / SR / (length / 5))
    ir = lp(ir, 5000)
    wet = fftconvolve(x, ir)
    wet = np.concatenate([wet, np.zeros(max(0, len(x) + ir_n - len(wet)))])[: len(x) + ir_n]
    wet /= np.max(np.abs(wet)) + 1e-9
    dry = np.concatenate([x, np.zeros(ir_n)])
    return dry + wet * amt * np.max(np.abs(x))


def norm(x, peak=0.85):
    m = np.max(np.abs(x))
    return x if m < 1e-9 else x / m * peak


def fade_tail(x, d=0.01):
    n = min(len(x), int(d * SR))
    x = x.copy()
    x[-n:] *= np.linspace(1, 0, n)
    return x


NOTE = {n: 440 * 2 ** ((i - 9) / 12) for i, n in enumerate(['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'])}


def hz(name):
    """'C6' → frequency."""
    pitch, octave = name[:-1], int(name[-1])
    return NOTE[pitch] * 2 ** (octave - 4)


# ---------------------------------------------------------------- instruments
def musicbox(f, d=0.9, gain=1.0):
    """Music-box tine: bright inharmonic partials decaying at different rates."""
    n = int(d * SR)
    parts = [(1, 1.0, 0.45), (2.0, 0.35, 0.18), (3.9, 0.22, 0.07), (5.6, 0.12, 0.04), (8.2, 0.06, 0.02)]
    out = np.zeros(n)
    for ratio, g, dec in parts:
        if f * ratio < SR / 2.2:
            out += g * osc(f * ratio, d) * env(n, 0.002, dec)
    click = hp(noise(0.004), 4000) * 0.15
    out[: len(click)] += click
    return out * gain


def bell(f, d=1.2, gain=1.0):
    n = int(d * SR)
    out = np.zeros(n)
    for ratio, g, dec in [(1, 1, 0.6), (2.76, 0.45, 0.25), (5.4, 0.25, 0.12), (8.93, 0.1, 0.06)]:
        if f * ratio < SR / 2.2:
            out += g * osc(f * ratio, d) * env(n, 0.003, dec)
    return out * gain


def pluck(f, d=0.5, gain=1.0, bright=0.5):
    n = int(d * SR)
    out = np.zeros(n)
    for k in range(1, 6):
        if f * k < SR / 2.2:
            out += (bright ** (k - 1)) / k * osc(f * k, d) * env(n, 0.003, 0.25 / k)
    return out * gain


def bubble(f0, f1, d, gain=1.0):
    n = int(d * SR)
    return osc(sweep(f0, f1, d), d) * env(n, 0.004, d * 0.35) * gain


def thump(f, d, gain=1.0):
    n = int(d * SR)
    return osc(sweep(f * 1.6, f, d), d) * env(n, 0.002, d * 0.3) * gain


def rustle(lo, hi, d, gain=1.0, a=0.01):
    n = int(d * SR)
    return bp(noise(d), lo, hi) * ahr(n, a, d * 0.7) * gain


# ---------------------------------------------------------------- sound effects
def s_tap():
    return mix((bubble(520, 1250, 0.07), 0), (hp(noise(0.006), 3000) * 0.08, 0))


def s_soft():
    return bubble(760, 520, 0.11, 0.8)


def s_open():
    return reverb(mix((pluck(hz('E5'), 0.4, 0.8), 0), (pluck(hz('A5'), 0.5, 0.8), 0.06), (rustle(1500, 6000, 0.12, 0.12), 0)), 0.15, 0.4)


def s_close():
    return reverb(mix((pluck(hz('A5'), 0.35, 0.7), 0), (pluck(hz('E5'), 0.45, 0.7), 0.06)), 0.12, 0.4)


def s_page():
    d = 0.22
    n = int(d * SR)
    sw = bp(noise(d), 900, 5000) * np.sin(np.linspace(0, np.pi, n)) ** 1.5
    return mix((sw * 0.5, 0), (thump(160, 0.06, 0.2), 0.16))


def s_correct():
    notes = ['G5', 'B5', 'D6', 'G6']
    parts = [(musicbox(hz(nm), 0.9, 0.8 if i < 3 else 0.5), i * 0.065) for i, nm in enumerate(notes)]
    parts.append((bell(hz('D7'), 0.6, 0.15), 0.26))
    return reverb(mix(*parts), 0.25, 0.8)


def s_wrong():
    # A soft, puzzled "hmm-hm": two warm wobbly notes, nothing buzzy.
    def note(f, d):
        n = int(d * SR)
        vib = f * (1 + 0.012 * np.sin(2 * np.pi * 7 * np.arange(n) / SR))
        x = osc(vib, d, 'tri') * 0.6 + osc(vib * 2, d) * 0.15
        return lp(x, 1600) * ahr(n, 0.02, d * 0.6)
    return reverb(mix((note(hz('A4'), 0.16), 0), (note(hz('F4'), 0.26), 0.15)) * 0.8, 0.12, 0.4)


def s_discovery():
    notes = ['E6', 'G6', 'A6', 'C7', 'E7']
    parts = [(bell(hz(nm), 0.9, 0.5), i * 0.055) for i, nm in enumerate(notes)]
    shimmer = hp(noise(0.5), 6000) * env(int(0.5 * SR), 0.05, 0.15) * 0.05
    parts.append((shimmer, 0.05))
    return reverb(mix(*parts), 0.3, 1.0)


def s_coin():
    def blip(f, d):
        n = int(d * SR)
        x = osc(f, d, 'square') * 0.35 + osc(f, d) * 0.5
        return lp(x, 6000) * env(n, 0.002, d * 0.4)
    return reverb(mix((blip(hz('B5'), 0.07), 0), (blip(hz('E6'), 0.32), 0.065)), 0.12, 0.4)


def s_sparkle():
    fs = [hz(n) for n in ['C7', 'E7', 'G7', 'D7', 'A7', 'C8']]
    parts = [(bell(f, 0.45, 0.35 + 0.1 * (i % 2)), i * 0.045) for i, f in enumerate(fs)]
    return reverb(mix(*parts), 0.3, 0.8)


def s_heart():
    chord = [(bell(hz('C6'), 1.3, 0.5), 0), (bell(hz('E6'), 1.3, 0.4), 0.04), (bell(hz('G6'), 1.3, 0.35), 0.08)]
    n = int(1.2 * SR)
    pad = osc(hz('C5'), 1.2) * ahr(n, 0.15, 0.8) * 0.25
    return reverb(mix(*chord, (pad, 0), (bell(hz('C7'), 0.8, 0.2), 0.18)), 0.3, 1.0)


def s_levelup():
    mel = [('C6', 0), ('E6', 0.1), ('G6', 0.2), ('C7', 0.3), ('G6', 0.45), ('C7', 0.55)]
    parts = [(musicbox(hz(n), 1.0, 0.8), at) for n, at in mel]
    parts += [(pluck(hz('C4'), 1.0, 0.5), 0), (pluck(hz('G4'), 1.0, 0.4), 0.3), (bell(hz('E7'), 1.0, 0.2), 0.55)]
    return reverb(mix(*parts), 0.3, 1.2)


def s_quest():
    mel = [('C5', 0), ('E5', 0.12), ('G5', 0.24), ('C6', 0.36)]
    parts = [(pluck(hz(n), 0.6, 0.7), at) for n, at in mel]
    parts += [(bell(hz(n), 1.4, 0.45), 0.5) for n in ['C6', 'E6', 'G6']]
    parts += [(bell(hz('C7'), 1.0, 0.25), 0.6), (pluck(hz('C3'), 1.2, 0.5), 0.5)]
    return reverb(mix(*parts), 0.3, 1.2)


def s_achievement():
    parts = [(bell(hz(n), 1.2, 0.5), i * 0.09) for i, n in enumerate(['G5', 'C6', 'E6', 'G6'])]
    shimmer = hp(noise(0.6), 7000) * env(int(0.6 * SR), 0.1, 0.2) * 0.05
    return reverb(mix(*parts, (shimmer, 0.2)), 0.3, 1.0)


def s_step_grass(i):
    d = 0.11
    n = int(d * SR)
    th = thump(95 + i * 12, 0.06, 0.55)
    ru = bp(noise(d), 700 + i * 150, 3200) * ahr(n, 0.004, 0.08) * 0.22
    return lp(mix((th, 0), (ru, 0.004)), 4000)


def s_step_wood(i):
    d = 0.1
    n = int(d * SR)
    f = 290 + i * 25
    body = (osc(f, d) + 0.5 * osc(f * 2.3, d)) * env(n, 0.001, 0.025)
    knock = bp(noise(0.012), 1000, 4000) * 0.3
    return mix((body * 0.6, 0), (knock, 0))


def s_step_stone(i):
    d = 0.08
    tap = bp(noise(0.02), 2200 + i * 300, 6000) * env(int(0.02 * SR), 0.001, 0.006) * 0.5
    low = thump(150 + i * 15, 0.045, 0.35)
    return mix((tap, 0), (low, 0), (silence(d), 0))


def s_step_snow(i):
    d = 0.13
    n = int(d * SR)
    crunch = bp(noise(d), 1800, 7000) * ahr(n, 0.01, 0.07) * (0.6 + 0.4 * rng.uniform(0, 1, n)) * 0.3
    return mix((crunch, 0), (thump(90, 0.06, 0.3), 0))


def s_hop():
    d = 0.24
    n = int(d * SR)
    f = sweep(260, 620, d) * (1 + 0.06 * np.sin(2 * np.pi * 22 * np.arange(n) / SR) * np.exp(-np.arange(n) / SR / 0.1))
    return osc(f, d) * env(n, 0.005, 0.07) * 0.7


def s_land():
    d = 0.18
    n = int(d * SR)
    squish = lp(noise(d), 1100) * np.sin(np.linspace(0, np.pi, n)) ** 2 * 0.5
    return mix((thump(85, 0.08, 0.7), 0), (squish, 0.01))


def s_squeak():
    d = 0.17
    n = int(d * SR)
    contour = np.interp(np.arange(n), [0, n * 0.4, n], [1350, 1850, 1500])
    vib = contour * (1 + 0.03 * np.sin(2 * np.pi * 30 * np.arange(n) / SR))
    x = osc(vib, d) + 0.3 * osc(vib * 2, d) + 0.1 * osc(vib * 3, d)
    return x * ahr(n, 0.015, 0.06) * 0.45


def s_cast():
    d = 0.32
    n = int(d * SR)
    x = noise(d)
    out = np.zeros(n)
    for k in range(8):  # sweep a bandpass upward for a "whoosh"
        a, b = k * n // 8, (k + 1) * n // 8
        lo = 300 * (2 ** (k / 3))
        out[a:b] = bp(x, lo, lo * 3)[a:b]
    return out * np.sin(np.linspace(0, np.pi, n)) ** 2 * 0.5


def s_plop():
    return mix((bubble(180, 900, 0.09, 0.8), 0), (rustle(800, 3000, 0.1, 0.12), 0.02), (bubble(500, 1300, 0.05, 0.25), 0.1))


def s_nibble():
    return mix((bubble(400, 1100, 0.05, 0.45), 0), (bubble(500, 1300, 0.04, 0.25), 0.07))


def s_splash():
    d = 0.6
    n = int(d * SR)
    body = lp(noise(d), 2400) * env(n, 0.005, 0.12) * 0.6
    spray = bp(noise(d), 2500, 8000) * env(n, 0.01, 0.08) * 0.25
    bubbles = [(bubble(rng.uniform(300, 600), rng.uniform(900, 1600), 0.06, 0.3), 0.1 + i * 0.06) for i in range(5)]
    return mix((body, 0), (spray, 0), *bubbles)


def s_reel():
    parts = []
    for i in range(9):
        c = bp(noise(0.012), 2500, 7000) * env(int(0.012 * SR), 0.0005, 0.003) * 0.6
        parts.append((c, i * 0.032))
    return mix(*parts, (bubble(400, 1200, 0.08, 0.3), 0.3))


def s_door():
    knock = mix((thump(180, 0.08, 0.6), 0), (s_step_wood(0) * 0.6, 0))
    jingle = []
    for i, f in enumerate([2600, 3300, 2950, 3500]):
        n = int(0.5 * SR)
        trem = 1 + 0.3 * np.sin(2 * np.pi * 18 * np.arange(n) / SR)
        jingle.append((osc(f, 0.5) * env(n, 0.002, 0.12) * trem * 0.18, 0.08 + i * 0.05))
    return reverb(mix((knock, 0), *jingle), 0.15, 0.5)


def s_place():
    return mix((thump(110, 0.1, 0.8), 0), (s_step_wood(1) * 0.5, 0.005), (rustle(500, 2500, 0.08, 0.1), 0))


def s_pickup():
    return reverb(mix((bubble(420, 880, 0.1, 0.7), 0), (bell(hz('E7'), 0.4, 0.2), 0.06)), 0.2, 0.5)


def s_rotate():
    return mix((s_step_wood(2) * 0.6, 0), (s_step_wood(0) * 0.5, 0.07))


def s_gift():
    crinkle = bp(noise(0.3), 2000, 8000) * (rng.uniform(0, 1, int(0.3 * SR)) > 0.85) * 0.5
    crinkle = lp(crinkle, 7000) * ahr(len(crinkle), 0.01, 0.1)
    return reverb(mix((crinkle, 0), (bell(hz('G6'), 0.8, 0.4), 0.25), (bell(hz('C7'), 0.8, 0.35), 0.32)), 0.25, 0.7)


def s_select():
    return mix((pluck(hz('C6'), 0.18, 0.55, 0.3), 0), (bubble(600, 900, 0.05, 0.3), 0))


def s_surprise():
    """The "!" moment when a villager first notices you: a quick upward swoop and a bright stab."""
    swoop = bubble(380, 1500, 0.14, 0.55)
    stab = mix((bell(hz('G6'), 0.7, 0.55), 0), (bell(hz('D7'), 0.6, 0.3), 0), (pluck(hz('G5'), 0.4, 0.5, 0.6), 0))
    whoosh = rustle(1500, 7000, 0.12, 0.12, a=0.08)
    return reverb(mix((whoosh, 0), (swoop, 0.02), (stab, 0.12)), 0.2, 0.6)


SFX = {
    'tap': s_tap, 'soft': s_soft, 'open': s_open, 'close': s_close, 'page': s_page,
    'correct': s_correct, 'wrong': s_wrong, 'discovery': s_discovery,
    'coin': s_coin, 'sparkle': s_sparkle, 'heart': s_heart, 'levelup': s_levelup, 'quest': s_quest, 'achievement': s_achievement,
    'hop': s_hop, 'land': s_land, 'squeak': s_squeak,
    'cast': s_cast, 'plop': s_plop, 'nibble': s_nibble, 'splash': s_splash, 'reel': s_reel,
    'door': s_door, 'place': s_place, 'pickup': s_pickup, 'rotate': s_rotate, 'gift': s_gift, 'select': s_select, 'surprise': s_surprise,
}
for i in range(3):
    SFX[f'step_grass{i}'] = (lambda i=i: s_step_grass(i))
    SFX[f'step_wood{i}'] = (lambda i=i: s_step_wood(i))
    SFX[f'step_stone{i}'] = (lambda i=i: s_step_stone(i))
    SFX[f'step_snow{i}'] = (lambda i=i: s_step_snow(i))

# ---------------------------------------------------------------- voice (formant synthesis)
F0 = 210.0  # bank base pitch; the game shifts it per villager
VOWELS = {  # cute, slightly child-like formants (F1, F2, F3)
    'a': (900, 1450, 2950), 'i': (380, 2650, 3350), 'u': (420, 1350, 2650),
    'e': (580, 2150, 2950), 'o': (560, 1000, 2750), 'n': (280, 1300, 2600),
}


def glottal(d, contour=None, breath=0.012):
    n = int(d * SR)
    c = np.ones(n) if contour is None else np.interp(np.arange(n), np.linspace(0, n - 1, len(contour)), contour)
    f = F0 * c * (1 + 0.01 * np.sin(2 * np.pi * 5.5 * np.arange(n) / SR))
    ph = np.cumsum(f) / SR % 1
    src = (1 - 2 * ph) * 0.6 + np.sin(2 * np.pi * ph) * 0.4  # soft sawtooth
    src = lp(src, 3500)
    return src + bp(noise(d), 1500, 6000) * breath


def formant(src, fmts, glide_from=None, glide_t=0.03):
    n = len(src)
    out = np.zeros(n)
    gains = [1.0, 0.9, 0.45]
    bws = [110, 150, 220]
    if glide_from is None:
        for f, g, bw in zip(fmts, gains, bws):
            out += resonator(src, f, bw) * g
        return out + src * 0.03
    # Glide formants by crossfading two filter banks (cheap and smooth enough).
    gl = min(n, int(glide_t * SR))
    w = np.concatenate([np.linspace(0, 1, gl), np.ones(n - gl)])
    a = formant(src, glide_from)
    b = formant(src, fmts)
    return a * (1 - w) + b * w


def vowel_clip(v, d=0.1, contour=(1.06, 1.0, 0.96)):
    n = int(d * SR)
    x = formant(glottal(d, contour), VOWELS[v])
    return x * ahr(n, 0.012, 0.04)


def syllable(onset, v):
    vd = 0.1
    if onset == '':
        return norm(vowel_clip(v, vd), 0.8)
    if onset == 'p':  # plosive: short burst + tiny gap
        burst = bp(noise(0.008), 1500, 5500) * env(int(0.008 * SR), 0.0005, 0.003) * 0.7
        return norm(np.concatenate([burst, silence(0.012), vowel_clip(v, vd)]), 0.8)
    if onset == 'f':  # fricative: s/sh/h
        fr = bp(noise(0.045), 2600, 8000) * ahr(int(0.045 * SR), 0.01, 0.015) * 0.35
        return norm(np.concatenate([fr, vowel_clip(v, vd)]), 0.8)
    if onset == 'm':  # nasal murmur into the vowel
        d = 0.035 + vd
        n = int(d * SR)
        x = formant(glottal(d, (1.0, 1.04, 0.96)), VOWELS[v], glide_from=VOWELS['n'], glide_t=0.04)
        return norm(x * ahr(n, 0.01, 0.04), 0.8)
    if onset == 'l':  # liquid/glide from an "i"-ish shape
        d = 0.03 + vd
        n = int(d * SR)
        x = formant(glottal(d, (1.02, 1.06, 0.96)), VOWELS[v], glide_from=VOWELS['i'], glide_t=0.035)
        return norm(x * ahr(n, 0.01, 0.04), 0.8)
    raise ValueError(onset)


def emote_giggle():
    parts = []
    for i in range(4):
        fr = bp(noise(0.02), 1500, 5000) * 0.25
        v = formant(glottal(0.07, (1.25 + i * 0.07, 1.2 + i * 0.07)), VOWELS['e']) * ahr(int(0.07 * SR), 0.008, 0.03)
        parts += [(fr, i * 0.09), (v, i * 0.09 + 0.015)]
    return norm(mix(*parts), 0.75)


def emote_gasp():
    intake = bp(noise(0.1), 1200, 5000) * np.linspace(0, 1, int(0.1 * SR)) * 0.25
    d = 0.2
    v = formant(glottal(d, (1.0, 1.45, 1.4), breath=0.08), VOWELS['o']) * ahr(int(d * SR), 0.01, 0.07)
    return norm(mix((intake, 0), (v, 0.09)), 0.8)


def emote_hmm():
    d = 0.45
    v = formant(glottal(d, (1.0, 0.92, 0.95, 1.08), breath=0.02), VOWELS['n']) * ahr(int(d * SR), 0.03, 0.12)
    return norm(lp(v, 2500), 0.7)


def emote_yay():
    d = 0.32
    n = int(d * SR)
    x = formant(glottal(d, (1.0, 1.25, 1.55, 1.5)), VOWELS['a'], glide_from=VOWELS['i'], glide_t=0.06)
    return norm(x * ahr(n, 0.01, 0.08), 0.85)


def emote_aww():
    d = 0.42
    n = int(d * SR)
    x = formant(glottal(d, (1.15, 1.0, 0.82), breath=0.05), VOWELS['o'], glide_from=VOWELS['a'], glide_t=0.25)
    return norm(x * ahr(n, 0.03, 0.15), 0.7)


def emote_yawn():
    d = 0.8
    n = int(d * SR)
    x = formant(glottal(d, (1.1, 1.2, 0.95, 0.75), breath=0.12), VOWELS['o'], glide_from=VOWELS['a'], glide_t=0.5)
    return norm(lp(x * np.sin(np.linspace(0, np.pi, n)) ** 0.7, 3000), 0.6)


def emote_hi():
    d = 0.22
    fr = bp(noise(0.03), 1500, 4500) * 0.2
    v = formant(glottal(d, (1.2, 1.35, 1.25)), VOWELS['i'], glide_from=VOWELS['a'], glide_t=0.08) * ahr(int(d * SR), 0.01, 0.07)
    return norm(mix((fr, 0), (v, 0.02)), 0.75)


VOICE = {}
for onset in ['', 'p', 'f', 'm', 'l']:
    for v in 'aiueo':
        VOICE[f'{onset or "_"}{v}'] = (lambda o=onset, v=v: syllable(o, v))
VOICE['_n'] = lambda: norm(vowel_clip('n', 0.08), 0.6)
VOICE.update({
    'emote_giggle': emote_giggle, 'emote_gasp': emote_gasp, 'emote_hmm': emote_hmm, 'emote_yay': emote_yay,
    'emote_aww': emote_aww, 'emote_yawn': emote_yawn, 'emote_hi': emote_hi,
})


# ---------------------------------------------------------------- packing
def pack(name, table, peak=0.85, gap=0.05):
    chunks, sprite, cursor = [], {}, 0.0
    for key, fn in table.items():
        x = fade_tail(norm(np.asarray(fn(), dtype=float), peak))
        # Trim trailing near-silence to keep the bank small.
        loud = np.where(np.abs(x) > 0.002)[0]
        if len(loud):
            x = x[: loud[-1] + int(0.01 * SR)]
        sprite[key] = [round(cursor, 4), round(len(x) / SR, 4)]
        chunks += [x, silence(gap)]
        cursor += len(x) / SR + gap
    audio = np.concatenate(chunks)
    pcm = (np.clip(audio, -1, 1) * 32767).astype('<i2')
    buf = io.BytesIO()
    with wave.open(buf, 'wb') as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(pcm.tobytes())
    b64 = base64.b64encode(buf.getvalue()).decode()
    os.makedirs(OUT, exist_ok=True)
    with open(os.path.join(OUT, f'{name}.ts'), 'w') as f:
        f.write('// Generated by tools/sound/render.py. Do not edit by hand.\n')
        f.write(f'export const sprite: Record<string, [number, number]> = {json.dumps(sprite)};\n')
        f.write(f'export const wav = "{b64}";\n')
    with open(os.path.join(OUT, f'{name}.wav'), 'wb') as f:  # handy for auditioning
        f.write(buf.getvalue())
    print(f'{name}: {len(sprite)} sounds, {cursor:.1f}s, {len(b64) / 1024:.0f} KB base64')


if __name__ == '__main__':
    pack('sfx', SFX)
    pack('voice', VOICE, peak=0.8, gap=0.03)
