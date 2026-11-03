import * as THREE from 'three';
import { emojiTexture, petal, softDot, type Season } from './textures';

export type Weather = 'sunny' | 'cloudy' | 'rainy' | 'snowy';

export function seasonOf(d = new Date()): Season {
  const m = d.getMonth();
  return m >= 2 && m <= 4 ? 'spring' : m >= 5 && m <= 7 ? 'summer' : m >= 8 && m <= 10 ? 'autumn' : 'winter';
}

/** Deterministic daily weather so every visit on the same day matches. */
export function weatherOf(d = new Date(), season = seasonOf(d)): Weather {
  let h = d.getFullYear() * 372 + d.getMonth() * 31 + d.getDate();
  h = Math.imul(h ^ (h >>> 15), 2246822507); h = Math.imul(h ^ (h >>> 13), 3266489909);
  const x = ((h ^ (h >>> 16)) >>> 0) / 4294967296;
  if (x < 0.55) return 'sunny';
  if (x < 0.8) return 'cloudy';
  return season === 'winter' ? 'snowy' : 'rainy';
}

interface Key { h: number; sky: string; sun: string; sunI: number; hemiSky: string; hemiGround: string; hemiI: number }
const KEYS: Key[] = [
  { h: 0, sky: '#1D2747', sun: '#9DB2FF', sunI: 0.45, hemiSky: '#4B5C96', hemiGround: '#2B2A3F', hemiI: 0.75 },
  { h: 5, sky: '#2E2F5A', sun: '#9DB2FF', sunI: 0.45, hemiSky: '#55639A', hemiGround: '#2E2C40', hemiI: 0.8 },
  { h: 6.5, sky: '#F3B9A4', sun: '#FFB88E', sunI: 1.4, hemiSky: '#F7D3C4', hemiGround: '#8A7A6A', hemiI: 1.0 },
  { h: 9, sky: '#BFE2F0', sun: '#FFF1D9', sunI: 2.5, hemiSky: '#DDF0FA', hemiGround: '#A7B58C', hemiI: 1.25 },
  { h: 16, sky: '#C7E5EF', sun: '#FFEACB', sunI: 2.3, hemiSky: '#E4F1F6', hemiGround: '#AEB48C', hemiI: 1.2 },
  { h: 18, sky: '#F7B58E', sun: '#FFA470', sunI: 1.6, hemiSky: '#F9CDB4', hemiGround: '#8F7563', hemiI: 1.0 },
  { h: 19.5, sky: '#7A6596', sun: '#C9A0E0', sunI: 0.75, hemiSky: '#9C8CC0', hemiGround: '#4A3E52', hemiI: 0.85 },
  { h: 21, sky: '#232E55', sun: '#9DB2FF', sunI: 0.45, hemiSky: '#4B5C96', hemiGround: '#2B2A3F', hemiI: 0.75 },
  { h: 24, sky: '#1D2747', sun: '#9DB2FF', sunI: 0.45, hemiSky: '#4B5C96', hemiGround: '#2B2A3F', hemiI: 0.75 },
];
const WEATHER_TINT: Record<Weather, [string, number, number]> = {
  sunny: ['#ffffff', 0, 1], cloudy: ['#B9C3CB', 0.4, 0.6], rainy: ['#8E9DAD', 0.6, 0.42], snowy: ['#D9E3EA', 0.5, 0.65],
};

const c1 = new THREE.Color(), c2 = new THREE.Color();
const lerpHex = (a: string, b: string, t: number, out: THREE.Color) => out.set(a).lerp(c2.set(b), t);

export class Sky {
  hemi = new THREE.HemisphereLight('#ffffff', '#888888', 1);
  sun = new THREE.DirectionalLight('#ffffff', 2);
  night = 0;
  skyColor = new THREE.Color();

  constructor(private scene: THREE.Scene) {
    scene.add(this.hemi, this.sun, this.sun.target);
    this.sun.castShadow = true;
    const s = this.sun.shadow;
    const mobile = matchMedia('(pointer: coarse)').matches;
    s.mapSize.set(mobile ? 1024 : 2048, mobile ? 1024 : 2048);
    s.camera.left = -20; s.camera.right = 20; s.camera.top = 20; s.camera.bottom = -20;
    s.camera.near = 1; s.camera.far = 70;
    s.bias = -0.0006; s.normalBias = 0.03; s.radius = 4;
    scene.fog = new THREE.Fog('#BFE2F0', 34, 70);
  }

