import * as THREE from 'three';
import type { V2 } from '../../content/places';
import { canvas, signTexture, stripes, waterNormal, GRASS, type Season } from '../textures';
import {
  bake, bench, CYL, fence, flower, house, lamp, mesh, rbox, rng, rock, SPH, SPH_SMALL, tree,
  type Collider, type HouseOpts, type Village,
} from '../village';

/**
 * Every Village Pass town shares one street plan (so villager routines and the dojo always sit
 * in the same places) but gets its own look: ground, landmark, buildings, water, edges and props.
 * -Z is north.
 */
export const TOWN_NODES: Record<string, V2> = {
  bus: [0, 19], plazaS: [0, 5], plazaN: [0, -5], plazaW: [-5, 0], plazaE: [5, 0],
  hall: [-11, 3.4], post: [11, 3.4], sw: [-6, 10], se: [6, 10], kitchen: [-11, 15.2], kitchenSide: [-7.6, 15.6],
  market: [10.5, 13], dojo: [4.6, -9.8], park: [9.6, -7.4], parkW: [4, -8], west: [-8.5, -6], westFar: [-16, -6],
};
export const TOWN_EDGES: [string, string][] = [
  ['bus', 'plazaS'], ['plazaS', 'plazaW'], ['plazaS', 'plazaE'], ['plazaN', 'plazaW'], ['plazaN', 'plazaE'],
  ['plazaW', 'hall'], ['plazaE', 'post'], ['plazaS', 'sw'], ['sw', 'kitchen'], ['sw', 'kitchenSide'], ['plazaS', 'se'], ['se', 'market'],
  ['plazaN', 'dojo'], ['plazaN', 'parkW'], ['parkW', 'park'], ['plazaW', 'west'], ['west', 'westFar'],
];
export const TOWN_SPOTS = {
  spawn: [0, 17.5] as V2,
  bus: [1.8, 19.5] as V2,
  dojoDoor: [0, -14.2] as V2,
  pond: { x: 13, z: -14, rx: 5, rz: 3.6 },
};
export const TOWN_BOUNDS = { minX: -24, maxX: 24, minZ: -24, maxZ: 22 };
const WORLD = 80;

export interface Town extends Village {
  nodes: Record<string, V2>;
  edges: [string, string][];
  /** Swings when the finale rings. */
  bell: THREE.Object3D;
  /** Turns slowly all day (windmill, lighthouse lamp, pinwheel…). */
  spinner: { obj: THREE.Object3D; axis: 'y' | 'z'; speed: number };
  bounds: typeof TOWN_BOUNDS;
}

type Colors = Pick<HouseOpts, 'wall' | 'roof' | 'trim' | 'door'>;
interface Theme {
  seed: number;
  season?: Season;
  grass?: [string, string, string];
  patch: 'clover' | 'sand' | 'leaves' | 'snow' | 'paving';
  path: [string, string];
  plaza: [string, string];
  court: string;
  water: 'pond' | 'sea' | 'onsen' | 'pool';
  landmark: 'clock' | 'lighthouse' | 'pagoda' | 'belfry' | 'tower';
  hall: Colors; post: Colors; resto: Colors;
  stalls: [string, string][];
  dojoRoof: string;
  gate: string;
  west: 'fields' | 'docks' | 'nightmarket' | 'library' | 'theater';
  edge: 'trees' | 'maples' | 'snowpines' | 'city';
  strings: number;
  signInk: [string, string, string, string, string];
}

export const THEMES: Record<string, Theme> = {
  clover: {
    seed: 4321, patch: 'clover', path: ['#D9BE8C', '#ECD7AE'], plaza: ['#D9BE8C', '#F4E6C9'], court: '#E9E2D2',
    water: 'pond', landmark: 'clock', west: 'fields', edge: 'trees', strings: 2, dojoRoof: '#3F4A5E', gate: '#C2453B',
    hall: { wall: '#FFF6E9', roof: '#7FB0D9', trim: '#FFFFFF', door: '#5E95C4' },
    post: { wall: '#FBE6D2', roof: '#E5735F', trim: '#FFFFFF', door: '#E8566C' },
    resto: { wall: '#FFF2DC', roof: '#5E8E74', trim: '#FFFFFF', door: '#B98A5E' },
    stalls: [['#F6C343', '#FFF6EE'], ['#F2A7B0', '#FFF6EE'], ['#9ED5BC', '#FFF6EE']],
    signInk: ['#3E6E9E', '#C2453B', '#3E7E5E', '#3F4A5E', '#B9832A'],
  },
  harbor: {
    seed: 812, season: 'summer', grass: ['#B9D99A', '#AACF8B', '#C6E1A9'], patch: 'sand', path: ['#C9A97E', '#E6CFA6'], plaza: ['#B99A72', '#E9D7B8'], court: '#E4DCCB',
    water: 'sea', landmark: 'lighthouse', west: 'docks', edge: 'trees', strings: 2, dojoRoof: '#2F5E7E', gate: '#2F5E7E',
    hall: { wall: '#F4F8FA', roof: '#3E7FA8', trim: '#FFFFFF', door: '#2F5E7E' },
    post: { wall: '#FFF3E6', roof: '#E5735F', trim: '#FFFFFF', door: '#C2453B' },
    resto: { wall: '#FDF0D8', roof: '#F2A23D', trim: '#FFFFFF', door: '#8A5A3B' },
    stalls: [['#5E95C4', '#FFFFFF'], ['#E5735F', '#FFFFFF'], ['#7DC3C9', '#FFFFFF']],
    signInk: ['#2F5E7E', '#C2453B', '#B9622A', '#2F5E7E', '#2F7E8E'],
  },
  lantern: {
    seed: 3301, season: 'autumn', grass: ['#B7B778', '#A7A86A', '#C6C287'], patch: 'leaves', path: ['#B08A62', '#D7B88E'], plaza: ['#9E7A55', '#DCC4A0'], court: '#E2D8C6',
    water: 'pond', landmark: 'pagoda', west: 'nightmarket', edge: 'maples', strings: 5, dojoRoof: '#5A3A3A', gate: '#C2453B',
    hall: { wall: '#FBEFDF', roof: '#6E4A4A', trim: '#F5E6D0', door: '#8A3B32' },
    post: { wall: '#FFF1E0', roof: '#B5523F', trim: '#F5E6D0', door: '#C2453B' },
    resto: { wall: '#FBE9D3', roof: '#4E5E4A', trim: '#F5E6D0', door: '#7A4E36' },
    stalls: [['#C2453B', '#FBE3B4'], ['#E9A92A', '#FFF1D6'], ['#7A4E8E', '#F5DDF0']],
    signInk: ['#6E2E2E', '#B5523F', '#4E5E4A', '#5A3A3A', '#B9622A'],
  },
  snowcap: {
    seed: 1919, season: 'winter', grass: ['#EEF3F6', '#E2EAEE', '#F7FAFB'], patch: 'snow', path: ['#C9C3BA', '#DDD8D0'], plaza: ['#BFB8AE', '#E3DED6'], court: '#D9D4CB',
    water: 'onsen', landmark: 'belfry', west: 'library', edge: 'snowpines', strings: 2, dojoRoof: '#4A4E5E', gate: '#9E3B32',
    hall: { wall: '#F3E3CC', roof: '#F6F8FA', trim: '#8A5A3B', door: '#6E4A3A' },
    post: { wall: '#EFD9C2', roof: '#F6F8FA', trim: '#8A5A3B', door: '#B5523F' },
    resto: { wall: '#F5E2C8', roof: '#F6F8FA', trim: '#8A5A3B', door: '#5E6E4A' },
    stalls: [['#9E3B32', '#F6F8FA'], ['#5E6E8E', '#F6F8FA'], ['#E9A92A', '#F6F8FA']],
    signInk: ['#6E4A3A', '#9E3B32', '#4E5E4A', '#4A4E5E', '#7A4E36'],
  },
  starlight: {
    seed: 7070, season: 'summer', grass: ['#A7C79A', '#9BBE8C', '#B4D1A7'], patch: 'paving', path: ['#B7B2C2', '#D6D2DE'], plaza: ['#A8A2B6', '#E3DFEA'], court: '#E2DFE6',
    water: 'pool', landmark: 'tower', west: 'theater', edge: 'city', strings: 3, dojoRoof: '#3A3550', gate: '#C2453B',
    hall: { wall: '#EDEAF2', roof: '#5E5A7A', trim: '#FFFFFF', door: '#3A3550' },
    post: { wall: '#F4EEE6', roof: '#C2453B', trim: '#FFFFFF', door: '#8E2E2E' },
    resto: { wall: '#F2ECF6', roof: '#7A5E9E', trim: '#FFFFFF', door: '#4E3A6E' },
    stalls: [['#B6A3D9', '#FFFFFF'], ['#F2A7B0', '#FFFFFF'], ['#7DC3C9', '#FFFFFF']],
    signInk: ['#3A3550', '#8E2E2E', '#4E3A6E', '#3A3550', '#5E5A7A'],
  },
};

