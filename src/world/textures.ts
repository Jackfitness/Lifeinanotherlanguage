import * as THREE from 'three';
import { NODES, EDGES, SPOTS } from '../content/places';

export const canvas = (w: number, h = w) => {
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  return [c, c.getContext('2d')!] as const;
};

function rng(seed: number) {
  let s = seed >>> 0;
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
}

/** Tileable value noise in [0,1]. */
function tileNoise(size: number, cells: number, seed: number) {
  const r = rng(seed);
  const g = Array.from({ length: cells * cells }, () => r());
  const out = new Float32Array(size * size);
  const sm = (t: number) => t * t * (3 - 2 * t);
  for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
    const fx = (x / size) * cells, fy = (y / size) * cells;
    const x0 = Math.floor(fx), y0 = Math.floor(fy);
    const tx = sm(fx - x0), ty = sm(fy - y0);
    const a = g[(y0 % cells) * cells + (x0 % cells)], b = g[(y0 % cells) * cells + ((x0 + 1) % cells)];
    const c = g[((y0 + 1) % cells) * cells + (x0 % cells)], d = g[((y0 + 1) % cells) * cells + ((x0 + 1) % cells)];
    out[y * size + x] = (a + (b - a) * tx) * (1 - ty) + (c + (d - c) * tx) * ty;
  }
  return out;
}

function heightToNormal(h: Float32Array, size: number, strength: number) {
  const [c, ctx] = canvas(size);
  const img = ctx.createImageData(size, size);
  for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
    const i = y * size + x;
    const l = h[y * size + ((x - 1 + size) % size)], r = h[y * size + ((x + 1) % size)];
    const u = h[((y - 1 + size) % size) * size + x], d = h[((y + 1) % size) * size + x];
    const nx = (l - r) * strength, ny = (u - d) * strength, nz = 1;
    const len = Math.hypot(nx, ny, nz);
    img.data[i * 4] = ((nx / len) * 0.5 + 0.5) * 255;
    img.data[i * 4 + 1] = ((ny / len) * 0.5 + 0.5) * 255;
    img.data[i * 4 + 2] = ((nz / len) * 0.5 + 0.5) * 255;
    img.data[i * 4 + 3] = 255;
  }
  ctx.putImageData(img, 0, 0);
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  return t;
}

let fabricCache: { map: THREE.Texture; normal: THREE.Texture } | null = null;
/** Soft minky/felt fabric: fine fibers + gentle knit undulation. Grayscale map tinted by material color. */
export function fabric() {
  if (fabricCache) return fabricCache;
  const size = 256;
  const n1 = tileNoise(size, 32, 7), n2 = tileNoise(size, 8, 11);
  const r = rng(3);
  const h = new Float32Array(size * size);
  for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
    const knit = Math.sin((x / size) * Math.PI * 2 * 48) * Math.sin((y / size) * Math.PI * 2 * 64);
    h[y * size + x] = n1[y * size + x] * 0.6 + n2[y * size + x] * 0.3 + knit * 0.08 + r() * 0.12;
  }
  const [c, ctx] = canvas(size);
  const img = ctx.createImageData(size, size);
  for (let i = 0; i < size * size; i++) {
    const v = 222 + (h[i] - 0.5) * 50;
    img.data[i * 4] = img.data[i * 4 + 1] = img.data[i * 4 + 2] = v; img.data[i * 4 + 3] = 255;
  }
  ctx.putImageData(img, 0, 0);
  ctx.globalAlpha = 0.08; ctx.strokeStyle = '#fff'; ctx.lineWidth = 1;
  for (let i = 0; i < 900; i++) {
    const x = r() * size, y = r() * size, a = r() * Math.PI, l = 2 + r() * 4;
    ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + Math.cos(a) * l, y + Math.sin(a) * l); ctx.stroke();
  }
  const map = new THREE.CanvasTexture(c);
  map.wrapS = map.wrapT = THREE.RepeatWrapping; map.repeat.set(3, 3); map.colorSpace = THREE.SRGBColorSpace;
  const normal = heightToNormal(h, size, 3);
  normal.repeat.set(3, 3);
  fabricCache = { map, normal };
  return fabricCache;
}

let stitchCache: THREE.Texture | null = null;
export function stitch() {
  if (stitchCache) return stitchCache;
  const [c, ctx] = canvas(64, 16);
  ctx.fillStyle = '#fff';
  ctx.beginPath(); (ctx as any).roundRect ? (ctx as any).roundRect(6, 4, 36, 8, 4) : ctx.rect(6, 4, 36, 8); ctx.fill();
  stitchCache = new THREE.CanvasTexture(c);
  stitchCache.wrapS = THREE.RepeatWrapping;
  return stitchCache;
}

