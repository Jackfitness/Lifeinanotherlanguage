import * as THREE from 'three';
import type { V2 } from '../../content/places';
import { canvas, signTexture, stripes, waterNormal, GRASS, type Season } from '../textures';
import {
  bake, bench, C, CYL, fence, flower, house, lamp, mesh, rbox, rng, rock, SPH, SPH_SMALL, tree,
  type Collider, type Village,
} from '../village';

/** World layout anchors for Clover Meadow. -Z is north. */
export const CLOVER_NODES: Record<string, V2> = {
  bus: [0, 19], plazaS: [0, 5], plazaN: [0, -5], plazaW: [-5, 0], plazaE: [5, 0],
  hall: [-11, 3.4], post: [11, 3.4], sw: [-6, 10], se: [6, 10], kitchen: [-11, 15.2], kitchenSide: [-7.6, 15.6],
  market: [10.5, 13], dojo: [3.4, -12.4], park: [9, -10.5], parkW: [4, -8],
};
export const CLOVER_EDGES: [string, string][] = [
  ['bus', 'plazaS'], ['plazaS', 'plazaW'], ['plazaS', 'plazaE'], ['plazaN', 'plazaW'], ['plazaN', 'plazaE'],
  ['plazaW', 'hall'], ['plazaE', 'post'], ['plazaS', 'sw'], ['sw', 'kitchen'], ['sw', 'kitchenSide'], ['plazaS', 'se'], ['se', 'market'],
  ['plazaN', 'dojo'], ['plazaN', 'parkW'], ['parkW', 'park'],
];
export const CLOVER_SPOTS = {
  spawn: [0, 17.5] as V2,
  bus: [1.8, 19.5] as V2,
  dojoDoor: [0, -14.2] as V2,
  tower: [0, 0] as V2,
  pond: { x: 13, z: -14, rx: 5, rz: 3.6 },
};
export const CLOVER_BOUNDS = { minX: -24, maxX: 24, minZ: -24, maxZ: 22 };
const WORLD = 80;

export interface Town extends Village {
  nodes: Record<string, V2>;
  edges: [string, string][];
  bell: THREE.Object3D;
  windmill: THREE.Object3D;
  bounds: typeof CLOVER_BOUNDS;
}