// ------------------------------------------------------------------ ground
function paintGround(th: Theme, season: Season) {
  const px = 1536;
  const [c, ctx] = canvas(px);
  const k = px / WORLD, W = (x: number) => (x + WORLD / 2) * k;
  const r = rng(th.seed + 1);
  const [g0, g1, g2] = th.grass ?? GRASS[season];
  ctx.fillStyle = g0; ctx.fillRect(0, 0, px, px);
  for (let i = 0; i < 1800; i++) {
    ctx.fillStyle = r() < 0.5 ? g1 : g2; ctx.globalAlpha = 0.25 + r() * 0.3;
    ctx.beginPath(); ctx.ellipse(r() * px, r() * px, 6 + r() * 26, 4 + r() * 16, r() * 3, 0, Math.PI * 2); ctx.fill();
  }
  ctx.globalAlpha = 0.5;
  if (th.patch === 'clover') for (let i = 0; i < 500; i++) { ctx.fillStyle = r() < 0.5 ? '#8CC77A' : '#A6D58E'; const x = r() * px, y = r() * px; for (let j = 0; j < 3; j++) { ctx.beginPath(); ctx.arc(x + Math.cos(j * 2.1) * 4, y + Math.sin(j * 2.1) * 4, 4, 0, 7); ctx.fill(); } }
  if (th.patch === 'leaves') for (let i = 0; i < 900; i++) { ctx.fillStyle = ['#D9822B', '#C2453B', '#E9A92A', '#B5523F'][Math.floor(r() * 4)]; ctx.beginPath(); ctx.ellipse(r() * px, r() * px, 5, 3, r() * 3, 0, 7); ctx.fill(); }
  if (th.patch === 'snow') for (let i = 0; i < 600; i++) { ctx.fillStyle = r() < 0.5 ? '#FFFFFF' : '#D7E2E8'; ctx.beginPath(); ctx.ellipse(r() * px, r() * px, 10 + r() * 30, 6 + r() * 14, r() * 3, 0, 7); ctx.fill(); }
  if (th.patch === 'sand') for (let i = 0; i < 700; i++) { ctx.fillStyle = r() < 0.5 ? '#E8D8B0' : '#D9C79A'; ctx.beginPath(); ctx.arc(r() * px, r() * px, 2 + r() * 3, 0, 7); ctx.fill(); }
  ctx.globalAlpha = 1;
  if (th.patch === 'paving') {
    // city blocks: paved squares with grass verges
    ctx.fillStyle = '#CFCAD8';
    ctx.fillRect(W(-24), W(-24), 48 * k, 46 * k);
    ctx.strokeStyle = 'rgba(120,110,140,.25)'; ctx.lineWidth = 2;
    for (let x = -24; x <= 24; x += 1.5) { ctx.beginPath(); ctx.moveTo(W(x), W(-24)); ctx.lineTo(W(x), W(22)); ctx.stroke(); }
    for (let z = -24; z <= 22; z += 1.5) { ctx.beginPath(); ctx.moveTo(W(-24), W(z)); ctx.lineTo(W(24), W(z)); ctx.stroke(); }
  }
  const drawPaths = (w: number, col: string) => {
    ctx.strokeStyle = col; ctx.lineWidth = w * k; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    for (const [a, b] of TOWN_EDGES) {
      const A = TOWN_NODES[a], B = TOWN_NODES[b];
      ctx.beginPath(); ctx.moveTo(W(A[0]), W(A[1])); ctx.lineTo(W(B[0]), W(B[1])); ctx.stroke();
    }
    ctx.beginPath(); ctx.moveTo(W(0), W(19)); ctx.lineTo(W(0), W(40)); ctx.stroke();
  };
  drawPaths(2.6, th.path[0]); drawPaths(2.1, th.path[1]);
  ctx.fillStyle = th.plaza[0]; ctx.beginPath(); ctx.arc(W(0), W(0), 7.6 * k, 0, 7); ctx.fill();
  ctx.fillStyle = th.plaza[1]; ctx.beginPath(); ctx.arc(W(0), W(0), 7.2 * k, 0, 7); ctx.fill();
  ctx.strokeStyle = 'rgba(120,100,80,.25)'; ctx.lineWidth = 2;
  for (let i = 0; i < 16; i++) { const a = (i / 16) * Math.PI * 2; ctx.beginPath(); ctx.moveTo(W(0) + Math.cos(a) * 2.2 * k, W(0) + Math.sin(a) * 2.2 * k); ctx.lineTo(W(0) + Math.cos(a) * 7.2 * k, W(0) + Math.sin(a) * 7.2 * k); ctx.stroke(); }
  // dojo courtyard (raked gravel)
  ctx.fillStyle = th.court; ctx.beginPath(); (ctx as any).roundRect(W(-5), W(-21), 10 * k, 9.5 * k, 2 * k); ctx.fill();
  ctx.strokeStyle = 'rgba(160,150,130,.4)'; for (let y = -20.5; y < -12; y += 0.6) { ctx.beginPath(); ctx.moveTo(W(-4.6), W(y)); ctx.lineTo(W(4.6), W(y)); ctx.stroke(); }
  // water banks
  const p = TOWN_SPOTS.pond;
  if (th.water === 'pond' || th.water === 'onsen') {
    ctx.fillStyle = th.water === 'onsen' ? '#B9B2A6' : '#E5D3A8'; ctx.beginPath(); ctx.ellipse(W(p.x), W(p.z), (p.rx + 0.9) * k, (p.rz + 0.9) * k, 0, 0, 7); ctx.fill();
  }
  if (th.water === 'pool') { ctx.fillStyle = '#B7B2C2'; ctx.fillRect(W(p.x - p.rx - 0.8), W(p.z - p.rz - 0.8), (p.rx + 0.8) * 2 * k, (p.rz + 0.8) * 2 * k); }
  if (th.water === 'sea') {
    ctx.fillStyle = '#E8D8B0'; ctx.fillRect(W(15), W(-40), 4 * k, 80 * k); // beach
  }
  if (th.west === 'fields') {
    ctx.fillStyle = season === 'winter' ? '#DDE6EA' : '#C9DE8E';
    for (let i = 0; i < 4; i++) { ctx.beginPath(); (ctx as any).roundRect(W(-22), W(-18 + i * 4.2), 9 * k, 3.4 * k, 1 * k); ctx.fill(); }
  } else {
    ctx.fillStyle = th.plaza[1]; ctx.beginPath(); (ctx as any).roundRect(W(-22), W(-19), 10 * k, 16 * k, 1.5 * k); ctx.fill();
  }
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8;
  return t;
}

