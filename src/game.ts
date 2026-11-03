import * as THREE from 'three';
import { S, store, today } from './core/save';
import { bus } from './core/events';
import { pick, setUiLang, t } from './core/i18n';
import type { Expr } from './core/types';
import {
  addCoins, addFriend, addXP, checkAchievements, count, dailyRollover, finishTalk, foundItem, friend,
  giveItem, playerLevel, qs, questTalk, spend, takeItem,
} from './core/progress';
import { NPCS, heartsFor, npcDef, type NpcDef } from './content/characters';
import { CONVOS, type Step } from './content/dialogues';
import { ITEMS, item, type ItemDef } from './content/items';
import { lex } from './content/lexicon';
import { NOTICES } from './content/notes';
import { questDef } from './content/quests';
import { SPOTS } from './content/places';
import { langInfo } from './content/languages';
import { audio } from './audio/audio';
import { speech } from './learning/tts';
import { plainText } from './learning/text';
import { exposePhrase, expose, lexNative, lexTarget, loadVoicePack, renderOpts, sayLex, target, wordsForChat, levelNum } from './learning/engine';
import { buildVillage, BOUNDS, setSigns, type Village } from './world/village';
import { Ambience, Burst, Sky, Sparkle, markerSprite, seasonOf, weatherOf, type Weather } from './world/env';
import { Npc, Player, blendYaw, moveCircle, type Walkable } from './world/actors';
import { Plush } from './world/plush';
import { HomeInterior } from './world/home';
import { portraitOf } from './world/portrait';
import { Hud } from './ui/hud';
import { Joystick } from './ui/joystick';
import { Dialogue, type Speaker } from './ui/dialogue';
import { openNotebook } from './ui/notebook';
import { openShop } from './ui/shop';
import { button, centerCard, confetti, fadeThrough, h, toast, ui } from './ui/dom';
import { playerSpec } from './ui/onboarding';
import type { Season } from './world/textures';

const params = new URLSearchParams(location.search);
const WEATHER_ICON: Record<Weather, string> = { sunny: '☀️', cloudy: '⛅', rainy: '🌧️', snowy: '❄️' };

interface Interactable { icon: string; label: string; x: number; z: number; r: number; use: () => void; pri?: number }
interface Pickup { id: string; obj: THREE.Object3D; sparkle: Sparkle }

export class Game {
  renderer: THREE.WebGLRenderer;
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(36, 1, 0.1, 140);
  clock = new THREE.Clock();
  season: Season;
  weather: Weather;
  village: Village;
  sky: Sky;
  amb: Ambience;
  burst: Burst;
  npcs: Npc[] = [];
  player?: Player;
  home = new HomeInterior();
  mode: 'title' | 'village' | 'home' = 'title';
  hud?: Hud;
  joy?: Joystick;
  busy = false;
  private camPos = new THREE.Vector3(0, 14, 24);
  private camLook = new THREE.Vector3();
  private focusNpc: Npc | null = null;
  private pickups: Pickup[] = [];
  private guide: THREE.Mesh;
  private portraits = new Map<string, string>();
  private saveTimer = 0;
  private fishing: null | { phase: 'wait' | 'nibble' | 'bite'; t: number; bobber: THREE.Mesh; line: THREE.Line; hud: HTMLElement; msg: HTMLElement; nibbles: number } = null;
  private deco: null | { panel: HTMLElement; placing: string | null; selected: number | null; pop: HTMLElement | null } = null;
  private zoom = 1;
  private shake = 0;
  private talkSlot: THREE.Vector3 | null = null;

  constructor(canvas: HTMLCanvasElement) {
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
    this.renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.0;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;

    const now = new Date();
    this.season = (params.get('season') as Season) || seasonOf(now);
    this.weather = (params.get('weather') as Weather) || weatherOf(now, this.season);
    this.village = buildVillage(this.season);
    this.scene.add(this.village.group);
    this.sky = new Sky(this.scene);
    this.amb = new Ambience(this.weather, this.season, this.village.fountainTop, this.village.chimneys);
    this.scene.add(this.amb.group);
    this.burst = new Burst(this.scene);
    for (const d of NPCS) {
      const n = new Npc(d);
      n.snap(this.hour());
      this.npcs.push(n);
      this.scene.add(n.plush.root);
    }
    const arrow = new THREE.Shape();
    arrow.moveTo(0, 0.55); arrow.lineTo(0.32, 0.05); arrow.lineTo(0.12, 0.1); arrow.lineTo(0.12, -0.3); arrow.lineTo(-0.12, -0.3); arrow.lineTo(-0.12, 0.1); arrow.lineTo(-0.32, 0.05);
    this.guide = new THREE.Mesh(new THREE.ShapeGeometry(arrow), new THREE.MeshBasicMaterial({ color: '#FFE08A', transparent: true, opacity: 0.85, depthWrite: false }));
    this.guide.rotation.x = -Math.PI / 2;
    this.guide.visible = false;
    this.scene.add(this.guide);

    window.addEventListener('resize', () => this.resize());
    this.resize();
    this.renderer.domElement.addEventListener('wheel', (e) => { this.zoom = THREE.MathUtils.clamp(this.zoom + e.deltaY * 0.001, 0.7, 1.3); }, { passive: true });
    this.renderer.domElement.addEventListener('pointerdown', (e) => this.onCanvasTap(e));
    this.renderer.setAnimationLoop(() => this.frame());
  }

  hour() {
    const ph = params.get('hour');
    if (ph) return parseFloat(ph);
    if (store.data?.settings.timeMode === 'day') return 12;
    const d = new Date();
    return d.getHours() + d.getMinutes() / 60;
  }

  resize() {
    const w = window.innerWidth, h2 = window.innerHeight;
    this.renderer.setSize(w, h2, false);
    this.camera.aspect = w / h2;
    this.camera.updateProjectionMatrix();
    this.home.camera.aspect = w / h2;
    this.home.camera.fov = w < h2 ? 46 : 36;
    this.home.camera.updateProjectionMatrix();
  }

