import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { FLOORS, WALLPAPERS, item } from '../content/items';
import { pattern } from './textures';
import { Plush, plushMat } from './plush';
import type { Collider } from './village';

const rb = (w: number, h: number, d: number, r = 0.08) => new RoundedBoxGeometry(w, h, d, 3, Math.min(r, w / 2 - 0.001, h / 2 - 0.001, d / 2 - 0.001));
const std = (color: string, extra: Partial<THREE.MeshStandardMaterialParameters> = {}) => new THREE.MeshStandardMaterial({ color, roughness: 0.8, ...extra });
const M = (geo: THREE.BufferGeometry, mat: THREE.Material, x = 0, y = 0, z = 0) => {
  const m = new THREE.Mesh(geo, mat); m.position.set(x, y, z); m.castShadow = true; m.receiveShadow = true; return m;
};

/** Procedural furniture, built at the origin facing +z. */
export function buildFurniture(id: string): THREE.Group {
  const g = new THREE.Group();
  const def = item(id);
  const wood = std('#C9925F'), dark = std('#8A6A55'), col = def.color ?? '#E9B872';
  switch (id) {
    case 'chair':
      g.add(M(rb(0.6, 0.12, 0.6), wood, 0, 0.45));
      g.add(M(rb(0.5, 0.1, 0.48, 0.05), plushMat('#F6B6B9'), 0, 0.55));
      g.add(M(rb(0.6, 0.6, 0.1), wood, 0, 0.8, -0.25));
      for (const [x, z] of [[-0.24, -0.24], [0.24, -0.24], [-0.24, 0.24], [0.24, 0.24]]) g.add(M(rb(0.08, 0.45, 0.08, 0.03), wood, x, 0.22, z));
      break;
    case 'table':
      g.add(M(new THREE.CylinderGeometry(0.45, 0.45, 0.08, 28), wood, 0, 0.72));
      g.add(M(new THREE.CylinderGeometry(0.07, 0.09, 0.7, 12), dark, 0, 0.35));
      g.add(M(new THREE.CylinderGeometry(0.28, 0.3, 0.05, 20), dark, 0, 0.03));
      g.add(M(new THREE.CylinderGeometry(0.13, 0.1, 0.12, 16), std('#FFFFFF'), 0.1, 0.82, 0));
      g.add(M(new THREE.SphereGeometry(0.06, 12, 8), std('#E8566C'), 0.1, 0.92, 0));
      break;
    case 'lamp': {
      g.add(M(new THREE.CylinderGeometry(0.18, 0.22, 0.08, 20), dark, 0, 0.04));
      g.add(M(new THREE.CylinderGeometry(0.03, 0.03, 1.2, 8), dark, 0, 0.64));
      const shade = M(new THREE.CylinderGeometry(0.2, 0.32, 0.36, 20, 1, true), std(col, { emissive: '#FFC27A', emissiveIntensity: 0.9, side: THREE.DoubleSide }), 0, 1.32);
      g.add(shade);
      const light = new THREE.PointLight('#FFC27A', 2.2, 5, 1.6); light.position.y = 1.2; g.add(light);
      break;
    }
    case 'plant':
      g.add(M(new THREE.CylinderGeometry(0.22, 0.17, 0.35, 18), std('#E5735F'), 0, 0.17));
      for (const [x, y, z, s] of [[0, 0.62, 0, 0.26], [0.14, 0.5, 0.08, 0.18], [-0.13, 0.52, -0.05, 0.2], [0.02, 0.82, -0.04, 0.17]]) g.add(M(new THREE.IcosahedronGeometry(s, 2), std('#7DB46C'), x, y, z));
      break;
    case 'rug':
      g.add(M(rb(1.8, 0.04, 1.8, 0.02), plushMat(col), 0, 0.02));
      g.add(M(rb(1.4, 0.045, 1.4, 0.02), plushMat('#FBE6D2'), 0, 0.023));
      break;
    case 'bed':
      g.add(M(rb(0.95, 0.35, 1.9), wood, 0, 0.22));
      g.add(M(rb(0.95, 0.75, 0.12), wood, 0, 0.45, -0.92));
      g.add(M(rb(0.88, 0.16, 1.75, 0.07), plushMat('#FFFFFF'), 0, 0.45, 0.02));
      g.add(M(rb(0.92, 0.12, 1.15, 0.06), plushMat(col), 0, 0.52, 0.34));
      g.add(M(rb(0.6, 0.14, 0.32, 0.07), plushMat('#FFF6EE'), 0, 0.6, -0.6));
      break;
    case 'radio':
      g.add(M(rb(0.6, 0.38, 0.3, 0.08), std(col), 0, 0.19));
      g.add(M(new THREE.CylinderGeometry(0.11, 0.11, 0.02, 20), std('#5B4636'), -0.12, 0.2, 0.15).rotateX(Math.PI / 2));
      g.add(M(rb(0.16, 0.06, 0.02, 0.01), std('#FFF6E9'), 0.15, 0.25, 0.15));
      g.add(M(new THREE.CylinderGeometry(0.01, 0.01, 0.5, 6), dark, 0.2, 0.6, -0.05).rotateZ(-0.3));
      break;
    case 'clock':
      g.add(M(rb(0.5, 1.6, 0.35), wood, 0, 0.8));
      g.add(M(new THREE.CylinderGeometry(0.18, 0.18, 0.03, 24), std('#FFF6E9'), 0, 1.3, 0.18).rotateX(Math.PI / 2));
      g.add(M(new THREE.SphereGeometry(0.06, 12, 8), std('#F2C94C', { metalness: 0.4, roughness: 0.3 }), 0, 0.6, 0.18));
      break;
    case 'bookshelf': {
      g.add(M(rb(0.9, 1.7, 0.4), wood, 0, 0.85));
      const cols = ['#E5735F', '#8FB8DE', '#F6C343', '#7DB46C', '#B6A3D9', '#F28FA6'];
      for (let row = 0; row < 3; row++) for (let i = 0; i < 6; i++)
        g.add(M(rb(0.1, 0.36, 0.28, 0.02), std(cols[(i + row * 2) % 6]), -0.3 + i * 0.12, 0.38 + row * 0.5, 0.06));
      break;
    }
    case 'sofa':
      g.add(M(rb(1.9, 0.4, 0.85, 0.15), plushMat(col), 0, 0.3));
      g.add(M(rb(1.9, 0.7, 0.25, 0.12), plushMat(col), 0, 0.6, -0.32));
      for (const x of [-0.88, 0.88]) g.add(M(rb(0.22, 0.6, 0.85, 0.1), plushMat(col), x, 0.45));
      g.add(M(rb(0.4, 0.35, 0.15, 0.1), plushMat('#FFF6EE'), -0.4, 0.62, -0.12));
      break;
    case 'plush': {
      const p = new Plush({ species: 'bear', main: '#D7A27A', accent: '#A87654', belly: '#F6E3CC', nose: '#4A2E22' });
      p.root.scale.setScalar(0.42);
      p.setExpr('happy');
      g.add(p.root);
      g.userData.plush = p;
      break;
    }
  }
  return g;
}