  update(hour: number, weather: Weather, focus: THREE.Vector3) {
    let i = 0;
    while (i < KEYS.length - 2 && KEYS[i + 1].h <= hour) i++;
    const a = KEYS[i], b = KEYS[i + 1];
    const t = THREE.MathUtils.clamp((hour - a.h) / (b.h - a.h), 0, 1);
    const [wc, wmix, wsun] = WEATHER_TINT[weather];
    this.night = hour >= 21 || hour < 5 ? 1 : hour >= 18.5 ? (hour - 18.5) / 2.5 : hour < 7 ? 1 - (hour - 5) / 2 : 0;
    lerpHex(a.sky, b.sky, t, this.skyColor).lerp(c1.set(wc).multiplyScalar(1 - this.night * 0.75), wmix);
    lerpHex(a.sun, b.sun, t, this.sun.color);
    this.sun.intensity = THREE.MathUtils.lerp(a.sunI, b.sunI, t) * wsun;
    lerpHex(a.hemiSky, b.hemiSky, t, this.hemi.color);
    lerpHex(a.hemiGround, b.hemiGround, t, this.hemi.groundColor);
    this.hemi.intensity = THREE.MathUtils.lerp(a.hemiI, b.hemiI, t) * (weather === 'sunny' ? 1 : 1.12);
    if (!(this.scene.background instanceof THREE.Color)) this.scene.background = new THREE.Color();
    (this.scene.background as THREE.Color).copy(this.skyColor);
    (this.scene.fog as THREE.Fog).color.copy(this.skyColor);
    if (weather !== 'sunny') this.night = Math.max(this.night, 0.25);
    // Light from the south-east, gently swinging over the day; shadow box follows the focus.
    const swing = Math.sin(((hour - 6) / 12) * Math.PI);
    this.sun.position.set(focus.x + 9 - swing * 6, focus.y + 20, focus.z + 12);
    this.sun.target.position.copy(focus);
  }
}

// ------------------------------------------------------------- particles
function pointsMat(tex: THREE.Texture, size: number, color = '#ffffff', additive = false) {
  return new THREE.PointsMaterial({
    map: tex, size, color, transparent: true, depthWrite: false, sizeAttenuation: true,
    blending: additive ? THREE.AdditiveBlending : THREE.NormalBlending,
  });
}

/** Weather + seasonal ambience particles that follow the camera focus. */
export class Ambience {
  group = new THREE.Group();
  private rain?: THREE.LineSegments;
  private fall?: THREE.Points;
  private fireflies: THREE.Points;
  private fireflyBase: Float32Array;
  private spray: THREE.Points;
  private sprayVel: Float32Array;
  private smoke: THREE.Sprite[] = [];
  private fallVel: Float32Array = new Float32Array();

