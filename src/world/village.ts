import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { EDGES, NODES, SPOTS, type V2 } from '../content/places';
import { groundTexture, signTexture, stripes, waterNormal, type Season } from './textures';

export type Collider =
  | { kind: 'circle'; x: number; z: number; r: number; tag?: string }
  | { kind: 'box'; minX: number; maxX: number; minZ: number; maxZ: number; tag?: string };

export interface Village {
  group: THREE.Group;
  colliders: Collider[];
  waters: THREE.Texture[];
  glowMat: THREE.MeshStandardMaterial;
  lamps: THREE.PointLight[];
  log: THREE.Object3D;
  flowers: THREE.Object3D[];
  mushrooms: THREE.Object3D[];
  chimneys: THREE.Vector3[];
  fountainTop: THREE.Vector3;
  /** Bench seats: center and facing (the sitter looks along +Z rotated by ry). */
  benches: { x: number; z: number; ry: number }[];
  isWater: (x: number, z: number) => boolean;
}

export const WORLD = 96;
export const BOUNDS = { minX: -30, maxX: 30, minZ: -34, maxZ: 27 };

// ------------------------------------------------------------ helpers
const matCache = new Map<string, THREE.MeshStandardMaterial>();
const C = (color: string) => {
  if (!matCache.has(color)) matCache.set(color, new THREE.MeshStandardMaterial({ color }));
  return matCache.get(color)!;
};
const GLOW = '__glow';

function mesh(geo: THREE.BufferGeometry, color: string, x = 0, y = 0, z = 0, opts: { rx?: number; ry?: number; rz?: number; s?: [number, number, number]; glow?: boolean } = {}) {
  const m = new THREE.Mesh(geo, C(color));
  m.position.set(x, y, z);
  m.rotation.set(opts.rx ?? 0, opts.ry ?? 0, opts.rz ?? 0);
  if (opts.s) m.scale.set(...opts.s);
  if (opts.glow) m.userData[GLOW] = true;
  return m;
}
const rbox = (w: number, h: number, d: number, r = 0.12) => new RoundedBoxGeometry(w, h, d, 3, Math.min(r, w / 2 - 0.001, h / 2 - 0.001, d / 2 - 0.001));
const SPH = new THREE.IcosahedronGeometry(1, 2);
const SPH_LO = new THREE.IcosahedronGeometry(1, 1);
const SPH_SMALL = new THREE.SphereGeometry(1, 10, 8);
const CYL = (rt: number, rb: number, h: number, seg = 16) => new THREE.CylinderGeometry(rt, rb, h, seg);

function prep(src: THREE.BufferGeometry, matrix: THREE.Matrix4, color: THREE.Color) {
  let g = src.index ? src.toNonIndexed() : src.clone();
  for (const k of Object.keys(g.attributes)) if (!['position', 'normal', 'uv'].includes(k)) g.deleteAttribute(k);
  if (!g.attributes.uv) g.setAttribute('uv', new THREE.Float32BufferAttribute(new Float32Array(g.attributes.position.count * 2), 2));
  if (!g.attributes.normal) g.computeVertexNormals();
  g.applyMatrix4(matrix);
  const n = g.attributes.position.count;
  const col = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) { col[i * 3] = color.r; col[i * 3 + 1] = color.g; col[i * 3 + 2] = color.b; }
  g.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
  g.morphAttributes = {};
  return g;
}

/** Merge every plain mesh under root into one vertex-colored mesh (plus one emissive "glow" mesh). */
function bake(root: THREE.Group, glowMat: THREE.Material): THREE.Mesh[] {
  root.updateMatrixWorld(true);
  const normal: THREE.BufferGeometry[] = [], glow: THREE.BufferGeometry[] = [];
  const doomed: THREE.Mesh[] = [];
  root.traverse((o) => {
    const m = o as THREE.Mesh;
    if (!m.isMesh || m.userData.keep) return;
    const mat = m.material as THREE.MeshStandardMaterial;
    (m.userData[GLOW] ? glow : normal).push(prep(m.geometry, m.matrixWorld, mat.color));
    doomed.push(m);
  });
  for (const d of doomed) d.removeFromParent();
  const out: THREE.Mesh[] = [];
  const base = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.88 });
  for (let i = 0; i < normal.length; i += 400) {
    const merged = new THREE.Mesh(mergeGeometries(normal.slice(i, i + 400)), base);
    merged.castShadow = merged.receiveShadow = true;
    out.push(merged);
  }
  if (glow.length) out.push(new THREE.Mesh(mergeGeometries(glow), glowMat));
  return out;
}

function rng(seed: number) {
  let s = seed >>> 0;
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
}

// ------------------------------------------------------------ props
interface HouseOpts { w: number; d: number; h: number; wall: string; roof: string; trim: string; door: string; chimney?: boolean; round?: boolean }