  // ------------------------------------------------------------ boot
  startPlay(isNew: boolean) {
    const d = S();
    setUiLang(d.profile.native);
    dailyRollover();
    this.player = new Player(new Plush(playerSpec(d.profile.species, d.profile.color)));
    this.player.plush.setOutfit(d.player.outfit);
    this.player.pos.set(d.player.x, 0, d.player.z);
    this.player.onStep = () => audio.step(this.surfaceAt(this.player!.pos));
    Plush.onHop = (p) => { if (this.nearPlayer(p)) audio.hop(); };
    Plush.onLand = (p) => { if (this.nearPlayer(p)) audio.land(); };
    for (const n of this.npcs) n.onGreet = (npc) => {
      if (!S().settings.blips || this.busy) return;
      const dx = npc.pos.x - this.player!.pos.x;
      audio.emote('hi', npc.def.voice.pitch, 0.7, dx / 6);
    };
    this.scene.add(this.player.plush.root);
    this.hud = new Hud((tab) => this.openMenu(tab));
    this.joy = new Joystick(this.joyHint());
    this.applySettings();
    this.mode = 'village';
    this.snapCamera();
    if (playerLevel() >= 2) this.openForest(false);
    this.refreshPickups();
    this.wireEvents();
    speech.onMissing = (lang) => toast('🔇', t('noVoice', { lang: langInfo(lang).autonym }), undefined, 4500);
    if (isNew) {
      this.player.plush.targetYaw = Math.PI;
      setTimeout(() => this.narrate([t('arrive')]), 600);
    } else {
      toast(WEATHER_ICON[this.weather], `${t(this.season)} · ${t(this.weather)}`, t('streak', { n: d.stats.streak }));
    }
    checkAchievements();
    window.setInterval(() => dailyRollover(), 60_000);
  }

  /** Which footstep sound fits the ground under the player. */
  private surfaceAt(p: THREE.Vector3): 'grass' | 'wood' | 'stone' | 'snow' {
    if (this.mode === 'home') return 'wood';
    const d = SPOTS.dockRect, b = SPOTS.bridge;
    if (p.x > d.minX && p.x < d.maxX && p.z > d.minZ && p.z < d.maxZ) return 'wood';
    if (Math.abs(p.x) < b.halfW && p.z > b.minZ && p.z < b.maxZ) return 'wood';
    if (Math.hypot(p.x, p.z) < 7.4) return 'stone';
    return this.season === 'winter' ? 'snow' : 'grass';
  }

  private nearPlayer(p: Plush) {
    if (!this.player) return false;
    if (p === this.player.plush) return true;
    return p.root.position.distanceTo(this.player.pos) < 5;
  }

  private joyHint() { return { en: 'Drag to walk', es: 'Arrastra para caminar', ja: 'ドラッグで歩く' }[S().profile.native] ?? 'Drag to walk'; }

  private wireEvents() {
    bus.on('save:changed', () => this.hud?.refresh());
    bus.on('learn:newWord', (id: string) => { if (!this.busy) toast(lex(id).icon, t('newWord'), lexTarget(id), 2200); });
    bus.on('coins', (n: number) => { if (n > 0) audio.coin(); });
    bus.on('levelup', (lvl: number) => this.onLevelUp(lvl));
    bus.on('heartup', ({ id, hearts }: { id: string; hearts: number }) => {
      const npc = this.npcs.find((n) => n.def.id === id);
      if (npc) this.burst.emit('💛', npc.pos.clone().setY(1.6), 6);
      audio.heart();
      toast('💛', t('friendUp', { npc: this.npcName(npcDef(id)) }), '💛'.repeat(hearts));
    });
    bus.on('achievement', (id: string) => { audio.achievement(); toast('🏅', t('ach_' + id), t('ach_' + id + '_d'), 3200); });
    bus.on('quest:new', (id: string) => { const q = questDef(id); toast(q.icon, t('newQuest'), pick(q.title), 3000); this.hud?.setMenuDot(true); });
    bus.on('quest:step', () => { this.refreshPickups(); this.hud?.refresh(); });
    bus.on('quest:done', (id: string) => this.onQuestDone(id));
  }

  npcName(d: NpcDef) { return pick(d.name, target()); }

  // ------------------------------------------------------------ settings
  applySettings() {
    const s = S().settings;
    audio.musicVol = s.music; audio.sfxVol = s.sfx; audio.applyVolumes();
    speech.rate = s.rate;
    loadVoicePack();
    document.documentElement.dataset.text = s.textSize;
    const sign = (id: string) => {
      let txt = plainText(lex(id).t[target()] ?? lex(id).t.en, target(), renderOpts(), s.jaScript === 'kana' ? 'kana' : 'kanji');
      txt = txt.replace(/^(el|la|los|las|the) /i, '');
      return txt.charAt(0).toUpperCase() + txt.slice(1);
    };
    setSigns(this.village, sign('cafe'), sign('store'));
    this.hud?.refresh();
  }

  changeLanguages(native: string, tgt: string) {
    const p = S().profile;
    p.native = native; p.target = tgt;
    setUiLang(native);
    store.touch('lang');
    this.hud?.root.remove();
    document.querySelector('.action-wrap')?.remove();
    this.hud = new Hud((tab) => this.openMenu(tab));
    this.joy?.remove();
    this.joy = new Joystick(this.joyHint());
    this.applySettings();
    this.portraits.clear();
  }

  portrait(id: string) {
    if (!this.portraits.has(id)) {
      const d = S();
      let p: Plush;
      if (id === 'player') { p = new Plush(playerSpec(d.profile.species, d.profile.color)); p.setOutfit(d.player.outfit); }
      else { const nd = npcDef(id); p = new Plush({ species: nd.species, ...nd.colors, extra: nd.extra }); }
      p.setExpr('happy');
      this.portraits.set(id, portraitOf(p));
    }
    return this.portraits.get(id)!;
  }

  openMenu(tab?: string) {
    if (this.busy) return;
    this.hud?.setMenuDot(false);
    this.setBusy(true);
    openNotebook({
      applySettings: () => this.applySettings(),
      equip: (slot, id) => {
        S().player.outfit[slot] = id; store.touch('outfit');
        this.player!.plush.setOutfit(S().player.outfit);
        this.player!.plush.hop(); audio.squeak(); this.portraits.delete('player');
      },
      changeLanguages: (n, tg) => this.changeLanguages(n, tg),
      resetSave: async () => { await store.reset(); location.href = location.pathname; },
      portrait: (id) => this.portrait(id),
    }, (tab as any) ?? 'quests').el.addEventListener('animationend', (e) => {
      if ((e as AnimationEvent).animationName === 'sheetDown') this.setBusy(false);
    });
  }

  setBusy(b: boolean) {
    this.busy = b;
    this.joy?.setEnabled(!b);
    if (b) this.hud?.setAction(null);
  }