function paintGround(season: Season) {
  const px = 1536;
  const [c, ctx] = canvas(px);
  const k = px / WORLD, W = (x: number) => (x + WORLD / 2) * k;
  const r = rng(77);
  const [g0, g1, g2] = GRASS[season === 'winter' ? 'winter' : season];
  ctx.fillStyle = g0; ctx.fillRect(0, 0, px, px);
  for (let i = 0; i < 1800; i++) {
    ctx.fillStyle = r() < 0.5 ? g1 : g2; ctx.globalAlpha = 0.25 + r() * 0.3;
    ctx.beginPath(); ctx.ellipse(r() * px, r() * px, 6 + r() * 26, 4 + r() * 16, r() * 3, 0, Math.PI * 2); ctx.fill();
  }
  // clover patches
  ctx.globalAlpha = 0.5;
  for (let i = 0; i < 500; i++) { ctx.fillStyle = r() < 0.5 ? '#8CC77A' : '#A6D58E'; const x = r() * px, y = r() * px; for (let j = 0; j < 3; j++) { ctx.beginPath(); ctx.arc(x + Math.cos(j * 2.1) * 4, y + Math.sin(j * 2.1) * 4, 4, 0, 7); ctx.fill(); } }
  ctx.globalAlpha = 1;
  const pathCol = '#ECD7AE', pathEdge = '#D9BE8C';
  const drawPaths = (w: number, col: string) => {
    ctx.strokeStyle = col; ctx.lineWidth = w * k; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    for (const [a, b] of CLOVER_EDGES) {
      const A = CLOVER_NODES[a], B = CLOVER_NODES[b];
      ctx.beginPath(); ctx.moveTo(W(A[0]), W(A[1])); ctx.lineTo(W(B[0]), W(B[1])); ctx.stroke();
    }
    ctx.beginPath(); ctx.moveTo(W(0), W(19)); ctx.lineTo(W(0), W(40)); ctx.stroke();
  };
  drawPaths(2.6, pathEdge); drawPaths(2.1, pathCol);
  ctx.fillStyle = pathEdge; ctx.beginPath(); ctx.arc(W(0), W(0), 7.6 * k, 0, 7); ctx.fill();
  ctx.fillStyle = '#F4E6C9'; ctx.beginPath(); ctx.arc(W(0), W(0), 7.2 * k, 0, 7); ctx.fill();
  ctx.strokeStyle = 'rgba(190,150,100,.35)'; ctx.lineWidth = 2;
  for (let i = 0; i < 16; i++) { const a = (i / 16) * Math.PI * 2; ctx.beginPath(); ctx.moveTo(W(0) + Math.cos(a) * 2.2 * k, W(0) + Math.sin(a) * 2.2 * k); ctx.lineTo(W(0) + Math.cos(a) * 7.2 * k, W(0) + Math.sin(a) * 7.2 * k); ctx.stroke(); }
  // dojo courtyard (raked gravel)
  ctx.fillStyle = '#E9E2D2'; ctx.beginPath(); (ctx as any).roundRect(W(-5), W(-21), 10 * k, 9.5 * k, 2 * k); ctx.fill();
  ctx.strokeStyle = 'rgba(160,150,130,.4)'; for (let y = -20.5; y < -12; y += 0.6) { ctx.beginPath(); ctx.moveTo(W(-4.6), W(y)); ctx.lineTo(W(4.6), W(y)); ctx.stroke(); }
  // pond bank
  const p = CLOVER_SPOTS.pond;
  ctx.fillStyle = '#E5D3A8'; ctx.beginPath(); ctx.ellipse(W(p.x), W(p.z), (p.rx + 0.9) * k, (p.rz + 0.9) * k, 0, 0, 7); ctx.fill();
  ctx.fillStyle = '#6FA9A8'; ctx.beginPath(); ctx.ellipse(W(p.x), W(p.z), (p.rx + 0.1) * k, (p.rz + 0.1) * k, 0, 0, 7); ctx.fill();
  // fields west
  ctx.fillStyle = season === 'winter' ? '#DDE6EA' : '#C9DE8E';
  for (let i = 0; i < 4; i++) { ctx.beginPath(); (ctx as any).roundRect(W(-22), W(-18 + i * 4.2), 9 * k, 3.4 * k, 1 * k); ctx.fill(); }
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8;
  return t;
}

function dojoBuilding() {
  const g = new THREE.Group();
  g.add(mesh(rbox(9, 0.7, 6.4, 0.15), '#B9A68E', 0, 0.35, 0));          // stone base
  g.add(mesh(rbox(8, 3.2, 5.4, 0.2), '#FFF8EC', 0, 2.3, 0));           // plaster walls
  for (const x of [-3.9, -1.3, 1.3, 3.9]) g.add(mesh(rbox(0.3, 3.3, 0.3, 0.06), '#7A4E36', x, 2.3, 2.75)); // posts
  g.add(mesh(rbox(8.3, 0.3, 0.32, 0.06), '#7A4E36', 0, 3.85, 2.75));
  g.add(mesh(rbox(8.3, 0.25, 0.32, 0.06), '#7A4E36', 0, 0.85, 2.75));
  // sliding doors with lattice
  g.add(mesh(rbox(2.4, 2.6, 0.12, 0.04), '#FBF1DC', 0, 2.1, 2.72));
  for (let i = -1; i <= 1; i++) g.add(mesh(rbox(0.06, 2.6, 0.14, 0.02), '#7A4E36', i * 0.8, 2.1, 2.76));
  for (let j = 0; j < 4; j++) g.add(mesh(rbox(2.4, 0.06, 0.14, 0.02), '#7A4E36', 0, 1.0 + j * 0.7, 2.76));
  // curved roof: two sweeping slabs with upturned eaves
  for (const side of [1, -1]) {
    g.add(mesh(rbox(10.4, 0.34, 4.4, 0.14), '#3F4A5E', 0, 4.9, side * 1.65, { rx: side * 0.48 }));
    g.add(mesh(rbox(10.6, 0.3, 1.2, 0.12), '#3F4A5E', 0, 4.12, side * 3.7, { rx: side * 0.12 }));
  }
  g.add(mesh(rbox(10.8, 0.5, 0.6, 0.2), '#2F3848', 0, 5.95, 0));
  for (const x of [-5.3, 5.3]) g.add(mesh(SPH_SMALL, '#2F3848', x, 6.0, 0, { s: [0.35, 0.45, 0.35] }));
  // steps
  g.add(mesh(rbox(3.4, 0.25, 1.0, 0.08), '#B9A68E', 0, 0.12, 3.6));
  return g;
}