// ------------------------------------------------------------------ buildings
function dojoBuilding(roof: string) {
  const g = new THREE.Group();
  g.add(mesh(rbox(9, 0.7, 6.4, 0.15), '#B9A68E', 0, 0.35, 0));
  g.add(mesh(rbox(8, 3.2, 5.4, 0.2), '#FFF8EC', 0, 2.3, 0));
  for (const x of [-3.9, -1.3, 1.3, 3.9]) g.add(mesh(rbox(0.3, 3.3, 0.3, 0.06), '#7A4E36', x, 2.3, 2.75));
  g.add(mesh(rbox(8.3, 0.3, 0.32, 0.06), '#7A4E36', 0, 3.85, 2.75));
  g.add(mesh(rbox(8.3, 0.25, 0.32, 0.06), '#7A4E36', 0, 0.85, 2.75));
  g.add(mesh(rbox(2.4, 2.6, 0.12, 0.04), '#FBF1DC', 0, 2.1, 2.72));
  for (let i = -1; i <= 1; i++) g.add(mesh(rbox(0.06, 2.6, 0.14, 0.02), '#7A4E36', i * 0.8, 2.1, 2.76));
  for (let j = 0; j < 4; j++) g.add(mesh(rbox(2.4, 0.06, 0.14, 0.02), '#7A4E36', 0, 1.0 + j * 0.7, 2.76));
  const dark = shadeHex(roof, -0.25);
  for (const side of [1, -1]) {
    g.add(mesh(rbox(10.4, 0.34, 4.4, 0.14), roof, 0, 4.9, side * 1.65, { rx: side * 0.48 }));
    g.add(mesh(rbox(10.6, 0.3, 1.2, 0.12), roof, 0, 4.12, side * 3.7, { rx: side * 0.12 }));
  }
  g.add(mesh(rbox(10.8, 0.5, 0.6, 0.2), dark, 0, 5.95, 0));
  for (const x of [-5.3, 5.3]) g.add(mesh(SPH_SMALL, dark, x, 6.0, 0, { s: [0.35, 0.45, 0.35] }));
  g.add(mesh(rbox(3.4, 0.25, 1.0, 0.08), '#B9A68E', 0, 0.12, 3.6));
  return g;
}

function shadeHex(hex: string, amt: number) {
  const c = new THREE.Color(hex);
  const hsl = { h: 0, s: 0, l: 0 }; c.getHSL(hsl);
  c.setHSL(hsl.h, hsl.s, Math.max(0, Math.min(1, hsl.l + amt)));
  return '#' + c.getHexString();
}

/** The plaza landmark. Returns where the bell hangs (y) and the radius to block. */
function landmark(kind: Theme['landmark'], root: THREE.Group): { bellY: number; r: number; spinner?: THREE.Group; spinAxis?: 'y' | 'z' } {
  const g = new THREE.Group(); root.add(g);
  switch (kind) {
    case 'clock': {
      g.add(mesh(CYL(2.1, 2.3, 0.6, 24), '#D8CFC4', 0, 0.3, 0));
      g.add(mesh(rbox(2.6, 6.4, 2.6, 0.25), '#FFF1DC', 0, 3.6, 0));
      g.add(mesh(rbox(2.9, 0.3, 2.9, 0.1), '#E8857A', 0, 6.9, 0));
      for (const [x, z] of [[-1.2, -1.2], [1.2, -1.2], [-1.2, 1.2], [1.2, 1.2]]) g.add(mesh(rbox(0.32, 1.8, 0.32, 0.08), '#FFF1DC', x, 7.9, z));
      g.add(mesh(new THREE.ConeGeometry(2.3, 2.2, 4), '#E8857A', 0, 9.9, 0, { ry: Math.PI / 4 }));
      g.add(mesh(SPH_SMALL, '#F6C343', 0, 11.1, 0, { s: [0.22, 0.22, 0.22] }));
      g.add(mesh(CYL(0.9, 0.9, 0.12, 28), '#FFFCF4', 0, 5.2, 1.32, { rx: Math.PI / 2 }));
      g.add(mesh(rbox(0.08, 0.6, 0.04, 0.02), '#5B4636', 0, 5.4, 1.4));
      g.add(mesh(rbox(0.45, 0.08, 0.04, 0.02), '#5B4636', 0.18, 5.2, 1.4));
      return { bellY: 8.6, r: 2.4 };
    }
    case 'lighthouse': {
      g.add(mesh(CYL(2.2, 2.4, 0.6, 24), '#B9B4AC', 0, 0.3, 0));
      for (let i = 0; i < 5; i++) g.add(mesh(CYL(1.5 - i * 0.12, 1.62 - i * 0.12, 1.5, 24), i % 2 ? '#E5735F' : '#FFFFFF', 0, 1.35 + i * 1.5, 0));
      g.add(mesh(CYL(1.35, 1.35, 0.25, 24), '#2F5E7E', 0, 8.2, 0));
      for (let i = 0; i < 8; i++) { const a = (i / 8) * Math.PI * 2; g.add(mesh(CYL(0.05, 0.05, 1.6, 6), '#2F5E7E', Math.cos(a) * 0.9, 9.1, Math.sin(a) * 0.9)); }
      g.add(mesh(CYL(0.85, 0.85, 1.5, 16), '#FFF1C2', 0, 9.1, 0, { glow: true }));
      g.add(mesh(new THREE.ConeGeometry(1.25, 1.2, 16), '#E5735F', 0, 10.5, 0));
      const beam = new THREE.Group(); beam.position.set(0, 9.1, 0);
      const bm = new THREE.Mesh(new THREE.ConeGeometry(0.6, 6, 12, 1, true), new THREE.MeshBasicMaterial({ color: '#FFF4C2', transparent: true, opacity: 0.18, side: THREE.DoubleSide, depthWrite: false }));
      bm.rotation.z = Math.PI / 2; bm.position.x = 3.6; beam.add(bm);
      return { bellY: 7.4, r: 2.4, spinner: beam, spinAxis: 'y' };
    }
    case 'pagoda': {
      g.add(mesh(rbox(4.2, 0.6, 4.2, 0.15), '#B9A68E', 0, 0.3, 0));
      for (let i = 0; i < 4; i++) {
        const s = 1 - i * 0.17, y = 0.6 + i * 2.15;
        g.add(mesh(rbox(2.6 * s, 1.6, 2.6 * s, 0.12), '#C2453B', 0, y + 0.8, 0));
        g.add(mesh(new THREE.ConeGeometry(2.6 * s + 0.7, 0.75, 4), '#3F3436', 0, y + 1.95, 0, { ry: Math.PI / 4 }));
        for (const [x, z] of [[1, 1], [-1, 1], [1, -1], [-1, -1]]) g.add(mesh(SPH_SMALL, '#FFD27A', x * (1.9 * s + 0.5), y + 1.55, z * (1.9 * s + 0.5), { s: [0.16, 0.22, 0.16], glow: true }));
      }
      g.add(mesh(CYL(0.06, 0.08, 2.2, 8), '#D9A94A', 0, 10.4, 0));
      for (let i = 0; i < 4; i++) g.add(mesh(CYL(0.22, 0.22, 0.06, 12), '#D9A94A', 0, 9.8 + i * 0.32, 0));
      return { bellY: 7.2, r: 2.6 };
    }
    case 'belfry': {
      g.add(mesh(rbox(4.2, 0.9, 4.2, 0.15), '#9E978C', 0, 0.45, 0));
      for (const [x, z] of [[-1.5, -1.5], [1.5, -1.5], [-1.5, 1.5], [1.5, 1.5]]) g.add(mesh(rbox(0.38, 5.4, 0.38, 0.06), '#7A4E36', x, 3.6, z));
      g.add(mesh(rbox(3.6, 0.3, 3.6, 0.06), '#7A4E36', 0, 6.3, 0));
      for (const side of [1, -1]) g.add(mesh(rbox(5.0, 0.3, 2.9, 0.12), '#4A4E5E', 0, 7.1, side * 1.2, { rx: side * 0.55 }));
      for (const side of [1, -1]) g.add(mesh(rbox(5.1, 0.18, 2.95, 0.1), '#F6F8FA', 0, 7.32, side * 1.2, { rx: side * 0.55 }));
      g.add(mesh(rbox(5.2, 0.35, 0.4, 0.12), '#3A3E4E', 0, 7.95, 0));
      return { bellY: 6.0, r: 2.6 };
    }
    case 'tower': {
      g.add(mesh(CYL(2.3, 2.5, 0.6, 24), '#A8A2B6', 0, 0.3, 0));
      // red-and-white lattice tower
      for (let i = 0; i < 6; i++) {
        const y = 0.6 + i * 1.9, w = 2.2 - i * 0.3;
        for (const [x, z] of [[1, 1], [-1, 1], [1, -1], [-1, -1]]) g.add(mesh(CYL(0.09, 0.11, 2.0, 6), i % 2 ? '#FFFFFF' : '#E5533F', x * w * 0.5, y + 1, z * w * 0.5, { rz: -x * 0.08, rx: z * 0.08 }));
        g.add(mesh(rbox(w + 0.2, 0.16, w + 0.2, 0.04), i % 2 ? '#E5533F' : '#FFFFFF', 0, y + 2, 0));
      }
      g.add(mesh(rbox(1.6, 0.8, 1.6, 0.15), '#FFF4D6', 0, 7.5, 0, { glow: true }));
      g.add(mesh(CYL(0.06, 0.12, 3.2, 8), '#E5533F', 0, 13.6, 0));
      g.add(mesh(SPH_SMALL, '#FFF1C2', 0, 15.3, 0, { s: [0.18, 0.18, 0.18], glow: true }));
      const star = new THREE.Group(); star.position.set(0, 12.4, 0);
      for (let i = 0; i < 5; i++) { const s = new THREE.Mesh(SPH_SMALL, new THREE.MeshStandardMaterial({ color: '#F6C343', emissive: '#F6C343', emissiveIntensity: 0.4 })); s.scale.setScalar(0.16); const a = (i / 5) * Math.PI * 2; s.position.set(Math.cos(a) * 1.2, 0, Math.sin(a) * 1.2); star.add(s); }
      return { bellY: 6.9, r: 2.6, spinner: star, spinAxis: 'y' };
    }
  }
}