  // ------------------------------------------------------------ frame
  private frame() {
    const dt = Math.min(0.05, this.clock.getDelta());
    const t = this.clock.elapsedTime;
    const hour = this.hour();
    if (this.mode === 'home') { this.frameHome(dt, t); return; }
    const focus = this.player ? this.player.pos : new THREE.Vector3(0, 0, 0);
    this.sky.update(hour, this.weather, focus);
    const night = this.sky.night;
    this.village.glowMat.emissiveIntensity = night * 1.4;
    for (const l of this.village.lamps) l.intensity = night * 14;
    for (const w of this.village.waters) { w.offset.x = t * 0.012; w.offset.y = t * 0.008; }
    audio.setMood(night > 0.7 ? 'night' : hour >= 17 ? 'evening' : 'day');
    audio.setRain(this.weather === 'rainy' && this.mode === 'village');
    this.amb.update(dt, t, focus, night);
    this.burst.update(dt);
    for (const p of this.pickups) { p.sparkle.update(t); p.obj.position.y = 0.6 + Math.sin(t * 2.5) * 0.1; p.obj.rotation.y = t; }

    const walk: Walkable = {
      colliders: this.village.colliders, isWater: this.village.isWater, bounds: BOUNDS,
      ignoreTags: this.village.log.visible ? undefined : new Set(['log']),
      dynamic: this.npcs.map((n) => ({ x: n.pos.x, z: n.pos.z, r: 0.45 })),
    };
    if (this.player) {
      const input = this.busy || this.fishing ? { x: 0, z: 0 } : this.joy!.read();
      if (this.talkSlot) {
        const d = this.talkSlot.clone().sub(this.player.pos);
        if (d.length() > 0.05) { this.player.pos.addScaledVector(d, Math.min(1, dt * 6)); this.player.plush.speed = 0.5; }
      }
      this.player.update(dt, t, input, walk);
      if (this.talkSlot && this.focusNpc) {
        this.player.plush.faceToward(this.focusNpc.pos.x, this.focusNpc.pos.z);
        this.player.plush.targetYaw = blendYaw(this.player.plush.targetYaw, 0, 0.4);
      }
      if (!this.busy && !this.fishing) this.hud?.setAction(this.nearestAction());
      this.updateGuide(t);
      this.saveTimer += dt;
      if (this.saveTimer > 4) { this.saveTimer = 0; S().player.x = this.player.pos.x; S().player.z = this.player.pos.z; store.touch('pos'); }
      this.hud?.setTime(hour, WEATHER_ICON[this.weather]);
    }
    for (const n of this.npcs) {
      n.update(dt, t, hour, this.player?.pos ?? new THREE.Vector3(0, 0, 999), walk);
      if (this.player && !n.talking) n.setMarker(questTalk(n.def.id) ? 'quest' : n.activity === 'rest' ? 'sleep' : '');
    }
    if (this.fishing) this.updateFishing(dt, t);
    this.updateCamera(dt, t);
    this.renderer.render(this.scene, this.camera);
  }

  private snapCamera() {
    for (let i = 0; i < 60; i++) this.updateCamera(0.05, 0);
  }

  private updateCamera(dt: number, t: number) {
    const portrait = this.camera.aspect < 1;
    if (this.mode === 'title' || !this.player) {
      const a = t * 0.06;
      this.camPos.set(Math.sin(a) * 26, 15, Math.cos(a) * 26 + 2);
      this.camLook.set(0, 1, 0);
      this.camera.position.copy(this.camPos);
      this.camera.lookAt(this.camLook);
      return;
    }
    const target = this.player.pos.clone();
    let dist = (portrait ? 15.5 : 12.5) * this.zoom;
    if (this.focusNpc) { target.lerp(this.focusNpc.pos, 0.5); dist *= 0.58; target.z += portrait ? 1.2 : 0.4; }
    if (this.fishing) { target.set(SPOTS.fishSpot[0], 0, SPOTS.fishSpot[1] - 1.5); dist *= 0.75; }
    const want = new THREE.Vector3(target.x, target.y + dist * 0.92, target.z + dist * 0.98);
    const k = 1 - Math.exp(-dt * 4);
    this.camPos.lerp(want, k);
    this.camLook.lerp(target.clone().add(new THREE.Vector3(0, 0.6, portrait ? -0.6 : -0.3)), k);
    this.camera.position.copy(this.camPos);
    if (this.shake > 0) {
      this.shake = Math.max(0, this.shake - dt);
      const s = this.shake * 0.5;
      this.camera.position.x += Math.sin(t * 90) * s;
      this.camera.position.y += Math.cos(t * 75) * s * 0.6;
    }
    this.camera.lookAt(this.camLook);
  }

  // ------------------------------------------------------------ interactions
  private interactables(): Interactable[] {
    const list: Interactable[] = [];
    for (const n of this.npcs) {
      const q = !!questTalk(n.def.id);
      list.push({ icon: q ? '❗' : '💬', label: `${t('talk')} · ${this.npcName(n.def)}`, x: n.pos.x, z: n.pos.z, r: 2.2, pri: q ? 2 : 0.8, use: () => this.talkTo(n) });
    }
    const [hx, hz] = SPOTS.homeDoor;
    list.push({ icon: '🏠', label: t('enter'), x: hx, z: hz + 0.4, r: 1.6, use: () => this.enterHome() });
    const [nx, nz] = SPOTS.notice;
    list.push({ icon: '📰', label: t('read'), x: nx, z: nz, r: 2.0, use: () => this.readNotice() });
    const [fx, fz] = SPOTS.fishSpot;
    list.push({ icon: '🎣', label: t('fish'), x: fx, z: fz, r: 1.3, use: () => this.startFishing() });
    for (const p of this.pickups) list.push({ icon: '✋', label: t('pickup'), x: p.obj.position.x, z: p.obj.position.z, r: 1.5, use: () => this.collect(p) });
    SPOTS.flowers.forEach(([x, z], i) => { if (!S().daily.flowers.includes(i)) list.push({ icon: '🌷', label: t('pickup'), x, z, r: 1.2, use: () => this.pickNature('flower', i) }); });
    if (!this.village.log.visible) SPOTS.mushrooms.forEach(([x, z], i) => { if (!S().daily.mushrooms.includes(i)) list.push({ icon: '🍄', label: t('pickup'), x, z, r: 1.2, use: () => this.pickNature('mushroom', i) }); });
    else { const [lx, lz] = SPOTS.forestLog; list.push({ icon: '🪵', label: t('look'), x: lx, z: lz + 1, r: 2.0, use: () => toast('🪵', t('forestBlocked')) }); }
    return list;
  }

  private nearestAction() {
    const p = this.player!.pos;
    let best: Interactable | null = null, bd = Infinity;
    for (const it of this.interactables()) {
      const d = Math.hypot(it.x - p.x, it.z - p.z);
      const score = d - (it.pri ?? 0);
      if (d < it.r && score < bd) { bd = score; best = it; }
    }
    return best ? { icon: best.icon, label: best.label, use: () => { if (!this.busy) best!.use(); } } : null;
  }

