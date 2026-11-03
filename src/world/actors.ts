import * as THREE from 'three';
import { EDGES, NODES, type V2 } from '../content/places';
import type { NpcDef } from '../content/characters';
import { Plush } from './plush';
import type { Collider } from './village';
import { markerSprite } from './env';

export interface Walkable {
  colliders: Collider[];
  isWater?: (x: number, z: number) => boolean;
  bounds: { minX: number; maxX: number; minZ: number; maxZ: number };
  ignoreTags?: Set<string>;
  dynamic?: { x: number; z: number; r: number }[];
}

/** Push a circle out of colliders; refuse moves into water (slide along it instead). */
export function moveCircle(x: number, z: number, dx: number, dz: number, r: number, w: Walkable): [number, number] {
  const tryPos = (nx: number, nz: number): [number, number] | null => {
    for (let iter = 0; iter < 2; iter++) {
      for (const c of w.colliders) {
        if (c.tag && w.ignoreTags?.has(c.tag)) continue;
        if (c.kind === 'circle') {
          const ddx = nx - c.x, ddz = nz - c.z, d = Math.hypot(ddx, ddz), min = c.r + r;
          if (d < min && d > 1e-5) { nx = c.x + (ddx / d) * min; nz = c.z + (ddz / d) * min; }
        } else {
          const cx = Math.max(c.minX, Math.min(nx, c.maxX)), cz = Math.max(c.minZ, Math.min(nz, c.maxZ));
          const ddx = nx - cx, ddz = nz - cz, d = Math.hypot(ddx, ddz);
          if (d < r) {
            if (d > 1e-5) { nx = cx + (ddx / d) * r; nz = cz + (ddz / d) * r; }
            else {
              const pen = [nx - c.minX, c.maxX - nx, nz - c.minZ, c.maxZ - nz];
              const m = Math.min(...pen), i = pen.indexOf(m);
              if (i === 0) nx = c.minX - r; else if (i === 1) nx = c.maxX + r; else if (i === 2) nz = c.minZ - r; else nz = c.maxZ + r;
            }
          }
        }
      }
      for (const c of w.dynamic ?? []) {
        const ddx = nx - c.x, ddz = nz - c.z, d = Math.hypot(ddx, ddz), min = c.r + r;
        if (d < min && d > 1e-5) { nx = c.x + (ddx / d) * min; nz = c.z + (ddz / d) * min; }
      }
    }
    nx = Math.max(w.bounds.minX, Math.min(w.bounds.maxX, nx));
    nz = Math.max(w.bounds.minZ, Math.min(w.bounds.maxZ, nz));
    if (w.isWater?.(nx, nz)) return null;
    return [nx, nz];
  };
  return tryPos(x + dx, z + dz) ?? tryPos(x + dx, z) ?? tryPos(x, z + dz) ?? [x, z];
}

/** Blend two angles (used to turn conversation partners three-quarters toward the camera). */
export function blendYaw(a: number, b: number, t: number) {
  const d = Math.atan2(Math.sin(b - a), Math.cos(b - a));
  return a + d * t;
}

// ------------------------------------------------------------ path graph
const ADJ = new Map<string, string[]>();
for (const [a, b] of EDGES) {
  if (!ADJ.has(a)) ADJ.set(a, []);
  if (!ADJ.has(b)) ADJ.set(b, []);
  ADJ.get(a)!.push(b); ADJ.get(b)!.push(a);
}
export function nearestNode(x: number, z: number) {
  let best = '', bd = Infinity;
  for (const [k, [nx, nz]] of Object.entries(NODES)) {
    const d = Math.hypot(nx - x, nz - z);
    if (d < bd) { bd = d; best = k; }
  }
  return best;
}
function route(from: string, to: string): string[] {
  const prev = new Map<string, string>([[from, '']]);
  const q = [from];
  while (q.length) {
    const n = q.shift()!;
    if (n === to) break;
    for (const m of ADJ.get(n) ?? []) if (!prev.has(m)) { prev.set(m, n); q.push(m); }
  }
  const path: string[] = [];
  for (let n: string | undefined = to; n; n = prev.get(n)) path.unshift(n);
  return path[0] === from ? path : [to];
}

// ------------------------------------------------------------ player
export class Player {
  plush: Plush;
  pos = new THREE.Vector3();
  private stepT = 0;
  onStep?: () => void;
  constructor(plush: Plush) { this.plush = plush; }

  update(dt: number, t: number, input: { x: number; z: number }, w: Walkable, speed = 4.6) {
    const mag = Math.min(1, Math.hypot(input.x, input.z));
    if (mag > 0.08) {
      const [nx, nz] = moveCircle(this.pos.x, this.pos.z, input.x * speed * dt, input.z * speed * dt, 0.38, w);
      const moved = Math.hypot(nx - this.pos.x, nz - this.pos.z);
      this.pos.x = nx; this.pos.z = nz;
      this.plush.targetYaw = Math.atan2(input.x, input.z);
      this.plush.speed = THREE.MathUtils.lerp(this.plush.speed, moved > 0.001 ? mag : 0, Math.min(1, dt * 10));
      this.stepT -= dt * mag;
      if (this.stepT <= 0 && moved > 0.001) { this.stepT = 0.32; this.onStep?.(); }
    } else this.plush.speed = THREE.MathUtils.lerp(this.plush.speed, 0, Math.min(1, dt * 10));
    this.plush.root.position.copy(this.pos);
    this.plush.update(dt, t);
  }
}