function clockTower() {
  const g = new THREE.Group();
  g.add(mesh(CYL(2.1, 2.3, 0.6, 24), '#D8CFC4', 0, 0.3, 0));
  g.add(mesh(rbox(2.6, 6.4, 2.6, 0.25), '#FFF1DC', 0, 3.6, 0));
  g.add(mesh(rbox(2.9, 0.3, 2.9, 0.1), '#E8857A', 0, 6.9, 0));
  for (const [x, z] of [[-1.2, -1.2], [1.2, -1.2], [-1.2, 1.2], [1.2, 1.2]]) g.add(mesh(rbox(0.32, 1.8, 0.32, 0.08), '#FFF1DC', x, 7.9, z));
  g.add(mesh(new THREE.ConeGeometry(2.3, 2.2, 4), '#E8857A', 0, 9.9, 0, { ry: Math.PI / 4 }));
  g.add(mesh(SPH_SMALL, '#F6C343', 0, 11.1, 0, { s: [0.22, 0.22, 0.22] }));
  // clock face
  g.add(mesh(CYL(0.9, 0.9, 0.12, 28), '#FFFCF4', 0, 5.2, 1.32, { rx: Math.PI / 2 }));
  g.add(mesh(rbox(0.08, 0.6, 0.04, 0.02), '#5B4636', 0, 5.4, 1.4));
  g.add(mesh(rbox(0.45, 0.08, 0.04, 0.02), '#5B4636', 0.18, 5.2, 1.4));
  return g;
}

function stall(x: number, z: number, c1: string, c2: string, goods: string[], kept: THREE.Group, root: THREE.Group) {
  const g = new THREE.Group(); g.position.set(x, 0, z);
  g.add(mesh(rbox(3.2, 1.0, 1.4, 0.12), '#C98F5E', 0, 0.5, 0));
  for (const sx of [-1.5, 1.5]) g.add(mesh(rbox(0.16, 2.6, 0.16, 0.05), '#8A5A3B', sx, 1.3, -0.6));
  goods.forEach((col, i) => {
    for (let j = 0; j < 5; j++) g.add(mesh(SPH_SMALL, col, -1.1 + i * 1.1 + (j % 3) * 0.22 - 0.22, 1.12 + Math.floor(j / 3) * 0.14, -0.1 + (j % 2) * 0.25, { s: [0.15, 0.15, 0.15] }));
  });
  root.add(g);
  const roof = new THREE.Mesh(new THREE.PlaneGeometry(3.6, 1.8), new THREE.MeshStandardMaterial({ map: stripes(c1, c2, 8), side: THREE.DoubleSide, roughness: 0.85 }));
  roof.position.set(x, 2.55, z - 0.1); roof.rotation.x = -Math.PI / 2 + 0.35; roof.castShadow = true; roof.userData.keep = true;
  kept.add(roof);
}

function bamboo(r: () => number, x: number, z: number, root: THREE.Group) {
  for (let i = 0; i < 6; i++) {
    const bx = x + (r() - 0.5) * 1.6, bz = z + (r() - 0.5) * 1.6, h = 3.5 + r() * 2.5;
    root.add(mesh(CYL(0.09, 0.11, h, 8), i % 2 ? '#7DB46C' : '#8CC27B', bx, h / 2, bz, { rz: (r() - 0.5) * 0.1 }));
    root.add(mesh(SPH, '#7DB46C', bx, h, bz, { s: [0.6, 0.35, 0.6] }));
  }
}

