import { h, button } from './dom';
import { t } from '../core/i18n';

/**
 * Tracing pad: a faint character to trace with a finger. Scoring compares the ink with the
 * character's shape: how much of the character is covered, and how much ink stayed on it.
 * (Stroke order isn't checked; the guide shows the shape only.)
 */
export interface TraceResult { coverage: number; precision: number; ok: boolean }

const SIZE = 240; // logical pixels
const FALLBACK = '"Kiwi Maru", "Hiragino Mincho ProN", "Yu Mincho", serif';
const FONT = `"Klee One", ${FALLBACK}`;

let fontLink = false;
/** Klee One is a schoolbook-style handwriting font: ideal tracing guides. Loaded on first use. */
export function ensureFont(glyph = 'あア字') {
  if (!fontLink) {
    fontLink = true;
    const l = document.createElement('link');
    l.rel = 'stylesheet'; l.href = 'https://fonts.googleapis.com/css2?family=Klee+One:wght@600&display=swap';
    document.head.append(l);
  }
  return document.fonts?.load(`600 40px "Klee One"`, glyph).catch(() => []) ?? Promise.resolve([]);
}

function glyphMask(glyph: string, px: number, grow: number, face: string) {
  const c = document.createElement('canvas'); c.width = c.height = px;
  const x = c.getContext('2d')!;
  x.fillStyle = '#000'; x.strokeStyle = '#000';
  x.textAlign = 'center'; x.textBaseline = 'middle';
  x.font = `600 ${px * 0.78}px ${face}`;
  x.fillText(glyph, px / 2, px * 0.53);
  if (grow) { x.lineWidth = grow; x.lineJoin = 'round'; x.strokeText(glyph, px / 2, px * 0.53); }
  return x.getImageData(0, 0, px, px).data;
}

export function tracePad(glyph: string, onDone: (r: TraceResult) => void) {
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  const cv = h('canvas.trace-canvas', { width: SIZE * dpr, height: SIZE * dpr, style: { width: SIZE + 'px', height: SIZE + 'px' } }) as HTMLCanvasElement;
  const ink = h('canvas', { width: SIZE, height: SIZE }) as HTMLCanvasElement; // scoring layer, 1x
  const g = cv.getContext('2d')!, ig = ink.getContext('2d')!;
  const lineW = 15;
  // Score against exactly the font the guide was drawn with (the web font may still be loading).
  let face = FALLBACK;
  const drawGuide = () => {
    face = document.fonts?.check(`600 40px "Klee One"`, glyph) ? FONT : FALLBACK;
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    g.clearRect(0, 0, SIZE, SIZE);
    // paper grid
    g.strokeStyle = 'rgba(194,69,59,0.25)'; g.lineWidth = 1; g.setLineDash([5, 6]);
    g.beginPath(); g.moveTo(SIZE / 2, 8); g.lineTo(SIZE / 2, SIZE - 8); g.moveTo(8, SIZE / 2); g.lineTo(SIZE - 8, SIZE / 2); g.stroke();
    g.setLineDash([]);
    g.fillStyle = 'rgba(91,70,54,0.16)'; g.textAlign = 'center'; g.textBaseline = 'middle';
    g.font = `600 ${SIZE * 0.78}px ${face}`;
    g.fillText(glyph, SIZE / 2, SIZE * 0.53);
  };
  drawGuide();
  void ensureFont(glyph).then(() => { if (!inked) drawGuide(); });
  ig.lineCap = ig.lineJoin = 'round'; ig.lineWidth = lineW; ig.strokeStyle = '#000';
  let last: [number, number] | null = null, inked = false;
  const pos = (e: PointerEvent): [number, number] => { const r = cv.getBoundingClientRect(); return [((e.clientX - r.left) / r.width) * SIZE, ((e.clientY - r.top) / r.height) * SIZE]; };
  const seg = (a: [number, number], b: [number, number]) => {
    for (const [ctx, w, col] of [[g, lineW, '#2E2A2A'], [ig, lineW, '#000']] as const) {
      ctx.lineCap = ctx.lineJoin = 'round'; ctx.lineWidth = w; ctx.strokeStyle = col;
      ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0] + 0.01, b[1]); ctx.stroke();
    }
    inked = true; done.removeAttribute('disabled');
  };
  cv.addEventListener('pointerdown', (e) => { e.preventDefault(); try { cv.setPointerCapture(e.pointerId); } catch { /* synthetic pointer */ } last = pos(e); seg(last, last); });
  cv.addEventListener('pointermove', (e) => { if (!last) return; const p = pos(e); seg(last, p); last = p; });
  const up = () => { last = null; };
  cv.addEventListener('pointerup', up); cv.addEventListener('pointercancel', up);

  const clear = button('btn.soft.small', t('traceClear'), () => { ig.clearRect(0, 0, SIZE, SIZE); drawGuide(); inked = false; done.setAttribute('disabled', ''); });
  const done = button('btn.primary.small', t('traceDone'), () => onDone(score()), { disabled: true });
  const score = (): TraceResult => {
    const shape = glyphMask(glyph, SIZE, 0, face), loose = glyphMask(glyph, SIZE, 16, face);
    const inkPx = ig.getImageData(0, 0, SIZE, SIZE).data;
    let glyphN = 0, covered = 0, inkN = 0, onShape = 0;
    for (let i = 3; i < inkPx.length; i += 4) {
      const gOn = shape[i] > 120, iOn = inkPx[i] > 120;
      if (gOn) { glyphN++; if (iOn) covered++; }
      if (iOn) { inkN++; if (loose[i] > 60) onShape++; }
    }
    const coverage = glyphN ? covered / glyphN : 0, precision = inkN ? onShape / inkN : 0;
    return { coverage, precision, ok: inked && coverage >= 0.55 && precision >= 0.7 };
  };
  const el = h('div.trace-pad', null, cv, h('div.trace-actions', null, clear, done));
  return { el, canvas: cv, score, get face() { return face; } };
}
