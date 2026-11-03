"""
Pre-renders pronunciation audio for every word and phrase with Kokoro-82M (Apache-2.0),
an open neural TTS model, so pronunciation sounds the same on every device.

Output per language and speed (target language only is loaded in game):
  public/voice/<lang>-<speed>.mp3   one sprite of all clips
  public/voice/<lang>-<speed>.json  {key: [start, duration]} with keys like "w:apple", "p:hello", "p:want_item|chair"

Setup (one time):
  python3 -m venv ~/.venvs/tts && ~/.venvs/tts/bin/pip install kokoro-onnx soundfile "misaki[ja]"
  Download into ~/.cache/kokoro from https://huggingface.co/onnx-community/Kokoro-82M-v1.0-ONNX :
    onnx/model.onnx  and  voices/{af_heart,ef_dora,jf_alpha}.bin

Run:
  node --experimental-strip-types tools/voice/export-lines.mjs > tools/voice/lines.json
  ~/.venvs/tts/bin/python tools/voice/render_tts.py
"""
import json
import os
import subprocess
import sys
import tempfile

import numpy as np
import soundfile as sf
from kokoro_onnx import Kokoro

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
CACHE = os.path.expanduser(os.environ.get('KOKORO_DIR', '~/.cache/kokoro'))
OUT = os.path.join(ROOT, 'public', 'voice')

VOICES = {'en': 'af_heart', 'es': 'ef_dora', 'ja': 'jf_alpha'}
ESPEAK = {'en': 'en-us', 'es': 'es'}
# Clear "teacher" pace by default; a slower take for beginners (no pitch shifting needed in game).
SPEEDS = {'normal': 0.92, 'slow': 0.74}
GAP = 0.18  # seconds of silence between clips (absorbs MP3 encoder delay)


def load_kokoro():
    model = os.path.join(CACHE, 'model.onnx')
    npz = os.path.join(CACHE, 'voices.npz')
    if not os.path.exists(npz):
        styles = {}
        for v in set(VOICES.values()):
            path = os.path.join(CACHE, f'{v}.bin')
            styles[v] = np.fromfile(path, dtype=np.float32).reshape(-1, 1, 256)
        np.savez(npz, **styles)
    return Kokoro(model, npz)


def trim(x, sr, thresh=0.01, pad=0.04):
    idx = np.where(np.abs(x) > thresh)[0]
    if not len(idx):
        return x
    a = max(0, idx[0] - int(pad * sr))
    b = min(len(x), idx[-1] + int(pad * sr))
    return x[a:b]


def level(x, target_rms=0.09, peak=0.92):
    rms = np.sqrt(np.mean(x ** 2)) + 1e-9
    x = x * (target_rms / rms)
    m = np.max(np.abs(x))
    return x * (peak / m) if m > peak else x


def main():
    lines = json.load(open(os.path.join(ROOT, 'tools', 'voice', 'lines.json')))
    langs = sys.argv[1:] or ['ja']  # Japanese-only game
    kokoro = load_kokoro()
    g2p = None
    os.makedirs(OUT, exist_ok=True)
    for lang in langs:
        if lang == 'ja' and g2p is None:
            from misaki import ja
            g2p = ja.JAG2P()
        for speed_name, speed in SPEEDS.items():
            clips, sprite, cursor, sr = [], {}, GAP, 24000
            for i, line in enumerate(lines[lang]):
                text = line['text']
                if lang == 'ja':
                    out = g2p(text)
                    phonemes = out[0] if isinstance(out, tuple) else out  # misaki ja returns a plain string
                    audio, sr = kokoro.create(phonemes, voice=VOICES[lang], speed=speed, is_phonemes=True)
                else:
                    audio, sr = kokoro.create(text, voice=VOICES[lang], speed=speed, lang=ESPEAK[lang])
                audio = level(trim(np.asarray(audio, dtype=np.float32), sr))
                sprite[line['key']] = [round(cursor, 3), round(len(audio) / sr, 3)]
                clips += [audio, np.zeros(int(GAP * sr), dtype=np.float32)]
                cursor += len(audio) / sr + GAP
                if i % 40 == 0:
                    print(f'  {lang}-{speed_name}: {i}/{len(lines[lang])}', flush=True)
            full = np.concatenate([np.zeros(int(GAP * sr), dtype=np.float32), *clips])
            base = os.path.join(OUT, f'{lang}-{speed_name}')
            with tempfile.NamedTemporaryFile(suffix='.wav') as tmp:
                sf.write(tmp.name, full, sr)
                subprocess.run(['ffmpeg', '-hide_banner', '-loglevel', 'error', '-y', '-i', tmp.name,
                                '-ac', '1', '-codec:a', 'libmp3lame', '-b:a', '48k', base + '.mp3'], check=True)
            json.dump(sprite, open(base + '.json', 'w'), separators=(',', ':'), ensure_ascii=False)
            size = os.path.getsize(base + '.mp3') / 1024
            print(f'{lang}-{speed_name}: {len(sprite)} clips, {cursor:.0f}s, {size:.0f} KB')


if __name__ == '__main__':
    main()
