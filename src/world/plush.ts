import * as THREE from 'three';
import type { Expr, Species } from '../core/types';
import { canvas, fabric, stitch } from './textures';

/**
 * Procedural plush toys: velvety sheen fabric, big round heads, stitched seams,
 * embroidered faces drawn onto curved decals, a belly patch, and a tush tag.
 */
export interface PlushSpec {
  species: Species;
  main: string; accent: string; belly: string; nose: string;
  extra?: 'apron' | 'yuzu' | 'bow';
}

const shade = (hex: string, amt: number) => {
  const c = new THREE.Color(hex);
  const hsl = { h: 0, s: 0, l: 0 };
  c.getHSL(hsl);
  c.setHSL(hsl.h, hsl.s, Math.max(0, Math.min(1, hsl.l + amt)));
  return '#' + c.getHexString();
};

const matCache = new Map<string, THREE.Material>();
export function plushMat(color: string): THREE.MeshPhysicalMaterial {
  const key = 'p' + color;
  if (!matCache.has(key)) {
    const f = fabric();
    matCache.set(key, new THREE.MeshPhysicalMaterial({
      color, map: f.map, normalMap: f.normal, normalScale: new THREE.Vector2(0.45, 0.45),
      roughness: 0.92, sheen: 1, sheenRoughness: 0.45, sheenColor: new THREE.Color(shade(color, 0.18)),
    }));
  }
  return matCache.get(key) as THREE.MeshPhysicalMaterial;
}
function glossyMat(color: string) {
  const key = 'g' + color;
  if (!matCache.has(key)) matCache.set(key, new THREE.MeshStandardMaterial({ color, roughness: 0.25, metalness: 0.05 }));
  return matCache.get(key)!;
}
function flatMat(color: string, rough = 0.8) {
  const key = 'f' + color + rough;
  if (!matCache.has(key)) matCache.set(key, new THREE.MeshStandardMaterial({ color, roughness: rough }));
  return matCache.get(key)!;
}

const SPH = new THREE.SphereGeometry(1, 32, 24);
const sph = (mat: THREE.Material, sx: number, sy = sx, sz = sx) => {
  const m = new THREE.Mesh(SPH, mat);
  m.scale.set(sx, sy, sz);
  m.castShadow = true;
  return m;
};
const capsule = (mat: THREE.Material, r: number, len: number) => {
  const m = new THREE.Mesh(new THREE.CapsuleGeometry(r, len, 8, 16), mat);
  m.castShadow = true;
  return m;
};

/** A curved canvas decal that hugs a sphere (faces, belly patches). */
class Decal {
  ctx: CanvasRenderingContext2D;
  tex: THREE.CanvasTexture;
  mesh: THREE.Mesh;
  size: number;
  constructor(radius: number, phiW: number, thetaStart: number, thetaLen: number, size = 256) {
    const [c, ctx] = canvas(size);
    this.ctx = ctx; this.size = size;
    this.tex = new THREE.CanvasTexture(c);
    this.tex.colorSpace = THREE.SRGBColorSpace;
    this.tex.anisotropy = 4;
    const geo = new THREE.SphereGeometry(radius, 32, 24, Math.PI / 2 - phiW / 2, phiW, thetaStart, thetaLen);
    const mat = new THREE.MeshStandardMaterial({
      map: this.tex, transparent: true, roughness: 0.85, depthWrite: false,
      polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2,
    });
    this.mesh = new THREE.Mesh(geo, mat);
    this.mesh.renderOrder = 2;
  }
  draw(fn: (ctx: CanvasRenderingContext2D, s: number) => void) {
    this.ctx.clearRect(0, 0, this.size, this.size);
    fn(this.ctx, this.size);
    this.tex.needsUpdate = true;
  }
}

const THREAD = '#2E211B';