export class HomeInterior {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
  room = new THREE.Group();
  furniture = new THREE.Group();
  meshes = new Map<number, THREE.Group>();
  colliders: Collider[] = [];
  size = 6;
  floorMesh!: THREE.Mesh;
  door = new THREE.Vector3();
  private grid?: THREE.GridHelper;
  private plushes: Plush[] = [];

  constructor() {
    this.scene.background = new THREE.Color('#3B2F2A');
    const hemi = new THREE.HemisphereLight('#FFF1DC', '#7A5B48', 1.4);
    const key = new THREE.DirectionalLight('#FFE9C7', 1.6);
    key.position.set(3, 8, 5); key.castShadow = true;
    key.shadow.mapSize.set(1024, 1024);
    Object.assign(key.shadow.camera, { left: -6, right: 6, top: 6, bottom: -6 });
    key.shadow.radius = 4; key.shadow.bias = -0.0005;
    this.scene.add(hemi, key, this.room, this.furniture);
  }

  build(home: { size: number; wallpaper: string; floor: string; placed: { uid: number; item: string; x: number; z: number; rot: number }[] }) {
    this.size = home.size;
    this.room.clear();
    const N = this.size, H = 3;
    const wp = WALLPAPERS.find((w) => w.id === home.wallpaper) ?? WALLPAPERS[0];
    const fl = FLOORS.find((f) => f.id === home.floor) ?? FLOORS[0];
    const floorTex = pattern(fl.pattern, fl.color, fl.accent); floorTex.repeat.set(N / 2, N / 2);
    this.floorMesh = new THREE.Mesh(rb(N, 0.3, N, 0.1), std('#ffffff', { map: floorTex }));
    this.floorMesh.position.y = -0.15; this.floorMesh.receiveShadow = true;
    this.room.add(this.floorMesh);
    const wallTex = pattern(wp.pattern, wp.color, wp.accent); wallTex.repeat.set(N / 2, 1.5);
    const wallMat = std('#ffffff', { map: wallTex });
    const trim = std('#FFFFFF');
    const back = M(rb(N + 0.6, H, 0.3), wallMat, 0, H / 2, -N / 2 - 0.15);
    const left = M(rb(0.3, H, N), wallMat, -N / 2 - 0.15, H / 2, 0);
    const right = M(rb(0.3, H, N), wallMat, N / 2 + 0.15, H / 2, 0);
    back.castShadow = left.castShadow = right.castShadow = false;
    this.room.add(back, left, right);
    this.room.add(M(rb(N + 0.6, 0.18, 0.06), trim, 0, 0.09, -N / 2 + 0.03));
    this.room.add(M(rb(0.06, 0.18, N), trim, -N / 2 + 0.03, 0.09, 0), M(rb(0.06, 0.18, N), trim, N / 2 - 0.03, 0.09, 0));
    // Window with soft daylight
    const win = M(rb(1.4, 1.1, 0.1, 0.06), std('#CFEAF5', { emissive: '#CFEAF5', emissiveIntensity: 0.6 }), 1.2, 1.7, -N / 2 + 0.02);
    const frame = M(rb(1.6, 1.3, 0.08, 0.08), trim, 1.2, 1.7, -N / 2 - 0.01);
    this.room.add(frame, win);
    this.room.add(M(rb(0.06, 1.1, 0.12), trim, 1.2, 1.7, -N / 2 + 0.05), M(rb(1.4, 0.06, 0.12), trim, 1.2, 1.7, -N / 2 + 0.05));
    // Framed picture
    this.room.add(M(rb(0.8, 0.6, 0.06), std('#C9925F'), -1.4, 1.8, -N / 2 + 0.03), M(rb(0.64, 0.44, 0.07), std('#9FD3E6'), -1.4, 1.8, -N / 2 + 0.04));
    this.room.add(M(new THREE.SphereGeometry(0.1, 12, 8), std('#F6C343'), -1.25, 1.88, -N / 2 + 0.09));
    // Doormat marks the exit
    this.door.set(0, 0, N / 2 - 0.4);
    this.room.add(M(rb(1.2, 0.03, 0.6, 0.02), plushMat('#C2575F'), 0, 0.02, N / 2 - 0.35));
    this.colliders = [];
    this.rebuildFurniture(home.placed);
    this.camera.position.set(0, N * 1.05 + 3.2, N * 1.15 + 2.6);
    this.camera.lookAt(0, 0.4, 0.2);
  }