function house(o: HouseOpts) {
  const g = new THREE.Group();
  const pitch = 0.62;
  g.add(mesh(rbox(o.w + 0.25, 0.35, o.d + 0.25, 0.1), o.trim, 0, 0.175, 0));
  g.add(mesh(rbox(o.w, o.h, o.d, 0.3), o.wall, 0, o.h / 2, 0));
  // Gable triangles
  const tri = new THREE.Shape();
  const rise = (o.d / 2) * Math.tan(pitch);
  tri.moveTo(-o.d / 2, 0); tri.lineTo(o.d / 2, 0); tri.lineTo(0, rise); tri.closePath();
  const gable = new THREE.ExtrudeGeometry(tri, { depth: o.w - 0.3, bevelEnabled: false });
  gable.translate(0, 0, -(o.w - 0.3) / 2);
  gable.rotateY(Math.PI / 2);
  g.add(mesh(gable, o.wall, 0, o.h - 0.02, 0));
  // Roof slabs, soft and puffy
  const half = (o.d / 2 + 0.5) / Math.cos(pitch);
  for (const side of [1, -1]) {
    const slab = mesh(rbox(o.w + 0.8, 0.32, half, 0.14), o.roof, 0,
      o.h + (half / 2) * Math.sin(pitch) - 0.12, side * (half / 2) * Math.cos(pitch) - side * 0.12, { rx: side * pitch });
    g.add(slab);
  }
  g.add(mesh(CYL(0.18, 0.18, o.w + 0.9, 12), o.roof, 0, o.h + rise + 0.08, 0, { rz: Math.PI / 2 }));
  // Door + steps
  g.add(mesh(rbox(1.0, 1.65, 0.2, 0.09), o.door, 0, 0.98, o.d / 2 + 0.02));
  g.add(mesh(SPH_SMALL, '#F2C94C', 0.32, 0.95, o.d / 2 + 0.14, { s: [0.06, 0.06, 0.06] }));
  g.add(mesh(rbox(1.5, 0.18, 0.7, 0.08), o.trim, 0, 0.09, o.d / 2 + 0.45));
  // Windows that glow at night
  for (const sx of [-1, 1]) {
    const wx = sx * Math.min(o.w * 0.3, 1.6);
    g.add(mesh(rbox(0.95, 0.95, 0.12, 0.08), o.trim, wx, o.h * 0.55, o.d / 2 + 0.02));
    g.add(mesh(rbox(0.75, 0.75, 0.12, 0.06), '#FFE6B0', wx, o.h * 0.55, o.d / 2 + 0.05, { glow: true }));
    g.add(mesh(rbox(0.08, 0.75, 0.14, 0.02), o.trim, wx, o.h * 0.55, o.d / 2 + 0.08));
    g.add(mesh(rbox(0.75, 0.08, 0.14, 0.02), o.trim, wx, o.h * 0.55, o.d / 2 + 0.08));
    g.add(mesh(rbox(1.0, 0.12, 0.28, 0.05), o.trim, wx, o.h * 0.55 - 0.52, o.d / 2 + 0.1));
    // window box flowers
    for (let i = -1; i <= 1; i++) g.add(mesh(SPH_SMALL, ['#F28FA6', '#F6C343', '#FFFFFF'][i + 1], wx + i * 0.28, o.h * 0.55 - 0.4, o.d / 2 + 0.16, { s: [0.11, 0.1, 0.11] }));
  }
  if (o.chimney) {
    g.add(mesh(rbox(0.55, 1.3, 0.55, 0.1), '#C9A28A', o.w * 0.28, o.h + rise * 0.7, -o.d * 0.18));
    g.add(mesh(rbox(0.7, 0.18, 0.7, 0.06), '#B38B74', o.w * 0.28, o.h + rise * 0.7 + 0.7, -o.d * 0.18));
  }
  return g;
}

function tree(r: () => number, season: Season, x: number, z: number, scale = 1, kind: 'round' | 'pine' | 'blossom' = 'round') {
  const g = new THREE.Group();
  const far = Math.abs(x) > 30 || z < -36 || z > 29;
  g.position.set(x, 0, z);
  g.rotation.y = r() * Math.PI * 2;
  const s = scale * (0.85 + r() * 0.35);
  g.scale.setScalar(s);
  const trunk = season === 'winter' ? '#9C7A5E' : '#A07A55';
  if (kind === 'pine') {
    g.add(mesh(CYL(0.16, 0.24, 1.2, 8), trunk, 0, 0.6, 0));
    const col = season === 'winter' ? '#5E8E74' : '#5FA27A';
    for (let i = 0; i < 3; i++) {
      g.add(mesh(new THREE.ConeGeometry(1.25 - i * 0.3, 1.3, 10), col, 0, 1.4 + i * 0.75, 0));
      if (season === 'winter') g.add(mesh(new THREE.ConeGeometry(0.75 - i * 0.2, 0.5, 10), '#F4F8FA', 0, 1.8 + i * 0.75, 0));
    }
    return g;
  }
  g.add(mesh(CYL(0.17, 0.27, 1.6, 8), trunk, 0, 0.8, 0));
  const pal: Record<Season, string[]> = {
    spring: kind === 'blossom' ? ['#F7C6D3', '#F4B3C5', '#FAD6DF'] : ['#8FCB7B', '#9DD38A', '#84C172'],
    summer: ['#6DB66A', '#7CC273', '#5FA95F'],
    autumn: ['#E9A55B', '#E07B4F', '#F2C65A', '#D98A4E', '#B9B85C'],
    winter: ['#DDE8EC', '#E9F0F2', '#D2DFE4'],
  };
  const cols = pal[season];
  const col = cols[Math.floor(r() * cols.length)];
  const blobs: [number, number, number, number][] = far ? [[0, 2.3, 0, 1.1], [0.1, 2.85, -0.1, 0.7]] : [[0, 2.25, 0, 1.0], [0.55, 1.9, 0.2, 0.72], [-0.5, 1.95, -0.15, 0.75], [0.1, 2.75, -0.1, 0.65]];
  for (const [bx, by, bz, br] of blobs) g.add(mesh(far ? SPH_LO : SPH, col, bx, by, bz, { s: [br, br * 0.92, br] }));
  if (season === 'autumn' && r() < 0.4) for (let i = 0; i < 4; i++) g.add(mesh(SPH_SMALL, '#F2A25A', (r() - 0.5) * 2, 0.04, (r() - 0.5) * 2, { s: [0.22, 0.04, 0.22] }));
  if (season !== 'winter' && r() < 0.3) for (let i = 0; i < 3; i++) g.add(mesh(SPH_SMALL, '#E8566C', (r() - 0.5) * 1.5, 1.7 + r() * 0.9, 0.75 + r() * 0.2, { s: [0.09, 0.09, 0.09] }));
  return g;
}

