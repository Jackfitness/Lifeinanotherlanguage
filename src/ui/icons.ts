/**
 * Custom icon set (replaces emoji). Every icon is a 64×64 SVG in one style: soft cocoa
 * outlines, warm felt colors, rounded shapes, and a light highlight — matching the logo.
 *
 * icon(name)        → inline SVG markup for the DOM
 * iconTexture(name) → a THREE texture for in-world sprites (markers, pickups, bursts)
 */
import * as THREE from 'three';

const K = '#5B4636'; // outline
const PAL = {
  brown: '#C98F5E', dbrown: '#8A5A3B', tan: '#E9C89B', cream: '#FFF4E3', white: '#FFFFFF',
  red: '#E8566C', pink: '#F6A5B5', rose: '#F2B8C6', orange: '#F2913D', yellow: '#F6C343', butter: '#FBE08A',
  green: '#7DB46C', dgreen: '#4F9466', mint: '#A8DABB', blue: '#7FB0D9', sky: '#9FD3E6', navy: '#4A6A9A',
  purple: '#B6A3D9', gray: '#BDB5AA', dgray: '#8C857C', water: '#8CCFD6', black: '#3A2E26',
};
type Col = keyof typeof PAL | string;
const col = (c: Col) => (c in PAL ? PAL[c as keyof typeof PAL] : c);

// Shape helpers (all outlined unless noted).
const C = (cx: number, cy: number, r: number, f: Col = '#fff') => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${col(f)}"/>`;
const E = (cx: number, cy: number, rx: number, ry: number, f: Col, rot = 0) =>
  `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${col(f)}"${rot ? ` transform="rotate(${rot} ${cx} ${cy})"` : ''}/>`;
const R = (x: number, y: number, w: number, h: number, r: number, f: Col, rot = 0) =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${col(f)}"${rot ? ` transform="rotate(${rot} ${x + w / 2} ${y + h / 2})"` : ''}/>`;
const P = (d: string, f: Col = 'none') => `<path d="${d}" fill="${col(f)}"/>`;
/** Unstroked detail (highlights, spots). */
const D = (inner: string, f: Col = '#fff', o = 0.55) => `<g stroke="none" fill="${col(f)}" opacity="${o}">${inner}</g>`;
const dot = (cx: number, cy: number, r = 2.2) => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${K}" stroke="none"/>`;
/** Tiny cute face. */
const face = (cx: number, cy: number, s = 1) =>
  dot(cx - 5 * s, cy, 1.9 * s) + dot(cx + 5 * s, cy, 1.9 * s) +
  `<path d="M${cx - 2.2 * s} ${cy + 3 * s} q${2.2 * s} ${2.6 * s} ${4.4 * s} 0" fill="none" stroke-width="${2.2 * s}"/>` +
  D(E(cx - 8 * s, cy + 3 * s, 2.6 * s, 1.6 * s, 'pink') + E(cx + 8 * s, cy + 3 * s, 2.6 * s, 1.6 * s, 'pink'), 'pink', 0.9);
const shine = (cx: number, cy: number, rx = 4, ry = 2.6, rot = -30) => D(E(cx, cy, rx, ry, '#fff', rot), '#fff', 0.6);