  private updateGuide(time: number) {
    const tgt = this.objectivePos();
    const p = this.player!.pos;
    if (!tgt || this.busy || Math.hypot(tgt.x - p.x, tgt.z - p.z) < 5) { this.guide.visible = false; return; }
    this.guide.visible = true;
    const ang = Math.atan2(tgt.x - p.x, tgt.z - p.z);
    const r = 1.25 + Math.sin(time * 4) * 0.08;
    this.guide.position.set(p.x + Math.sin(ang) * r, 0.08, p.z + Math.cos(ang) * r);
    this.guide.rotation.z = ang + Math.PI;
  }

  private objectivePos(): THREE.Vector3 | null {
    for (const id of ['q_hello', 'q_tea', 'q_lost']) {
      const st = qs(id);
      if (!st || st.state !== 'active') continue;
      const step = questDef(id).steps[st.step];
      if (step.talk) {
        const who = Object.keys(step.talk).find((n) => !st.talked.includes(n));
        const npc = this.npcs.find((n) => n.def.id === who);
        if (npc) return npc.pos;
      }
      if (step.collect && this.pickups.length) {
        const p = this.player!.pos;
        return this.pickups.map((x) => x.obj.position).sort((a, b) => a.distanceTo(p) - b.distanceTo(p))[0];
      }
    }
    return null;
  }

  private speakerFor(n: Npc): Speaker {
    return {
      name: this.npcName(n.def), color: n.def.tint, voice: n.def.voice,
      setExpr: (e: Expr) => n.plush.setExpr(e),
      setTalking: (on) => (n.plush.talking = on),
    };
  }

  private async conversation(n: Npc | null, steps: Step[], opts: { closable?: boolean } = {}) {
    const dlg = new Dialogue(n ? this.speakerFor(n) : null, { effect: (fn, arg) => this.effect(fn, arg, n) }, opts);
    return dlg.run(steps);
  }

  private async withNpc<T>(n: Npc, fn: () => Promise<T>): Promise<T> {
    this.setBusy(true);
    this.focusNpc = n; n.talking = true;
    n.setMarker('');
    // Step beside the villager so both faces are visible.
    const pl = this.player!;
    const side = pl.pos.x >= n.pos.x ? 1 : -1;
    for (const sx of [side, -side]) {
      const tx = n.pos.x + sx * 1.3, tz = n.pos.z + 0.45;
      const walk: Walkable = { colliders: this.village.colliders, isWater: this.village.isWater, bounds: BOUNDS };
      const [nx, nz] = moveCircle(tx, tz, 0, 0, 0.38, walk);
      if (Math.hypot(nx - tx, nz - tz) < 0.3 && !this.village.isWater(tx, tz)) { this.talkSlot = new THREE.Vector3(tx, 0, tz); break; }
    }
    pl.plush.faceToward(n.pos.x, n.pos.z);
    pl.plush.targetYaw = blendYaw(pl.plush.targetYaw, 0, 0.4);
    try { return await fn(); } finally {
      n.talking = false; this.focusNpc = null; this.talkSlot = null; n.plush.setExpr('neutral');
      this.setBusy(false);
      this.hud?.refresh();
    }
  }

  private narrate(lines: string[], icon = '✦') {
    this.setBusy(true);
    return this.conversation(null, lines.map((l) => ({ t: 'narrate', text: { [S().profile.native]: l }, icon }) as Step)).finally(() => this.setBusy(false));
  }

  async talkTo(n: Npc) {
    audio.soft();
    const qt = questTalk(n.def.id);
    if (qt) {
      await this.withNpc(n, async () => {
        if (!friend(n.def.id).met) await this.firstMeeting(n);
        const r = await this.conversation(n, CONVOS[qt.convo]);
        if (!r.closed) { finishTalk(qt.quest, n.def.id); addFriend(n.def.id, 5); }
      });
      return;
    }
    await this.withNpc(n, async () => {
      const dlg = new Dialogue(this.speakerFor(n), { effect: (fn, arg) => this.effect(fn, arg, n) }, { closable: true });
      const choices = [{ id: 'chat', label: '💬 ' + t('chat') }, { id: 'gift', label: '🎁 ' + t('gift') }];
      if (n.def.id === 'pip') choices.push({ id: 'shop', label: '🛍️ ' + t('shop') }, { id: 'sell', label: '🪙 ' + t('sellFish') });
      if (n.def.id === 'biscuit') choices.push({ id: 'order', label: '🧁 ' + t('order') });
      choices.push({ id: 'bye', label: '👋 ' + t('bye') });
      const greet = this.timeGreeting();
      const choice = await dlg.menu({ p: n.activity === 'rest' ? 'im_sleepy' : greet, e: n.activity === 'rest' ? 'sleepy' : 'happy' }, choices);
      if (choice === 'chat') await dlg.run(this.chatSteps(n));
      else if (choice === 'gift') await this.giveGift(n, dlg);
      else if (choice === 'sell') { dlg.finish(); await this.sellFinds(n); }
      else if (choice === 'shop' || choice === 'order') {
        dlg.finish();
        let bought = false;
        await new Promise<void>((res) => openShop(choice === 'shop' ? 'store' : 'cafe', (it) => { bought = true; void this.purchase(n, it).then(res); }).el.addEventListener('animationend', (e) => {
          if ((e as AnimationEvent).animationName === 'sheetDown' && !bought) setTimeout(res, 50);
        }));
      } else { dlg.finish(); n.plush.wave(); }
    });
  }

  /** Animal Crossing–style "!" the first time you talk to someone. */
  private async firstMeeting(n: Npc) {
    const p = n.plush, pl = this.player!;
    p.faceToward(pl.pos.x, pl.pos.z);
    p.yaw = p.targetYaw;
    await new Promise((r) => setTimeout(r, 150));
    const bang = markerSprite('❗', '#FFE9A8', 1);
    bang.position.set(0, 2.25, 0);
    bang.scale.setScalar(0.01);
    p.root.add(bang);
    audio.surprise();
    if (S().settings.blips) audio.emote('gasp', n.def.voice.pitch);
    p.setExpr('surprised');
    p.hop(3.4);
    this.shake = 0.35;
    navigator.vibrate?.(40);
    // Hop back a little, away from the player.
    const away = n.pos.clone().sub(pl.pos).setY(0).normalize().multiplyScalar(0.45);
    const from = n.pos.clone(), start = performance.now();
    await new Promise<void>((resolve) => {
      const tick = () => {
        const k = Math.min(1, (performance.now() - start) / 900);
        // "!" pops with an overshoot, then settles; villager slides back during the jump.
        const pop = k < 0.25 ? (k / 0.25) * 1.25 : k < 0.4 ? 1.25 - ((k - 0.25) / 0.15) * 0.25 : 1;
        bang.scale.setScalar(pop * 0.95);
        bang.position.y = 2.25 + Math.sin(Math.min(1, k * 2) * Math.PI) * 0.15;
        n.pos.copy(from).addScaledVector(away, Math.min(1, k * 2.5));
        if (k < 1) requestAnimationFrame(tick); else resolve();
      };
      requestAnimationFrame(tick);
    });
    bang.removeFromParent();
    (bang.material as THREE.Material).dispose();
    p.setExpr('neutral');
  }