function flower(r: () => number, x: number, z: number, col?: string) {
  const g = new THREE.Group();
  g.position.set(x, 0, z);
  g.add(mesh(CYL(0.02, 0.025, 0.36, 5), '#6FAE62', 0, 0.18, 0));
  const c = col ?? ['#F28FA6', '#F6C343', '#FFFFFF', '#B6A3D9', '#F49B7B'][Math.floor(r() * 5)];
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * Math.PI * 2;
    g.add(mesh(SPH_SMALL, c, Math.cos(a) * 0.07, 0.38, Math.sin(a) * 0.07, { s: [0.06, 0.03, 0.06] }));
  }
  g.add(mesh(SPH_SMALL, '#F6C343', 0, 0.395, 0, { s: [0.045, 0.035, 0.045] }));
  return g;
}

function bench(x: number, z: number, ry: number) {
  const g = new THREE.Group(); g.position.set(x, 0, z); g.rotation.y = ry;
  g.add(mesh(rbox(1.8, 0.12, 0.55, 0.05), '#C98B5B', 0, 0.48, 0));
  g.add(mesh(rbox(1.8, 0.45, 0.1, 0.05), '#C98B5B', 0, 0.85, -0.25));
  for (const sx of [-0.75, 0.75]) g.add(mesh(rbox(0.12, 0.48, 0.5, 0.04), '#8A6A55', sx, 0.24, 0));
  return g;
}

function lamp(x: number, z: number) {
  const g = new THREE.Group(); g.position.set(x, 0, z);
  g.add(mesh(CYL(0.25, 0.3, 0.25, 12), '#6E6A7A', 0, 0.12, 0));
  g.add(mesh(CYL(0.07, 0.09, 2.6, 8), '#6E6A7A', 0, 1.4, 0));
  g.add(mesh(rbox(0.42, 0.5, 0.42, 0.1), '#FFE3A3', 0, 2.85, 0, { glow: true }));
  g.add(mesh(new THREE.ConeGeometry(0.38, 0.32, 4), '#6E6A7A', 0, 3.25, 0, { ry: Math.PI / 4 }));
  return g;
}

function fence(x1: number, z1: number, x2: number, z2: number) {
  const g = new THREE.Group();
  const len = Math.hypot(x2 - x1, z2 - z1), n = Math.max(1, Math.round(len / 0.7));
  const ang = Math.atan2(x2 - x1, z2 - z1);
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    g.add(mesh(rbox(0.14, 0.75, 0.14, 0.05), '#FFF4E3', x1 + (x2 - x1) * t, 0.37, z1 + (z2 - z1) * t));
  }
  for (const y of [0.28, 0.55]) g.add(mesh(rbox(0.06, 0.09, len, 0.03), '#FFF4E3', (x1 + x2) / 2, y, (z1 + z2) / 2, { ry: ang }));
  return g;
}

function rock(r: () => number, x: number, z: number, s = 1) {
  return mesh(SPH, ['#B9B4AC', '#C8C2B8', '#A9A49D'][Math.floor(r() * 3)], x, 0.1 * s, z, { s: [0.5 * s * (0.8 + r() * 0.5), 0.32 * s, 0.45 * s * (0.8 + r() * 0.5)], ry: r() * 3 });
}