// ------------------------------------------------------------------ icon drawings
const ICONS: Record<string, string> = {
  // ---- Food & drink
  bread: P('M10 34c0-12 10-20 22-20s22 8 22 20v12c0 3-2 5-5 5H15c-3 0-5-2-5-5z', 'tan') + P('M14 30c2-8 9-12 18-12s16 4 18 12', 'brown') + face(32, 38),
  coffee: P('M14 24h30v16c0 7-6 12-13 12h-4c-7 0-13-5-13-12z', 'cream') + P('M44 28h4c4 0 6 3 6 6s-2 6-6 6h-4', 'none') + E(29, 24, 15, 4, 'dbrown') + `<path d="M24 16c-2-3 2-5 0-8M32 16c-2-3 2-5 0-8" fill="none" opacity=".6"/>` + face(29, 36, 0.8),
  tea: P('M12 28h34v8c0 9-8 16-17 16s-17-7-17-16z', 'mint') + P('M46 31h3c4 0 6 3 5 6s-3 5-7 5', 'none') + E(29, 28, 17, 4.5, 'dgreen') + `<path d="M22 20c-2-3 2-5 0-8M32 20c-2-3 2-5 0-8" fill="none" opacity=".6"/>` + face(29, 39, 0.8),
  cake: P('M10 34l22-14 22 14v14c0 2-1 3-3 3H13c-2 0-3-1-3-3z', 'cream') + P('M10 34l22-14 22 14c-6 4-10-2-15 2s-10 0-14-2-9 4-15 0z', 'pink') + C(32, 15, 5, 'red') + P('M32 10c1-3 3-4 5-4', 'none') + face(32, 42, 0.85),
  cookie: C(32, 32, 21, 'tan') + D(C(24, 25, 3.5, K) + C(38, 22, 3) + C(41, 37, 3.5) + C(26, 41, 3) + C(33, 33, 2.4), 'dbrown', 1) + shine(24, 18),
  croissant: P('M8 40c4-14 14-22 24-22s20 8 24 22c-4 2-8 0-10-3-2 4-6 6-14 6s-12-2-14-6c-2 3-6 5-10 3z', 'butter') + `<path d="M22 22l4 14M32 19v18M42 22l-4 14" fill="none"/>`,
  honey: R(14, 20, 36, 32, 12, 'yellow') + R(17, 12, 30, 10, 4, 'brown') + P('M14 32c6 0 6 5 12 5s6-5 12-5 6 5 12 5', 'none') + shine(22, 28) + face(32, 42, 0.8),
  milk: P('M20 22l4-10h16l4 10v26c0 3-2 5-5 5H25c-3 0-5-2-5-5z', 'white') + R(20, 30, 24, 12, 2, 'sky') + P('M24 12l8 6 8-6', 'none') + face(32, 36, 0.7),
  water: P('M32 8c10 13 17 21 17 30a17 17 0 0 1-34 0c0-9 7-17 17-30z', 'sky') + shine(25, 34, 3, 6, 20) + face(32, 40, 0.85),
  apple: P('M32 20c-6-5-20-4-20 12 0 12 9 21 15 21 2 0 3-1 5-1s3 1 5 1c6 0 15-9 15-21 0-16-14-17-20-12z', 'red') + P('M32 20c0-5 2-9 5-11', 'none') + E(41, 13, 6, 3, 'green', -25) + shine(21, 29) + face(32, 37, 0.85),
  strawberry: P('M32 54C18 46 12 34 14 26c2-6 9-8 18-8s16 2 18 8c2 8-4 20-18 28z', 'red') + P('M18 20l6-6 8 4 8-4 6 6-14 4z', 'green') + D(C(24, 32, 1.6) + C(40, 32, 1.6) + C(32, 40, 1.6) + C(26, 44, 1.6) + C(38, 44, 1.6), 'butter', 1) + face(32, 33, 0.7),
  carrot: P('M24 22c5-4 12-3 15 1s1 10-4 15L18 54c-2 1-4-1-3-3z', 'orange') + P('M36 20c-2-6 0-10 4-12M38 22c4-4 9-4 12-2M37 20c1-6 6-8 10-7', 'none') + `<path d="M24 34l4 2M21 41l4 2" fill="none"/>` + face(30, 29, 0.7),
  soup: P('M8 30h48c0 13-10 22-24 22S8 43 8 30z', 'orange') + E(32, 30, 24, 6, 'butter') + D(C(24, 30, 2.5) + C(36, 29, 2), 'green', 1) + `<path d="M24 22c-2-3 2-5 0-8M34 22c-2-3 2-5 0-8" fill="none" opacity=".6"/>` + face(32, 41, 0.8),
  sandwich: P('M8 42L32 14l24 28z', 'tan') + P('M10 40c7 3 15-2 22 1s15-1 22-1', 'none') + P('M12 38h40l-2 5H14z', 'green') + P('M8 42h48v6H8z', 'tan') + face(32, 32, 0.7),

  // ---- Pond life
  fish: P('M10 32c8-12 22-14 32-8l10-8v32l-10-8c-10 6-24 4-32-8z', 'blue') + `<path d="M30 24c3 5 3 11 0 16" fill="none"/>` + dot(20, 30, 2.4) + shine(20, 26, 4, 2),
  goldfish: P('M10 32c8-11 20-13 28-8l14-10-4 18 4 18-14-10c-8 5-20 3-28-8z', 'orange') + P('M28 22l6-8 4 10', 'orange') + dot(19, 30, 2.4) + shine(19, 26, 4, 2),
  carp: P('M8 34c8-12 22-14 32-8l12-8v30l-12-8c-10 6-24 4-32-6z', 'white') + D(E(28, 30, 6, 5, 'red') + E(38, 36, 4, 3, 'red') + E(22, 37, 3, 2.5, 'orange'), 'red', 0.9) + dot(17, 32, 2.4) + `<path d="M12 37c-4 1-6 4-6 6M14 38c-2 3-2 6 0 8" fill="none"/>`,
  catfish: P('M8 34c8-10 22-12 32-6l12-8v28l-12-8c-10 6-24 4-32-6z', 'dgray') + dot(17, 31, 2.4) + `<path d="M10 34c-3 3-5 3-7 2M11 36c-2 4-4 6-6 6M12 32c-3-2-5-2-7-1" fill="none"/>` + shine(22, 28, 4, 2),
  trout: P('M8 32c8-11 22-13 32-7l12-9v32l-12-9c-10 6-24 4-32-7z', 'mint') + D(P('M14 34c10 3 20 3 28-2', 'none'), 'pink', 1) + `<path d="M14 34c10 3 20 3 28-2" stroke="${PAL.pink}" stroke-width="4" fill="none" opacity=".9"/>` + D(C(26, 27, 1.5, K) + C(32, 26, 1.5) + C(36, 29, 1.5), K, 0.6) + dot(17, 30, 2.4),
  crab: E(32, 38, 17, 11, 'red') + C(12, 22, 7, 'red') + C(52, 22, 7, 'red') + `<path d="M14 30l6 4M50 30l-6 4M16 46l-6 4M48 46l6 4M20 48l-4 6M44 48l4 6" fill="none"/>` + `<path d="M26 28v-6M38 28v-6" fill="none"/>` + C(26, 20, 3, 'white') + C(38, 20, 3, 'white') + dot(26, 20, 1.4) + dot(38, 20, 1.4) + `<path d="M29 40q3 3 6 0" fill="none"/>`,
  turtle: E(32, 34, 18, 12, 'green') + P('M20 30l12-6 12 6-2 10H22z', 'dgreen') + C(53, 32, 6, 'mint') + E(18, 46, 5, 3, 'mint') + E(44, 46, 5, 3, 'mint') + dot(55, 31, 1.6) + shine(26, 28, 4, 2),
  frog: E(32, 40, 20, 14, 'green') + C(20, 22, 8, 'green') + C(44, 22, 8, 'green') + C(20, 22, 4, 'white') + C(44, 22, 4, 'white') + dot(20, 22, 2) + dot(44, 22, 2) + `<path d="M24 40q8 6 16 0" fill="none"/>` + D(E(18, 44, 3, 2, 'pink') + E(46, 44, 3, 2, 'pink'), 'pink', 0.9),
  shrimp: P('M46 16c-14 0-28 8-28 22 0 8 6 14 12 14 4 0 6-4 4-7-3-4-8-3-8-8 0-6 10-12 20-12z', 'pink') + `<path d="M26 32l6-4M24 40l6-2M30 22l2 6" fill="none"/>` + P('M28 52l-8 4 4-8', 'pink') + `<path d="M46 16c4-4 8-6 12-6M46 18c4 0 8 2 10 4" fill="none"/>` + dot(42, 20, 2),
  boot: P('M22 10h16v26l12 6c4 2 6 6 6 10H14V14c0-2 2-4 4-4z', 'dbrown') + P('M14 46h42v6H14z', 'black') + `<path d="M22 20h16M22 27h16" fill="none"/>` + D(C(46, 30, 2.5) + C(52, 22, 2) + C(48, 14, 1.6), 'water', 1),

  // ---- Nature
  flower: [0, 72, 144, 216, 288].map((a) => C(32 + 11 * Math.cos(((a - 90) * Math.PI) / 180), 28 + 11 * Math.sin(((a - 90) * Math.PI) / 180), 8, 'pink')).join('') + C(32, 28, 7, 'yellow') + `<path d="M32 40v16" fill="none"/>` + E(40, 50, 6, 3, 'green', -30),
  tree: R(28, 38, 8, 16, 3, 'dbrown') + C(32, 26, 16, 'green') + C(20, 32, 9, 'green') + C(44, 32, 9, 'green') + D(C(26, 20, 4) + C(38, 24, 3), '#fff', 0.35) + face(32, 30, 0.75),
  mushroom: P('M10 34c0-12 10-22 22-22s22 10 22 22z', 'red') + R(24, 34, 16, 18, 7, 'cream') + D(C(22, 26, 3.5) + C(36, 20, 3) + C(44, 29, 3), '#fff', 1) + face(32, 42, 0.75),
  leaf: P('M12 52C12 30 26 12 52 12c0 26-18 40-40 40z', 'orange') + `<path d="M12 52L40 24M24 40h10M30 34l-2-10" fill="none"/>`,
  bird: P('M12 38c0-12 10-20 22-20 8 0 14 4 16 10l8 2-8 4c-2 10-10 16-20 16-10 0-18-4-18-12z', 'sky') + P('M24 34c4 6 12 6 16 0', 'blue') + dot(38, 26, 2.2) + P('M50 28l8 2-8 4z', 'orange'),
  butterfly: E(20, 24, 11, 9, 'purple', -20) + E(44, 24, 11, 9, 'purple', 20) + E(22, 42, 8, 7, 'pink', 20) + E(42, 42, 8, 7, 'pink', -20) + R(29, 20, 6, 28, 3, 'dbrown') + `<path d="M30 20c-2-5-5-8-8-9M34 20c2-5 5-8 8-9" fill="none"/>`,
  star: P('M32 8l7 15 16 2-12 11 3 16-14-8-14 8 3-16L9 25l16-2z', 'yellow') + face(32, 33, 0.8),
  moon: P('M40 10a22 22 0 1 0 14 34A18 18 0 0 1 40 10z', 'butter') + face(30, 34, 0.8),
  sun: [0, 45, 90, 135, 180, 225, 270, 315].map((a) => { const r = (a * Math.PI) / 180; return `<path d="M${32 + 18 * Math.cos(r)} ${32 + 18 * Math.sin(r)}L${32 + 26 * Math.cos(r)} ${32 + 26 * Math.sin(r)}" fill="none" stroke="${PAL.orange}" stroke-width="4"/>`; }).join('') + C(32, 32, 14, 'yellow') + face(32, 33, 0.8),
  rain: P('M16 34a10 10 0 0 1 4-19 14 14 0 0 1 26 3 9 9 0 0 1 2 16z', 'white') + `<path d="M22 42l-3 8M32 42l-3 8M42 42l-3 8" fill="none" stroke="${PAL.blue}" stroke-width="4"/>`,
  snow: [0, 60, 120].map((a) => `<path d="M32 32l${16 * Math.cos((a * Math.PI) / 180)} ${16 * Math.sin((a * Math.PI) / 180)}M32 32l${-16 * Math.cos((a * Math.PI) / 180)} ${-16 * Math.sin((a * Math.PI) / 180)}" stroke="${PAL.sky}" stroke-width="5" fill="none"/>`).join('') + C(32, 32, 6, 'white'),
  cloud: P('M14 44a11 11 0 0 1 3-21 15 15 0 0 1 28 2 10 10 0 0 1 4 19z', 'white') + face(32, 36, 0.75),

  // ---- Objects
  key: C(20, 30, 11, 'yellow') + C(20, 30, 4, 'white') + P('M30 28h24v6h-4v6h-6v-6h-6v-6z', 'yellow') + shine(16, 24, 3, 2),
  book: P('M8 16c8-4 16-4 24 2 8-6 16-6 24-2v34c-8-4-16-4-24 2-8-6-16-6-24-2z', 'red') + P('M12 18c6-3 13-3 20 2v32c-7-5-14-5-20-2z', 'cream') + P('M52 18c-6-3-13-3-20 2v32c7-5 14-5 20-2z', 'cream') + `<path d="M16 26h10M16 32h10M38 26h10M38 32h10" fill="none" opacity=".5"/>`,
  umbrella: P('M8 32C8 18 19 10 32 10s24 8 24 22c-4-3-8-3-12 0-4-3-8-3-12 0-4-3-8-3-12 0-4-3-8-3-12 0z', 'red') + P('M20 32C20 20 25 12 32 10 39 12 44 20 44 32', 'none') + `<path d="M32 32v16c0 4 6 4 6 0" fill="none"/>`,
  letter: R(8, 16, 48, 32, 6, 'cream') + P('M10 20l22 14 22-14', 'none') + P('M32 31c-2-3-7-2-6 2 1 3 6 5 6 5s5-2 6-5c1-4-4-5-6-2z', 'red'),
  rod: `<path d="M12 54L48 10" stroke-width="5" fill="none" stroke="${PAL.dbrown}"/><path d="M12 54L48 10" fill="none" stroke-width="1.2" stroke="${K}" opacity=".3"/>` + `<path d="M48 10c4 8 6 18 4 28" fill="none" stroke-width="1.6"/>` + C(52, 42, 4, 'red') + C(18, 46, 5, 'gray'),
  coin: C(32, 32, 20, 'yellow') + C(32, 32, 14, 'butter') + P('M32 22c1 6 3 8 9 10-6 2-8 4-9 10-1-6-3-8-9-10 6-2 8-4 9-10z', 'yellow') + shine(24, 22),

  // ---- Places
  cafe: P('M12 30h40v22H12z', 'cream') + P('M8 30l6-14h36l6 14z', 'pink') + `<path d="M8 30c4 4 8 4 12 0 4 4 8 4 12 0 4 4 8 4 12 0 4 4 8 4 12 0" fill="${PAL.white}"/>` + R(27, 38, 10, 14, 3, 'brown') + C(32, 12, 4, 'red'),
  store: P('M12 30h40v22H12z', 'cream') + P('M8 30l6-14h36l6 14z', 'mint') + `<path d="M8 30c4 4 8 4 12 0 4 4 8 4 12 0 4 4 8 4 12 0 4 4 8 4 12 0" fill="${PAL.white}"/>` + R(16, 37, 12, 10, 2, 'sky') + R(34, 37, 12, 15, 3, 'blue'),
  house: P('M12 30L32 12l20 18v22H12z', 'cream') + P('M8 32L32 10l24 22', 'none') + P('M6 32L32 8l26 24-4 4-22-20-22 20z', 'blue') + R(27, 38, 10, 14, 3, 'red') + R(16, 36, 7, 7, 2, 'butter') + R(41, 36, 7, 7, 2, 'butter'),
  garden: R(8, 40, 48, 12, 5, 'dbrown') + [16, 32, 48].map((x, i) => `<path d="M${x} 40V${26 + i % 2 * 4}" fill="none"/>` + C(x, 24 + (i % 2) * 4, 6, ['pink', 'yellow', 'purple'][i])).join(''),
  plaza: E(32, 44, 24, 9, 'gray') + R(20, 26, 24, 18, 4, 'cream') + E(32, 26, 12, 4, 'sky') + `<path d="M32 22V12" fill="none"/>` + C(32, 11, 3, 'sky'),
  fountain: E(32, 46, 24, 8, 'gray') + E(32, 44, 20, 5, 'water') + R(28, 24, 8, 20, 3, 'cream') + E(32, 24, 12, 4, 'cream') + `<path d="M32 20c-6-8-12-4-14 2M32 20c6-8 12-4 14 2M32 20V10" fill="none" stroke="${PAL.blue}" stroke-width="3.4"/>`,
  forest: P('M20 8l12 20H8z', 'dgreen') + P('M20 18l14 22H6z', 'dgreen') + R(18, 40, 4, 10, 1, 'dbrown') + P('M44 14l10 18H34z', 'green') + P('M44 24l12 20H32z', 'green') + R(42, 44, 4, 8, 1, 'dbrown'),
  bridge: P('M4 44c10-16 46-16 56 0', 'none') + P('M4 44c10-12 46-12 56 0v6H4z', 'brown') + `<path d="M12 36v-8M22 32v-8M32 31v-8M42 32v-8M52 36v-8M8 30c16-10 32-10 48 0" fill="none"/>` + D(P('M4 54h56v6H4z'), 'water', 1),
  pond: E(32, 38, 26, 14, 'water') + E(24, 36, 7, 4, 'green') + C(42, 40, 3, 'pink') + shine(40, 32, 6, 2, 0),

  // ---- Colors (paint blobs)
  ...Object.fromEntries((['red', 'blue', 'yellow', 'green', 'pink', 'white'] as const).map((c) => [c,
    C(32, 32, 17, c) + C(14, 22, 5, c) + C(52, 40, 4, c) + C(20, 52, 3.5, c) + C(50, 14, 3, c) + shine(26, 25, 5, 3)])),

  // ---- Furniture
  chair: R(18, 10, 28, 22, 6, 'brown') + R(14, 32, 36, 8, 4, 'pink') + `<path d="M18 40v14M46 40v14" stroke-width="4" fill="none"/>`,
  table: E(32, 24, 24, 8, 'brown') + R(28, 28, 8, 20, 2, 'dbrown') + E(32, 50, 12, 4, 'dbrown') + C(32, 18, 3, 'red'),
  bed: R(6, 26, 52, 18, 6, 'blue') + R(6, 20, 10, 32, 4, 'brown') + R(16, 22, 14, 8, 4, 'white') + `<path d="M8 52h48" fill="none"/>` + R(48, 34, 10, 18, 3, 'brown'),
  lamp: P('M20 12h24l6 18H14z', 'butter') + `<path d="M32 30v18" fill="none" stroke-width="4"/>` + E(32, 52, 12, 4, 'dbrown') + D(P('M14 30h36l6 10H8z'), 'butter', 0.5),
  plant: P('M20 40h24l-4 14H24z', 'orange') + E(24, 26, 9, 5, 'green', -40) + E(40, 26, 9, 5, 'green', 40) + E(32, 20, 5, 10, 'green') + `<path d="M32 40V26" fill="none"/>`,
  sofa: R(10, 22, 44, 18, 8, 'purple') + R(6, 30, 12, 20, 6, 'purple') + R(46, 30, 12, 20, 6, 'purple') + R(14, 34, 36, 12, 4, 'rose') + `<path d="M12 50v4M52 50v4" fill="none"/>`,
  bookshelf: R(12, 8, 40, 48, 4, 'brown') + `<path d="M12 24h40M12 40h40" fill="none"/>` + R(16, 12, 5, 12, 1, 'red') + R(22, 13, 5, 11, 1, 'blue') + R(29, 12, 5, 12, 1, 'yellow') + R(17, 28, 5, 12, 1, 'green') + R(24, 29, 6, 11, 1, 'purple') + R(40, 44, 6, 12, 1, 'orange'),
  clock: R(18, 6, 28, 52, 8, 'brown') + C(32, 22, 11, 'cream') + `<path d="M32 22v-7M32 22l5 3" fill="none"/>` + C(32, 44, 5, 'yellow'),
  radio: R(8, 22, 48, 30, 8, 'orange') + C(24, 37, 9, 'cream') + R(38, 30, 12, 5, 2, 'cream') + `<path d="M44 22L52 8" fill="none"/>` + C(52, 8, 2.5, 'red') + D(`<circle cx="24" cy="37" r="4"/>`, K, 0.4),
  plush: C(20, 18, 7, 'brown') + C(44, 18, 7, 'brown') + C(32, 30, 16, 'brown') + E(32, 50, 13, 10, 'brown') + E(32, 35, 7, 5, 'tan') + dot(26, 27) + dot(38, 27) + dot(32, 33, 1.8) + D(C(20, 18, 3, 'tan') + C(44, 18, 3, 'tan'), 'tan', 1),
  rug: E(32, 38, 26, 14, 'pink') + E(32, 38, 18, 9, 'cream') + E(32, 38, 9, 4, 'pink') + `<path d="M8 38H4M60 38h-4M10 44l-4 2M54 44l4 2" fill="none"/>`,

  // ---- Clothing
  hat: E(32, 42, 26, 8, 'butter') + P('M18 40c0-14 6-22 14-22s14 8 14 22z', 'butter') + P('M18 36c8 3 20 3 28 0v5c-8 3-20 3-28 0z', 'pink'),
  scarf: P('M12 22c12 8 28 8 40 0l2 10c-14 8-30 8-44 0z', 'red') + P('M38 30l4 22 8-2-4-22', 'red') + `<path d="M40 52l1 4M44 51l1 4M48 50l1 4" fill="none"/>` + `<path d="M20 26l2 6M30 28v6" fill="none" opacity=".4"/>`,
  ribbon: P('M32 32L10 18v28z', 'pink') + P('M32 32l22-14v28z', 'pink') + C(32, 32, 6, 'red') + P('M28 36l-6 16 6-2 4 6 2-18', 'pink'),
  glasses: C(20, 34, 10, 'sky') + C(44, 34, 10, 'sky') + `<path d="M30 33q2-3 4 0M10 32L4 26M54 32l6-6" fill="none"/>` + shine(17, 30, 3, 2),
  cap: P('M12 38c0-14 9-24 20-24s20 10 20 24z', 'blue') + P('M30 38h30c0 4-6 6-14 6H30z', 'navy') + C(32, 14, 3, 'navy'),
  crown: P('M10 46l-2-28 12 10 12-16 12 16 12-10-2 28z', 'yellow') + R(10, 44, 44, 8, 3, 'yellow') + C(32, 34, 4, 'red') + C(20, 38, 3, 'blue') + C(44, 38, 3, 'green'),

  // ---- Describing words
  happy: C(32, 32, 22, 'butter') + `<path d="M22 28q4-5 8 0M34 28q4-5 8 0M22 38q10 10 20 0" fill="none"/>` + D(E(18, 38, 4, 2.6, 'pink') + E(46, 38, 4, 2.6, 'pink'), 'pink', 0.9),
  sleepy: C(32, 32, 22, 'butter') + `<path d="M21 30h9M34 30h9M28 40q4 3 8 0" fill="none"/>` + `<text x="46" y="18" font-size="12" font-weight="700" fill="${K}" stroke="none">z</text><text x="52" y="10" font-size="9" font-weight="700" fill="${K}" stroke="none">z</text>`,
  delicious: C(32, 32, 22, 'butter') + `<path d="M21 28q4-4 8 0M35 28q4-4 8 0M22 38q10 8 20 0" fill="none"/>` + P('M36 40c2 6 8 6 8 0', 'pink'),
  cute: C(32, 32, 22, 'butter') + P('M25 26c-2-3-6-2-5 1 1 3 5 5 5 5s4-2 5-5c1-3-3-4-5-1z', 'red') + P('M39 26c-2-3-6-2-5 1 1 3 5 5 5 5s4-2 5-5c1-3-3-4-5-1z', 'red') + `<path d="M27 40q5 4 10 0" fill="none"/>`,
  big: E(30, 36, 22, 16, 'gray') + C(48, 28, 10, 'gray') + P('M54 32c6 2 6 12 2 16', 'none') + dot(48, 26) + R(14, 46, 6, 10, 3, 'gray') + R(36, 46, 6, 10, 3, 'gray'),
  small: E(32, 40, 14, 10, 'gray') + C(22, 30, 6, 'pink') + C(42, 30, 6, 'pink') + C(32, 34, 9, 'gray') + dot(29, 33, 1.6) + dot(35, 33, 1.6) + `<path d="M46 42c6 0 8 4 6 8" fill="none"/>`,
  hot: P('M32 8c4 10 16 14 16 28a16 16 0 0 1-32 0c0-8 6-10 8-18 4 6 6 8 8 4 0-4-2-8 0-14z', 'orange') + P('M32 30c2 6 8 8 8 14a8 8 0 0 1-16 0c0-4 4-6 4-10 2 2 4 2 4-4z', 'yellow'),
  cold: R(14, 14, 36, 36, 8, 'sky') + R(20, 20, 24, 24, 5, 'white') + shine(24, 22, 5, 3) + face(32, 36, 0.75),

  // ---- Actions
  eat: C(32, 32, 20, 'white') + C(32, 32, 12, 'cream') + `<path d="M8 12v14c0 3 2 4 3 4v24M14 12v12M50 12c-4 4-4 14 0 18v24" fill="none"/>`,
  drink: P('M18 18h28l-4 34H22z', 'sky') + P('M20 30h24l-2 22H22z', 'orange') + `<path d="M36 18l6-12" fill="none" stroke-width="4"/>`,
  go_fishing: '',
  walk: P('M18 46c-6 0-8-8-4-14s10-4 10 4-2 10-6 10zM40 30c-6 0-8-8-4-14s10-4 10 4-2 10-6 10z', 'tan') + D(C(14, 48, 2.5, K) + C(18, 52, 2) + C(36, 32, 2.5) + C(40, 36, 2), K, 0.5),
  read: '',
  sleep: C(28, 36, 16, 'butter') + `<path d="M20 34h6M30 34h6M24 42q4 2 8 0" fill="none"/>` + `<text x="40" y="22" font-size="14" font-weight="700" fill="${K}" stroke="none">Z</text><text x="50" y="12" font-size="10" font-weight="700" fill="${K}" stroke="none">z</text>`,

  // ---- Interface
  notebook: R(12, 8, 40, 48, 6, 'green') + R(18, 8, 4, 48, 0, 'dgreen') + R(26, 16, 20, 12, 3, 'cream') + `<path d="M30 21h12M30 25h8" fill="none" opacity=".5"/>` + P('M40 56v6l4-3 4 3v-6', 'red'),
  quest: C(32, 32, 22, 'butter') + R(28, 14, 8, 22, 4, 'red') + C(32, 46, 4.5, 'red'),
  chat: P('M10 16c0-4 3-6 6-6h32c3 0 6 2 6 6v20c0 4-3 6-6 6H28l-12 10v-10h0c-3 0-6-2-6-6z', 'white') + dot(22, 26, 2.6) + dot(32, 26, 2.6) + dot(42, 26, 2.6),
  gift: R(10, 26, 44, 28, 4, 'pink') + R(8, 18, 48, 10, 3, 'rose') + R(28, 18, 8, 36, 0, 'red') + P('M32 18c-8-12-18-6-12 0M32 18c8-12 18-6 12 0', 'none'),
  shop: P('M14 22h36l-4 32H18z', 'mint') + P('M24 22c0-12 16-12 16 0', 'none') + face(32, 38, 0.8),
  order: P('M16 34h32l-4 18H20z', 'pink') + P('M14 34c0-12 8-18 18-18s18 6 18 18z', 'cream') + C(32, 14, 4, 'red') + D(C(24, 26, 1.6) + C(38, 24, 1.6) + C(32, 28, 1.6), 'red', 1),
  sell: P('M18 22c-6 6-8 14-8 20 0 8 8 12 22 12s22-4 22-12c0-6-2-14-8-20z', 'tan') + P('M22 22l-4-10h28l-4 10z', 'tan') + C(32, 40, 8, 'yellow') + `<path d="M22 22h20" fill="none"/>`,
  bye: P('M24 54c-8-4-12-14-10-22l2-14c0-3 5-3 5 0v10l2-16c0-3 5-3 5 0v14l2-16c0-3 5-3 5 0v16l2-12c0-3 5-3 5 0v20c0 12-8 22-18 20z', 'tan') + `<path d="M50 14c3 2 5 5 5 8M54 10c4 3 6 7 6 12" fill="none" opacity=".6"/>`,
  home: '',
  notice: R(12, 12, 40, 32, 4, 'brown') + R(16, 16, 15, 20, 2, 'cream') + R(34, 18, 14, 12, 2, 'rose') + `<path d="M20 52V44M44 52V44" stroke-width="4" fill="none"/>` + C(23, 16, 2.4, 'red'),
  pickup: P('M18 34c-2-8 6-10 8-4l2 4V16c0-3 5-3 5 0v14-18c0-3 5-3 5 0v18-14c0-3 5-3 5 0v16-10c0-3 5-3 5 0v18c0 12-8 20-18 18-6-1-10-6-12-12z', 'tan') + D(C(48, 12, 2) + C(54, 18, 1.6), 'yellow', 1),
  sit: R(10, 28, 44, 8, 3, 'brown') + R(10, 16, 44, 10, 3, 'brown') + `<path d="M16 36v14M48 36v14" stroke-width="4" fill="none"/>`,
  stand: C(32, 14, 7, 'tan') + P('M24 24h16l-2 14h-12z', 'blue') + `<path d="M28 38l-2 16M36 38l2 16M24 26l-6 10M40 26l6 10" stroke-width="4" fill="none"/>`,
  door: R(16, 8, 32, 48, 6, 'red') + C(40, 34, 3, 'yellow') + R(22, 14, 20, 12, 3, 'rose') + `<path d="M8 56h48" fill="none"/>`,
  map: P('M8 14l14-4 20 6 14-4v38l-14 4-20-6-14 4z', 'cream') + `<path d="M22 10v38M42 16v38" fill="none"/>` + P('M28 26c0-4 3-6 6-6s6 2 6 6c0 5-6 10-6 10s-6-5-6-10z', 'red') + `<path d="M12 40c6-4 10 4 16 0" fill="none" stroke="${PAL.green}" stroke-width="3"/>`,
  pass: R(8, 16, 48, 32, 6, 'yellow') + `<path d="M40 16v32" stroke-dasharray="3 4" fill="none"/>` + P('M24 22l3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1z', 'white') + C(8, 32, 4, 'cream') + C(56, 32, 4, 'cream'),
  lock: R(14, 28, 36, 26, 6, 'yellow') + P('M22 28v-6c0-14 20-14 20 0v6', 'none') + C(32, 40, 4, K) + `<path d="M32 42v5" fill="none"/>`,
  heart: P('M32 52S8 38 8 22c0-8 6-12 12-12 5 0 9 3 12 8 3-5 7-8 12-8 6 0 12 4 12 12 0 16-24 30-24 30z', 'red') + shine(20, 20),
  heartEmpty: P('M32 52S8 38 8 22c0-8 6-12 12-12 5 0 9 3 12 8 3-5 7-8 12-8 6 0 12 4 12 12 0 16-24 30-24 30z', 'cream'),
  sparkle: P('M32 6c2 14 6 18 20 20-14 2-18 6-20 20-2-14-6-18-20-20 14-2 18-6 20-20z', 'yellow') + P('M50 40c1 6 3 8 8 9-5 1-7 3-8 8-1-5-3-7-8-8 5-1 7-3 8-9z', 'butter'),
  speaker: P('M10 24h10l14-12v40L20 40H10z', 'cream') + `<path d="M42 22c4 4 4 16 0 20M48 16c8 8 8 24 0 32" fill="none"/>`,
  hint: '',
  eye: P('M6 32c8-12 16-18 26-18s18 6 26 18c-8 12-16 18-26 18S14 44 6 32z', 'white') + C(32, 32, 9, 'blue') + dot(32, 32, 4) + shine(29, 28, 2, 1.4, 0),
  check: C(32, 32, 22, 'green') + `<path d="M21 33l7 7 15-16" fill="none" stroke="${PAL.white}" stroke-width="5"/>`,
  clock2: C(32, 32, 22, 'cream') + `<path d="M32 32V18M32 32l9 6" fill="none"/>`,
  zzz: `<text x="10" y="44" font-size="30" font-weight="800" fill="${PAL.sky}" stroke="${K}" stroke-width="2">Z</text><text x="34" y="30" font-size="20" font-weight="800" fill="${PAL.sky}" stroke="${K}" stroke-width="1.6">z</text><text x="48" y="18" font-size="13" font-weight="800" fill="${PAL.sky}" stroke="${K}" stroke-width="1.2">z</text>`,
  music: P('M22 44V16l26-6v28', 'none') + E(18, 46, 7, 5, 'purple', -20) + E(44, 40, 7, 5, 'purple', -20) + P('M22 16l26-6v8l-26 6z', 'purple'),
  bell: P('M32 8c-10 0-16 8-16 18v12l-6 6h44l-6-6V26c0-10-6-18-16-18z', 'yellow') + C(32, 50, 5, 'orange') + shine(26, 20),
  voice: P('M10 16c0-4 3-6 6-6h32c3 0 6 2 6 6v20c0 4-3 6-6 6H28l-12 10v-10c-3 0-6-2-6-6z', 'pink') + `<path d="M20 26q3-6 6 0t6 0 6 0 6 0" fill="none"/>`,
  turtleSlow: E(32, 36, 18, 12, 'green') + C(53, 34, 6, 'mint') + dot(55, 33, 1.6) + E(20, 47, 5, 3, 'mint') + E(42, 47, 5, 3, 'mint') + P('M20 32l12-6 12 6-2 8H22z', 'dgreen'),
  pencil: P('M14 50l4-12 26-26 8 8-26 26z', 'yellow') + P('M14 50l4-12 8 8z', 'tan') + P('M40 16l8 8 4-4c2-2 2-4 0-6l-2-2c-2-2-4-2-6 0z', 'pink'),
  textsize: `<text x="6" y="48" font-size="34" font-weight="800" fill="${PAL.cream}" stroke="${K}" stroke-width="2.4">A</text><text x="36" y="48" font-size="22" font-weight="800" fill="${PAL.cream}" stroke="${K}" stroke-width="2">a</text>`,
  level: R(8, 40, 12, 14, 3, 'green') + R(26, 28, 12, 26, 3, 'yellow') + R(44, 14, 12, 40, 3, 'pink'),
  kana: R(8, 8, 48, 48, 12, 'cream') + `<text x="32" y="44" text-anchor="middle" font-size="30" font-weight="700" fill="${K}" stroke="none">あ</text>`,
  abc: R(8, 8, 48, 48, 12, 'cream') + `<text x="32" y="42" text-anchor="middle" font-size="22" font-weight="800" fill="${K}" stroke="none">Ab</text>`,
  moonTime: '',
  globe: C(32, 32, 22, 'sky') + P('M16 22c6 2 8 8 4 12s-2 10 4 12M40 12c-4 6 2 10 8 10s6 8 2 12', 'none') + D(P('M16 22c6 2 8 8 4 12s-2 10 4 12 0 4-4 0-8-8-8-12 2-10 4-12z'), 'green', 0.9),
  sprout: R(24, 46, 16, 10, 3, 'orange') + `<path d="M32 46V30" fill="none"/>` + E(24, 28, 9, 5, 'green', 30) + E(40, 26, 9, 5, 'green', -30),
  herb: R(24, 46, 16, 10, 3, 'orange') + `<path d="M32 46V18" fill="none"/>` + E(24, 38, 8, 4, 'green', 30) + E(40, 32, 8, 4, 'green', -30) + E(25, 24, 7, 4, 'green', 30) + E(38, 18, 7, 4, 'green', -30),
  medal: P('M20 8h10l4 16h-8zM44 8H34l-4 16h8z', 'blue') + C(32, 40, 15, 'yellow') + P('M32 31l3 6 6 1-4 4 1 6-6-3-6 3 1-6-4-4 6-1z', 'butter'),
  flame: P('M32 8c4 10 16 14 16 28a16 16 0 0 1-32 0c0-8 6-10 8-18 4 6 6 8 8 4 0-4-2-8 0-14z', 'orange') + face(32, 40, 0.75),
  magnifier: C(26, 26, 15, 'sky') + `<path d="M37 37l15 15" stroke-width="7" fill="none" stroke="${PAL.dbrown}"/><path d="M37 37l15 15" fill="none"/>` + shine(21, 21),
  wave: '',
  bag: P('M14 24c0-6 4-10 10-10h16c6 0 10 4 10 10v26c0 3-2 5-5 5H19c-3 0-5-2-5-5z', 'orange') + P('M24 14c0-8 16-8 16 0', 'none') + R(20, 32, 24, 12, 4, 'butter') + `<path d="M32 32v4" fill="none"/>`,
  friends: '',
  me: '',
  scroll: R(14, 12, 36, 40, 4, 'cream') + R(10, 8, 44, 8, 4, 'tan') + R(10, 48, 44, 8, 4, 'tan') + `<path d="M20 24h24M20 31h24M20 38h16" fill="none" opacity=".5"/>`,
  words: '',
  hand: '',
  reel: '',
  log: R(8, 26, 48, 16, 8, 'brown') + E(54, 34, 6, 8, 'tan') + E(54, 34, 3, 4, 'brown') + E(26, 22, 6, 3, 'green', -10),
  sunny: '', cloudy: '', rainy: '', snowy: '',
  seedling: '',
  expand: R(10, 10, 44, 44, 6, 'cream') + `<path d="M18 30V18h12M46 34v12H34M18 18l10 10M46 46L36 36" fill="none"/>`,
  palette: P('M32 8c14 0 24 10 24 22 0 6-4 9-9 9-4 0-6 3-5 7 1 5-3 10-10 10C18 56 8 46 8 32 8 18 18 8 32 8z', 'cream') + C(22, 24, 4, 'red') + C(34, 18, 4, 'yellow') + C(44, 26, 4, 'blue') + C(20, 38, 4, 'green'),
  wallpaper: R(10, 10, 44, 44, 6, 'cream') + `<path d="M20 10v44M32 10v44M44 10v44" fill="none" stroke="${PAL.rose}" stroke-width="5"/>` + R(10, 10, 44, 44, 6, 'none'),
  floor: P('M6 46l14-26h24l14 26z', 'tan') + `<path d="M14 32h36M22 20l-6 26M32 20v26M42 20l6 26" fill="none"/>`,
  rotate: P('M46 22a16 16 0 1 0 4 14', 'none') + P('M44 10l4 14-14-2z', K),
  box: P('M10 22l22-10 22 10v26L32 58 10 48z', 'tan') + P('M10 22l22 10 22-10M32 32v26', 'none') + R(26, 14, 12, 6, 1, 'brown', -24),
  close: `<path d="M18 18l28 28M46 18L18 46" stroke-width="6" fill="none"/>`,
  play: P('M20 12l32 20-32 20z', 'green'),
  hourglass: P('M18 8h28M18 56h28M20 8c0 14 24 14 24 24S20 42 20 56M44 8c0 14-24 14-24 24s24 10 24 24', 'none') + P('M24 18h16c-2 6-8 8-8 8s-6-2-8-8zM24 50c2-6 8-8 8-8s6 2 8 8z', 'yellow'),
  bed2: '',
  ticket: '',

  // ---- Animals (villagers & new towns)
  bear: C(18, 18, 8, 'brown') + C(46, 18, 8, 'brown') + C(32, 34, 20, 'brown') + E(32, 42, 9, 7, 'tan') + dot(25, 32) + dot(39, 32) + dot(32, 40, 2.4) + D(C(18, 18, 3.5, 'tan') + C(46, 18, 3.5), 'tan', 1),
  bunny: E(24, 14, 5, 13, 'white', -8) + E(40, 14, 5, 13, 'white', 10) + D(E(24, 14, 2, 8, 'pink', -8) + E(40, 14, 2, 8, 'pink', 10), 'pink', 1) + C(32, 38, 18, 'white') + dot(25, 36) + dot(39, 36) + P('M30 42h4l-2 2z', 'pink') + D(E(20, 42, 3, 2, 'pink') + E(44, 42, 3, 2, 'pink'), 'pink', 0.9),
  capybara: C(20, 20, 4, 'dbrown') + C(44, 20, 4, 'dbrown') + R(10, 20, 44, 34, 16, 'brown') + R(18, 38, 28, 14, 7, 'dbrown') + dot(23, 32) + dot(41, 32) + dot(29, 44, 1.6) + dot(35, 44, 1.6) + C(36, 12, 5, 'yellow'),
  cat: P('M12 26L14 8l12 10M52 26L50 8 38 18', 'orange') + C(32, 34, 20, 'orange') + dot(25, 32) + dot(39, 32) + P('M30 38h4l-2 2z', 'pink') + `<path d="M14 38h-8M14 42l-7 3M50 38h8M50 42l7 3" fill="none"/>`,
  dog: E(14, 30, 6, 12, 'dbrown', 15) + E(50, 30, 6, 12, 'dbrown', -15) + C(32, 32, 18, 'tan') + E(32, 42, 9, 7, 'cream') + dot(25, 30) + dot(39, 30) + E(32, 38, 3.5, 2.6, K),
  fox: P('M12 30L12 8l14 12M52 30V8L38 20', 'orange') + P('M10 28c0-10 10-16 22-16s22 6 22 16c0 10-10 24-22 24S10 38 10 28z', 'orange') + P('M18 34c4 6 10 14 14 14s10-8 14-14c-6 2-10 0-14 0s-8 2-14 0z', 'white') + dot(24, 28) + dot(40, 28) + dot(32, 44, 2.2),
  raccoon: C(18, 16, 7, 'gray') + C(46, 16, 7, 'gray') + C(32, 34, 20, 'gray') + P('M14 32c6-8 12-6 18 0 6-6 12-8 18 0-6 6-12 6-18 2-6 4-12 4-18-2z', 'dgray') + dot(24, 32) + dot(40, 32) + E(32, 44, 3, 2, K),
  duck: C(32, 26, 14, 'yellow') + E(32, 44, 20, 12, 'yellow') + P('M36 28h14c0 4-6 6-14 4z', 'orange') + dot(30, 22) + E(22, 44, 8, 5, 'butter', -20),
  penguin: E(32, 36, 18, 20, 'navy') + E(32, 40, 12, 15, 'white') + dot(26, 28) + dot(38, 28) + P('M29 34h6l-3 4z', 'orange') + E(24, 56, 5, 2.5, 'orange') + E(40, 56, 5, 2.5, 'orange'),
  otter: C(32, 32, 20, 'brown') + E(32, 40, 11, 8, 'tan') + C(14, 22, 4, 'brown') + C(50, 22, 4, 'brown') + dot(25, 30) + dot(39, 30) + E(32, 37, 3, 2, K) + `<path d="M20 40h-8M20 43l-7 2M44 40h8M44 43l7 2" fill="none" opacity=".6"/>`,
  owl: E(32, 36, 20, 20, 'dbrown') + P('M14 18l8 8M50 18l-8 8', 'none') + C(24, 30, 8, 'cream') + C(40, 30, 8, 'cream') + dot(24, 30, 3) + dot(40, 30, 3) + P('M30 36h4l-2 5z', 'orange') + E(32, 48, 10, 6, 'tan'),
  deer: P('M18 18c-4-6-2-12 2-14M18 12l-6-2M46 18c4-6 2-12-2-14M46 12l6-2', 'none') + E(16, 26, 6, 4, 'brown', -30) + E(48, 26, 6, 4, 'brown', 30) + E(32, 36, 16, 18, 'brown') + E(32, 46, 8, 6, 'tan') + dot(26, 32) + dot(38, 32) + dot(32, 44, 2.4) + D(C(24, 24, 1.8) + C(40, 22, 1.8) + C(36, 28, 1.5), 'cream', 1),
};