  private timeGreeting() {
    const hr = this.hour();
    return hr >= 5 && hr < 11 ? 'good_morning' : hr >= 11 && hr < 18 ? 'good_afternoon' : 'good_evening';
  }

  /** Daily small talk that weaves in spaced-repetition reviews. */
  private chatSteps(n: Npc): Step[] {
    const f = friend(n.def.id);
    const first = f.lastChat !== today();
    const greet = this.timeGreeting();
    const steps: Step[] = [];
    if (first) {
      steps.push({ t: 'say', p: greet, e: 'happy' });
      steps.push({ t: 'reply', ok: [greet], bad: ['good_morning', 'good_afternoon', 'good_evening'].filter((g) => g !== greet && !(target() === 'ja' && greet === 'good_afternoon' && g === 'hello')) });
      const wp = { sunny: 'weather_sunny', cloudy: 'weather_cloudy', rainy: 'weather_rain', snowy: 'weather_snow' }[this.weather];
      steps.push({ t: 'say', p: wp, e: this.weather === 'rainy' ? 'sleepy' : 'happy' });
      steps.push({ t: 'reply', ok: ['yes_it_is'], bad: ['see_you', 'whats_your_name'] });
    }
    const words = wordsForChat(first ? 2 : 1, (l) => l.cat !== 'action' && l.cat !== 'feeling');
    words.forEach((w, i) => {
      steps.push({ t: 'say', p: 'whats_this', e: 'thinking' });
      steps.push(levelNum() >= 2 && i % 2 === 1 ? { t: 'listen', w, due: true } : { t: 'name', w, due: true });
    });
    if (first && f.story < heartsFor(f.pts) + 1 && f.story < n.def.stories.length) {
      const sp = n.def.stories[f.story];
      steps.push({ t: 'say', p: sp, e: 'love' });
      if (levelNum() >= 2) steps.push({ t: 'meaning', p: sp });
      steps.push({ t: 'do', fn: 'story' });
    }
    steps.push({ t: 'say', p: 'see_you', e: 'happy' });
    steps.push({ t: 'do', fn: 'chatDone', arg: first });
    return steps;
  }

  private async giveGift(n: Npc, dlg: Dialogue) {
    const f = friend(n.def.id);
    if (f.lastGift === today()) { dlg.finish(); toast('🎁', t('giftedToday', { npc: this.npcName(n.def) })); return; }
    const giftable = Object.keys(S().inventory).filter((id) => ['food', 'nature', 'fish'].includes(item(id).kind) && count(id) > 0);
    if (!giftable.length) { dlg.finish(); toast('🎒', t('noGift')); return; }
    const choice = await dlg.pickTile('🎁 ' + t('chooseGift'), giftable.map((id) => ({ id, icon: lex(item(id).lex).icon, label: lexTarget(item(id).lex) })));
    if (!choice) return;
    const lx = item(choice).lex;
    expose('lex', lx);
    const fav = n.def.favorites.includes(lx), like = n.def.likes.includes(lx);
    await dlg.run([
      { t: 'reply', ok: ['heres_gift'], bad: ['whats_this', 'see_you'] },
      { t: 'do', fn: 'takeItem', arg: choice },
      { t: 'say', p: fav ? 'gift_love' : 'gift_thanks', e: fav ? 'love' : 'happy' },
      ...(fav ? [{ t: 'say', p: 'i_like_item', item: lx, e: 'love' } as Step] : []),
    ]);
    f.lastGift = today();
    audio.gift();
    this.burst.emit(fav ? '💖' : '💛', n.pos.clone().setY(1.6), fav ? 8 : 4);
    addFriend(n.def.id, fav ? 15 : like ? 8 : 4);
  }

  private async purchase(n: Npc, it: ItemDef) {
    await this.withNpc(n, async () => {
      const dlg = new Dialogue(this.speakerFor(n), { effect: (fn, arg) => this.effect(fn, arg, n) });
      const pool = ITEMS.filter((x) => x.shop === it.shop && x.id !== it.id && lex(x.lex).icon !== lex(it.lex).icon && (x.minLevel ?? 1) <= playerLevel());
      const others = pool.sort(() => Math.random() - 0.5).map((x) => x.lex);
      await dlg.say(n.def.id === 'biscuit' ? 'what_would_you_like' : 'which_one', 'happy');
      await dlg.replyItem('want_item', it.lex, others);
      if (spend(it.price ?? 0)) {
        giveItem(it.id);
        await dlg.say(n.def.id === 'biscuit' ? 'here_you_go' : 'thanks_purchase', 'happy');
      } else await dlg.say('not_enough', 'sad');
      dlg.finish();
    });
  }

  private async sellFinds(n: Npc) {
    const sellable = Object.keys(S().inventory).filter((id) => item(id).sell && count(id) > 0);
    if (!sellable.length) { toast('🪙', t('nothingToSell')); return; }
    let total = 0;
    for (const id of sellable) {
      const def = item(id), c = count(id);
      const known = def.kind !== 'fish' || S().collection[id]?.known;
      total += Math.round((def.sell ?? 0) * (known ? 1 : 0.5)) * c;
      takeItem(id, c);
    }
    await this.withNpc(n, async () => {
      const dlg = new Dialogue(this.speakerFor(n), { effect: () => {} });
      await dlg.say('thanks_purchase', 'happy');
      dlg.finish();
    });
    addCoins(total);
    toast('🪙', t('sold', { n: total }));
  }

  private async effect(fn: string, arg: unknown, n: Npc | null) {
    switch (fn) {
      case 'giveItem': giveItem(arg as string); audio.sparkle(); toast(lex(item(arg as string).lex).icon, t('gotItem', { x: lexTarget(item(arg as string).lex) })); break;
      case 'takeItem': takeItem(arg as string); break;
      case 'giveCoins': addCoins(arg as number); break;
      case 'pay': spend(Math.min(arg as number, S().player.coins)); break;
      case 'meet': friend(arg as string).met = true; store.touch('meet'); checkAchievements(); break;
      case 'spawnLost': this.refreshPickups(); break;
      case 'story': if (n) { friend(n.def.id).story++; store.touch('story'); } break;
      case 'chatDone': {
        if (!n) break;
        const f = friend(n.def.id);
        if (arg) { f.lastChat = today(); addFriend(n.def.id, 6); addXP(5); }
        n.plush.wave();
        break;
      }
    }
  }