export function buildClover(season: Season, signs: { hall: string; post: string; restaurant: string; dojo: string; market: string }): Town {
  const r = rng(4321);
  const root = new THREE.Group(), kept = new THREE.Group();
  const colliders: Collider[] = [], waters: THREE.Texture[] = [], benches: { x: number; z: number; ry: number }[] = [];
  const box = (cx: number, cz: number, w: number, d: number) => colliders.push({ kind: 'box', minX: cx - w / 2, maxX: cx + w / 2, minZ: cz - d / 2, maxZ: cz + d / 2 });
  const circ = (x: number, z: number, rr: number) => colliders.push({ kind: 'circle', x, z, r: rr });

  const ground = new THREE.Mesh(new THREE.PlaneGeometry(WORLD, WORLD), new THREE.MeshStandardMaterial({ map: paintGround(season), roughness: 1 }));
  ground.rotation.x = -Math.PI / 2; ground.receiveShadow = true; ground.userData.keep = true; kept.add(ground);

  // Pond
  const p = CLOVER_SPOTS.pond;
  const wn = waterNormal().clone(); wn.needsUpdate = true; wn.repeat.set(3, 3); waters.push(wn);
  const pond = new THREE.Mesh(new THREE.CircleGeometry(1, 40), new THREE.MeshStandardMaterial({ color: '#8CCFD6', roughness: 0.12, normalMap: wn, normalScale: new THREE.Vector2(0.35, 0.35), transparent: true, opacity: 0.9 }));
  pond.scale.set(p.rx, p.rz, 1); pond.rotation.x = -Math.PI / 2; pond.position.set(p.x, 0.06, p.z); pond.userData.keep = true; kept.add(pond);
  for (let i = 0; i < 8; i++) {
    const a = r() * Math.PI * 2, rad = 0.3 + r() * 0.5;
    root.add(mesh(CYL(1, 1, 0.03, 14), '#7DB46C', p.x + Math.cos(a) * p.rx * rad, 0.09, p.z + Math.sin(a) * p.rz * rad, { s: [0.5, 1, 0.5] }));
    if (r() < 0.5) root.add(mesh(SPH_SMALL, '#FFFFFF', p.x + Math.cos(a) * p.rx * rad, 0.18, p.z + Math.sin(a) * p.rz * rad, { s: [0.14, 0.08, 0.14] }));
  }
  for (let i = 0; i < 20; i++) { const a = (i / 20) * Math.PI * 2; root.add(rock(r, p.x + Math.cos(a) * (p.rx + 0.4), p.z + Math.sin(a) * (p.rz + 0.4), 0.7)); }

  // Clock tower (bell kept separately so it can swing when it rings)
  root.add(clockTower()); circ(0, 0, 2.4);
  const bell = new THREE.Group(); bell.position.set(0, 8.6, 0);
  const bellBody = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.75, 1.1, 24, 1, true), new THREE.MeshStandardMaterial({ color: '#D9A94A', metalness: 0.55, roughness: 0.35, side: THREE.DoubleSide }));
  bellBody.position.y = -0.55; bellBody.castShadow = true;
  const bellTop = new THREE.Mesh(new THREE.SphereGeometry(0.36, 20, 10, 0, Math.PI * 2, 0, Math.PI / 2), bellBody.material);
  const clapper = new THREE.Mesh(SPH_SMALL, new THREE.MeshStandardMaterial({ color: '#8A5A3B' })); clapper.scale.setScalar(0.14); clapper.position.y = -1.05;
  bell.add(bellBody, bellTop, clapper); bell.traverse((o) => (o.userData.keep = true)); kept.add(bell);

  // Buildings
  const hall = house({ w: 6, d: 4.6, h: 3.2, wall: '#FFF6E9', roof: '#7FB0D9', trim: '#FFFFFF', door: '#5E95C4', chimney: true });
  hall.position.set(-11, 0, -1); root.add(hall); box(-11, -1, 6.2, 4.8);
  const post = house({ w: 5.2, d: 4.4, h: 3.0, wall: '#FBE6D2', roof: '#E5735F', trim: '#FFFFFF', door: '#E8566C' });
  post.position.set(11, 0, -1); root.add(post); box(11, -1, 5.4, 4.6);
  const resto = house({ w: 5.6, d: 4.4, h: 3.0, wall: '#FFF2DC', roof: '#5E8E74', trim: '#FFFFFF', door: '#B98A5E', chimney: true });
  resto.position.set(-11, 0, 11.2); root.add(resto); box(-11, 11.2, 5.8, 4.6);
  // mailbox for the post office
  root.add(mesh(rbox(0.7, 1.2, 0.6, 0.2), '#E8566C', 13.8, 0.6, 1.6)); circ(13.8, 1.6, 0.5);
  const dojo = dojoBuilding(); dojo.position.set(0, 0, -18); root.add(dojo); box(0, -18, 9.2, 6.6);
  // dojo gate (torii-style) and lanterns
  for (const x of [-2.4, 2.4]) { root.add(mesh(CYL(0.18, 0.2, 3.4, 10), '#C2453B', x, 1.7, -11)); circ(x, -11, 0.3); }
  root.add(mesh(rbox(6, 0.35, 0.4, 0.1), '#C2453B', 0, 3.3, -11)); root.add(mesh(rbox(6.8, 0.3, 0.5, 0.12), '#3F4A5E', 0, 3.65, -11));
  for (const x of [-3.2, 3.2]) { root.add(mesh(rbox(0.5, 1.4, 0.5, 0.1), '#B9A68E', x, 0.7, -13.4)); root.add(mesh(rbox(0.6, 0.5, 0.6, 0.1), '#FFE3A3', x, 1.6, -13.4, { glow: true })); circ(x, -13.4, 0.45); }
  for (const [x, z] of [[-6, -16], [6, -16], [-6.5, -21], [6.5, -21], [-3, -23], [3, -23]] as V2[]) { bamboo(r, x, z, root); circ(x, z, 1.0); }

  // Market stalls
  stall(6.8, 11.2, '#F6C343', '#FFF6EE', ['#E8566C', '#F2913D', '#7DB46C'], kept, root); box(6.8, 11.2, 3.4, 1.6);
  stall(10.5, 11.2, '#F2A7B0', '#FFF6EE', ['#FBE08A', '#E8566C', '#B6A3D9'], kept, root); box(10.5, 11.2, 3.4, 1.6);
  stall(14.2, 11.2, '#9ED5BC', '#FFF6EE', ['#F6C343', '#7DB46C', '#F2913D'], kept, root); box(14.2, 11.2, 3.4, 1.6);

  // Windmill over the fields
  root.add(mesh(new THREE.CylinderGeometry(1.0, 1.6, 6, 12), '#FFF6E9', -18, 3, -12)); circ(-18, -12, 1.7);
  root.add(mesh(new THREE.ConeGeometry(1.4, 1.6, 12), '#E8857A', -18, 6.8, -12));
  const windmill = new THREE.Group(); windmill.position.set(-18, 5.4, -10.8);
  for (let i = 0; i < 4; i++) {
    const blade = new THREE.Mesh(rbox(0.5, 3.4, 0.08, 0.04), new THREE.MeshStandardMaterial({ color: '#FFFCF4' }));
    blade.position.y = 1.8; const arm = new THREE.Group(); arm.rotation.z = (i * Math.PI) / 2; arm.add(blade); windmill.add(arm);
  }
  windmill.add(new THREE.Mesh(SPH_SMALL, new THREE.MeshStandardMaterial({ color: '#8A5A3B' })).translateZ(0.05));
  windmill.traverse((o) => { o.userData.keep = true; (o as THREE.Mesh).castShadow = true; }); kept.add(windmill);
  for (let i = 0; i < 4; i++) for (let j = 0; j < 9; j++) root.add(flower(r, -21.5 + j, -17 + i * 4.2, ['#F6C343', '#F28FA6', '#FFFFFF', '#B6A3D9'][i]));
  root.add(fence(-23, -19, -13, -19)); root.add(fence(-13, -19, -13, -1.5)); box(-18, -19, 10, 0.3); box(-13, -10.25, 0.3, 17.5);

  // Plaza dressing: lamps, benches, lantern strings
  for (const [x, z] of [[-5.4, -5.4], [5.4, -5.4], [-5.4, 5.4], [5.4, 5.4]] as V2[]) { root.add(lamp(x, z)); circ(x, z, 0.32); }
  for (const [x, z, ry] of [[-6, 2.2, 1.9], [6, 2.2, -1.9], [7, -11, -0.6], [11, -9, -2.4]] as [number, number, number][]) { root.add(bench(x, z, ry)); circ(x, z, 0.9); benches.push({ x, z, ry }); }
  for (const [a, b] of [[[-5.4, -5.4], [5.4, 5.4]], [[5.4, -5.4], [-5.4, 5.4]]] as V2[][]) {
    for (let i = 1; i < 10; i++) {
      const t = i / 10, x = a[0] + (b[0] - a[0]) * t, z = a[1] + (b[1] - a[1]) * t;
      const sag = Math.sin(t * Math.PI) * 0.8;
      if (Math.hypot(x, z) < 2.6) continue;
      root.add(mesh(SPH_SMALL, i % 2 ? '#E8566C' : '#FFF6EE', x, 3.1 - sag, z, { s: [0.2, 0.26, 0.2], glow: i % 2 === 0 }));
    }
  }
  // Bus stop
  root.add(mesh(CYL(0.06, 0.06, 2.3, 8), '#6E6A7A', 2.6, 1.15, 19.6));
  root.add(mesh(CYL(0.42, 0.42, 0.08, 20), '#7FB0D9', 2.6, 2.35, 19.6, { rx: Math.PI / 2 }));
  root.add(bench(4.2, 20.6, Math.PI)); circ(4.2, 20.6, 0.9); benches.push({ x: 4.2, z: 20.6, ry: Math.PI });

  // Trees: ring around the town and a few in the park
  for (let gx = -38; gx <= 38; gx += 3) for (let gz = -38; gz <= 38; gz += 3) {
    const x = gx + (r() - 0.5) * 2, z = gz + (r() - 0.5) * 2;
    const outside = x < CLOVER_BOUNDS.minX + 1 || x > CLOVER_BOUNDS.maxX - 1 || z < CLOVER_BOUNDS.minZ + 1 || z > CLOVER_BOUNDS.maxZ - 1;
    if (!outside || Math.hypot(x, z) > 40 || (Math.abs(x) < 4 && z > 18)) continue;
    root.add(tree(r, season, x, z, 1, r() < 0.3 ? 'pine' : season === 'spring' && r() < 0.4 ? 'blossom' : 'round'));
  }
  for (const [x, z] of [[16, -6], [18, -18], [6, -20], [-16, 4], [-17, 18], [17, 18], [18, 5]] as V2[]) { root.add(tree(r, season, x, z, 1.2, season === 'spring' ? 'blossom' : 'round')); circ(x, z, 0.6); }
  for (let i = 0; i < 40; i++) {
    const x = (r() - 0.5) * 40, z = (r() - 0.5) * 36;
    if (Math.hypot(x, z) < 8.5 || Math.abs(x) < 2 || colliders.some((c) => c.kind === 'box' && x > c.minX - 1 && x < c.maxX + 1 && z > c.minZ - 1 && z < c.maxZ + 1)) continue;
    root.add(flower(r, x, z));
  }

  const glowMat = new THREE.MeshStandardMaterial({ vertexColors: true, emissive: new THREE.Color('#FFC870'), emissiveIntensity: 0, roughness: 0.6 });
  const group = new THREE.Group();
  for (const m of bake(root, glowMat)) group.add(m);
  group.add(kept);

  // Japanese signs above the doors
  const sign = (text: string, x: number, y: number, z: number, bg: string, fg: string, w = 2.4) => {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(w, 0.75), new THREE.MeshStandardMaterial({ map: signTexture(text, bg, fg, '"Kiwi Maru", "M PLUS Rounded 1c", sans-serif', 500), transparent: true, roughness: 0.8 }));
    m.position.set(x, y, z); group.add(m);
  };
  sign(signs.hall, -11, 3.75, 1.36, '#FFF6EE', '#3E6E9E');
  sign(signs.post, 11, 3.55, 1.26, '#FFF6EE', '#C2453B');
  sign(signs.restaurant, -11, 3.55, 13.46, '#FFF6EE', '#3E7E5E');
  sign(signs.dojo, 0, 3.3, -10.75, '#FFF8EC', '#3F4A5E', 2.0);
  sign(signs.market, 10.5, 3.1, 11.9, '#FFF6EE', '#B9832A');

  const lamps: THREE.PointLight[] = [];
  for (const [x, z] of [[-5.4, -5.4], [5.4, 5.4], [0, -13.4]] as V2[]) { const l = new THREE.PointLight('#FFC27A', 0, 11, 1.6); l.position.set(x, 2.7, z); group.add(l); lamps.push(l); }

  const isWater = (x: number, z: number) => ((x - p.x) / (p.rx + 0.2)) ** 2 + ((z - p.z) / (p.rz + 0.2)) ** 2 < 1;
  const log = new THREE.Object3D(); log.visible = false;
  return {
    group, colliders, waters, glowMat, lamps, log, flowers: [], mushrooms: [], chimneys: [new THREE.Vector3(-9.3, 5.4, -1.8), new THREE.Vector3(-9.4, 5.2, 10.4)],
    fountainTop: new THREE.Vector3(0, -40, 0), isWater, benches,
    nodes: CLOVER_NODES, edges: CLOVER_EDGES, bell, windmill, bounds: CLOVER_BOUNDS,
  };
}
void C;