// ------------------------------------------------------------ villagers
export class Npc {
  plush: Plush;
  pos = new THREE.Vector3();
  path: V2[] = [];
  node = '';
  activity: NpcDef['routine'][number]['activity'] = 'stroll';
  talking = false;
  marker: THREE.Sprite | null = null;
  markerKind = '';
  private anchor: V2 = [0, 0];
  private wanderT = 2;
  private greeted = false;
  /** Called when the villager notices the player walking up. */
  onGreet?: (n: Npc) => void;

  constructor(public def: NpcDef) {
    this.plush = new Plush({ species: def.species, ...def.colors, extra: def.extra });
  }

  slotFor(hour: number) {
    return this.def.routine.find((s) => (hour >= s.from && hour < s.to) || (hour + 24 >= s.from && hour + 24 < s.to)) ?? this.def.routine[0];
  }

  /** Place instantly at the routine spot for this hour (used on load). */
  snap(hour: number) {
    const s = this.slotFor(hour);
    this.node = s.node; this.activity = s.activity;
    const [x, z] = NODES[s.node];
    this.anchor = [x, z];
    this.pos.set(x, 0, z);
    this.path = [];
    this.plush.targetYaw = this.plush.yaw = this.facingFor();
  }

  private facingFor() { return this.activity === 'fish' || this.activity === 'stargaze' ? Math.PI * 0.85 : 0; }

  setMarker(kind: '' | 'quest' | 'sleep' | 'chat') {
    if (kind === this.markerKind) return;
    this.markerKind = kind;
    if (this.marker) { this.marker.removeFromParent(); this.marker = null; }
    if (!kind) return;
    this.marker = markerSprite(kind === 'quest' ? '❗' : kind === 'sleep' ? '💤' : '💬', kind === 'quest' ? '#FFE9A8' : '#FFF8EC', 0.62);
    this.marker.position.set(0, 2.05, 0);
    this.plush.root.add(this.marker);
  }

  update(dt: number, t: number, hour: number, player: THREE.Vector3, w: Walkable) {
    const slot = this.slotFor(hour);
    if (slot.node !== this.node && !this.talking) {
      this.node = slot.node; this.activity = slot.activity;
      const from = nearestNode(this.pos.x, this.pos.z);
      this.path = route(from, slot.node).map((n) => NODES[n]);
      this.anchor = NODES[slot.node];
    }
    const pd = Math.hypot(player.x - this.pos.x, player.z - this.pos.z);
    let moveX = 0, moveZ = 0;
    if (this.talking) {
      this.plush.faceToward(player.x, player.z);
      this.plush.targetYaw = blendYaw(this.plush.targetYaw, 0, 0.4);
    } else if (this.path.length) {
      const [tx, tz] = this.path[0];
      const dx = tx - this.pos.x, dz = tz - this.pos.z, d = Math.hypot(dx, dz);
      if (d < 0.25) this.path.shift();
      else { moveX = dx / d; moveZ = dz / d; }
    } else if (pd < 3.6) {
      this.plush.faceToward(player.x, player.z);
      if (!this.greeted) { this.greeted = true; this.plush.wave(); this.onGreet?.(this); }
    } else {
      this.greeted = pd < 6 && this.greeted;
      if (this.activity === 'stroll' || this.activity === 'garden') {
        this.wanderT -= dt;
        const [ax, az] = this.anchor;
        if (this.wanderT <= 0) {
          this.wanderT = 3 + Math.random() * 4;
          const a = Math.random() * Math.PI * 2, rr = Math.random() * 1.8;
          this.path = [[ax + Math.cos(a) * rr, az + Math.sin(a) * rr]];
        }
      } else this.plush.targetYaw = this.facingFor();
    }
    const speed = this.def.id === 'yuzu' ? 1.5 : this.def.id === 'pip' ? 2.6 : 2.0;
    if (moveX || moveZ) {
      const [nx, nz] = moveCircle(this.pos.x, this.pos.z, moveX * speed * dt, moveZ * speed * dt, 0.3, { ...w, dynamic: undefined });
      if (Math.hypot(nx - this.pos.x, nz - this.pos.z) < speed * dt * 0.2) this.path.shift(); // stuck: skip waypoint
      this.pos.set(nx, 0, nz);
      this.plush.targetYaw = Math.atan2(moveX, moveZ);
      this.plush.speed = THREE.MathUtils.lerp(this.plush.speed, 0.75, dt * 8);
    } else this.plush.speed = THREE.MathUtils.lerp(this.plush.speed, 0, dt * 8);
    const sleepy = this.activity === 'rest';
    if (!this.talking) this.plush.setExpr(sleepy ? 'sleepy' : this.plush.expr === 'sleepy' ? 'neutral' : this.plush.expr);
    this.plush.root.position.copy(this.pos);
    if (this.marker) this.marker.position.y = 2.05 + Math.sin(t * 3) * 0.08;
    this.plush.update(dt, t);
  }
}