  // ------------------------------------------------------------ world objects
  private refreshPickups() {
    for (const p of this.pickups) { p.obj.removeFromParent(); p.sparkle.sprite.removeFromParent(); }
    this.pickups = [];
    const st = qs('q_lost');
    if (st?.state === 'active' && st.step === 1) {
      for (const id of ['key', 'book', 'umbrella'] as const) {
        if (st.found.includes(id)) continue;
        const [x, z] = SPOTS.lost[id];
        const obj = markerSprite(lex(item(id).lex).icon, '#FFFFFFcc', 0.8);
        (obj.material as THREE.SpriteMaterial).depthTest = true;
        obj.position.set(x, 0.6, z);
        const sparkle = new Sparkle(new THREE.Vector3(x, 0, z));
        this.scene.add(obj, sparkle.sprite);
        this.pickups.push({ id, obj, sparkle });
      }
    }
    const flowers = S().daily.flowers, mush = S().daily.mushrooms;
    this.village.flowers.forEach((f, i) => (f.visible = !flowers.includes(i)));
    this.village.mushrooms.forEach((m, i) => (m.visible = !mush.includes(i)));
  }

  private collect(p: Pickup) {
    audio.pickup();
    giveItem(p.id);
    const lx = item(p.id).lex;
    expose('lex', lx);
    sayLex(lx);
    toast(lex(lx).icon, t('found', { x: lexTarget(lx) }), lexNative(lx), 2800);
    this.burst.emit('✨', p.obj.position.clone(), 6);
    this.player!.plush.hop();
    foundItem('q_lost', p.id);
    this.refreshPickups();
    this.hud?.refresh();
  }

  private pickNature(id: 'flower' | 'mushroom', i: number) {
    (id === 'flower' ? S().daily.flowers : S().daily.mushrooms).push(i);
    giveItem(id);
    expose('lex', id);
    sayLex(id);
    audio.pickup();
    toast(lex(id).icon, t('found', { x: lexTarget(id) }), lexNative(id), 2200);
    this.player!.plush.hop(1.6);
    this.refreshPickups();
  }

  private openForest(announce: boolean) {
    this.village.log.visible = false;
    if (announce) toast('🌲', t('forestOpen'), undefined, 4000);
  }

  private async readNotice() {
    if (S().daily.notice) { toast('📰', t('noticeDone')); return; }
    const d = new Date();
    const n = NOTICES[(d.getDate() + d.getMonth() * 31) % NOTICES.length];
    this.setBusy(true);
    const dlg = new Dialogue({ name: '📰 ' + t('noticeTitle'), color: '#B0644E', voice: { pitch: 0, speed: 3 } }, { effect: () => {} });
    exposePhrase(n.p);
    const r = await dlg.run([{ t: 'say', p: n.p }, { t: 'ask', q: n.q, w: n.answer, opts: n.opts }]);
    S().daily.notice = true;
    if (r.correct) { addCoins(15); addXP(8); }
    store.touch('notice');
    this.setBusy(false);
  }

  private onLevelUp(lvl: number) {
    audio.levelUp(); confetti(70);
    const unlocks: string[] = [];
    if (lvl === 2) { unlocks.push('🌲 ' + t('forestOpen')); this.openForest(false); }
    if (lvl === 3) unlocks.push('🏠 ' + t('homeUpgrade'));
    if (ITEMS.some((i) => i.minLevel === lvl)) unlocks.push('🛍️ ' + t('newItems'));
    const list = unlocks.length ? h('div.unlock-list', null, ...unlocks.map((u) => h('div', null, u))) : '';
    setTimeout(() => centerCard('🌟', t('levelUp', { n: lvl }), list ? [list] : [], t('gotIt')), this.busy ? 1200 : 200);
  }

  private onQuestDone(id: string) {
    const q = questDef(id);
    this.refreshPickups();
    setTimeout(() => {
      audio.questDone(); confetti(80);
      const rewards = [`🪙 +${q.reward.coins}`, `✨ +${q.reward.xp} XP`, ...(q.reward.items ?? []).map((i) => `${lex(item(i).lex).icon} ${lexTarget(item(i).lex)}`)];
      centerCard(q.icon, t('questComplete'), [pick(q.title), h('div.unlock-list', null, ...rewards.map((r) => h('div', { html: r })))], t('gotIt'));
    }, 700);
    this.hud?.refresh();
  }