  constructor(weather: Weather, season: Season, private fountain: THREE.Vector3, private chimneys: THREE.Vector3[]) {
    const R = 22;
    if (weather === 'rainy') {
      const n = 900, pos = new Float32Array(n * 6);
      for (let i = 0; i < n; i++) {
        const x = (Math.random() - 0.5) * R * 2, y = Math.random() * 16, z = (Math.random() - 0.5) * R * 2;
        pos.set([x, y, z, x - 0.05, y - 0.55, z + 0.05], i * 6);
      }
      const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
      this.rain = new THREE.LineSegments(g, new THREE.LineBasicMaterial({ color: '#DCEBF5', transparent: true, opacity: 0.55 }));
      this.rain.frustumCulled = false;
      this.group.add(this.rain);
    }
    const fallKind = weather === 'snowy' ? 'snow' : weather === 'rainy' ? null : season === 'spring' ? 'petal' : season === 'autumn' ? 'leaf' : null;
    if (fallKind) {
      const n = fallKind === 'snow' ? 700 : 70, pos = new Float32Array(n * 3);
      this.fallVel = new Float32Array(n * 2);
      for (let i = 0; i < n; i++) {
        pos.set([(Math.random() - 0.5) * R * 2, Math.random() * 14, (Math.random() - 0.5) * R * 2], i * 3);
        this.fallVel.set([Math.random() * 6.28, 0.4 + Math.random() * 0.6], i * 2);
      }
      const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
      const tex = fallKind === 'snow' ? softDot() : petal(fallKind === 'petal' ? '#F7C6D3' : '#E9934F');
      this.fall = new THREE.Points(g, pointsMat(tex, fallKind === 'snow' ? 0.22 : 0.35));
      this.fall.frustumCulled = false;
      this.fall.userData.kind = fallKind;
      this.group.add(this.fall);
    }
    // Fireflies near the pond & forest edge
    const fn = 40;
    this.fireflyBase = new Float32Array(fn * 3);
    for (let i = 0; i < fn; i++) {
      const near = i % 2 ? [-14, 10] : [(Math.random() - 0.5) * 30, -18];
      this.fireflyBase.set([near[0] + (Math.random() - 0.5) * 14, 0.6 + Math.random() * 1.8, near[1] + (Math.random() - 0.5) * 8], i * 3);
    }
    const fg = new THREE.BufferGeometry(); fg.setAttribute('position', new THREE.BufferAttribute(this.fireflyBase.slice(), 3));
    this.fireflies = new THREE.Points(fg, pointsMat(softDot('#FFF3A6'), 0.35, '#FFF3A6', true));
    this.fireflies.frustumCulled = false;
    this.group.add(this.fireflies);
    // Fountain spray
    const sn = 80, sp = new Float32Array(sn * 3);
    this.sprayVel = new Float32Array(sn * 4);
    for (let i = 0; i < sn; i++) this.resetDrop(sp, i, Math.random());
    const sg = new THREE.BufferGeometry(); sg.setAttribute('position', new THREE.BufferAttribute(sp, 3));
    this.spray = new THREE.Points(sg, pointsMat(softDot('#E8F6FA'), 0.14, '#ffffff'));
    this.group.add(this.spray);
    // Chimney smoke
    const st = softDot('#ffffff');
    for (const c of chimneys) for (let i = 0; i < 4; i++) {
      const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: st, transparent: true, opacity: 0.5, depthWrite: false }));
      s.userData = { base: c, t: i / 4 };
      this.smoke.push(s); this.group.add(s);
    }
  }

  private resetDrop(arr: Float32Array, i: number, age = 0) {
    const a = Math.random() * Math.PI * 2, sp = 0.3 + Math.random() * 0.5;
    arr.set([this.fountain.x, this.fountain.y, this.fountain.z], i * 3);
    this.sprayVel.set([Math.cos(a) * sp, 1.6 + Math.random() * 0.8, Math.sin(a) * sp, age], i * 4);
  }

  update(dt: number, t: number, focus: THREE.Vector3, night: number) {
    if (this.rain) {
      this.rain.position.set(focus.x, 0, focus.z);
      const p = this.rain.geometry.attributes.position as THREE.BufferAttribute;
      const a = p.array as Float32Array;
      for (let i = 0; i < a.length; i += 6) {
        a[i + 1] -= dt * 18; a[i + 4] -= dt * 18;
        if (a[i + 4] < 0) { a[i + 1] += 16; a[i + 4] += 16; }
      }
      p.needsUpdate = true;
    }
    if (this.fall) {
      this.fall.position.set(focus.x, 0, focus.z);
      const p = this.fall.geometry.attributes.position as THREE.BufferAttribute;
      const a = p.array as Float32Array;
      const snow = this.fall.userData.kind === 'snow';
      for (let i = 0, j = 0; i < a.length; i += 3, j += 2) {
        const ph = this.fallVel[j], sp = this.fallVel[j + 1];
        a[i] += Math.sin(t * 0.8 + ph) * dt * (snow ? 0.3 : 0.9) + dt * 0.25;
        a[i + 1] -= dt * sp * (snow ? 1.2 : 0.8);
        a[i + 2] += Math.cos(t * 0.6 + ph) * dt * 0.3;
        if (a[i + 1] < 0) { a[i + 1] = 14; a[i] = (Math.random() - 0.5) * 44; a[i + 2] = (Math.random() - 0.5) * 44; }
      }
      p.needsUpdate = true;
    }
    // Fireflies
    const fm = this.fireflies.material as THREE.PointsMaterial;
    fm.opacity = night * (0.6 + Math.sin(t * 3) * 0.2);
    this.fireflies.visible = night > 0.3;
    if (this.fireflies.visible) {
      const p = this.fireflies.geometry.attributes.position as THREE.BufferAttribute;
      const a = p.array as Float32Array;
      for (let i = 0; i < a.length; i += 3) {
        a[i] = this.fireflyBase[i] + Math.sin(t * 0.5 + i) * 0.8;
        a[i + 1] = this.fireflyBase[i + 1] + Math.sin(t * 0.9 + i * 1.3) * 0.4;
        a[i + 2] = this.fireflyBase[i + 2] + Math.cos(t * 0.4 + i) * 0.8;
      }
      p.needsUpdate = true;
    }
    // Spray
    const sp = this.spray.geometry.attributes.position as THREE.BufferAttribute;
    const sa = sp.array as Float32Array;
    for (let i = 0; i < sa.length / 3; i++) {
      const v = this.sprayVel;
      v[i * 4 + 1] -= dt * 4.5; v[i * 4 + 3] += dt;
      sa[i * 3] += v[i * 4] * dt; sa[i * 3 + 1] += v[i * 4 + 1] * dt; sa[i * 3 + 2] += v[i * 4 + 2] * dt;
      if (sa[i * 3 + 1] < 1.75) this.resetDrop(sa, i);
    }
    sp.needsUpdate = true;
    // Smoke
    for (const s of this.smoke) {
      s.userData.t = (s.userData.t + dt * 0.18) % 1;
      const k = s.userData.t, b = s.userData.base as THREE.Vector3;
      s.position.set(b.x + Math.sin(k * 3 + t * 0.3) * 0.3 + k * 0.6, b.y + k * 3, b.z);
      s.scale.setScalar(0.4 + k * 1.1);
      (s.material as THREE.SpriteMaterial).opacity = (1 - k) * 0.45 * (1 - night * 0.5);
    }
  }
}