function stall(x: number, z: number, c1: string, c2: string, goods: string[], kept: THREE.Group, root: THREE.Group, ry = 0) {
  const g = new THREE.Group(); g.position.set(x, 0, z); g.rotation.y = ry;
  g.add(mesh(rbox(3.2, 1.0, 1.4, 0.12), '#C98F5E', 0, 0.5, 0));
  for (const sx of [-1.5, 1.5]) g.add(mesh(rbox(0.16, 2.6, 0.16, 0.05), '#8A5A3B', sx, 1.3, -0.6));
  goods.forEach((col, i) => {
    for (let j = 0; j < 5; j++) g.add(mesh(SPH_SMALL, col, -1.1 + i * 1.1 + (j % 3) * 0.22 - 0.22, 1.12 + Math.floor(j / 3) * 0.14, -0.1 + (j % 2) * 0.25, { s: [0.15, 0.15, 0.15] }));
  });
  root.add(g);
  const roof = new THREE.Mesh(new THREE.PlaneGeometry(3.6, 1.8), new THREE.MeshStandardMaterial({ map: stripes(c1, c2, 8), side: THREE.DoubleSide, roughness: 0.85 }));
  roof.position.set(x, 2.55, z); roof.rotation.order = 'YXZ'; roof.rotation.y = ry; roof.rotation.x = -Math.PI / 2 + 0.35;
  roof.translateY(-0.1); roof.castShadow = true; roof.userData.keep = true;
  kept.add(roof);
}

function bamboo(r: () => number, x: number, z: number, root: THREE.Group, snow = false) {
  for (let i = 0; i < 6; i++) {
    const bx = x + (r() - 0.5) * 1.6, bz = z + (r() - 0.5) * 1.6, h = 3.5 + r() * 2.5;
    root.add(mesh(CYL(0.09, 0.11, h, 8), i % 2 ? '#7DB46C' : '#8CC27B', bx, h / 2, bz, { rz: (r() - 0.5) * 0.1 }));
    root.add(mesh(SPH, snow ? '#F4F8FA' : '#7DB46C', bx, h, bz, { s: [0.6, 0.35, 0.6] }));
  }
}

function snowPine(r: () => number, x: number, z: number, s = 1) {
  const g = new THREE.Group(); g.position.set(x, 0, z);
  g.add(mesh(CYL(0.16 * s, 0.22 * s, 1.0 * s, 8), '#7A5A44', 0, 0.5 * s, 0));
  for (let i = 0; i < 3; i++) {
    const rr = (1.5 - i * 0.38) * s, y = (1.2 + i * 1.0) * s;
    g.add(mesh(new THREE.ConeGeometry(rr, 1.5 * s, 9), '#4E7A62', 0, y, 0, { ry: r() * 3 }));
    g.add(mesh(new THREE.ConeGeometry(rr * 0.82, 0.7 * s, 9), '#F7FAFB', 0, y + 0.42 * s, 0, { ry: r() * 3 }));
  }
  return g;
}