// ------------------------------------------------------------ world
export function buildVillage(season: Season): Village {
  const r = rng(1234);
  const root = new THREE.Group();
  const kept = new THREE.Group();
  const colliders: Collider[] = [];
  const waters: THREE.Texture[] = [];
  const benches: { x: number; z: number; ry: number }[] = [];
  const chimneys: THREE.Vector3[] = [];
  const box = (cx: number, cz: number, w: number, d: number, tag?: string) =>
    colliders.push({ kind: 'box', minX: cx - w / 2, maxX: cx + w / 2, minZ: cz - d / 2, maxZ: cz + d / 2, tag });
  const circ = (x: number, z: number, rr: number, tag?: string) => colliders.push({ kind: 'circle', x, z, r: rr, tag });

  // Ground
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(WORLD, WORLD), new THREE.MeshStandardMaterial({ map: groundTexture(season, WORLD), roughness: 1 }));
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  ground.userData.keep = true;
  kept.add(ground);

  // Water
  const wn = waterNormal();
  const waterMat = (rep: number) => {
    const t = wn.clone(); t.needsUpdate = true; t.repeat.set(rep, rep); waters.push(t);
    return new THREE.MeshStandardMaterial({ color: '#8CCFD6', roughness: 0.12, metalness: 0.0, normalMap: t, normalScale: new THREE.Vector2(0.35, 0.35), transparent: true, opacity: 0.88 });
  };
  const p = SPOTS.pond;
  const pond = new THREE.Mesh(new THREE.CircleGeometry(1, 48), waterMat(3));
  pond.scale.set(p.rx, p.rz, 1); pond.rotation.x = -Math.PI / 2; pond.position.set(p.x, 0.06, p.z);
  pond.userData.keep = true; pond.receiveShadow = true; kept.add(pond);
  const st = SPOTS.stream;
  const stream = new THREE.Mesh(new THREE.PlaneGeometry(WORLD, st.half * 2), waterMat(10));
  (stream.material as THREE.MeshStandardMaterial).normalMap!.repeat.set(24, 1);
  stream.rotation.x = -Math.PI / 2; stream.position.set(0, 0.06, st.z);
  stream.userData.keep = true; stream.receiveShadow = true; kept.add(stream);

  // Distant hills
  for (let i = 0; i < 26; i++) {
    const a = (i / 26) * Math.PI * 2, rad = 46 + r() * 6;
    root.add(mesh(SPH, season === 'winter' ? '#E3ECEF' : season === 'autumn' ? '#BFC47A' : '#9CCB7F', Math.cos(a) * rad, -2, Math.sin(a) * rad, { s: [10 + r() * 6, 5 + r() * 3, 10 + r() * 6] }));
  }

  // Plaza & fountain
  const f = new THREE.Group();
  f.add(mesh(CYL(2.2, 2.35, 0.55, 32), '#D8CFC4', 0, 0.27, 0));
  f.add(mesh(new THREE.TorusGeometry(2.15, 0.16, 10, 40), '#E8E1D7', 0, 0.56, 0, { rx: Math.PI / 2 }));
  f.add(mesh(CYL(0.35, 0.45, 1.6, 16), '#E8E1D7', 0, 0.8, 0));
  f.add(mesh(CYL(0.95, 0.55, 0.3, 24), '#E8E1D7', 0, 1.6, 0));
  f.add(mesh(SPH, '#E8E1D7', 0, 2.0, 0, { s: [0.28, 0.4, 0.28] }));
  root.add(f);
  const fWater = new THREE.Mesh(new THREE.CircleGeometry(2.0, 32), waterMat(1.2));
  fWater.rotation.x = -Math.PI / 2; fWater.position.y = 0.5; fWater.userData.keep = true; kept.add(fWater);
  const fWater2 = new THREE.Mesh(new THREE.CircleGeometry(0.85, 24), waterMat(0.6));
  fWater2.rotation.x = -Math.PI / 2; fWater2.position.y = 1.76; fWater2.userData.keep = true; kept.add(fWater2);
  circ(0, 0, 2.5);
  for (const [x, z, ry] of [[-5.6, 3.2, 2.1], [5.6, 3.2, -2.1], [-5.8, -2.6, 1.15]] as [number, number, number][]) {
    root.add(bench(x, z, ry)); circ(x, z, 0.9); benches.push({ x, z, ry });
  }
  const lampSpots: V2[] = [[-5.2, -5.2], [5.2, -5.2], [-5.2, 5.2], [5.2, 5.2], [-2, 11.5], [2.6, -12], [-9, -2], [9, -2]];
  for (const [x, z] of lampSpots) { root.add(lamp(x, z)); circ(x, z, 0.32); }
  // Planters
  for (const [x, z] of [[3.6, -6.2], [-3.6, -6.2], [6.6, 0.9], [-6.6, 0.9]] as V2[]) {
    root.add(mesh(rbox(1.0, 0.5, 1.0, 0.15), '#D9A877', x, 0.25, z));
    for (let i = 0; i < 5; i++) root.add(mesh(SPH_SMALL, ['#F28FA6', '#F6C343', '#FFFFFF', '#B6A3D9'][i % 4], x + (r() - 0.5) * 0.6, 0.6, z + (r() - 0.5) * 0.6, { s: [0.14, 0.12, 0.14] }));
    root.add(mesh(SPH, '#7DB46C', x, 0.52, z, { s: [0.45, 0.2, 0.45] }));
    circ(x, z, 0.7);
  }
  // Notice board
  const [nx, nz] = SPOTS.notice;
  const nb = new THREE.Group(); nb.position.set(nx, 0, nz); nb.rotation.y = -0.35;
  for (const sx of [-0.85, 0.85]) nb.add(mesh(rbox(0.14, 2.0, 0.14, 0.05), '#8A6A55', sx, 1.0, 0));
  nb.add(mesh(rbox(1.9, 1.15, 0.12, 0.08), '#C98B5B', 0, 1.35, 0));
  nb.add(mesh(rbox(2.2, 0.16, 0.5, 0.07), '#B0644E', 0, 2.05, 0));
  nb.add(mesh(rbox(0.7, 0.8, 0.02, 0.01), '#FFF8EC', -0.4, 1.38, 0.07, { rz: 0.05 }));
  nb.add(mesh(rbox(0.6, 0.55, 0.02, 0.01), '#FBE2E4', 0.45, 1.45, 0.07, { rz: -0.06 }));
  nb.add(mesh(SPH_SMALL, '#E8566C', -0.4, 1.72, 0.09, { s: [0.04, 0.04, 0.04] }));
  root.add(nb); circ(nx, nz, 1.0);

  // Buildings: [center, opts, sign text, awning colors]
  const cafe = house({ w: 6.4, d: 5, h: 3.2, wall: '#FBE6D2', roof: '#E8857A', trim: '#FFFFFF', door: '#C98B5B', chimney: true });
  cafe.position.set(SPOTS.cafeBuilding[0], 0, SPOTS.cafeBuilding[1]); root.add(cafe);
  box(SPOTS.cafeBuilding[0], SPOTS.cafeBuilding[1], 6.6, 5.2);
  chimneys.push(new THREE.Vector3(SPOTS.cafeBuilding[0] + 1.8, 6.0, SPOTS.cafeBuilding[1] - 0.9));
  const store = house({ w: 6.4, d: 5, h: 3.2, wall: '#FFF2DC', roof: '#7FC3A8', trim: '#FFFFFF', door: '#6E9FC4' });
  store.position.set(SPOTS.storeBuilding[0], 0, SPOTS.storeBuilding[1]); root.add(store);
  box(SPOTS.storeBuilding[0], SPOTS.storeBuilding[1], 6.6, 5.2);
  const home = house({ w: 5, d: 4.4, h: 2.8, wall: '#FFF6E9', roof: '#8FB8DE', trim: '#FFFFFF', door: '#E5735F', chimney: true });
  home.position.set(SPOTS.homeBuilding[0], 0, SPOTS.homeBuilding[1]); root.add(home);
  box(SPOTS.homeBuilding[0], SPOTS.homeBuilding[1], 5.2, 4.6);
  chimneys.push(new THREE.Vector3(SPOTS.homeBuilding[0] + 1.4, 5.1, SPOTS.homeBuilding[1] - 0.8));
  const homes: [V2, HouseOpts][] = [
    [SPOTS.biscuitHouse, { w: 4.2, d: 4, h: 2.6, wall: '#F3D9BF', roof: '#D9925E', trim: '#FFF6E9', door: '#8A5A3B', chimney: true }],
    [SPOTS.pipHouse, { w: 4.2, d: 4, h: 2.6, wall: '#FFFFFF', roof: '#F2A7B0', trim: '#FFF6E9', door: '#8FCB9B' }],
    [SPOTS.yuzuHouse, { w: 3.8, d: 3.6, h: 2.4, wall: '#EADCC2', roof: '#E3C06E', trim: '#FFF6E9', door: '#B98A5E' }],
  ];
  for (const [[x, z], o] of homes) {
    const hh = house(o); hh.position.set(x, 0, z); root.add(hh); box(x, z, o.w + 0.2, o.d + 0.2);
    if (o.chimney) chimneys.push(new THREE.Vector3(x + o.w * 0.28, o.h + 2.3, z - o.d * 0.18));
  }
  // Mailbox
  root.add(mesh(rbox(0.12, 1.0, 0.12, 0.04), '#8A6A55', 2.3, 0.5, 17.6));
  root.add(mesh(rbox(0.5, 0.38, 0.6, 0.16), '#8FB8DE', 2.3, 1.15, 17.6));
  root.add(mesh(rbox(0.05, 0.25, 0.08, 0.02), '#E8566C', 2.56, 1.3, 17.5));
  circ(2.3, 17.6, 0.35);

  // Shop awnings + signs (kept: textured)
  const sign = (text: string, x: number, y: number, z: number, bg: string, fg: string) => {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(2.4, 0.75), new THREE.MeshStandardMaterial({ map: signTexture(text, bg, fg), roughness: 0.8, transparent: true }));
    m.position.set(x, y, z); m.userData.keep = true; kept.add(m);
    return m;
  };
  const awning = (x: number, z: number, w: number, c1: string, c2: string) => {
    const geo = new THREE.CylinderGeometry(0.7, 0.7, w, 24, 1, true, 0, Math.PI / 2);
    const m = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ map: stripes(c1, c2, 12), side: THREE.DoubleSide, roughness: 0.85 }));
    m.rotation.z = Math.PI / 2;
    m.position.set(x, 2.45, z);
    m.castShadow = true; m.userData.keep = true; kept.add(m);
    for (let i = 0; i < 12; i++) {
      const s = mesh(SPH_SMALL, i % 2 ? c2 : c1, x - w / 2 + (i + 0.5) * (w / 12), 2.42, z + 0.7, { s: [w / 24, 0.09, 0.05] });
      root.add(s);
    }
  };
  const cz = SPOTS.cafeBuilding[1] + 2.52, sz = SPOTS.storeBuilding[1] + 2.52;
  awning(SPOTS.cafeBuilding[0], cz, 6.2, '#F6B6B9', '#FFF6EE');
  awning(SPOTS.storeBuilding[0], sz, 6.2, '#9ED5BC', '#FFF6EE');
  const signs = {
    cafe: sign('', SPOTS.cafeBuilding[0], 2.86, cz + 0.76, '#FFF6EE', '#C2575F'),
    store: sign('', SPOTS.storeBuilding[0], 2.86, sz + 0.76, '#FFF6EE', '#3E8E6E'),
  };
  (kept as any).signs = signs;

  // Café terrace
  for (const [x, z] of [[-15.2, -3.4], [-8.6, -3.2]] as V2[]) {
    root.add(mesh(CYL(0.55, 0.55, 0.08, 20), '#FFFFFF', x, 0.8, z));
    root.add(mesh(CYL(0.06, 0.06, 0.8, 8), '#8A6A55', x, 0.4, z));
    root.add(mesh(CYL(0.06, 0.06, 1.7, 8), '#FFFFFF', x, 1.65, z));
    root.add(mesh(new THREE.ConeGeometry(1.25, 0.55, 12), '#F6B6B9', x, 2.6, z));
    root.add(mesh(SPH_SMALL, '#C98B5B', x + 0.15, 0.9, z, { s: [0.14, 0.08, 0.14] }));
    for (const sx of [-0.85, 0.85]) {
      root.add(mesh(rbox(0.45, 0.08, 0.45, 0.04), '#E9B872', x + sx, 0.48, z));
      for (const lx of [-0.17, 0.17]) root.add(mesh(CYL(0.03, 0.03, 0.48, 6), '#8A6A55', x + sx + lx, 0.24, z));
      root.add(mesh(rbox(0.45, 0.4, 0.06, 0.03), '#E9B872', x + sx + (sx > 0 ? 0.2 : -0.2), 0.7, z, { ry: Math.PI / 2 }));
    }
    circ(x, z, 1.4);
  }
  // Store crates
  for (const [x, z, c] of [[8.4, -5.2, '#E8566C'], [9.6, -5.0, '#F2A25A'], [15.4, -5.2, '#7DB46C']] as [number, number, string][]) {
    root.add(mesh(rbox(0.95, 0.6, 0.75, 0.06), '#D9A877', x, 0.3, z));
    for (let i = 0; i < 6; i++) root.add(mesh(SPH_SMALL, c, x - 0.3 + (i % 3) * 0.3, 0.68, z - 0.15 + Math.floor(i / 3) * 0.3, { s: [0.14, 0.14, 0.14] }));
    circ(x, z, 0.6);
  }
  root.add(mesh(CYL(0.4, 0.4, 0.9, 14), '#B9875E', 15.6, 0.45, -3.9)); circ(15.6, -3.9, 0.5);

  // Garden: beds, flowers (pickable ones kept separate), fence, big tree
  for (const [x, z] of [[8.2, 9.6], [12.2, 9.6], [8.2, 12.2], [12.2, 12.2]] as V2[]) {
    root.add(mesh(rbox(3.3, 0.22, 1.7, 0.1), season === 'winter' ? '#C9B8A6' : '#9C7356', x, 0.11, z));
    if (season !== 'winter') for (let i = 0; i < 7; i++) root.add(flower(r, x - 1.3 + i * 0.43, z + (i % 2 ? 0.3 : -0.3)));
  }
  root.add(fence(6.0, 8.3, 6.0, 13.6)); root.add(fence(14.4, 8.3, 14.4, 13.6)); root.add(fence(6.0, 13.6, 14.4, 13.6));
  box(6.0, 10.95, 0.3, 5.3); box(14.4, 10.95, 0.3, 5.3); box(10.2, 13.6, 8.6, 0.3);
  const flowers: THREE.Object3D[] = SPOTS.flowers.map(([x, z]) => {
    const fl = flower(r, x, z, '#E8566C'); fl.scale.setScalar(1.6); fl.userData.keep = true;
    fl.traverse((o) => { o.userData.keep = true; (o as THREE.Mesh).castShadow = true; });
    kept.add(fl); return fl;
  });
  const [btx, btz] = SPOTS.bigTree;
  root.add(tree(r, season, btx, btz, 1.7)); circ(btx, btz, 0.8);

  // Pond dressing: dock, rocks, reeds, lily pads
  const d = SPOTS.dockRect;
  root.add(mesh(rbox(d.maxX - d.minX + 0.6, 0.16, d.maxZ - d.minZ, 0.05), '#C9925F', (d.minX + d.maxX) / 2, 0.32, (d.minZ + d.maxZ) / 2));
  for (let x = d.minX + 0.2; x < d.maxX + 0.4; x += 0.5) root.add(mesh(rbox(0.04, 0.02, d.maxZ - d.minZ, 0.01), '#A9764B', x, 0.41, (d.minZ + d.maxZ) / 2));
  for (const x of [d.minX + 0.1, (d.minX + d.maxX) / 2]) for (const z of [d.minZ, d.maxZ]) root.add(mesh(CYL(0.12, 0.12, 0.9, 8), '#8A6A55', x, 0.25, z));
  for (let i = 0; i < 26; i++) {
    const a = (i / 26) * Math.PI * 2;
    if (Math.abs(Math.atan2(Math.sin(a), Math.cos(a))) < 0.25) continue; // leave the dock side open
    root.add(rock(r, p.x + Math.cos(a) * (p.rx + 0.35), p.z + Math.sin(a) * (p.rz + 0.35), 0.8 + r() * 0.5));
  }
  for (let i = 0; i < 9; i++) {
    const a = r() * Math.PI * 2, rad = 0.5 + r() * 0.35;
    root.add(mesh(CYL(1, 1, 0.03, 14), '#7DB46C', p.x + Math.cos(a) * p.rx * rad, 0.09, p.z + Math.sin(a) * p.rz * rad, { s: [0.45, 1, 0.45] }));
    if (r() < 0.4) root.add(mesh(SPH_SMALL, '#F7C6D3', p.x + Math.cos(a) * p.rx * rad, 0.17, p.z + Math.sin(a) * p.rz * rad, { s: [0.13, 0.08, 0.13] }));
  }
  for (const [x, z] of [[-19.6, 7], [-19.2, 13], [-12, 5.2], [-16, 14.6]] as V2[]) {
    for (let i = 0; i < 4; i++) {
      const rx = x + (r() - 0.5) * 0.8, rz = z + (r() - 0.5) * 0.6, h = 0.9 + r() * 0.6;
      root.add(mesh(CYL(0.025, 0.03, h, 5), '#6FAE62', rx, h / 2, rz));
      root.add(mesh(new THREE.CapsuleGeometry(0.05, 0.16, 4, 8), '#8A5A3B', rx, h + 0.05, rz));
    }
  }

  // Bridge + forest log
  const b = SPOTS.bridge;
  const bl = b.maxZ - b.minZ;
  root.add(mesh(rbox(2.6, 0.22, bl, 0.08), '#C9925F', 0, 0.3, (b.minZ + b.maxZ) / 2));
  for (const sx of [-1.25, 1.25]) {
    root.add(mesh(rbox(0.12, 0.12, bl, 0.04), '#B0644E', sx, 0.95, (b.minZ + b.maxZ) / 2));
    for (let zz = b.minZ; zz <= b.maxZ + 0.01; zz += bl / 3) root.add(mesh(rbox(0.16, 0.9, 0.16, 0.05), '#B0644E', sx, 0.55, zz));
  }
  const log = new THREE.Group();
  const [lx, lz] = SPOTS.forestLog;
  log.position.set(lx, 0, lz);
  const logBody = new THREE.Mesh(CYL(0.5, 0.55, 5.2, 16), new THREE.MeshStandardMaterial({ color: '#8E6B4E', roughness: 0.9 }));
  logBody.rotation.z = Math.PI / 2; logBody.position.y = 0.5; logBody.castShadow = true;
  const ring = new THREE.Mesh(new THREE.CircleGeometry(0.5, 16), new THREE.MeshStandardMaterial({ color: '#E2C49B' }));
  ring.position.set(2.61, 0.5, 0); ring.rotation.y = Math.PI / 2;
  log.add(logBody, ring);
  for (const x of [-1.2, 0.4, 1.6]) {
    const m = new THREE.Mesh(SPH_SMALL, new THREE.MeshStandardMaterial({ color: '#E8566C' }));
    m.scale.set(0.16, 0.1, 0.16); m.position.set(x, 1.0, 0.1); log.add(m);
  }
  log.traverse((o) => (o.userData.keep = true));
  kept.add(log);
  colliders.push({ kind: 'box', minX: -2.7, maxX: 2.7, minZ: lz - 0.6, maxZ: lz + 0.6, tag: 'log' });

  // Clearing: stumps, bench, pickable mushrooms
  root.add(bench(0, -32.2, 0)); circ(0, -32.2, 1.0); benches.push({ x: 0, z: -32.2, ry: 0 });
  for (const [x, z] of [[-3.6, -27.5], [3.8, -31.2]] as V2[]) {
    root.add(mesh(CYL(0.5, 0.6, 0.5, 14), '#A07A55', x, 0.25, z));
    root.add(mesh(CYL(0.5, 0.5, 0.02, 14), '#E2C49B', x, 0.51, z));
    circ(x, z, 0.6);
  }
  const mushrooms: THREE.Object3D[] = SPOTS.mushrooms.map(([x, z]) => {
    const g = new THREE.Group(); g.position.set(x, 0, z);
    const stem = new THREE.Mesh(CYL(0.08, 0.1, 0.3, 8), new THREE.MeshStandardMaterial({ color: '#FFF4E3' })); stem.position.y = 0.15;
    const cap = new THREE.Mesh(new THREE.SphereGeometry(0.22, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2), new THREE.MeshStandardMaterial({ color: '#E8566C' })); cap.position.y = 0.28;
    g.add(stem, cap);
    for (let i = 0; i < 4; i++) { const s = new THREE.Mesh(SPH_SMALL, new THREE.MeshStandardMaterial({ color: '#fff' })); s.scale.setScalar(0.035); const a = i * 1.6; s.position.set(Math.cos(a) * 0.13, 0.43, Math.sin(a) * 0.13); g.add(s); }
    g.traverse((o) => { o.userData.keep = true; (o as THREE.Mesh).castShadow = true; });
    kept.add(g); return g;
  });

  // Bus stop at the village edge
  root.add(mesh(CYL(0.06, 0.06, 2.3, 8), '#6E6A7A', 3.2, 1.15, 23.6));
  root.add(mesh(CYL(0.42, 0.42, 0.08, 20), '#8FB8DE', 3.2, 2.35, 23.6, { rx: Math.PI / 2 }));
  root.add(bench(4.6, 24.4, Math.PI)); circ(4.6, 24.4, 0.9); benches.push({ x: 4.6, z: 24.4, ry: Math.PI }); circ(3.2, 23.6, 0.2);

  // Trees: decorative inside the village, dense forest outside
  const nearPath = (x: number, z: number, m: number) => EDGES.some(([a, bb]) => {
    const A = NODES[a], B = NODES[bb];
    const vx = B[0] - A[0], vz = B[1] - A[1];
    const t = Math.max(0, Math.min(1, ((x - A[0]) * vx + (z - A[1]) * vz) / (vx * vx + vz * vz)));
    return Math.hypot(x - (A[0] + vx * t), z - (A[1] + vz * t)) < m;
  });
  const blocked = (x: number, z: number) => {
    if (nearPath(x, z, 2.4)) return true;
    if (Math.hypot(x, z) < 9.5) return true;
    if (Math.abs(x) < 2.6 && z > 17) return true;
    if (((x - p.x) / (p.rx + 2.2)) ** 2 + ((z - p.z) / (p.rz + 2.2)) ** 2 < 1) return true;
    if (Math.abs(z - st.z) < st.half + 1.2) return true;
    if (Math.hypot(x - 0, z + 29.5) < 5.5) return true;
    if (Math.abs(x - SPOTS.forestLog[0]) < 3.5 && Math.abs(z - SPOTS.forestLog[1]) < 1.6) return true;
    if (x > 5 && x < 17 && z > 3 && z < 15) return true;
    // keep camera sightlines clear south of every gathering spot
    if (Object.values(NODES).some(([nx, nz]) => Math.abs(x - nx) < 4.5 && z > nz - 1 && z < nz + 8)) return true;
    return colliders.some((c) => c.kind === 'box' && x > c.minX - 1.6 && x < c.maxX + 1.6 && z > c.minZ - 1.6 && z < c.maxZ + 1.6);
  };
  for (let gx = -44; gx <= 44; gx += 2.9) for (let gz = -44; gz <= 44; gz += 2.9) {
    const x = gx + (r() - 0.5) * 2.0, z = gz + (r() - 0.5) * 2.0;
    const outside = x < BOUNDS.minX + 3 || x > BOUNDS.maxX - 3 || z > BOUNDS.maxZ - 2 || z < st.z - st.half - 0.8;
    const inside = !outside && r() < 0.06;
    if (!(outside || inside) || blocked(x, z)) continue;
    if (Math.hypot(x, z) > 46) continue;
    if (outside && z > BOUNDS.maxZ - 2 && Math.abs(x) < 5) continue;
    const kind = z < -20 && r() < 0.5 ? 'pine' : season === 'spring' && r() < 0.35 ? 'blossom' : r() < 0.2 ? 'pine' : 'round';
    root.add(tree(r, season, x, z, 1, kind));
    if (Math.abs(x) < 33 && z > -40 && z < 30) circ(x, z, 0.55);
  }
  // Bushes & scattered flowers
  for (let i = 0; i < 70; i++) {
    const x = (r() - 0.5) * 56, z = -16 + r() * 40;
    if (blocked(x, z) && !nearPath(x, z, 2.4) ) continue;
    if (nearPath(x, z, 1.6) || Math.hypot(x, z) < 8.2) continue;
    if (((x - p.x) / (p.rx + 1)) ** 2 + ((z - p.z) / (p.rz + 1)) ** 2 < 1) continue;
    if (colliders.some((c) => c.kind === 'box' && x > c.minX - 0.4 && x < c.maxX + 0.4 && z > c.minZ - 0.4 && z < c.maxZ + 0.4)) continue;
    if (r() < 0.35) {
      root.add(mesh(SPH_LO, season === 'autumn' ? '#C9B35E' : season === 'winter' ? '#E3ECEF' : '#7DB46C', x, 0.25, z, { s: [0.65, 0.5, 0.6] }));
      circ(x, z, 0.5);
    } else root.add(flower(r, x, z));
  }

  // Seasonal decorations
  const deco: V2[] = [[-9.3, -5.6], [9.0, -6.0], [-2.8, 17.4], [-3.4, 4.9], [-15.6, -5.6]];
  for (const [x, z] of deco) {
    if (season === 'autumn') {
      root.add(mesh(SPH, '#F2913D', x, 0.28, z, { s: [0.4, 0.3, 0.4] }));
      root.add(mesh(CYL(0.04, 0.05, 0.18, 6), '#6B4A2F', x, 0.62, z));
      root.add(mesh(SPH, '#E9A55B', x + 0.55, 0.12, z + 0.2, { s: [0.5, 0.12, 0.45] }));
      circ(x, z, 0.45);
    } else if (season === 'winter') {
      root.add(mesh(SPH, '#FFFFFF', x, 0.45, z, { s: [0.5, 0.45, 0.5] }));
      root.add(mesh(SPH, '#FFFFFF', x, 1.05, z, { s: [0.34, 0.32, 0.34] }));
      root.add(mesh(new THREE.ConeGeometry(0.06, 0.25, 8), '#F2913D', x, 1.05, z + 0.38, { rx: Math.PI / 2 }));
      root.add(mesh(new THREE.TorusGeometry(0.3, 0.07, 8, 20), '#E5735F', x, 0.8, z, { rx: Math.PI / 2 }));
      circ(x, z, 0.55);
    } else if (season === 'summer') {
      for (let i = 0; i < 3; i++) {
        root.add(mesh(CYL(0.035, 0.04, 1.4, 6), '#6FAE62', x + i * 0.35, 0.7, z));
        root.add(mesh(CYL(0.22, 0.22, 0.06, 14), '#F6C343', x + i * 0.35, 1.45, z + 0.04, { rx: Math.PI / 2 }));
        root.add(mesh(CYL(0.1, 0.1, 0.07, 10), '#8A5A3B', x + i * 0.35, 1.45, z + 0.07, { rx: Math.PI / 2 }));
      }
    } else {
      for (let i = 0; i < 6; i++) root.add(flower(r, x + (r() - 0.5) * 1.2, z + (r() - 0.5) * 1.2, '#F7C6D3'));
    }
  }

  // Glow material for windows & lanterns (intensity driven by time of day)
  const glowMat = new THREE.MeshStandardMaterial({ vertexColors: true, emissive: new THREE.Color('#FFC870'), emissiveIntensity: 0, roughness: 0.6 });
  const group = new THREE.Group();
  for (const m of bake(root, glowMat)) group.add(m);
  group.add(kept);
  (group as any).signs = signs;

  const lamps: THREE.PointLight[] = [];
  for (const [x, z] of [[-5.2, -5.2], [5.2, 5.2], [-2, 11.5]] as V2[]) {
    const l = new THREE.PointLight('#FFC27A', 0, 11, 1.6);
    l.position.set(x, 2.7, z); group.add(l); lamps.push(l);
  }

  const isWater = (x: number, z: number) => {
    const dk = SPOTS.dockRect;
    if (x > dk.minX && x < dk.maxX && z > dk.minZ && z < dk.maxZ) return false;
    if (((x - p.x) / (p.rx + 0.2)) ** 2 + ((z - p.z) / (p.rz + 0.2)) ** 2 < 1) return true;
    if (Math.abs(z - st.z) < st.half + 0.1 && !(Math.abs(x) < b.halfW - 0.25 && z > b.minZ && z < b.maxZ)) return true;
    return false;
  };

  return { group, colliders, waters, glowMat, lamps, log, flowers, mushrooms, chimneys, fountainTop: new THREE.Vector3(0, 2.3, 0), isWater, benches };
}

/** Update the shop signs so they read in the language being learned. */
export function setSigns(v: Village, cafe: string, store: string, family?: string, weight?: number) {
  const s = (v.group as any).signs as Record<string, THREE.Mesh>;
  const upd = (m: THREE.Mesh, text: string, bg: string, fg: string) => {
    const mat = m.material as THREE.MeshStandardMaterial;
    mat.map?.dispose();
    mat.map = signTexture(text, bg, fg, family, weight);
    mat.needsUpdate = true;
  };
  upd(s.cafe, cafe, '#FFF6EE', '#C2575F');
  upd(s.store, store, '#FFF6EE', '#3E8E6E');
}
