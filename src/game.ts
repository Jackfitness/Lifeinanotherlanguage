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
import { hasLex, lex } from './content/lexicon';
import { NOTICES } from './content/notes';
import { questDef } from './content/quests';
import { SPOTS } from './content/places';
import { langInfo } from './content/languages';
import { audio } from './audio/audio';
import { speech } from './learning/tts';
import { plainText, renderTarget } from './learning/text';
import { card, exposePhrase, expose, lexNative, lexTarget, loadVoicePack, renderOpts, sayLex, target, wordsForChat, levelNum } from './learning/engine';
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
import { button, centerCard, confetti, holdCards, fadeThrough, h, toast, ui } from './ui/dom';
import { playerSpec } from './ui/onboarding';
import { openMap } from './ui/map';
import { openDojo } from './ui/dojoui';
import { buildTown, TOWN_SPOTS, type Town } from './world/towns/build';
import { makeGraph } from './world/actors';
import { isTown, registerTowns, townById, TOWNS } from './content/towns';
import type { TownContent } from './content/towns/types';
import { buildSession, setDojoTown, grammarFor, townState, lessonsDone, type SessionKind } from './learning/dojo';
import { activeQuests, finishDojo, startTown } from './core/progress';
import { openPass } from './ui/pass';
import { showBedtime } from './ui/bedtime';
import { voicePack } from './audio/voicepack';
import { ensureFont } from './ui/trace';
import { billing, FREE_PREVIEW, FREE_TOWNS, hasPass, questLocked, townOpenFree } from './core/billing';
import { progress } from './learning/engine';
import { applyFont, displayFamily, FONTS } from './ui/fonts';
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
  private seat: { x: number; z: number; ry: number } | null = null;
  private bedtime: { close: () => void } | null = null;
  /** Which outdoor area the player is in: the starter village or a Village Pass town. */
  place: string = 'home';
  private townDef: TownContent = TOWNS[0];
  private townCache = new Map<string, { town: Town; npcs: Npc[]; amb: Ambience }>();
  private town: Town | null = null;
  private townNpcs: Npc[] = [];
  private townAmb: Ambience | null = null;
  private bellSwing = 0;
  private playTick = 0;

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

  // ------------------------------------------------------------ daily play time
  /** Free players get 15 minutes a day (?playlimit=<seconds> overrides for testing). */
  private get playLimit() { return Number(params.get('playlimit')) || 15 * 60; }
  private hasPass() { return hasPass(); }
  private playLimitReached() { return !this.hasPass() && (S().daily.playSeconds ?? 0) >= this.playLimit; }

  private trackPlayTime(realDt: number) {
    if (this.hasPass() || this.bedtime || document.hidden || this.mode === 'title') return;
    if (FREE_TOWNS.includes(this.place)) return; // learning to read is free and unlimited
    const d = S().daily;
    d.playSeconds = (d.playSeconds ?? 0) + Math.min(realDt, 1);
    this.playTick += realDt;
    if (this.playTick > 10) { this.playTick = 0; store.touch('playtime'); }
    const left = this.playLimit - d.playSeconds;
    if (!d.warned && left <= 120 && left > 0) {
      d.warned = true;
      toast('⏳', t('timeLeft', { m: Math.ceil(left / 60) }), t('timeLeftSub'), 4500);
    }
    if (left <= 0 && !this.busy) this.enterBedtime();
  }

  private enterBedtime() {
    if (this.bedtime || this.hasPass()) return;
    this.standUp();
    store.touch('bedtime');
    const dayStart = new Date(); dayStart.setHours(0, 0, 0, 0);
    const words = Object.values(progress().lex).filter((c) => c.last >= dayStart.getTime()).length;
    const next = new Date(dayStart); next.setDate(next.getDate() + 1);
    this.bedtime = showBedtime({
      minutes: Math.max(1, Math.round((S().daily.playSeconds ?? this.playLimit) / 60)),
      words,
      msToNextDay: () => next.getTime() - Date.now(),
      onReview: () => this.openMenu('words', true),
      onPass: () => openPass(() => { if (this.hasPass() && this.bedtime) { this.bedtime.close(); this.bedtime = null; this.setBusy(false); } }, 'bedtime'),
      onFreeTown: () => { this.bedtime?.close(); this.bedtime = null; this.setBusy(false); void this.travel('ink'); },
    });
    this.setBusy(true);
  }

  openMapSheet() {
    if (this.busy) return;
    this.setBusy(true);
    openMap({
      player: () => ({ x: this.player!.pos.x, z: this.player!.pos.z }),
      villagers: () => (this.place === 'home' ? this.npcs : []).map((n) => ({ icon: n.def.species, x: n.pos.x, z: n.pos.z })),
      place: this.place,
      canTravel: (id) => isTown(id) && (this.hasPass() || townOpenFree(id)),
      travel: (id) => { void this.travel(id); },
    }, () => this.setBusy(false));
  }

  // ------------------------------------------------------------ towns
  /** The outdoor area the player is standing in. */
  area(): Village { return this.inTown() && this.town ? this.town : this.village; }
  activeNpcs(): Npc[] { return this.inTown() ? this.townNpcs : this.npcs; }
  inTown() { return this.place !== 'home'; }

  /** Builds a town the first time you visit it, then reuses it. */
  private ensureTown(id: string) {
    registerTowns();
    const def = townById(id) ?? TOWNS[0];
    let c = this.townCache.get(def.id);
    if (!c) {
      const kana = S().settings.jaScript === 'kana';
      const sg = (m: string) => plainText(m, 'ja', renderOpts(), kana ? 'kana' : 'kanji');
      const town = buildTown(def.theme, this.season, { hall: sg(def.signs.hall), post: sg(def.signs.post), restaurant: sg(def.signs.restaurant), dojo: sg(def.signs.dojo), market: sg(def.signs.market) });
      town.group.visible = false;
      this.scene.add(town.group);
      const graph = makeGraph(town.nodes, town.edges);
      const npcs = def.npcs.map((d) => { const n = new Npc(d, graph); n.snap(this.hour()); n.plush.root.visible = false; this.scene.add(n.plush.root); return n; });
      const amb = new Ambience(this.weather, def.theme === 'snowcap' ? 'winter' : this.season, town.fountainTop, town.chimneys);
      amb.group.visible = false;
      this.scene.add(amb.group);
      for (const n of npcs) n.onGreet = (npc) => { if (S().settings.blips && !this.busy) audio.emote('hi', npc.def.voice.pitch, 0.7, (npc.pos.x - this.player!.pos.x) / 6); };
      c = { town, npcs, amb };
      this.townCache.set(def.id, c);
    }
    this.townDef = def;
    if (def.script) void ensureFont(); // tracing guides use a handwriting font
    this.town = c.town; this.townNpcs = c.npcs; this.townAmb = c.amb;
    setDojoTown(def.id);
    this.updateTownRoutines();
    return c.town;
  }

  /** Mimi wanders off to the park during chapter 6, then goes home with you. */
  private updateTownRoutines(mimiFound = false) {
    const mimi = townById('clover')!.npcs.find((n) => n.id === 'mimi');
    if (!mimi) return;
    const st = qs('clover_6');
    const lost = !mimiFound && st?.state === 'active' && st.step >= 1 && st.step <= 3;
    mimi.routine = [{ from: 0, to: 24, node: lost ? 'park' : 'kitchenSide', activity: 'stroll' }];
  }

  /** Bus travel between the starter village and the pass towns. */
  async travel(to: string, instant = false) {
    if (!this.player || (to !== 'home' && !isTown(to))) return;
    if (to !== 'home' && !this.hasPass() && !townOpenFree(to)) { openPass(undefined, 'town'); return; }
    this.standUp();
    this.setBusy(true);
    const swap = () => {
      const goingToTown = to !== 'home';
      // hide whatever town we were in
      if (this.town) this.town.group.visible = false;
      for (const n of this.townNpcs) n.plush.root.visible = false;
      if (this.townAmb) this.townAmb.group.visible = false;
      if (goingToTown) this.ensureTown(to);
      this.place = to;
      this.village.group.visible = !goingToTown;
      for (const n of this.npcs) n.plush.root.visible = !goingToTown;
      this.amb.group.visible = !goingToTown;
      if (goingToTown) {
        this.town!.group.visible = true;
        for (const n of this.townNpcs) n.plush.root.visible = true;
        this.townAmb!.group.visible = true;
      }
      this.refreshPickups();
      const [x, z] = goingToTown ? TOWN_SPOTS.spawn : [1.2, 22.2];
      this.player!.pos.set(x, 0, z);
      this.player!.plush.targetYaw = Math.PI;
      S().player.place = to; S().player.x = x; S().player.z = z;
      voicePack.setTown(to);
      store.touch('travel');
      if (this.hud) this.hud.place = to;
      this.hud?.refresh();
      this.snapCamera();
    };
    if (instant) swap(); else { audio.door(); await fadeThrough(swap); }
    this.setBusy(false);
    if (to !== 'home' && startTown(to)) {
      this.updateTownRoutines();
      setTimeout(() => this.narrate([pick(this.townDef.arrive)], '🚌'), 400);
    }
  }

  openDojoSheet() {
    if (this.busy) return;
    this.setBusy(true);
    openDojo({
      portrait: (id) => this.portrait(id),
      run: (kind, unit) => void this.runDojo(kind, unit),
      examOpen: () => !!this.townDef.script || lessonsDone() >= this.townDef.units || qs(this.townDef.finaleQuest)?.state === 'active' || townState().examBest > 0,
    }, () => { if (!this.dojoRunning) this.setBusy(false); });
  }
  private dojoRunning = false;

  /** Run a dojo lesson, practice set or the exam, then show results. */
  private async runDojo(kind: SessionKind, unit = 1) {
    if (!this.hasPass() && !FREE_TOWNS.includes(this.townDef.id) && (kind === 'exam' || (kind === 'lesson' && unit > FREE_PREVIEW.chapters))) { openPass(undefined, 'preview'); return; }
    this.dojoRunning = true;
    this.setBusy(true);
    holdCards(true);
    const kero = this.townNpcs.find((n) => n.def.id === this.townDef.sensei);
    if (kero) { this.focusNpc = kero; kero.talking = true; }
    const dlg = new Dialogue(kero ? this.speakerFor(kero) : null, { effect: () => {} }, { closable: true });
    try {
      if (kind === 'lesson') {
        for (const gp of grammarFor(unit)) {
          await dlg.noteCard(`${t('lessonKicker')} ${unit}`, pick(gp.title), pick(gp.note),
            `${renderTarget(gp.example, 'ja', renderOpts())}<div class="muted" style="font-size:.85em">${pick(gp.exampleM)}</div>`);
        }
      }
      const qs2 = buildSession(kind, unit);
      const sections: Record<string, { c: number; n: number }> = {};
      let correct = 0, answered = 0;
      const label = kind === 'exam' ? pick(this.townDef.examTitle) : kind === 'lesson' ? `${t('lessonKicker')} ${unit}` : '';
      for (let i = 0; i < qs2.length; i++) {
        const ok = await Promise.race([dlg.dojo(qs2[i], { i, n: qs2.length, label }), new Promise<null>((r) => { const iv = setInterval(() => { if (!dlg.root.isConnected) { clearInterval(iv); r(null); } }, 300); })]);
        if (ok === null) break;
        answered++;
        const sec = (sections[qs2[i].section] ??= { c: 0, n: 0 });
        sec.n++; if (ok) { sec.c++; correct++; }
      }
      dlg.finish();
      if (answered < qs2.length) return; // quit early: no result
      const pct = Math.round((correct / qs2.length) * 100);
      const ts = townState();
      ts.sessions++;
      let title = t('sessionDone'), sub = t('correctOf', { c: correct, n: qs2.length }), big = '✨';
      if (kind === 'lesson') {
        const key = 'lesson_' + unit, first = !(ts.lessons[key] >= 60);
        ts.lessons[key] = Math.max(ts.lessons[key] ?? 0, pct);
        if (pct >= 60) { title = t('lessonPassed'); big = '🥋'; if (first) { addXP(30); addCoins(20); } finishDojo(key); }
        else { title = t('lessonRetry'); big = '🌱'; }
      }
      if (kind === 'exam') {
        ts.examBest = Math.max(ts.examBest, pct);
        if (pct >= (this.townDef.passMark ?? 80)) { ts.examPassed = true; title = t('examPassed'); sub += ' · ' + pick(this.townDef.examPassedSub); big = '🏅'; finishDojo('exam'); }
        else {
          title = t('examFailed', { p: this.townDef.passMark ?? 80 }); big = '🌱';
          const names: Record<string, string> = { vocab: t('dojoVocab'), kanji: t('dojoKanji'), grammar: t('dojoGrammar'), reading: t('dojoReading'), listening: t('dojoListening'), writing: t('dojoWriting') };
          const weakest = Object.entries(sections).sort((a, b) => a[1].c / a[1].n - b[1].c / b[1].n)[0];
          if (weakest) sub += ' · ' + t('practiceTip', { s: names[weakest[0]] });
        }
      }
      store.touch('dojo');
      const bars = h('div.result-bars', null, ...Object.entries(sections).map(([k, v]) =>
        h('div.rb', null, h('span', null, ({ vocab: t('dojoVocab'), kanji: t('dojoKanji'), grammar: t('dojoGrammar'), reading: t('dojoReading'), listening: t('dojoListening'), writing: t('dojoWriting') } as Record<string, string>)[k]),
          h('div.rb-bar', null, h('i', { style: { width: `${(v.c / v.n) * 100}%` } })), h('b', null, `${v.c}/${v.n}`))));
      if (pct >= (this.townDef.passMark ?? 80) || (kind === 'lesson' && pct >= 60)) { audio.questDone(); confetti(50); }
      holdCards(false, false);
      centerCard(big, title, [h('div.result-score', null, `${pct}%`), sub, bars], t('gotIt'));
    } finally {
      if (kero) { kero.talking = false; this.focusNpc = null; kero.plush.setExpr('neutral'); }
      this.dojoRunning = false;
      holdCards(false);
      this.setBusy(false);
      this.hud?.refresh();
    }
  }

  private ringBell() {
    this.bellSwing = 6;
    audio.levelUp();
    setTimeout(() => audio.heart(), 500);
    setTimeout(() => audio.questDone(), 1200);
    confetti(120);
    if (this.town) for (let i = 0; i < 4; i++) setTimeout(() => this.burst.emit('sparkle', new THREE.Vector3((Math.random() - 0.5) * 6, 9, (Math.random() - 0.5) * 4), 8), i * 400);
    for (const n of this.townNpcs) n.plush.hop(2.4);
    toast('🔔', pick(this.townDef.finaleTitle), pick(this.townDef.finaleSub), 6000);
  }

  /** Copy the live player position into the save (called before the app is hidden or closed). */
  persistPosition() {
    if (!this.player || this.mode !== 'village' || !store.data) return;
    S().player.x = this.player.pos.x; S().player.z = this.player.pos.z; S().player.place = this.place;
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
    this.hud = new Hud((tab) => this.openMenu(tab), () => this.openMapSheet());
    this.hud.place = this.place;
    this.joy = new Joystick(this.joyHint());
    this.applySettings();
    this.mode = 'village';
    this.snapCamera();
    if (playerLevel() >= 2) this.openForest(false);
    if (isTown(S().player.place) && (this.hasPass() || townOpenFree(S().player.place!))) void this.travel(S().player.place!, true);
    this.refreshPickups();
    this.wireEvents();
    speech.onMissing = (lang) => voicePack.ready() ? undefined : toast('🔇', t('noVoice', { lang: langInfo(lang).autonym }), undefined, 4500);
    if (isNew) {
      this.player.plush.targetYaw = Math.PI;
      setTimeout(() => this.narrate([t('arrive')]), 600);
    } else {
      toast(WEATHER_ICON[this.weather], `${t(this.season)} · ${t(this.weather)}`, t('streak', { n: d.stats.streak }));
    }
    checkAchievements();
    window.setInterval(() => dailyRollover(), 60_000);
    bus.on('newday', () => { if (this.bedtime) { this.bedtime.close(); this.bedtime = null; this.setBusy(false); } });
    if (this.playLimitReached() && !FREE_TOWNS.includes(this.place)) setTimeout(() => this.enterBedtime(), 800);
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
    bus.on('quest:step', () => { this.refreshPickups(); this.updateTownRoutines(); this.hud?.refresh(); });
    bus.on('quest:done', (id: string) => this.onQuestDone(id));
    bus.on('pass:granted', () => { this.hud?.refresh(); if (this.bedtime) { this.bedtime.close(); this.bedtime = null; this.setBusy(false); } });
  }

  npcName(d: NpcDef) {
    return plainText(pick(d.name, target()), target(), renderOpts(), S().settings.jaScript === 'kana' ? 'kana' : 'kanji');
  }

  // ------------------------------------------------------------ settings
  applySettings() {
    const s = S().settings;
    audio.musicVol = s.music; audio.sfxVol = s.sfx; audio.applyVolumes();
    speech.rate = s.rate;
    loadVoicePack();
    void billing.refresh();
    document.documentElement.dataset.text = s.textSize;
    const sign = (id: string) => {
      let txt = plainText(lex(id).t[target()] ?? lex(id).t.en, target(), renderOpts(), s.jaScript === 'kana' ? 'kana' : 'kanji');
      txt = txt.replace(/^(el|la|los|las|the) /i, '');
      return txt.charAt(0).toUpperCase() + txt.slice(1);
    };
    void applyFont(s.font).then(() => setSigns(this.village, sign('cafe'), sign('store'), displayFamily(), FONTS[s.font ?? 'cozy'].displayWeight));
    this.hud?.refresh();
  }

  changeLanguages(native: string, tgt: string) {
    const p = S().profile;
    p.native = native; p.target = tgt;
    setUiLang(native);
    store.touch('lang');
    this.hud?.root.remove();
    document.querySelector('.action-wrap')?.remove();
    this.hud = new Hud((tab) => this.openMenu(tab), () => this.openMapSheet());
    this.hud.place = this.place;
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

  openMenu(tab?: string, force = false) {
    if (this.busy && !force) return;
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
    }, (tab as any) ?? 'quests', () => this.setBusy(false));
  }

  setBusy(b: boolean) {
    b = b || !!this.bedtime;
    this.busy = b;
    this.joy?.setEnabled(!b);
    if (b) this.hud?.setAction(null);
  }

  // ------------------------------------------------------------ frame
  private frame() {
    const rawDt = this.clock.getDelta();
    const dt = Math.min(0.05, rawDt);
    if (this.player) this.trackPlayTime(rawDt);
    const t = this.clock.elapsedTime;
    const hour = this.hour();
    if (this.mode === 'home') { this.frameHome(dt, t); return; }
    const focus = this.player ? this.player.pos : new THREE.Vector3(0, 0, 0);
    this.sky.update(hour, this.weather, focus);
    const night = this.sky.night;
    const area = this.area();
    area.glowMat.emissiveIntensity = night * 1.4;
    for (const l of area.lamps) l.intensity = night * 14;
    for (const w of area.waters) { w.offset.x = t * 0.012; w.offset.y = t * 0.008; }
    if (this.town && this.inTown()) {
      const sp = this.town.spinner; sp.obj.rotation[sp.axis] += dt * sp.speed;
      for (const o of this.town.group.children) if (o.userData.steam !== undefined) { const k = ((t * 0.25 + o.userData.steam) % 1); o.position.y = 0.4 + k * 2.6; o.scale.setScalar(0.4 + k * 0.9); ((o as THREE.Mesh).material as THREE.MeshBasicMaterial).opacity = 0.4 * (1 - k); }
      if (this.bellSwing > 0) { this.bellSwing -= dt; this.town.bell.rotation.z = Math.sin(t * 9) * 0.45 * Math.min(1, this.bellSwing); }
    }
    audio.setMood(night > 0.7 ? 'night' : hour >= 17 ? 'evening' : 'day');
    audio.setRain(this.weather === 'rainy' && this.mode === 'village');
    (this.inTown() && this.townAmb ? this.townAmb : this.amb).update(dt, t, focus, night);
    this.burst.update(dt);
    for (const p of this.pickups) { p.sparkle.update(t); p.obj.position.y = 0.6 + Math.sin(t * 2.5) * 0.1; p.obj.rotation.y = t; }

    const walk: Walkable = {
      colliders: area.colliders, isWater: area.isWater, bounds: this.inTown() && this.town ? this.town.bounds : BOUNDS,
      ignoreTags: this.village.log.visible || this.place !== 'home' ? undefined : new Set(['log']),
      dynamic: this.activeNpcs().map((n) => ({ x: n.pos.x, z: n.pos.z, r: 0.45 })),
    };
    if (this.player) {
      let input = this.busy || this.fishing ? { x: 0, z: 0 } : this.joy!.read();
      if (this.seat) {
        if (Math.hypot(input.x, input.z) > 0.3) this.standUp();
        input = { x: 0, z: 0 };
      }
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
    for (const n of this.activeNpcs()) {
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
    let dist = (portrait ? 15.5 : 14.5) * this.zoom;
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
    if (this.seat) {
      const p = this.player!.pos;
      return [{ icon: '🧍', label: t('standUp'), x: p.x, z: p.z, r: 5, use: () => this.standUp() }];
    }
    for (const b of this.area().benches) {
      list.push({ icon: '🪑', label: t('sit'), x: b.x + Math.sin(b.ry) * 0.9, z: b.z + Math.cos(b.ry) * 0.9, r: 1.4, pri: -0.3, use: () => this.sitDown(b) });
    }
    if (this.inTown()) {
      for (const n of this.townNpcs) {
        const q = !!questTalk(n.def.id);
        list.push({ icon: q ? '❗' : '💬', label: `${t('talk')} · ${this.npcName(n.def)}`, x: n.pos.x, z: n.pos.z, r: 2.6, pri: q ? 2 : 0.8, use: () => this.talkTo(n) });
      }
      const [dx, dz] = TOWN_SPOTS.dojoDoor;
      list.push({ icon: '🥋', label: t('enterDojo'), x: dx, z: dz + 0.6, r: 2.0, pri: 1.5, use: () => this.openDojoSheet() });
      const [bx, bz] = TOWN_SPOTS.bus;
      list.push({ icon: '🚌', label: t('goHome'), x: bx, z: bz, r: 1.8, use: () => void this.travel('home') });
      this.addLooks(list);
      return list;
    }
    list.push({ icon: '🚌', label: t('travel'), x: 3.2, z: 22.6, r: 1.8, use: () => this.openMapSheet() });
    for (const n of this.npcs) {
      const q = !!questTalk(n.def.id);
      list.push({ icon: q ? '❗' : '💬', label: `${t('talk')} · ${this.npcName(n.def)}`, x: n.pos.x, z: n.pos.z, r: 2.6, pri: q ? 2 : 0.8, use: () => this.talkTo(n) });
    }
    const [hx, hz] = SPOTS.homeDoor;
    list.push({ icon: '🏠', label: t('enter'), x: hx, z: hz + 0.4, r: 1.6, use: () => this.enterHome() });
    const [nx, nz] = SPOTS.notice;
    list.push({ icon: '📰', label: t('read'), x: nx, z: nz, r: 2.0, use: () => this.readNotice() });
    const [fx, fz] = SPOTS.fishSpot;
    list.push({ icon: '🎣', label: t('fish'), x: fx, z: fz, r: 1.3, use: () => this.startFishing() });
    for (const p of this.pickups) list.push({ icon: '✋', label: t('pickup'), x: p.obj.position.x, z: p.obj.position.z, r: 1.5, use: () => this.collect(p) });
    SPOTS.flowers.forEach(([x, z], i) => { if (!S().daily.flowers.includes(i)) list.push({ icon: '🌷', label: t('pickup'), x, z, r: 1.6, use: () => this.pickNature('flower', i) }); });
    if (!this.village.log.visible) SPOTS.mushrooms.forEach(([x, z], i) => { if (!S().daily.mushrooms.includes(i)) list.push({ icon: '🍄', label: t('pickup'), x, z, r: 1.6, use: () => this.pickNature('mushroom', i) }); });
    else { const [lx, lz] = SPOTS.forestLog; list.push({ icon: '🪵', label: t('look'), x: lx, z: lz + 1, r: 2.0, use: () => toast('🪵', t('forestBlocked')) }); }
    this.addLooks(list);
    return list;
  }

  /** Things you can stop and look at: each shows its Japanese name, reads it aloud and adds it to your words. */
  private lookSpots(): [x: number, z: number, word: string, icon: string, r?: number][] {
    if (this.inTown()) {
      const water: Record<string, [string, string]> = { harbor: ['n4_umi', '🌊'], snowcap: ['n2_onsen', '♨️'], starlight: ['pool', '🏊'] };
      const [w, wi] = water[this.townDef.id] ?? ['pond', '🪷'];
      const p = TOWN_SPOTS.pond;
      return [
        ...(this.townDef.id === 'harbor'
          ? [[18, -4, w, wi, 2.4], [p.x - 2, p.z + p.rz + 1.2, 'pond', '🪷', 2.2]] as [number, number, string, string, number][]
          : [[p.x - 2, p.z + p.rz + 1.2, w, wi, 2.2]] as [number, number, string, string, number][]),
        [11.6, 4.8, 'n5_yuubinkyoku', '🏤'],
        [12, 14.2, 'n5_ichiba', '🧺'],
        [8.4, -6.2, 'n5_kouen', '🌳'],
        [-3.2, 3.2, 'plaza', '🏘️', 1.4],
      ];
    }
    const lamps: [number, number][] = [[-5.2, -5.2], [5.2, -5.2], [-5.2, 5.2], [5.2, 5.2], [-2, 11.5], [2.6, -12], [-9, -2], [9, -2]];
    const p = SPOTS.pond;
    return [
      [0, 3.4, 'fountain', '⛲', 1.6],
      [0, -3.4, 'fountain', '⛲', 1.6],
      ...lamps.map(([x, z]): [number, number, string, string, number] => [x, z + 0.7, 'streetlight', '🏮', 1.1]),
      ...([[3.6, -6.2], [-3.6, -6.2], [6.6, 0.9], [-6.6, 0.9]] as [number, number][]).map(([x, z]): [number, number, string, string, number] => [x, z + 0.9, 'flower', '🌸', 1.1]),
      [SPOTS.bigTree[0], SPOTS.bigTree[1] + 1.8, 'tree', '🌳', 1.8],
      [p.x, p.z + p.rz + 1.0, 'pond', '🪷', 2.2],
      [0, SPOTS.bridge.maxZ + 0.6, 'bridge', '🌉', 1.8],
      [4.5, SPOTS.stream.z + 2.0, 'river', '🏞️', 1.8],
      [-12, SPOTS.cafeBuilding[1] + 3.6, 'cafe', '🧁', 1.4],
      [12, SPOTS.storeBuilding[1] + 3.6, 'store', '🏪', 1.4],
      [0, -28.5, 'forest', '🌲', 2.4],
    ];
  }

  private addLooks(list: Interactable[]) {
    for (const [x, z, word, icon, r] of this.lookSpots()) {
      if (!hasLex(word)) continue;
      list.push({ icon: '👀', label: t('look'), x, z, r: r ?? 1.6, pri: -0.6, use: () => this.lookAt(word, icon) });
    }
  }

  private lookAt(id: string, icon: string) {
    const isNew = !card('lex', id);
    sayLex(id);
    audio.pickup();
    this.player!.plush.hop(0.8);
    const sentence = renderTarget(`これは ${lex(id).t.ja} です。`, 'ja', renderOpts());
    centerCard(icon, isNew ? t('newWord') : '', [
      h('div.look-word', { html: lexTarget(id) }),
      h('div.look-mean', { html: lexNative(id) }),
      h('div.look-sent', { html: sentence }),
      button('btn.soft.small.look-say', '🔊 ' + t('listen'), () => sayLex(id)),
    ], t('gotIt'), () => { expose('lex', id); this.hud?.refresh(); });
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
    for (const q of activeQuests(this.place)) {
      const id = q.id, st = qs(id);
      const step = questDef(id).steps[st.step];
      if (step.dojo && this.inTown()) return new THREE.Vector3(TOWN_SPOTS.dojoDoor[0], 0, TOWN_SPOTS.dojoDoor[1]);
      if (step.talk) {
        const who = Object.keys(step.talk).find((n) => !st.talked.includes(n));
        const npc = this.activeNpcs().find((n) => n.def.id === who);
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
      const ar = this.area();
      const walk: Walkable = { colliders: ar.colliders, isWater: ar.isWater, bounds: BOUNDS };
      const [nx, nz] = moveCircle(tx, tz, 0, 0, 0.38, walk);
      if (Math.hypot(nx - tx, nz - tz) < 0.3 && !ar.isWater(tx, tz)) { this.talkSlot = new THREE.Vector3(tx, 0, tz); break; }
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
    if (qt && questLocked(questDef(qt.quest))) { openPass(undefined, 'preview'); return; }
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
        await new Promise<void>((res) => openShop(choice === 'shop' ? 'store' : 'cafe',
          (it) => { bought = true; void this.purchase(n, it).then(res); },
          () => { if (!bought) res(); }));
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

  /** Hop onto a bench and settle in. */
  private sitDown(b: { x: number; z: number; ry: number }) {
    const pl = this.player!;
    this.seat = b;
    pl.pos.set(b.x + Math.sin(b.ry) * 0.05, 0.45, b.z + Math.cos(b.ry) * 0.05);
    pl.plush.sitting = true;
    pl.plush.targetYaw = pl.plush.yaw = b.ry;
    pl.plush.speed = 0;
    audio.land();
    setTimeout(() => audio.squeak(), 120);
  }

  private standUp() {
    const b = this.seat, pl = this.player!;
    if (!b) return;
    this.seat = null;
    pl.plush.sitting = false;
    pl.pos.set(b.x + Math.sin(b.ry) * 1.4, 0, b.z + Math.cos(b.ry) * 1.4);
    pl.plush.hop(1.6);
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
      case 'askTime': {
        const d = new Date();
        const hh = d.getHours() % 12 || 12, mm = d.getMinutes();
        const jaTime = `${hh}時${mm >= 30 ? '半' : ''}`;
        toast('🕰️', t('timeNow', { t: jaTime }), `${hh}:${String(mm).padStart(2, '0')}`, 3500);
        break;
      }
      case 'mimiHome': this.updateTownRoutines(true); break;
      case 'ringBell': this.ringBell(); break;
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
    if (st?.state === 'active' && st.step === 1 && this.place === 'home') {
      for (const id of ['key', 'book', 'umbrella'] as const) {
        if (st.found.includes(id)) continue;
        const [x, z] = SPOTS.lost[id];
        const obj = markerSprite(item(id).lex, '#FFFFFF', 0.8);
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
      // The free preview ends here: show what's next while the player is happiest.
      const previewEnd = id === `${FREE_PREVIEW.town}_${FREE_PREVIEW.chapters}` && !this.hasPass();
      centerCard(q.icon, t('questComplete'), [pick(q.title), h('div.unlock-list', null, ...rewards.map((r) => h('div', { html: r })))], t('gotIt'),
        previewEnd ? () => setTimeout(() => openPass(undefined, 'preview'), 600) : undefined);
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
    this.burst.emit(caught.lex, new THREE.Vector3(SPOTS.bobber[0], 0.6, SPOTS.bobber[1]), 1);
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
    this.standUp();
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
          canExpand ? button('btn.soft.small', `📐 ${t('expand')} 🪙300`, () => { if (spend(300)) { home.size = 8; store.touch('home'); this.home.build(home); this.renderDecorate(); } else toast('🪙', t('coinsShort')); }) : null,
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
    // Forgiving selection: a tap near an item's footprint selects it even if it missed the thin parts.
    if (!d.placing && d.selected === null) {
      let best: { uid: number; d: number } | null = null;
      for (const f of home.placed) {
        const dist = Math.hypot(f.x - pt.x, f.z - pt.z);
        if (dist < 0.85 && (!best || dist < best.d)) best = { uid: f.uid, d: dist };
      }
      if (best) { this.selectFurniture(best.uid, e.clientX, e.clientY); return; }
    }
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
    const left = Math.min(window.innerWidth - 110, Math.max(110, sx)), top = Math.max(120, sy);
    const pop = h('div.sel-pop', { style: { left: left + 'px', top: top + 'px' } },
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