  rebuildFurniture(placed: { uid: number; item: string; x: number; z: number; rot: number }[]) {
    this.furniture.clear(); this.meshes.clear(); this.plushes = [];
    this.colliders = [];
    for (const p of placed) {
      const g = buildFurniture(p.item);
      g.position.set(p.x, 0, p.z); g.rotation.y = (p.rot * Math.PI) / 2;
      g.userData.uid = p.uid;
      this.furniture.add(g); this.meshes.set(p.uid, g);
      if (g.userData.plush) this.plushes.push(g.userData.plush);
      if (p.item !== 'rug') {
        const [w, d] = this.footprint(p.item, p.rot);
        this.colliders.push({ kind: 'box', minX: p.x - w / 2 + 0.05, maxX: p.x + w / 2 - 0.05, minZ: p.z - d / 2 + 0.05, maxZ: p.z + d / 2 - 0.05 });
      }
    }
  }

  footprint(id: string, rot: number): [number, number] {
    const [w, d] = item(id).size ?? [1, 1];
    return rot % 2 ? [d, w] : [w, d];
  }

  /** Snap a floor point to the grid for an item; returns null if it overlaps something. */
  snap(id: string, rot: number, px: number, pz: number, placed: { uid: number; item: string; x: number; z: number; rot: number }[], ignoreUid = -1) {
    const N = this.size;
    const [w, d] = this.footprint(id, rot);
    const i = THREE.MathUtils.clamp(Math.round(px + N / 2 - w / 2), 0, N - w);
    const j = THREE.MathUtils.clamp(Math.round(pz + N / 2 - d / 2), 0, N - d);
    const x = -N / 2 + i + w / 2, z = -N / 2 + j + d / 2;
    const isRug = id === 'rug';
    const clash = placed.some((p) => {
      if (p.uid === ignoreUid || (p.item === 'rug') !== isRug) return false;
      const [pw, pd] = this.footprint(p.item, p.rot);
      return Math.abs(p.x - x) < (pw + w) / 2 - 0.01 && Math.abs(p.z - z) < (pd + d) / 2 - 0.01;
    });
    const blocksDoor = !isRug && Math.abs(x) < w / 2 + 0.5 && z + d / 2 > N / 2 - 1;
    return { x, z, ok: !clash && !blocksDoor };
  }

  showGrid(on: boolean) {
    if (on && !this.grid) {
      this.grid = new THREE.GridHelper(this.size, this.size, '#ffffff', '#ffffff');
      (this.grid.material as THREE.Material).opacity = 0.35; (this.grid.material as THREE.Material).transparent = true;
      this.grid.position.y = 0.02; this.scene.add(this.grid);
    } else if (!on && this.grid) { this.grid.removeFromParent(); this.grid = undefined; }
  }

  update(dt: number, t: number) { for (const p of this.plushes) p.update(dt, t); }
}