function drawEyes(ctx: CanvasRenderingContext2D, s: number, expr: Expr, blink: boolean, gap: number) {
  const ey = s * 0.5, lx = s * (0.5 - gap), rx = s * (0.5 + gap);
  // Blush
  for (const x of [s * (0.5 - gap * 1.55), s * (0.5 + gap * 1.55)]) {
    const g = ctx.createRadialGradient(x, s * 0.66, 0, x, s * 0.66, s * 0.09);
    g.addColorStop(0, `rgba(255,128,140,${expr === 'love' || expr === 'happy' ? 0.7 : 0.5})`);
    g.addColorStop(1, 'rgba(255,128,140,0)');
    ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(x, s * 0.66, s * 0.1, s * 0.065, 0, 0, Math.PI * 2); ctx.fill();
  }
  ctx.strokeStyle = THREAD; ctx.fillStyle = THREAD; ctx.lineCap = 'round'; ctx.lineWidth = s * 0.036;
  const closedArc = (x: number, up: boolean) => {
    ctx.beginPath();
    if (up) ctx.arc(x, ey + s * 0.03, s * 0.06, Math.PI * 1.15, Math.PI * 1.85);
    else ctx.arc(x, ey - s * 0.03, s * 0.05, Math.PI * 0.2, Math.PI * 0.8);
    ctx.stroke();
  };
  const button = (x: number, big = 1) => {
    ctx.fillStyle = THREAD;
    ctx.beginPath(); ctx.ellipse(x, ey, s * 0.066 * big, s * 0.084 * big, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,.95)';
    ctx.beginPath(); ctx.arc(x - s * 0.022 * big, ey - s * 0.03 * big, s * 0.024 * big, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,.6)';
    ctx.beginPath(); ctx.arc(x + s * 0.02 * big, ey + s * 0.028 * big, s * 0.011 * big, 0, Math.PI * 2); ctx.fill();
  };
  const heart = (x: number) => {
    ctx.fillStyle = '#E8566C';
    const r = s * 0.034;
    ctx.beginPath();
    ctx.moveTo(x, ey + r * 1.6);
    ctx.bezierCurveTo(x - r * 2.4, ey - r * 0.2, x - r * 1.2, ey - r * 2.1, x, ey - r * 0.7);
    ctx.bezierCurveTo(x + r * 1.2, ey - r * 2.1, x + r * 2.4, ey - r * 0.2, x, ey + r * 1.6);
    ctx.fill();
  };
  if (expr === 'love') { heart(lx); heart(rx); return; }
  if (expr === 'happy') { closedArc(lx, true); closedArc(rx, true); return; }
  if (blink || expr === 'sleepy') {
    ctx.beginPath(); ctx.moveTo(lx - s * 0.045, ey + s * 0.01); ctx.lineTo(lx + s * 0.045, ey + s * 0.01); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(rx - s * 0.045, ey + s * 0.01); ctx.lineTo(rx + s * 0.045, ey + s * 0.01); ctx.stroke();
    if (expr === 'sleepy' && !blink) { closedArc(lx, false); closedArc(rx, false); }
    return;
  }
  if (expr === 'thinking') {
    button(lx); closedArc(rx, true);
    ctx.lineWidth = s * 0.022; ctx.beginPath(); ctx.moveTo(lx - s * 0.05, ey - s * 0.11); ctx.lineTo(lx + s * 0.04, ey - s * 0.125); ctx.stroke();
    return;
  }
  button(lx, expr === 'surprised' ? 1.25 : 1);
  button(rx, expr === 'surprised' ? 1.25 : 1);
  if (expr === 'sad') {
    ctx.lineWidth = s * 0.022;
    ctx.beginPath(); ctx.moveTo(lx - s * 0.05, ey - s * 0.1); ctx.lineTo(lx + s * 0.04, ey - s * 0.125); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(rx + s * 0.05, ey - s * 0.1); ctx.lineTo(rx - s * 0.04, ey - s * 0.125); ctx.stroke();
  }
}