  // ------------------------------------------------------------ fishing
  private startFishing() {
    if (!count('rod')) { toast('🎣', t('needRod')); return; }
    this.setBusy(true);
    this.busy = false; // keep the action button usable for reeling
    this.joy?.setEnabled(false);
    const [fx, fz] = SPOTS.fishSpot, [bx, bz] = SPOTS.bobber;
    this.player!.pos.set(fx, 0, fz);
    this.player!.plush.targetYaw = Math.PI;
    const bobber = new THREE.Mesh(new THREE.SphereGeometry(0.12, 16, 12), new THREE.MeshStandardMaterial({ color: '#E8566C' }));
    const cap = new THREE.Mesh(new THREE.SphereGeometry(0.12, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2), new THREE.MeshStandardMaterial({ color: '#FFFFFF' }));
    bobber.add(cap); bobber.position.set(bx, 0.1, bz);
    const lineGeo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(fx + 0.3, 1.4, fz - 0.3), bobber.position]);
    const line = new THREE.Line(lineGeo, new THREE.LineBasicMaterial({ color: '#ffffff', transparent: true, opacity: 0.7 }));
    this.scene.add(bobber, line);
    audio.cast();
    setTimeout(() => audio.plop(), 280);
    const msg = h('div.fish-msg', null, t('fishWait'));
    const hud = h('div.fish-hud', null, msg);
    const stop = button('btn.soft.small', t('stopFishing'), () => this.endFishing(), { style: { position: 'absolute', left: '50%', bottom: 'calc(130px + var(--safe-b))', transform: 'translateX(-50%)' } });
    ui().append(hud, stop);
    hud.dataset.stop = '1';
    (hud as any).stopBtn = stop;
    this.fishing = { phase: 'wait', t: 1.5 + Math.random() * 3.5, bobber, line, hud, msg, nibbles: 1 + Math.floor(Math.random() * 3) };
    this.hud?.setAction({ icon: '🎣', label: t('reel'), use: () => this.reel() });
  }

  private updateFishing(dt: number, time: number) {
    const f = this.fishing!;
    f.t -= dt;
    const [bx, bz] = SPOTS.bobber;
    let y = 0.1 + Math.sin(time * 2) * 0.02;
    if (f.phase === 'nibble') y -= Math.max(0, Math.sin((f.t / 0.35) * Math.PI)) * 0.08;
    if (f.phase === 'bite') y = -0.12 + Math.sin(time * 20) * 0.03;
    f.bobber.position.set(bx, y, bz);
    (f.line.geometry as THREE.BufferGeometry).setFromPoints([new THREE.Vector3(SPOTS.fishSpot[0] + 0.3, 1.4, SPOTS.fishSpot[1] - 0.3), f.bobber.position]);
    if (f.t > 0) return;
    if (f.phase === 'wait' || f.phase === 'nibble') {
      if (f.nibbles > 0) { f.nibbles--; f.phase = 'nibble'; f.t = 0.35 + Math.random() * 1.2; audio.nibble(); }
      else { f.phase = 'bite'; f.t = levelNum() === 1 ? 1.3 : 1.0; audio.splash(); f.msg.textContent = t('fishNow'); f.msg.classList.add('now'); navigator.vibrate?.(80); }
    } else if (f.phase === 'bite') {
      f.msg.textContent = t('fishEscaped'); f.msg.classList.remove('now');
      setTimeout(() => this.endFishing(), 900);
      f.phase = 'wait'; f.t = 999;
    }
  }

  private async reel() {
    const f = this.fishing;
    if (!f) return;
    if (f.phase !== 'bite') {
      f.msg.textContent = f.phase === 'nibble' ? t('fishEarly') : t('fishWait');
      if (f.phase === 'nibble') { f.t = 999; setTimeout(() => this.endFishing(), 1100); }
      return;
    }
    audio.reel();
    setTimeout(() => audio.splash(), 260);
    const night = this.sky.night > 0.6;
    const pool = ITEMS.filter((i) => i.fish && !(i.fish.night && !night) && !(i.fish.day && night));
    const total = pool.reduce((s, i) => s + i.fish!.weight, 0);
    let r = Math.random() * total;
    const caught = pool.find((i) => (r -= i.fish!.weight) < 0) ?? pool[0];
    this.endFishing(true);
    giveItem(caught.id);
    const col = S().collection;
    col[caught.id] = { caught: (col[caught.id]?.caught ?? 0) + 1, known: col[caught.id]?.known ?? false };
    S().stats.fishCaught++;
    store.touch('fish');
    this.burst.emit(lex(caught.lex).icon, new THREE.Vector3(SPOTS.bobber[0], 0.6, SPOTS.bobber[1]), 1);
    this.player!.plush.hop(2.6);
    this.player!.plush.setExpr('happy');
    const yuzu = this.npcs.find((n) => n.def.id === 'yuzu')!;
    const near = yuzu.pos.distanceTo(this.player!.pos) < 9 ? yuzu : null;
    this.setBusy(true);
    if (near) { this.focusNpc = near; near.talking = true; }
    const dlg = new Dialogue(near ? this.speakerFor(near) : null, { effect: () => {} });
    const opts = [caught.lex, ...ITEMS.filter((i) => i.fish && i.id !== caught.id).sort(() => Math.random() - 0.5).slice(0, levelNum() >= 3 ? 3 : 2).map((i) => i.lex)];
    const steps: Step[] = near ? [{ t: 'say', p: 'nice_catch', e: 'happy' }, { t: 'say', p: 'what_fish', e: 'thinking' }] : [];
    steps.push({ t: 'name', w: caught.lex, opts, due: true });
    const res = await dlg.run(steps);
    if (res.correct) { col[caught.id].known = true; addXP(6); }
    store.touch('fish');
    checkAchievements();
    if (near) { near.talking = false; this.focusNpc = null; }
    this.player!.plush.setExpr('neutral');
    this.setBusy(false);
  }

  private endFishing(caught = false) {
    const f = this.fishing;
    if (!f) return;
    f.bobber.removeFromParent(); f.line.removeFromParent();
    f.hud.remove(); (f.hud as any).stopBtn?.remove();
    this.fishing = null;
    if (!caught) this.setBusy(false);
  }

  // ------------------------------------------------------------ home
  async enterHome() {
    this.setBusy(true);
    audio.door();
    await fadeThrough(() => {
      this.mode = 'home';
      this.home.build(S().home);
      this.home.scene.add(this.player!.plush.root);
      this.player!.pos.set(0, 0, this.home.size / 2 - 0.9);
      this.player!.plush.targetYaw = Math.PI;
      this.hud!.show(true);
      audio.setRain(false);
      this.showHomeBar();
    });
    this.setBusy(false);
  }

  async exitHome() {
    this.setBusy(true);
    audio.door();
    this.closeDecorate();
    await fadeThrough(() => {
      this.mode = 'village';
      this.scene.add(this.player!.plush.root);
      const [x, z] = SPOTS.homeDoor;
      this.player!.pos.set(x, 0, z + 1.2);
      this.player!.plush.targetYaw = 0;
      this.snapCamera();
      document.querySelector('.home-bar')?.remove();
    });
    this.setBusy(false);
  }

  private showHomeBar() {
    document.querySelector('.home-bar')?.remove();
    ui().append(h('div.home-bar', null, button('btn', '🪄 ' + t('decorate'), () => this.openDecorate())));
  }

  private frameHome(dt: number, time: number) {
    const N = this.home.size;
    const walk: Walkable = { colliders: this.home.colliders, bounds: { minX: -N / 2 + 0.4, maxX: N / 2 - 0.4, minZ: -N / 2 + 0.4, maxZ: N / 2 - 0.3 } };
    const input = this.busy || this.deco ? { x: 0, z: 0 } : this.joy!.read();
    this.player!.update(dt, time, input, walk, 3.4);
    this.home.update(dt, time);
    if (!this.busy && !this.deco) {
      const d = Math.hypot(this.player!.pos.x - this.home.door.x, this.player!.pos.z - this.home.door.z);
      this.hud?.setAction(d < 1.2 ? { icon: '🚪', label: t('exit'), use: () => this.exitHome() } : null);
    }
    this.hud?.setTime(this.hour(), WEATHER_ICON[this.weather]);
    this.renderer.render(this.home.scene, this.home.camera);
  }

  private openDecorate() {
    if (this.deco) return;
    audio.open();
    this.hud?.setAction(null);
    this.joy?.setEnabled(false);
    document.querySelector('.home-bar')?.remove();
    this.home.showGrid(true);
    const panel = h('div.deco-panel');
    ui().append(panel);
    this.deco = { panel, placing: null, selected: null, pop: null };
    this.renderDecorate();
  }

  private closeDecorate() {
    if (!this.deco) return;
    this.deco.panel.remove(); this.deco.pop?.remove();
    this.deco = null;
    this.home.showGrid(false);
    this.joy?.setEnabled(true);
    if (this.mode === 'home') this.showHomeBar();
    checkAchievements();
  }

  private renderDecorate() {
    const d = this.deco!;
    const home = S().home;
    const owned = Object.keys(S().inventory).filter((id) => item(id).kind === 'furniture' && count(id) > 0);
    const wallBtns = h('div.row', null, ...['cream', 'mint', 'peach', 'sky'].map((w) => button('swatch' + (home.wallpaper === w ? '.on' : ''), '', () => { home.wallpaper = w; store.touch('home'); this.home.build(home); this.renderDecorate(); }, { style: { background: { cream: '#FBEBD5', mint: '#D8EEDC', peach: '#FBD9CC', sky: '#D6E9F6' }[w], width: '30px', height: '30px' }, 'aria-label': w })));
    const floorBtns = h('div.row', null, ...['oak', 'checker', 'moss'].map((f) => button('swatch' + (home.floor === f ? '.on' : ''), '', () => { home.floor = f; store.touch('home'); this.home.build(home); this.renderDecorate(); }, { style: { background: { oak: '#D9A877', checker: '#E8B9A6', moss: '#BBD5A0' }[f], width: '30px', height: '30px' }, 'aria-label': f })));
    const canExpand = playerLevel() >= 3 && home.size < 8;
    const scroll = h('div.deco-scroll');
    if (!owned.length) scroll.append(h('div.muted', { style: { padding: '12px', fontWeight: 700 } }, t('noFurniture')));
    for (const id of owned) {
      const def = item(id);
      const el = button('slot' + (d.placing === id ? '.sel' : ''), [h('span.cnt', null, '×' + count(id)), h('span.si', null, lex(def.lex).icon), h('span', { lang: target(), html: lexTarget(def.lex) })], () => {
        d.placing = d.placing === id ? null : id; d.selected = null; d.pop?.remove(); d.pop = null;
        sayLex(def.lex);
        this.renderDecorate();
      });
      scroll.append(el);
    }
    d.panel.replaceChildren(
      h('div.deco-tools', null,
        h('div.row', null, h('span.muted', { style: { fontSize: '0.8em', fontWeight: 800 } }, t('wallpaper')), wallBtns),
        h('div.row', null, h('span.muted', { style: { fontSize: '0.8em', fontWeight: 800 } }, t('floor')), floorBtns)),
      h('div.row', { style: { justifyContent: 'space-between', margin: '4px 2px 6px' } },
        h('b', { style: { fontSize: '0.9em' } }, d.placing ? '👆 ' + t('placeHint') : t('furnitureBag')),
        h('div.row', null,
          canExpand ? button('btn.soft.small', `📐 ${t('expand')} · 🪙300`, () => { if (spend(300)) { home.size = 8; store.touch('home'); this.home.build(home); this.renderDecorate(); } else toast('🪙', t('coinsShort')); }) : null,
          button('btn.primary.small', t('done'), () => { audio.close(); this.closeDecorate(); }))),
      scroll,
    );
  }

  private onCanvasTap(e: PointerEvent) {
    if (this.mode !== 'home' || !this.deco) return;
    const d = this.deco;
    const ndc = new THREE.Vector2((e.clientX / window.innerWidth) * 2 - 1, -(e.clientY / window.innerHeight) * 2 + 1);
    const ray = new THREE.Raycaster();
    ray.setFromCamera(ndc, this.home.camera);
    const home = S().home;
    // Tap on existing furniture → select it
    const hits = ray.intersectObjects(this.home.furniture.children, true);
    if (hits.length && !d.placing) {
      let o: THREE.Object3D | null = hits[0].object;
      while (o && o.userData.uid === undefined) o = o.parent;
      if (o) { this.selectFurniture(o.userData.uid as number, e.clientX, e.clientY); return; }
    }
    const pt = new THREE.Vector3();
    if (!ray.ray.intersectPlane(new THREE.Plane(new THREE.Vector3(0, 1, 0), 0), pt)) return;
    if (d.placing) {
      const snap = this.home.snap(d.placing, 0, pt.x, pt.z, home.placed);
      if (!snap.ok) { audio.gentleWrong(); return; }
      takeItem(d.placing);
      home.placed.push({ uid: home.nextUid++, item: d.placing, x: snap.x, z: snap.z, rot: 0 });
      store.touch('home');
      audio.place();
      this.home.rebuildFurniture(home.placed);
      if (!count(d.placing)) d.placing = null;
      this.renderDecorate();
    } else if (d.selected !== null) {
      const p = home.placed.find((x) => x.uid === d.selected);
      if (!p) return;
      const snap = this.home.snap(p.item, p.rot, pt.x, pt.z, home.placed, p.uid);
      if (!snap.ok) { audio.gentleWrong(); return; }
      p.x = snap.x; p.z = snap.z; store.touch('home'); audio.place();
      this.home.rebuildFurniture(home.placed);
      d.pop?.remove(); d.pop = null; d.selected = null;
    }
  }

  private selectFurniture(uid: number, sx: number, sy: number) {
    const d = this.deco!;
    const home = S().home;
    d.pop?.remove();
    d.selected = uid;
    audio.select();
    const p = home.placed.find((x) => x.uid === uid)!;
    sayLex(item(p.item).lex);
    const pop = h('div.sel-pop', { style: { left: sx + 'px', top: sy + 'px' } },
      button('btn.small', '↻ ' + t('rotate'), () => {
        const nr = (p.rot + 1) % 4;
        const snap = this.home.snap(p.item, nr, p.x, p.z, home.placed, p.uid);
        if (!snap.ok) { audio.gentleWrong(); return; }
        p.rot = nr; p.x = snap.x; p.z = snap.z; store.touch('home'); audio.rotate(); this.home.rebuildFurniture(home.placed);
      }),
      button('btn.small', '📦 ' + t('putAway'), () => {
        home.placed = home.placed.filter((x) => x.uid !== uid);
        giveItem(p.item); store.touch('home'); audio.pickup();
        this.home.rebuildFurniture(home.placed);
        pop.remove(); d.pop = null; d.selected = null;
        this.renderDecorate();
      }));
    ui().append(pop);
    d.pop = pop;
  }
}