const WIN = new THREE.BoxGeometry(0.6, 0.8, 0.06);
const WIN_SIDE = new THREE.BoxGeometry(0.06, 0.8, 0.6);
/** A skyline block: windows only on the side that faces the town, to keep it light. */
function cityBlock(r: () => number, x: number, z: number, root: THREE.Group) {
  const w = 3 + r() * 2.5, d = 3 + r() * 2.5, h = 6 + r() * 12;
  const col = ['#C9C2D8', '#E2D6C8', '#B7C4D6', '#D8C6D6', '#C8D3C2'][Math.floor(r() * 5)];
  root.add(mesh(new THREE.BoxGeometry(w, h, d), col, x, h / 2, z));
  const alongZ = Math.abs(z) >= Math.abs(x);
  for (let y = 1.6; y < h - 0.8; y += 1.8) for (let i = -1; i <= 1; i++) {
    const lit = r() < 0.55;
    if (alongZ) root.add(mesh(WIN, lit ? '#FFE3A3' : '#6E7A9A', x + i * (w / 3.2), y, z - Math.sign(z) * (d / 2 + 0.03), { glow: lit }));
    else root.add(mesh(WIN_SIDE, lit ? '#FFE3A3' : '#6E7A9A', x - Math.sign(x) * (w / 2 + 0.03), y, z + i * (d / 3.2), { glow: lit }));
  }
  root.add(mesh(new THREE.BoxGeometry(w * 0.4, 0.6, d * 0.4), '#8E8AA0', x, h + 0.3, z));
}