// ------------------------------------------------------------- markers & sparkles
const texCache = new Map<string, THREE.Texture>();
export function markerSprite(emoji: string, bg = '#FFF8EC', size = 0.7) {
  const key = emoji + bg;
  if (!texCache.has(key)) texCache.set(key, emojiTexture(emoji, 128, bg));
  const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: texCache.get(key)!, transparent: true, depthWrite: false, depthTest: false }));
  s.scale.setScalar(size);
  s.renderOrder = 10;
  return s;
}

export class Sparkle {
  sprite: THREE.Points;
  constructor(public pos: THREE.Vector3) {
    const n = 8, a = new Float32Array(n * 3);
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(a, 3));
    this.sprite = new THREE.Points(g, pointsMat(softDot('#FFF6C8'), 0.28, '#FFF6C8', true));
    this.sprite.position.copy(pos);
  }
  update(t: number) {
    const p = this.sprite.geometry.attributes.position as THREE.BufferAttribute;
    const a = p.array as Float32Array;
    for (let i = 0; i < a.length / 3; i++) {
      const k = (t * 0.6 + i / 8) % 1, ang = i * 2.4 + t;
      a[i * 3] = Math.cos(ang) * 0.35 * (1 - k); a[i * 3 + 1] = 0.2 + k * 1.1; a[i * 3 + 2] = Math.sin(ang) * 0.35 * (1 - k);
    }
    p.needsUpdate = true;
  }
}

/** Short-lived floating emoji (hearts, notes) above a character. */
export class Burst {
  items: { s: THREE.Sprite; v: THREE.Vector3; life: number }[] = [];
  constructor(private parent: THREE.Object3D) {}
  emit(emoji: string, at: THREE.Vector3, n = 5) {
    for (let i = 0; i < n; i++) {
      const s = markerSprite(emoji, undefined, 0.35);
      (s.material as THREE.SpriteMaterial).depthTest = true;
      s.position.copy(at);
      this.parent.add(s);
      this.items.push({ s, v: new THREE.Vector3((Math.random() - 0.5) * 1.4, 1.4 + Math.random(), (Math.random() - 0.5) * 0.6), life: 1.2 });
    }
  }
  update(dt: number) {
    this.items = this.items.filter((it) => {
      it.life -= dt;
      it.s.position.addScaledVector(it.v, dt);
      it.v.y -= dt * 1.2;
      (it.s.material as THREE.SpriteMaterial).opacity = Math.min(1, it.life * 2);
      if (it.life <= 0) { it.s.removeFromParent(); (it.s.material as THREE.Material).dispose(); return false; }
      return true;
    });
  }
}