// Aliases & composites
ICONS.go_fishing = ICONS.rod;
ICONS.read = ICONS.book;
ICONS.home = ICONS.house;
ICONS.hint = ICONS.lamp;
ICONS.wave = ICONS.bye;
ICONS.hand = ICONS.pickup;
ICONS.reel = ICONS.rod;
ICONS.friends = ICONS.heart;
ICONS.me = ICONS.flower;
ICONS.words = ICONS.book;
ICONS.sunny = ICONS.sun;
ICONS.cloudy = ICONS.cloud;
ICONS.rainy = ICONS.rain;
ICONS.snowy = ICONS.snow;
ICONS.moonTime = ICONS.moon;
ICONS.seedling = ICONS.sprout;
ICONS.bed2 = ICONS.bed;
ICONS.ticket = ICONS.pass;

const svg = (name: string) => {
  const body = ICONS[name] ?? ICONS.sparkle;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><g stroke="${K}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round">${body}</g></svg>`;
};

export const hasIcon = (name: string) => name in ICONS && !!ICONS[name];

/** Inline SVG markup for the DOM. */
export function icon(name: string, cls = ''): string {
  return svg(name).replace('<svg ', `<svg class="ic${cls ? ' ' + cls : ''}" aria-hidden="true" focusable="false" `);
}

/** THREE texture of an icon (optionally on a round cream badge), drawn when the SVG decodes. */
const texCache = new Map<string, THREE.CanvasTexture>();
export function iconTexture(name: string, badge?: string, size = 128): THREE.CanvasTexture {
  const key = name + '|' + (badge ?? '');
  const hit = texCache.get(key);
  if (hit) return hit;
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  const img = new Image();
  img.onload = () => {
    const ctx = c.getContext('2d')!;
    if (badge) {
      ctx.fillStyle = badge;
      ctx.beginPath(); ctx.arc(size / 2, size / 2, size * 0.44, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = 'rgba(91,70,54,.35)'; ctx.lineWidth = size * 0.04; ctx.stroke();
      ctx.drawImage(img, size * 0.18, size * 0.18, size * 0.64, size * 0.64);
    } else ctx.drawImage(img, 0, 0, size, size);
    tex.needsUpdate = true;
  };
  img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg(name));
  texCache.set(key, tex);
  return tex;
}

// ------------------------------------------------------------------ emoji → custom icon
/** Interface emoji used across the code, rendered as custom icons instead. */
const EMOJI: Record<string, string> = {
  '🪙': 'coin', '💛': 'heart', '💖': 'heart', '🤍': 'heartEmpty', '🎣': 'rod', '🔊': 'speaker', '🔇': 'speaker', '👂': 'speaker',
  '💬': 'chat', '🤔': 'chat', '❓': 'chat', '🗨️': 'voice', '🗣️': 'voice', '🌱': 'sprout', '🌿': 'herb', '🌳': 'tree', '🌲': 'forest',
  '🛍️': 'shop', '✨': 'sparkle', '🌟': 'star', '⭐': 'star', '🪑': 'sit', '🧍': 'stand', '❗': 'quest', '🏠': 'house', '🏡': 'house',
  '📰': 'notice', '🎁': 'gift', '🧁': 'order', '👋': 'bye', '💡': 'hint', '📖': 'book', '📜': 'scroll', '🌙': 'moon', '🔥': 'flame',
  '🍵': 'tea', '☕': 'coffee', '🍰': 'cake', '☀️': 'sun', '🌻': 'sun', '⛅': 'cloud', '☁️': 'cloud', '🌧️': 'rain', '❄️': 'snow',
  '🏅': 'medal', '🌷': 'flower', '🌸': 'flower', '🌺': 'flower', '🌼': 'flower', '🍄': 'mushroom', '🪵': 'log', '🎒': 'bag',
  '👒': 'hat', '🔤': 'abc', '👀': 'eye', '🤫': 'eye', '🔎': 'magnifier', '🐢': 'turtleSlow', '🐟': 'fish', '🐠': 'goldfish',
  '🍽️': 'table', '🛋️': 'sofa', '✋': 'pickup', '👆': 'pickup', '🪄': 'palette', '🚪': 'door', '📐': 'expand', '↻': 'rotate',
  '📦': 'box', '🔒': 'lock', '🐱': 'cat', '🦊': 'fox', '🐶': 'dog', '🧵': 'hint', '✔': 'check', '✅': 'check', '🎵': 'music',
  '🔔': 'bell', '✏️': 'pencil', '🔠': 'textsize', '🎚️': 'level', '📒': 'notebook', '💤': 'zzz', '🧸': 'plush', '🗺️': 'map',
  '🎟️': 'pass', '⏳': 'hourglass', 'あ': '', '🔴': 'red',
};
delete EMOJI['あ'];
const EMOJI_RE = new RegExp(Object.keys(EMOJI).sort((a, b) => b.length - a.length).map((k) => k.replace(/️/g, '') .replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '️?').join('|'), 'g');
const bare = (k: string) => k.replace(/️/g, '');
const EMOJI_BARE: Record<string, string> = Object.fromEntries(Object.entries(EMOJI).map(([k, v]) => [bare(k), v]));

/** Icon name for an emoji (or the name itself if it already is one). */
export function iconName(key: string): string | null {
  if (hasIcon(key)) return key;
  return EMOJI_BARE[bare(key)] ?? null;
}

/** Replace known emoji inside HTML with custom icons. */
export function emo(html: string): string {
  return html.replace(EMOJI_RE, (m) => icon(EMOJI_BARE[bare(m)]));
}

const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]!));
/** Plain text → HTML with emoji swapped for icons. Returns null if the text has no emoji. */
export function emoText(text: string): string | null {
  EMOJI_RE.lastIndex = 0;
  if (!EMOJI_RE.test(text) && !text.includes('<svg')) return null;
  if (text.includes('<svg')) return text; // already icon markup
  return emo(esc(text));
}

/** Vocabulary icons share names with their words; swap the emoji in the lexicon for custom icons. */
export function installLexiconIcons(lexicon: { id: string; icon: string }[]) {
  for (const l of lexicon) if (hasIcon(l.id)) l.icon = icon(l.id);
}