let waterCache: THREE.Texture | null = null;
export function waterNormal() {
  if (waterCache) return waterCache;
  const size = 256;
  const a = tileNoise(size, 8, 21), b = tileNoise(size, 16, 5);
  const h = new Float32Array(size * size);
  for (let i = 0; i < h.length; i++) h[i] = a[i] * 0.7 + b[i] * 0.3;
  waterCache = heightToNormal(h, size, 6);
  return waterCache;
}

/** A soft round sprite used by particles. */
export function softDot(color = '#ffffff') {
  const [c, ctx] = canvas(64);
  const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  g.addColorStop(0, color); g.addColorStop(0.4, color); g.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = g; ctx.fillRect(0, 0, 64, 64);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

export function petal(color: string) {
  const [c, ctx] = canvas(64);
  ctx.fillStyle = color;
  ctx.beginPath(); ctx.ellipse(32, 32, 14, 24, 0.6, 0, Math.PI * 2); ctx.fill();
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

/** Emoji/text drawn into a sprite texture (quest markers, signs). */
export function emojiTexture(emoji: string, size = 128, bg?: string) {
  const [c, ctx] = canvas(size);
  if (bg) {
    ctx.fillStyle = bg;
    ctx.beginPath(); ctx.arc(size / 2, size / 2, size * 0.42, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = 'rgba(91,70,54,.25)'; ctx.lineWidth = size * 0.04; ctx.stroke();
  }
  ctx.font = `${size * 0.56}px "Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif`;
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText(emoji, size / 2, size / 2 + size * 0.04);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

export function signTexture(text: string, bg: string, fg: string, family = '"M PLUS Rounded 1c", sans-serif', weight = 800) {
  const [c, ctx] = canvas(512, 160);
  ctx.fillStyle = bg;
  ctx.beginPath(); (ctx as any).roundRect(8, 8, 496, 144, 40); ctx.fill();
  ctx.strokeStyle = fg; ctx.globalAlpha = 0.35; ctx.setLineDash([14, 10]); ctx.lineWidth = 5;
  ctx.beginPath(); (ctx as any).roundRect(22, 22, 468, 116, 30); ctx.stroke();
  ctx.globalAlpha = 1; ctx.setLineDash([]);
  ctx.fillStyle = fg;
  let fs = 84;
  ctx.font = `${weight} ${fs}px ${family}`;
  while (ctx.measureText(text).width > 430 && fs > 30) { fs -= 4; ctx.font = `${weight} ${fs}px ${family}`; }
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText(text, 256, 84);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4;
  return t;
}

export function stripes(c1: string, c2: string, n = 8) {
  const [c, ctx] = canvas(256, 64);
  for (let i = 0; i < n; i++) { ctx.fillStyle = i % 2 ? c2 : c1; ctx.fillRect((i * 256) / n, 0, 256 / n + 1, 64); }
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

export type Season = 'spring' | 'summer' | 'autumn' | 'winter';
export const GRASS: Record<Season, [string, string, string]> = {
  spring: ['#A9D58A', '#9BCB7C', '#B7DE97'],
  summer: ['#93C873', '#86BD66', '#A2D282'],
  autumn: ['#B9C877', '#AABA6A', '#C9CF86'],
  winter: ['#E8EEF0', '#DCE6EA', '#F4F7F8'],
};

/** World ground: painted grass with dirt paths following the NPC path graph, plaza stones, pond banks. */
export function groundTexture(season: Season, worldSize: number) {
  const px = 2048;
  const [c, ctx] = canvas(px);
  const k = px / worldSize;
  const W = (x: number) => (x + worldSize / 2) * k;
  const r = rng(42);
  const [g0, g1, g2] = GRASS[season];
  ctx.fillStyle = g0; ctx.fillRect(0, 0, px, px);
  for (let i = 0; i < 2600; i++) {
    ctx.fillStyle = r() < 0.5 ? g1 : g2;
    ctx.globalAlpha = 0.25 + r() * 0.3;
    ctx.beginPath(); ctx.ellipse(r() * px, r() * px, 6 + r() * 30, 4 + r() * 18, r() * 3, 0, Math.PI * 2); ctx.fill();
  }
  ctx.globalAlpha = 1;
  // Paths
  const pathCol = season === 'winter' ? '#D9CDBF' : '#E9D2A6';
  const pathEdge = season === 'winter' ? '#CDBFAE' : '#D8BC8A';
  const drawPaths = (w: number, col: string) => {
    ctx.strokeStyle = col; ctx.lineWidth = w * k; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    for (const [a, b] of EDGES) {
      const A = NODES[a], B = NODES[b];
      ctx.beginPath(); ctx.moveTo(W(A[0]), W(A[1])); ctx.lineTo(W(B[0]), W(B[1])); ctx.stroke();
    }
    ctx.beginPath(); ctx.moveTo(W(0), W(SPOTS.homeDoor[1])); ctx.lineTo(W(0), W(40)); ctx.stroke();
  };
  drawPaths(2.5, pathEdge);
  drawPaths(2.0, pathCol);
  // Plaza
  ctx.fillStyle = pathEdge; ctx.beginPath(); ctx.arc(W(0), W(0), 7.6 * k, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = season === 'winter' ? '#E6DED4' : '#F1E3C8'; ctx.beginPath(); ctx.arc(W(0), W(0), 7.2 * k, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = 'rgba(180,150,110,.35)'; ctx.lineWidth = 2;
  for (let ring = 1; ring <= 4; ring++) {
    const rr = ring * 1.75 * k;
    ctx.beginPath(); ctx.arc(W(0), W(0), rr, 0, Math.PI * 2); ctx.stroke();
    const n = ring * 9;
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2 + ring;
      ctx.beginPath(); ctx.moveTo(W(0) + Math.cos(a) * (rr - 1.75 * k), W(0) + Math.sin(a) * (rr - 1.75 * k));
      ctx.lineTo(W(0) + Math.cos(a) * rr, W(0) + Math.sin(a) * rr); ctx.stroke();
    }
  }
  // Pond bank
  const p = SPOTS.pond;
  ctx.fillStyle = '#E5D3A8'; ctx.beginPath(); ctx.ellipse(W(p.x), W(p.z), (p.rx + 0.9) * k, (p.rz + 0.9) * k, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#6FA9A8'; ctx.beginPath(); ctx.ellipse(W(p.x), W(p.z), (p.rx + 0.1) * k, (p.rz + 0.1) * k, 0, 0, Math.PI * 2); ctx.fill();
  // Stream bed
  const s = SPOTS.stream;
  ctx.fillStyle = '#E5D3A8'; ctx.fillRect(0, W(s.z - s.half - 0.7), px, (s.half + 0.7) * 2 * k);
  ctx.fillStyle = '#6FA9A8'; ctx.fillRect(0, W(s.z - s.half), px, s.half * 2 * k);
  // Garden soil beds
  ctx.fillStyle = season === 'winter' ? '#C9B8A6' : '#A9805E';
  for (const [x, z] of [[8.2, 9.6], [12.2, 9.6], [8.2, 12.2], [12.2, 12.2]]) {
    ctx.beginPath(); (ctx as any).roundRect(W(x - 1.6), W(z - 0.8), 3.2 * k, 1.6 * k, 0.5 * k); ctx.fill();
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8;
  return t;
}

/** Interior patterns for wallpaper and floors. */
export function pattern(kind: string, color: string, accent: string) {
  const [c, ctx] = canvas(256);
  ctx.fillStyle = color; ctx.fillRect(0, 0, 256, 256);
  ctx.fillStyle = accent; ctx.strokeStyle = accent;
  if (kind === 'stripes') for (let i = 0; i < 8; i += 2) ctx.fillRect(i * 32, 0, 22, 256);
  if (kind === 'dots') for (let y = 0; y < 4; y++) for (let x = 0; x < 4; x++) { ctx.beginPath(); ctx.arc(x * 64 + (y % 2) * 32 + 16, y * 64 + 32, 9, 0, 7); ctx.fill(); }
  if (kind === 'gingham') { ctx.globalAlpha = 0.55; for (let i = 0; i < 4; i++) { ctx.fillRect(i * 64, 0, 32, 256); ctx.fillRect(0, i * 64, 256, 32); } }
  if (kind === 'clouds') for (let i = 0; i < 6; i++) { const x = (i * 97) % 256, y = (i * 61) % 256; ctx.beginPath(); ctx.arc(x, y, 14, 0, 7); ctx.arc(x + 14, y - 6, 16, 0, 7); ctx.arc(x + 28, y, 13, 0, 7); ctx.fill(); }
  if (kind === 'planks') { ctx.lineWidth = 3; for (let i = 0; i < 4; i++) { ctx.beginPath(); ctx.moveTo(0, i * 64); ctx.lineTo(256, i * 64); ctx.stroke(); ctx.beginPath(); const x = (i * 83) % 256; ctx.moveTo(x, i * 64); ctx.lineTo(x, i * 64 + 64); ctx.stroke(); } }
  if (kind === 'checker') for (let y = 0; y < 4; y++) for (let x = 0; x < 4; x++) if ((x + y) % 2) ctx.fillRect(x * 64, y * 64, 64, 64);
  if (kind === 'carpet') { const r = rng(9); ctx.globalAlpha = 0.4; for (let i = 0; i < 1400; i++) ctx.fillRect(r() * 256, r() * 256, 2, 2); }
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping; t.colorSpace = THREE.SRGBColorSpace;
  return t;
}