function drawMouth(ctx: CanvasRenderingContext2D, s: number, expr: Expr, open: boolean, opts: { nose?: string; whiskers?: boolean; y?: number }) {
  const cx = s * 0.5, my = s * (opts.y ?? 0.42);
  ctx.strokeStyle = THREAD; ctx.lineCap = 'round'; ctx.lineWidth = s * 0.025;
  if (opts.nose) {
    ctx.fillStyle = opts.nose;
    ctx.beginPath();
    ctx.moveTo(cx - s * 0.05, my - s * 0.1); ctx.quadraticCurveTo(cx, my - s * 0.125, cx + s * 0.05, my - s * 0.1);
    ctx.quadraticCurveTo(cx, my - s * 0.02, cx - s * 0.05, my - s * 0.1); ctx.fill();
  }
  if (opts.whiskers) {
    ctx.lineWidth = s * 0.012; ctx.globalAlpha = 0.6;
    for (const d of [-1, 1]) for (const k of [-1, 0.2]) {
      ctx.beginPath(); ctx.moveTo(cx + d * s * 0.14, my - s * 0.04 + k * s * 0.03); ctx.lineTo(cx + d * s * 0.32, my - s * 0.06 + k * s * 0.06); ctx.stroke();
    }
    ctx.globalAlpha = 1; ctx.lineWidth = s * 0.025;
  }
  if (open || expr === 'surprised') {
    ctx.fillStyle = '#5A2A2A';
    ctx.beginPath(); ctx.ellipse(cx, my + s * 0.035, s * (expr === 'surprised' ? 0.035 : 0.05), s * (open ? 0.05 : 0.035), 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#F08A94';
    ctx.beginPath(); ctx.ellipse(cx, my + s * 0.06, s * 0.03, s * 0.017, 0, 0, Math.PI * 2); ctx.fill();
    return;
  }
  if (expr === 'sad') {
    ctx.beginPath(); ctx.arc(cx, my + s * 0.08, s * 0.05, Math.PI * 1.2, Math.PI * 1.8); ctx.stroke();
    return;
  }
  // Little "ω" mouth, wider when happy.
  const w = expr === 'happy' || expr === 'love' ? 0.05 : 0.038;
  ctx.beginPath();
  ctx.moveTo(cx, my - s * 0.02); ctx.lineTo(cx, my + s * 0.005);
  ctx.stroke();
  ctx.beginPath(); ctx.arc(cx - s * w * 0.9, my, s * w, Math.PI * 0.05, Math.PI * 0.95); ctx.stroke();
  ctx.beginPath(); ctx.arc(cx + s * w * 0.9, my, s * w, Math.PI * 0.05, Math.PI * 0.95); ctx.stroke();
}

/** Thread stitches along a curve. */
function seam(points: THREE.Vector3[], color: string) {
  const curve = new THREE.CatmullRomCurve3(points);
  const len = curve.getLength();
  const tex = stitch().clone();
  tex.repeat.set(Math.max(1, len / 0.045), 1);
  tex.needsUpdate = true;
  const m = new THREE.Mesh(
    new THREE.TubeGeometry(curve, Math.max(8, Math.round(len * 40)), 0.0075, 5),
    new THREE.MeshStandardMaterial({ color, map: tex, alphaTest: 0.5, roughness: 0.9 }),
  );
  return m;
}

function bodyDecal(ctx: CanvasRenderingContext2D, s: number, spec: PlushSpec) {
  const thread = shade(spec.main, -0.25);
  if (spec.extra === 'apron') {
    ctx.fillStyle = '#F6B6B9';
    ctx.beginPath();
    ctx.moveTo(s * 0.3, s * 0.28); ctx.lineTo(s * 0.7, s * 0.28);
    ctx.quadraticCurveTo(s * 0.86, s * 0.95, s * 0.5, s * 0.98);
    ctx.quadraticCurveTo(s * 0.14, s * 0.95, s * 0.3, s * 0.28); ctx.fill();
    ctx.fillStyle = '#FFE9E4';
    ctx.beginPath(); (ctx as any).roundRect(s * 0.4, s * 0.55, s * 0.2, s * 0.15, s * 0.04); ctx.fill();
    ctx.strokeStyle = '#fff'; ctx.setLineDash([s * 0.025, s * 0.02]); ctx.lineWidth = s * 0.012;
    ctx.beginPath();
    ctx.moveTo(s * 0.32, s * 0.31); ctx.lineTo(s * 0.68, s * 0.31);
    ctx.quadraticCurveTo(s * 0.82, s * 0.92, s * 0.5, s * 0.95);
    ctx.quadraticCurveTo(s * 0.18, s * 0.92, s * 0.32, s * 0.31); ctx.stroke();
    ctx.fillStyle = '#E8566C';
    ctx.beginPath(); ctx.arc(s * 0.5, s * 0.6, s * 0.03, 0, Math.PI * 2); ctx.fill();
    return;
  }
  ctx.fillStyle = spec.belly;
  ctx.beginPath(); ctx.ellipse(s * 0.5, s * 0.55, s * 0.27, s * 0.33, 0, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = thread; ctx.globalAlpha = 0.7;
  ctx.setLineDash([s * 0.03, s * 0.022]); ctx.lineWidth = s * 0.014; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.ellipse(s * 0.5, s * 0.55, s * 0.25, s * 0.31, 0, 0, Math.PI * 2); ctx.stroke();
  ctx.globalAlpha = 1; ctx.setLineDash([]);
}

export class Plush {
  /** Set by the game to play hop/landing sounds. */
  static onHop?: (p: Plush) => void;
  static onLand?: (p: Plush) => void;
  root = new THREE.Group();
  bob = new THREE.Group();
  head = new THREE.Group();
  headMesh!: THREE.Mesh;
  armL = new THREE.Group(); armR = new THREE.Group();
  legL = new THREE.Group(); legR = new THREE.Group();
  ears: THREE.Object3D[] = [];
  tail?: THREE.Object3D;
  hatSlot = new THREE.Group(); neckSlot = new THREE.Group(); faceSlot = new THREE.Group();
  eyes!: Decal; mouth!: Decal;
  spec: PlushSpec;
  expr: Expr = 'neutral';
  speed = 0;
  talking = false;
  yaw = 0; targetYaw = 0;
  private phase = 0; private seed = Math.random() * 10;
  private blinkIn = 2; private blinkT = 0; private mouthT = 0; private mouthOpen = false;
  private hopY = 0; private hopV = 0; private waveT = 0; private gap = 0.16;
  private mouthOpts: { nose?: string; whiskers?: boolean; y?: number } = {};

  constructor(spec: PlushSpec) {
    this.spec = spec;
    const main = plushMat(spec.main), accent = plushMat(spec.accent), belly = plushMat(spec.belly);
    this.root.add(this.bob);
    const R = 0.4;

    // Body
    const body = sph(main, 0.36, 0.38, 0.33);
    body.position.y = 0.47;
    this.bob.add(body);
    const bd = new Decal(1.012, 1.5, Math.PI / 2 - 0.55, 1.25);
    bd.draw((c, s) => bodyDecal(c, s, spec));
    body.add(bd.mesh);
    // Tush tag
    const tag = new THREE.Mesh(new THREE.BoxGeometry(0.075, 0.1, 0.012), flatMat('#FFFFFF', 0.95));
    tag.position.set(0.24, 0.32, -0.2); tag.rotation.set(0.2, -0.9, 0.15);
    const tagStripe = new THREE.Mesh(new THREE.BoxGeometry(0.076, 0.018, 0.013), flatMat('#E8566C'));
    tagStripe.position.y = 0.02; tag.add(tagStripe);
    this.bob.add(tag);

    // Legs
    for (const [g, x] of [[this.legL, -0.15], [this.legR, 0.15]] as const) {
      g.position.set(x, 0.26, 0.02);
      const leg = capsule(main, 0.11, 0.07);
      leg.position.y = -0.11;
      g.add(leg);
      const pad = sph(belly, 0.075, 0.075, 0.03);
      pad.position.set(0, -0.15, 0.1); pad.rotation.x = -0.5;
      g.add(pad);
      this.bob.add(g);
    }
    // Arms
    for (const [g, x, side] of [[this.armL, -0.29, -1], [this.armR, 0.29, 1]] as const) {
      g.position.set(x, 0.62, 0.02);
      g.rotation.z = side * 0.4;
      const arm = capsule(main, 0.085, 0.13);
      arm.position.y = -0.12;
      g.add(arm);
      this.bob.add(g);
    }

    // Head
    this.head.position.y = 1.0;
    this.bob.add(this.head);
    const hm = (this.headMesh = sph(main, R));
    this.head.add(hm);
    if (spec.species === 'capybara') hm.scale.set(R * 1.02, R * 0.92, R * 1.08);
    // Seam over the top of the head
    const seamPts: THREE.Vector3[] = [];
    for (let i = 0; i <= 16; i++) {
      const a = -0.28 + (i / 16) * 2.3;
      seamPts.push(new THREE.Vector3(0, Math.cos(a) * 1.006, -Math.sin(a) * 1.006));
    }
    const hs = seam(seamPts, shade(spec.main, -0.22));
    hm.add(hs);
    hs.scale.setScalar(1);
    // Neck seam
    const neckPts: THREE.Vector3[] = [];
    for (let i = 0; i <= 24; i++) {
      const a = (i / 24) * Math.PI * 2;
      neckPts.push(new THREE.Vector3(Math.cos(a) * 0.288, 0.715, Math.sin(a) * 0.272));
    }
    this.bob.add(seam(neckPts, shade(spec.main, -0.22)));

    this.eyes = new Decal(1.012, 1.6, Math.PI / 2 - 0.62, 1.15);
    hm.add(this.eyes.mesh);
    this.buildSpecies(spec, main, accent, belly, R);

    this.hatSlot.position.set(0, R * 0.92, 0);
    this.head.add(this.hatSlot);
    this.faceSlot.position.set(0, 0.02, R * 0.93);
    this.head.add(this.faceSlot);
    this.neckSlot.position.set(0, 0.76, 0);
    this.bob.add(this.neckSlot);

    this.redrawFace();
    this.root.traverse((o) => { if ((o as THREE.Mesh).isMesh) (o as THREE.Mesh).castShadow = true; });
  }

  private buildSpecies(spec: PlushSpec, main: THREE.Material, accent: THREE.Material, belly: THREE.Material, R: number) {
    const hm = this.headMesh;
    const add = (o: THREE.Object3D) => { this.head.add(o); return o; };
    const muzzle = (rx: number, ry: number, rz: number, y: number, z: number, mat: THREE.Material) => {
      const m = sph(mat, rx, ry, rz);
      m.position.set(0, y, z);
      this.head.add(m);
      this.mouth = new Decal(1.03, 1.7, Math.PI / 2 - 0.45, 1.2);
      m.add(this.mouth.mesh);
      return m;
    };
    const nose3d = (x: number, y: number, z: number, s: number) => {
      const n = sph(glossyMat(spec.nose), s * 1.35, s * 0.95, s * 0.85);
      n.position.set(x, y, z);
      this.head.add(n);
    };
    const headDecalMouth = (y = 0.42) => {
      this.mouth = new Decal(1.016, 1.2, Math.PI / 2 - 0.1, 0.9);
      hm.add(this.mouth.mesh);
      this.mouthOpts.y = y;
    };

    switch (spec.species) {
      case 'bear': {
        for (const sx of [-1, 1]) {
          const ear = sph(main, 0.13, 0.13, 0.07);
          ear.position.set(sx * 0.27, 0.27, -0.03);
          const inner = sph(belly, 0.075, 0.075, 0.04);
          inner.position.set(0, -0.005, 0.5);
          ear.add(inner); inner.scale.set(0.6, 0.6, 0.6);
          add(ear); this.ears.push(ear);
        }
        muzzle(0.17, 0.13, 0.13, -0.11, 0.3, belly);
        nose3d(0, -0.055, 0.425, 0.045);
        this.mouthOpts.y = 0.52;
        const tail = sph(main, 0.08); tail.position.set(0, 0.3, -0.33); this.bob.add(tail); this.tail = tail;
        break;
      }
      case 'bunny': {
        for (const sx of [-1, 1]) {
          const g = new THREE.Group();
          g.position.set(sx * 0.13, 0.3, -0.04);
          g.rotation.z = sx * -0.12;
          if (sx < 0) g.rotation.z = 0.75; // one floppy ear
          const ear = capsule(main, 0.085, 0.32);
          ear.scale.z = 0.55; ear.position.y = 0.22;
          const inner = capsule(accent, 0.05, 0.26);
          inner.scale.z = 0.35; inner.position.set(0, 0.22, 0.04);
          g.add(ear, inner);
          add(g); this.ears.push(g);
        }
        headDecalMouth(0.44);
        this.mouthOpts.nose = spec.nose;
        const tail = sph(plushMat('#FFFFFF'), 0.1); tail.position.set(0, 0.3, -0.33); this.bob.add(tail); this.tail = tail;
        break;
      }
      case 'cat': {
        for (const sx of [-1, 1]) {
          const ear = new THREE.Mesh(new THREE.ConeGeometry(0.13, 0.22, 20), main);
          ear.scale.z = 0.55; ear.position.set(sx * 0.22, 0.32, -0.02); ear.rotation.z = sx * -0.38;
          const inner = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.14, 16), accent);
          inner.scale.z = 0.4; inner.position.set(0, -0.02, 0.04);
          ear.add(inner); add(ear); this.ears.push(ear);
        }
        headDecalMouth(0.44);
        this.mouthOpts.nose = spec.nose; this.mouthOpts.whiskers = true;
        const pts = [new THREE.Vector3(0, 0.25, -0.3), new THREE.Vector3(0.05, 0.3, -0.48), new THREE.Vector3(0.12, 0.55, -0.55), new THREE.Vector3(0.08, 0.72, -0.48)];
        const tail = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 20, 0.055, 10), main);
        this.bob.add(tail); this.tail = tail;
        break;
      }
      case 'fox': {
        for (const sx of [-1, 1]) {
          const ear = new THREE.Mesh(new THREE.ConeGeometry(0.15, 0.3, 20), main);
          ear.scale.z = 0.5; ear.position.set(sx * 0.22, 0.35, -0.02); ear.rotation.z = sx * -0.32;
          const inner = new THREE.Mesh(new THREE.ConeGeometry(0.09, 0.19, 16), plushMat(spec.belly));
          inner.scale.z = 0.4; inner.position.set(0, -0.03, 0.045);
          ear.add(inner); add(ear); this.ears.push(ear);
        }
        muzzle(0.15, 0.11, 0.17, -0.1, 0.3, belly);
        nose3d(0, -0.07, 0.47, 0.04);
        this.mouthOpts.y = 0.55;
        const g = new THREE.Group(); g.position.set(0, 0.28, -0.3); g.rotation.x = -0.9;
        const t1 = sph(main, 0.13, 0.3, 0.13); t1.position.y = 0.22;
        const tip = sph(belly, 0.1, 0.12, 0.1); tip.position.y = 0.47;
        g.add(t1, tip); this.bob.add(g); this.tail = g;
        break;
      }
      case 'dog': {
        for (const sx of [-1, 1]) {
          const g = new THREE.Group(); g.position.set(sx * 0.31, 0.15, 0); g.rotation.z = sx * 0.35;
          const ear = capsule(accent, 0.09, 0.18); ear.scale.z = 0.45; ear.position.y = -0.12;
          g.add(ear); add(g); this.ears.push(g);
        }
        muzzle(0.16, 0.12, 0.13, -0.11, 0.3, belly);
        nose3d(0, -0.055, 0.425, 0.048);
        this.mouthOpts.y = 0.52;
        const tail = capsule(main, 0.05, 0.16); tail.position.set(0, 0.35, -0.33); tail.rotation.x = -0.7;
        this.bob.add(tail); this.tail = tail;
        break;
      }
      case 'capybara': {
        for (const sx of [-1, 1]) {
          const ear = sph(accent, 0.07, 0.06, 0.04);
          ear.position.set(sx * 0.27, 0.24, -0.1);
          add(ear); this.ears.push(ear);
        }
        const m = muzzle(0.27, 0.2, 0.2, -0.1, 0.24, plushMat(shade(spec.main, -0.05)));
        m.scale.set(0.27, 0.2, 0.2);
        // Nostrils + mouth drawn on the muzzle decal
        this.mouthOpts.y = 0.56;
        this.mouthOpts.nose = undefined;
        const nostrils = new Decal(1.035, 1.0, Math.PI / 2 - 0.75, 0.6, 128);
        nostrils.draw((c, s) => {
          c.fillStyle = THREAD;
          for (const x of [0.36, 0.64]) { c.beginPath(); c.ellipse(s * x, s * 0.55, s * 0.06, s * 0.1, x < 0.5 ? 0.3 : -0.3, 0, Math.PI * 2); c.fill(); }
        });
        m.add(nostrils.mesh);
        break;
      }
    }

    if (spec.extra === 'yuzu') {
      const fruit = new THREE.Mesh(new THREE.SphereGeometry(0.11, 24, 16), plushMat('#F6C343'));
      fruit.scale.y = 0.85; fruit.position.set(0.05, R * 0.95, 0);
      const leaf = sph(plushMat('#7DB46C'), 0.06, 0.015, 0.03);
      leaf.position.set(0.04, 0.09, 0); leaf.rotation.z = -0.5;
      const stem = sph(plushMat('#6B4A2F'), 0.015, 0.025, 0.015); stem.position.y = 0.095;
      fruit.add(leaf, stem);
      add(fruit);
    }
    if (spec.extra === 'bow') {
      const g = new THREE.Group(); g.position.set(0.17, 0.32, 0.08); g.rotation.z = -0.3;
      const m = plushMat('#8FCB9B');
      const l = sph(m, 0.07, 0.05, 0.03); l.position.x = -0.06; l.rotation.z = 0.3;
      const r = sph(m, 0.07, 0.05, 0.03); r.position.x = 0.06; r.rotation.z = -0.3;
      const k = sph(plushMat('#79B887'), 0.03);
      g.add(l, r, k); add(g);
    }
    if (!this.mouth) headDecalMouth();
  }

  redrawFace() {
    this.eyes.draw((c, s) => drawEyes(c, s, this.expr, this.blinkT > 0, this.gap));
    this.mouth.draw((c, s) => drawMouth(c, s, this.expr, this.mouthOpen, this.mouthOpts));
  }

  setExpr(e: Expr) {
    if (e === this.expr) return;
    this.expr = e;
    if (e === 'happy' || e === 'love') this.hop();
    this.redrawFace();
  }
  hop(power = 2.2) { if (this.hopY <= 0.001) { this.hopV = power; Plush.onHop?.(this); } }
  wave(sec = 1.2) { this.waveT = sec; }

  /** Equip accessories by item id (hat/neck/face slots). */
  setOutfit(o: { hat?: string; neck?: string; face?: string }) {
    for (const slot of [this.hatSlot, this.neckSlot, this.faceSlot]) slot.clear();
    if (o.hat) this.hatSlot.add(buildAccessory(o.hat));
    if (o.neck) this.neckSlot.add(buildAccessory(o.neck));
    if (o.face) this.faceSlot.add(buildAccessory(o.face));
  }

  faceToward(x: number, z: number) {
    this.targetYaw = Math.atan2(x - this.root.position.x, z - this.root.position.z);
  }

  update(dt: number, t: number) {
    // Smooth yaw
    let d = this.targetYaw - this.yaw;
    d = Math.atan2(Math.sin(d), Math.cos(d));
    this.yaw += d * Math.min(1, dt * 10);
    this.root.rotation.y = this.yaw;

    const s = this.speed;
    if (s > 0.02) this.phase += dt * (7 + 5 * s);
    const sw = Math.sin(this.phase);
    // Hop physics
    const wasUp = this.hopY > 0.02;
    this.hopV -= dt * 14; this.hopY = Math.max(0, this.hopY + this.hopV * dt);
    if (this.hopY === 0) { if (wasUp) Plush.onLand?.(this); this.hopV = 0; }
    const breathe = Math.sin(t * 2.2 + this.seed) * 0.014;
    this.bob.position.y = Math.abs(sw) * 0.085 * s + this.hopY;
    this.bob.rotation.z = sw * 0.09 * s + Math.sin(t * 1.1 + this.seed) * 0.012;
    this.bob.rotation.x = 0.06 * s;
    const squash = this.hopV < -1 && this.hopY < 0.05 ? 0.06 : 0;
    this.bob.scale.set(1 - breathe * 0.5 + squash, 1 + breathe - squash, 1 - breathe * 0.5 + squash);

    this.legL.rotation.x = sw * 0.75 * s;
    this.legR.rotation.x = -sw * 0.75 * s;
    this.armL.rotation.x = -sw * 0.6 * s;
    this.armR.rotation.x = sw * 0.6 * s;
    this.armL.rotation.z = -0.4 - Math.sin(t * 1.7 + this.seed) * 0.05;
    if (this.waveT > 0) {
      this.waveT -= dt;
      this.armR.rotation.z = 2.3 + Math.sin(t * 16) * 0.35;
      this.armR.rotation.x = 0;
    } else this.armR.rotation.z = 0.4 + Math.sin(t * 1.7 + this.seed) * 0.05;

    // Head
    this.head.rotation.z = Math.sin(t * 0.8 + this.seed) * 0.06;
    this.head.rotation.x = this.talking ? Math.sin(t * 13) * 0.045 : Math.sin(t * 0.6 + this.seed) * 0.02;
    if (this.tail) this.tail.rotation.y = (this.expr === 'happy' || this.expr === 'love' || s > 0.1 ? Math.sin(t * 14) * 0.35 : Math.sin(t * 2) * 0.08);
    if (this.spec.species === 'bunny' && this.ears[1]) this.ears[1].rotation.z = 0.12 + Math.max(0, Math.sin(t * 0.9 + this.seed) - 0.85) * 1.2;

    // Blink & mouth flaps
    let redraw = false;
    this.blinkIn -= dt;
    if (this.blinkIn <= 0 && this.blinkT <= 0) { this.blinkT = 0.13; this.blinkIn = 2 + Math.random() * 3.5; redraw = true; }
    if (this.blinkT > 0) { this.blinkT -= dt; if (this.blinkT <= 0) redraw = true; }
    if (this.talking) {
      this.mouthT -= dt;
      if (this.mouthT <= 0) { this.mouthOpen = !this.mouthOpen; this.mouthT = 0.09 + Math.random() * 0.07; redraw = true; }
    } else if (this.mouthOpen) { this.mouthOpen = false; redraw = true; }
    if (redraw) this.redrawFace();
  }
}