// ------------------------------------------------------------------ the town
export function buildTown(themeId: string, worldSeason: Season, signs: { hall: string; post: string; restaurant: string; dojo: string; market: string }): Town {
  const th = THEMES[themeId] ?? THEMES.clover;
  const season = th.season ?? worldSeason;
  const r = rng(th.seed);
  const root = new THREE.Group(), kept = new THREE.Group();
  const colliders: Collider[] = [], waters: THREE.Texture[] = [], benches: { x: number; z: number; ry: number }[] = [];
  const box = (cx: number, cz: number, w: number, d: number) => colliders.push({ kind: 'box', minX: cx - w / 2, maxX: cx + w / 2, minZ: cz - d / 2, maxZ: cz + d / 2 });
  const circ = (x: number, z: number, rr: number) => colliders.push({ kind: 'circle', x, z, r: rr });
  const occupied = (x: number, z: number, pad = 1) => colliders.some((c) => (c.kind === 'box' ? x > c.minX - pad && x < c.maxX + pad && z > c.minZ - pad && z < c.maxZ + pad : Math.hypot(x - c.x, z - c.z) < c.r + pad));

  const ground = new THREE.Mesh(new THREE.PlaneGeometry(WORLD, WORLD), new THREE.MeshStandardMaterial({ map: paintGround(th, season), roughness: 1 }));
  ground.rotation.x = -Math.PI / 2; ground.receiveShadow = true; ground.userData.keep = true; kept.add(ground);

  // ---- Water
  const p = TOWN_SPOTS.pond;
  const wn = waterNormal().clone(); wn.needsUpdate = true; wn.repeat.set(3, 3); waters.push(wn);
  const waterMat = (color: string, opacity = 0.9) => new THREE.MeshStandardMaterial({ color, roughness: 0.12, normalMap: wn, normalScale: new THREE.Vector2(0.35, 0.35), transparent: true, opacity });
  let isWater: (x: number, z: number) => boolean;
  const steam: THREE.Vector3[] = [];
  if (th.water === 'sea') {
    const sea = new THREE.Mesh(new THREE.PlaneGeometry(22, 80), waterMat('#7CC3D6', 0.94));
    sea.rotation.x = -Math.PI / 2; sea.position.set(30, 0.05, 0); sea.userData.keep = true; kept.add(sea);
    // piers with posts, and boats
    for (const pz of [-14, -2, 8]) {
      root.add(mesh(rbox(9, 0.22, 2, 0.05), '#B88A5E', 23, 0.42, pz));
      for (let i = 0; i < 5; i++) for (const sz of [-0.9, 0.9]) root.add(mesh(CYL(0.12, 0.12, 1.4, 6), '#8A5A3B', 19.5 + i * 1.9, 0.2, pz + sz));
    }
    const boat = (x: number, z: number, col: string) => {
      const b = new THREE.Group(); b.position.set(x, 0.15, z);
      b.add(mesh(rbox(1.6, 0.7, 3.6, 0.3), col, 0, 0.3, 0));
      b.add(mesh(rbox(1.3, 0.1, 3.2, 0.05), '#E9D7B8', 0, 0.62, 0));
      b.add(mesh(CYL(0.06, 0.06, 3, 6), '#8A5A3B', 0, 2.0, -0.2));
      b.add(mesh(new THREE.ConeGeometry(1.1, 2.4, 3), '#FFFFFF', 0.05, 2.1, -0.1, { s: [0.08, 1, 0.9], rz: 0 }));
      root.add(b);
    };
    boat(26.5, -10.5, '#E5735F'); boat(26.5, 1.5, '#5E95C4'); boat(29, 11, '#F6C343');
    isWater = (x, z) => x > 19 && !(Math.abs(z + 14) < 1.1 && x < 27.5) && !(Math.abs(z + 2) < 1.1 && x < 27.5) && !(Math.abs(z - 8) < 1.1 && x < 27.5);
    // a small tide pool where the pond would be
    const tp = new THREE.Mesh(new THREE.CircleGeometry(1, 40), waterMat('#8CCFD6'));
    tp.scale.set(p.rx * 0.6, p.rz * 0.6, 1); tp.rotation.x = -Math.PI / 2; tp.position.set(p.x, 0.06, p.z); tp.userData.keep = true; kept.add(tp);
    for (let i = 0; i < 14; i++) { const a = (i / 14) * Math.PI * 2; root.add(rock(r, p.x + Math.cos(a) * (p.rx * 0.6 + 0.4), p.z + Math.sin(a) * (p.rz * 0.6 + 0.4), 0.8)); }
    const inPool = (x: number, z: number) => ((x - p.x) / (p.rx * 0.6 + 0.2)) ** 2 + ((z - p.z) / (p.rz * 0.6 + 0.2)) ** 2 < 1;
    const inSea = isWater; isWater = (x, z) => inSea(x, z) || inPool(x, z);
  } else if (th.water === 'pool') {
    const pool = new THREE.Mesh(new THREE.PlaneGeometry(p.rx * 2, p.rz * 2), waterMat('#7FB8D9', 0.92));
    pool.rotation.x = -Math.PI / 2; pool.position.set(p.x, 0.07, p.z); pool.userData.keep = true; kept.add(pool);
    root.add(mesh(rbox(p.rx * 2 + 0.8, 0.4, 0.4, 0.08), '#E3DFEA', p.x, 0.2, p.z - p.rz - 0.2));
    root.add(mesh(rbox(p.rx * 2 + 0.8, 0.4, 0.4, 0.08), '#E3DFEA', p.x, 0.2, p.z + p.rz + 0.2));
    root.add(mesh(rbox(0.4, 0.4, p.rz * 2, 0.08), '#E3DFEA', p.x - p.rx - 0.2, 0.2, p.z));
    root.add(mesh(rbox(0.4, 0.4, p.rz * 2, 0.08), '#E3DFEA', p.x + p.rx + 0.2, 0.2, p.z));
    for (let i = 0; i < 3; i++) root.add(mesh(CYL(0.12, 0.12, 0.9 + i * 0.3, 8), '#E3DFEA', p.x - 2.5 + i * 2.5, 0.4, p.z));
    isWater = (x, z) => Math.abs(x - p.x) < p.rx + 0.2 && Math.abs(z - p.z) < p.rz + 0.2;
  } else {
    const onsen = th.water === 'onsen';
    const pond = new THREE.Mesh(new THREE.CircleGeometry(1, 40), waterMat(onsen ? '#A9D9D0' : '#8CCFD6'));
    pond.scale.set(p.rx, p.rz, 1); pond.rotation.x = -Math.PI / 2; pond.position.set(p.x, 0.06, p.z); pond.userData.keep = true; kept.add(pond);
    if (!onsen) for (let i = 0; i < 8; i++) {
      const a = r() * Math.PI * 2, rad = 0.3 + r() * 0.5;
      root.add(mesh(CYL(1, 1, 0.03, 14), '#7DB46C', p.x + Math.cos(a) * p.rx * rad, 0.09, p.z + Math.sin(a) * p.rz * rad, { s: [0.5, 1, 0.5] }));
      if (r() < 0.5) root.add(mesh(SPH_SMALL, themeId === 'lantern' ? '#F2A7B0' : '#FFFFFF', p.x + Math.cos(a) * p.rx * rad, 0.18, p.z + Math.sin(a) * p.rz * rad, { s: [0.14, 0.08, 0.14] }));
    }
    for (let i = 0; i < 20; i++) { const a = (i / 20) * Math.PI * 2; root.add(rock(r, p.x + Math.cos(a) * (p.rx + 0.4), p.z + Math.sin(a) * (p.rz + 0.4), onsen ? 1.1 : 0.7)); }
    if (onsen) {
      for (let i = 0; i < 6; i++) steam.push(new THREE.Vector3(p.x + (r() - 0.5) * p.rx, 0.4, p.z + (r() - 0.5) * p.rz));
      // wooden onsen fence and sign post
      root.add(fence(p.x - p.rx - 1.2, p.z - p.rz - 1.4, p.x + p.rx + 1.2, p.z - p.rz - 1.4));
      root.add(mesh(rbox(0.9, 0.6, 0.12, 0.05), '#C2453B', p.x - p.rx - 0.6, 1.4, p.z + p.rz + 0.8));
      root.add(mesh(CYL(0.06, 0.06, 1.2, 6), '#7A4E36', p.x - p.rx - 0.6, 0.6, p.z + p.rz + 0.8));
    }
    if (themeId === 'lantern') {
      // red arched bridge across the pond
      for (let i = 0; i < 9; i++) { const t = i / 8, x = p.x - 3.2 + t * 6.4, y = 0.3 + Math.sin(t * Math.PI) * 0.9; root.add(mesh(rbox(0.85, 0.16, 1.4, 0.04), '#C2453B', x, y, p.z, { rz: Math.cos(t * Math.PI) * -0.35 })); }
    }
    isWater = (x, z) => ((x - p.x) / (p.rx + 0.2)) ** 2 + ((z - p.z) / (p.rz + 0.2)) ** 2 < 1;
  }

  // ---- Landmark and bell
  const lm = landmark(th.landmark, root); circ(0, 0, lm.r);
  const bell = new THREE.Group(); bell.position.set(0, lm.bellY, 0);
  const bellMat = new THREE.MeshStandardMaterial({ color: th.landmark === 'belfry' ? '#8C6A3A' : '#D9A94A', metalness: 0.55, roughness: 0.35, side: THREE.DoubleSide });
  const bs = th.landmark === 'belfry' ? 1.35 : 1;
  const bellBody = new THREE.Mesh(new THREE.CylinderGeometry(0.35 * bs, 0.75 * bs, 1.1 * bs, 24, 1, true), bellMat);
  bellBody.position.y = -0.55 * bs; bellBody.castShadow = true;
  const bellTop = new THREE.Mesh(new THREE.SphereGeometry(0.36 * bs, 20, 10, 0, Math.PI * 2, 0, Math.PI / 2), bellMat);
  const clapper = new THREE.Mesh(SPH_SMALL, new THREE.MeshStandardMaterial({ color: '#8A5A3B' })); clapper.scale.setScalar(0.14 * bs); clapper.position.y = -1.05 * bs;
  bell.add(bellBody, bellTop, clapper); bell.traverse((o) => (o.userData.keep = true)); kept.add(bell);

  // ---- Buildings
  const hall = house({ w: 6, d: 4.6, h: 3.2, ...th.hall, chimney: true });
  hall.position.set(-11, 0, -1); root.add(hall); box(-11, -1, 6.2, 4.8);
  const post = house({ w: 5.2, d: 4.4, h: 3.0, ...th.post });
  post.position.set(11, 0, -1); root.add(post); box(11, -1, 5.4, 4.6);
  const resto = house({ w: 5.6, d: 4.4, h: 3.0, ...th.resto, chimney: true });
  resto.position.set(-11, 0, 11.2); root.add(resto); box(-11, 11.2, 5.8, 4.6);
  root.add(mesh(rbox(0.7, 1.2, 0.6, 0.2), '#E8566C', 13.8, 0.6, 1.6)); circ(13.8, 1.6, 0.5);
  const dojo = dojoBuilding(th.dojoRoof); dojo.position.set(0, 0, -18); root.add(dojo); box(0, -18, 9.2, 6.6);
  for (const x of [-2.4, 2.4]) { root.add(mesh(CYL(0.18, 0.2, 3.4, 10), th.gate, x, 1.7, -11)); circ(x, -11, 0.3); }
  root.add(mesh(rbox(6, 0.35, 0.4, 0.1), th.gate, 0, 3.3, -11)); root.add(mesh(rbox(6.8, 0.3, 0.5, 0.12), th.dojoRoof, 0, 3.65, -11));
  for (const x of [-3.2, 3.2]) { root.add(mesh(rbox(0.5, 1.4, 0.5, 0.1), '#B9A68E', x, 0.7, -13.4)); root.add(mesh(rbox(0.6, 0.5, 0.6, 0.1), '#FFE3A3', x, 1.6, -13.4, { glow: true })); circ(x, -13.4, 0.45); }
  for (const [x, z] of [[-6, -16], [6, -16], [-6.5, -21], [6.5, -21], [-3, -23], [3, -23]] as V2[]) {
    if (th.edge === 'snowpines') root.add(snowPine(r, x, z, 0.9)); else bamboo(r, x, z, root);
    circ(x, z, 1.0);
  }

  // ---- Market stalls
  const goods: Record<string, string[][]> = {
    clover: [['#E8566C', '#F2913D', '#7DB46C'], ['#FBE08A', '#E8566C', '#B6A3D9'], ['#F6C343', '#7DB46C', '#F2913D']],
    harbor: [['#9FB8C8', '#E5735F', '#C8D3DA'], ['#F2A07B', '#9FB8C8', '#E5735F'], ['#7DB46C', '#C8D3DA', '#F2A07B']],
    lantern: [['#FFD27A', '#C2453B', '#FFD27A'], ['#F2A7B0', '#FFFFFF', '#7DB46C'], ['#E9A92A', '#8A5A3B', '#F6C343']],
    snowcap: [['#F2913D', '#FFFFFF', '#C2453B'], ['#8A5A3B', '#E9D7B8', '#7DB46C'], ['#E9A92A', '#C2453B', '#FFFFFF']],
    starlight: [['#B6A3D9', '#F2A7B0', '#FFFFFF'], ['#7DC3C9', '#F6C343', '#E8566C'], ['#FFFFFF', '#B6A3D9', '#7DC3C9']],
  };
  const gd = goods[themeId] ?? goods.clover;
  th.stalls.forEach(([c1, c2], i) => { const x = 6.8 + i * 3.7; stall(x, 11.2, c1, c2, gd[i], kept, root); box(x, 11.2, 3.4, 1.6); });

  // ---- West quarter (fields / docks / night market / library / theater)
  let spinner: THREE.Object3D | undefined = lm.spinner, spinAxis: 'y' | 'z' = lm.spinAxis ?? 'z', spinSpeed = lm.spinner ? 0.5 : 0.6;
  if (th.west === 'fields') {
    root.add(mesh(new THREE.CylinderGeometry(1.0, 1.6, 6, 12), '#FFF6E9', -18, 3, -12)); circ(-18, -12, 1.7);
    root.add(mesh(new THREE.ConeGeometry(1.4, 1.6, 12), '#E8857A', -18, 6.8, -12));
    const wm = new THREE.Group(); wm.position.set(-18, 5.4, -10.8);
    for (let i = 0; i < 4; i++) {
      const blade = new THREE.Mesh(rbox(0.5, 3.4, 0.08, 0.04), new THREE.MeshStandardMaterial({ color: '#FFFCF4' }));
      blade.position.y = 1.8; const arm = new THREE.Group(); arm.rotation.z = (i * Math.PI) / 2; arm.add(blade); wm.add(arm);
    }
    wm.add(new THREE.Mesh(SPH_SMALL, new THREE.MeshStandardMaterial({ color: '#8A5A3B' })).translateZ(0.05));
    wm.traverse((o) => { o.userData.keep = true; (o as THREE.Mesh).castShadow = true; }); kept.add(wm);
    if (!spinner) { spinner = wm; spinAxis = 'z'; }
    for (let i = 0; i < 4; i++) for (let j = 0; j < 9; j++) root.add(flower(r, -21.5 + j, -17 + i * 4.2, ['#F6C343', '#F28FA6', '#FFFFFF', '#B6A3D9'][i]));
    root.add(fence(-23, -19, -13, -19)); root.add(fence(-13, -19, -13, -1.5)); box(-18, -19, 10, 0.3); box(-13, -10.25, 0.3, 17.5);
  } else if (th.west === 'docks') {
    // net-mending yard: crates, barrels, drying nets and a beached boat
    for (const [x, z] of [[-20, -16], [-18.6, -16], [-20, -14.6], [-15, -8], [-16.4, -8]] as V2[]) { root.add(mesh(rbox(1.2, 1.0, 1.2, 0.08), '#C98F5E', x, 0.5, z)); circ(x, z, 0.8); }
    for (const [x, z] of [[-14, -16], [-14.9, -15.2], [-21, -9]] as V2[]) { root.add(mesh(CYL(0.5, 0.5, 1.1, 12), '#8A5A3B', x, 0.55, z)); circ(x, z, 0.6); }
    for (let i = 0; i < 3; i++) { const x = -21 + i * 3; root.add(mesh(CYL(0.08, 0.08, 2.4, 6), '#7A4E36', x, 1.2, -12)); }
    root.add(mesh(rbox(6.2, 1.6, 0.04, 0.02), '#5E8E9E', -18, 1.4, -12)); box(-18, -12, 6.4, 0.4);
    const bb = new THREE.Group(); bb.position.set(-17, 0.4, -4.5); bb.rotation.set(0, 0.6, 0.15);
    bb.add(mesh(rbox(1.6, 0.7, 3.6, 0.3), '#E5735F', 0, 0, 0)); root.add(bb); circ(-17, -4.5, 1.6);
  } else if (th.west === 'nightmarket') {
    th.stalls.forEach(([c1, c2], i) => { stall(-17.5, -16 + i * 4.4, c1, c2, gd[(i + 1) % 3], kept, root, Math.PI / 2); box(-17.5, -16 + i * 4.4, 1.6, 3.4); });
    for (let i = 0; i < 5; i++) { root.add(mesh(CYL(0.06, 0.06, 3.2, 6), '#7A4E36', -14.6, 1.6, -18 + i * 3.4)); root.add(mesh(SPH_SMALL, '#FFB35C', -14.6, 3.0, -18 + i * 3.4, { s: [0.3, 0.38, 0.3], glow: true })); circ(-14.6, -18 + i * 3.4, 0.2); }
  } else if (th.west === 'library') {
    const lib = house({ w: 7.5, d: 5.4, h: 3.8, wall: '#EAD6BC', roof: '#F6F8FA', trim: '#8A5A3B', door: '#6E4A3A', chimney: true });
    lib.position.set(-18, 0, -13); lib.rotation.y = Math.PI / 2; root.add(lib); box(-18, -13, 5.6, 7.7);
    for (let i = 0; i < 4; i++) root.add(mesh(rbox(2.2, 0.32, 0.32, 0.06), '#9E7A55', -15.5, 0.2 + i * 0.32, -5.5 + (i % 2) * 0.05));
    box(-15.5, -5.5, 2.4, 0.6);
    const sm = new THREE.Group(); sm.position.set(-14.5, 0, -6.8);
    sm.add(mesh(SPH, '#FFFFFF', 0, 0.5, 0, { s: [0.55, 0.5, 0.55] })); sm.add(mesh(SPH, '#FFFFFF', 0, 1.25, 0, { s: [0.38, 0.36, 0.38] }));
    sm.add(mesh(new THREE.ConeGeometry(0.08, 0.35, 8), '#F2913D', 0, 1.25, 0.42, { rx: Math.PI / 2 }));
    root.add(sm); circ(-14.5, -6.8, 0.6);
  } else if (th.west === 'theater') {
    const thr = new THREE.Group(); thr.position.set(-18, 0, -12); root.add(thr);
    thr.add(mesh(rbox(8, 6, 7, 0.3), '#E8DCEB', 0, 3, 0));
    thr.add(mesh(rbox(8.4, 0.6, 7.4, 0.2), '#7A5E9E', 0, 6.2, 0));
    thr.add(mesh(rbox(0.3, 1.4, 5.4, 0.1), '#3A3550', 4.1, 4.4, 0));
    for (let i = 0; i < 9; i++) thr.add(mesh(SPH_SMALL, '#FFE3A3', 4.3, 3.6, -2.4 + i * 0.6, { s: [0.09, 0.09, 0.09], glow: true }));
    thr.add(mesh(rbox(0.2, 2.6, 2.4, 0.05), '#C2453B', 4.05, 1.3, 0));
    box(-18, -12, 8.2, 7.2);
  }

  // ---- Plaza dressing
  // The north-east lamp sits off the diagonal so it never stands between the camera and the dojo.
  const LAMPS: V2[] = [[-5.4, -5.4], [7.0, -3.0], [-5.4, 5.4], [5.4, 5.4]];
  for (const [x, z] of LAMPS) { root.add(lamp(x, z)); circ(x, z, 0.32); }
  for (const [x, z, ry] of [[-6, 2.2, 1.9], [6, 2.2, -1.9], [7, -11, -0.6], [11, -9, -2.4]] as [number, number, number][]) { root.add(bench(x, z, ry)); circ(x, z, 0.9); benches.push({ x, z, ry }); }
  const [L0, L1, L2, L3] = LAMPS;
  const strings: [V2, V2][] = [[L0, L3], [L1, L2], [L2, L3], [L0, L2], [L1, L3], [L0, L1]];
  const lanternCols: Record<string, [string, string]> = { clover: ['#E8566C', '#FFF6EE'], harbor: ['#5E95C4', '#FFFFFF'], lantern: ['#E5533F', '#FFB35C'], snowcap: ['#C2453B', '#FFF1C2'], starlight: ['#FFF1C2', '#B6A3D9'] };
  const [lc1, lc2] = lanternCols[themeId] ?? lanternCols.clover;
  for (const [a, b] of strings.slice(0, th.strings)) {
    for (let i = 1; i < 10; i++) {
      const t = i / 10, x = a[0] + (b[0] - a[0]) * t, z = a[1] + (b[1] - a[1]) * t;
      const sag = Math.sin(t * Math.PI) * 0.8;
      if (Math.hypot(x, z) < 2.8) continue;
      root.add(mesh(SPH_SMALL, i % 2 ? lc1 : lc2, x, 3.1 - sag, z, { s: themeId === 'lantern' ? [0.26, 0.34, 0.26] : [0.2, 0.26, 0.2], glow: themeId === 'lantern' || i % 2 === 0 }));
    }
  }
  // Bus stop
  root.add(mesh(CYL(0.06, 0.06, 2.3, 8), '#6E6A7A', 2.6, 1.15, 19.6));
  root.add(mesh(CYL(0.42, 0.42, 0.08, 20), '#7FB0D9', 2.6, 2.35, 19.6, { rx: Math.PI / 2 }));
  root.add(bench(4.2, 20.6, Math.PI)); circ(4.2, 20.6, 0.9); benches.push({ x: 4.2, z: 20.6, ry: Math.PI });

  // ---- Edges: trees, maples, snowy pines or city blocks
  const B = TOWN_BOUNDS;
  if (th.edge === 'city') {
    for (let gx = -36; gx <= 36; gx += 6.5) for (let gz = -36; gz <= 36; gz += 6.5) {
      const x = gx + (r() - 0.5) * 1.5, z = gz + (r() - 0.5) * 1.5;
      const outside = x < B.minX - 2 || x > B.maxX + 2 || z < B.minZ - 2 || z > B.maxZ + 2;
      if (Math.max(Math.abs(x), Math.abs(z)) > 33) continue;
      if (!outside || (Math.abs(x) < 5 && z > 18)) continue;
      cityBlock(r, x, z, root);
    }
    for (const [x, z] of [[16, -6], [18, 5], [-16, 4], [-17, 18], [17, 18]] as V2[]) { root.add(tree(r, season, x, z, 0.9, 'round')); circ(x, z, 0.6); }
  } else {
    for (let gx = -38; gx <= 38; gx += 3) for (let gz = -38; gz <= 38; gz += 3) {
      const x = gx + (r() - 0.5) * 2, z = gz + (r() - 0.5) * 2;
      const outside = x < B.minX + 1 || x > B.maxX - 1 || z < B.minZ + 1 || z > B.maxZ - 1;
      if (!outside || Math.hypot(x, z) > 40 || (Math.abs(x) < 4 && z > 18)) continue;
      if (th.water === 'sea' && x > 17) continue;
      if (th.edge === 'snowpines') root.add(snowPine(r, x, z, 1 + r() * 0.4));
      else root.add(tree(r, season, x, z, 1, r() < 0.3 ? 'pine' : season === 'spring' && r() < 0.4 ? 'blossom' : 'round'));
    }
    const inner: V2[] = th.water === 'sea' ? [[-16, 4], [-17, 18], [14, 18], [6, -20]] : [[16, -6], [18, -18], [6, -20], [-16, 4], [-17, 18], [17, 18], [18, 5]];
    for (const [x, z] of inner) {
      if (th.edge === 'snowpines') root.add(snowPine(r, x, z, 1.2)); else root.add(tree(r, season, x, z, 1.2, season === 'spring' ? 'blossom' : 'round'));
      circ(x, z, 0.6);
    }
  }
  if (th.water === 'sea') for (const [x, z] of [[17, -20], [17.5, -8], [17, 14]] as V2[]) { root.add(mesh(CYL(0.15, 0.2, 3.6, 8), '#9E7A55', x, 1.8, z, { rz: 0.15 })); root.add(mesh(SPH, '#6FAE62', x + 0.3, 3.7, z, { s: [1.3, 0.4, 1.3] })); circ(x, z, 0.4); }
  for (let i = 0; i < 40; i++) {
    const x = (r() - 0.5) * 40, z = (r() - 0.5) * 36;
    if (Math.hypot(x, z) < 8.5 || Math.abs(x) < 2 || occupied(x, z) || isWater(x, z) || th.patch === 'paving' || th.patch === 'snow') continue;
    root.add(flower(r, x, z));
  }

  const glowMat = new THREE.MeshStandardMaterial({ vertexColors: true, emissive: new THREE.Color('#FFC870'), emissiveIntensity: 0, roughness: 0.6 });
  const group = new THREE.Group();
  for (const m of bake(root, glowMat)) group.add(m);
  group.add(kept);
  if (spinner && spinner !== kept.children.find((c) => c === spinner)) { spinner.traverse((o) => (o.userData.keep = true)); group.add(spinner); }

  // Steam puffs over the hot spring
  for (const s of steam) {
    const puff = new THREE.Mesh(SPH, new THREE.MeshBasicMaterial({ color: '#FFFFFF', transparent: true, opacity: 0.35, depthWrite: false }));
    puff.position.copy(s); puff.scale.setScalar(0.6); puff.userData.steam = Math.random() * 6; group.add(puff);
  }

  // Japanese signs above the doors
  const sign = (text: string, x: number, y: number, z: number, bg: string, fg: string, w = 2.4) => {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(w, 0.75), new THREE.MeshStandardMaterial({ map: signTexture(text, bg, fg, '"Kiwi Maru", "M PLUS Rounded 1c", sans-serif', 500), transparent: true, roughness: 0.8 }));
    m.position.set(x, y, z); group.add(m);
  };
  const ink = th.signInk;
  sign(signs.hall, -11, 3.75, 1.36, '#FFF6EE', ink[0]);
  sign(signs.post, 11, 3.55, 1.26, '#FFF6EE', ink[1]);
  sign(signs.restaurant, -11, 3.55, 13.46, '#FFF6EE', ink[2]);
  sign(signs.dojo, 0, 3.3, -10.75, '#FFF8EC', ink[3], 2.0);
  sign(signs.market, 10.5, 3.1, 11.9, '#FFF6EE', ink[4]);

  const lamps: THREE.PointLight[] = [];
  for (const [x, z] of [[-5.4, -5.4], [5.4, 5.4], [0, -13.4]] as V2[]) { const l = new THREE.PointLight('#FFC27A', 0, 11, 1.6); l.position.set(x, 2.7, z); group.add(l); lamps.push(l); }

  const log = new THREE.Object3D(); log.visible = false;
  return {
    group, colliders, waters, glowMat, lamps, log, flowers: [], mushrooms: [], chimneys: [new THREE.Vector3(-9.3, 5.4, -1.8), new THREE.Vector3(-9.4, 5.2, 10.4)],
    fountainTop: new THREE.Vector3(0, -40, 0), isWater, benches,
    nodes: TOWN_NODES, edges: TOWN_EDGES, bell, spinner: { obj: spinner ?? new THREE.Object3D(), axis: spinAxis, speed: spinSpeed }, bounds: TOWN_BOUNDS,
  };
}