/** Wearable accessories, kept soft and plush-like. */
export function buildAccessory(id: string): THREE.Object3D {
  const g = new THREE.Group();
  const m = (c: string) => plushMat(c);
  switch (id) {
    case 'hat': { // straw sun hat with ribbon
      const brim = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.44, 0.03, 32), m('#EED8A0'));
      const dome = new THREE.Mesh(new THREE.SphereGeometry(0.24, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2), m('#EED8A0'));
      const band = new THREE.Mesh(new THREE.CylinderGeometry(0.245, 0.245, 0.06, 32), m('#F28FA6'));
      band.position.y = 0.04; brim.position.y = 0; dome.position.y = 0.01;
      g.add(brim, dome, band); g.position.y = -0.03; g.rotation.x = -0.12;
      break;
    }
    case 'cap': {
      const dome = new THREE.Mesh(new THREE.SphereGeometry(0.3, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2), m('#7FB0D9'));
      const bill = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.025, 24, 1, false, -Math.PI / 2, Math.PI), m('#5E95C4'));
      bill.position.set(0, 0.01, 0.2); bill.scale.z = 1.1;
      const btn = new THREE.Mesh(new THREE.SphereGeometry(0.035, 12, 8), m('#5E95C4')); btn.position.y = 0.3;
      g.add(dome, bill, btn); g.position.y = -0.1; g.rotation.x = -0.1;
      break;
    }
    case 'ribbon': {
      const l = new THREE.Mesh(new THREE.SphereGeometry(0.1, 16, 12), m('#F28FA6')); l.scale.set(1, 0.7, 0.4); l.position.x = -0.1; l.rotation.z = 0.3;
      const r = l.clone(); r.position.x = 0.1; r.rotation.z = -0.3;
      const k = new THREE.Mesh(new THREE.SphereGeometry(0.045, 12, 8), m('#E77A93'));
      g.add(l, r, k); g.position.set(0.12, 0.0, 0.12); g.rotation.z = -0.4;
      break;
    }
    case 'crown': {
      const band = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.19, 0.12, 24, 1, true), new THREE.MeshStandardMaterial({ color: '#F2C94C', roughness: 0.35, metalness: 0.5, side: THREE.DoubleSide }));
      g.add(band);
      for (let i = 0; i < 5; i++) {
        const a = (i / 5) * Math.PI * 2;
        const p = new THREE.Mesh(new THREE.SphereGeometry(0.035, 10, 8), m('#F28FA6'));
        p.position.set(Math.cos(a) * 0.18, 0.09, Math.sin(a) * 0.18);
        g.add(p);
      }
      g.position.y = 0.0;
      break;
    }
    case 'scarf': {
      const ring = new THREE.Mesh(new THREE.TorusGeometry(0.23, 0.07, 12, 32), m('#E5735F'));
      ring.rotation.x = Math.PI / 2; ring.scale.set(1.05, 0.95, 1.2);
      const tail = new THREE.Mesh(new THREE.CapsuleGeometry(0.06, 0.16, 6, 12), m('#E5735F'));
      tail.position.set(0.12, -0.14, 0.2); tail.rotation.set(0.2, 0, 0.25); tail.scale.z = 0.5;
      g.add(ring, tail);
      break;
    }
    case 'glasses': {
      const mat = new THREE.MeshStandardMaterial({ color: '#5B4636', roughness: 0.4 });
      for (const x of [-0.11, 0.11]) {
        const r = new THREE.Mesh(new THREE.TorusGeometry(0.075, 0.012, 8, 24), mat);
        r.position.set(x, 0, 0.04); g.add(r);
      }
      const bridge = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, 0.07, 6), mat);
      bridge.rotation.z = Math.PI / 2; bridge.position.z = 0.05; g.add(bridge);
      break;
    }
  }
  g.traverse((o) => { if ((o as THREE.Mesh).isMesh) (o as THREE.Mesh).castShadow = true; });
  return g;
}
