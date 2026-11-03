import { bus } from './events';
import { S, store, today } from './save';
import { QUESTS, questDef } from '../content/quests';
import { heartsFor, NPCS } from '../content/characters';
import { metWords } from '../learning/engine';

// ------------------------------------------------------------ levels
/** Total XP needed to reach a level: L2 = 60, L3 = 180, L4 = 360, L5 = 600 … */
export const xpAt = (lvl: number) => 30 * (lvl - 1) * lvl;
export const levelOf = (xp: number) => { let l = 1; while (xp >= xpAt(l + 1)) l++; return l; };
export const playerLevel = () => levelOf(S().player.xp);

export function addXP(n: number) {
  if (n <= 0) return;
  const before = playerLevel();
  S().player.xp += n;
  const after = playerLevel();
  bus.emit('xp', n);
  if (after > before) bus.emit('levelup', after);
  store.touch('xp');
}

export function addCoins(n: number) {
  S().player.coins = Math.max(0, S().player.coins + n);
  bus.emit('coins', n);
  store.touch('coins');
}
export function spend(n: number) {
  if (S().player.coins < n) return false;
  addCoins(-n);
  return true;
}

// ------------------------------------------------------------ inventory
export const count = (id: string) => S().inventory[id] ?? 0;
export function giveItem(id: string, n = 1) {
  S().inventory[id] = count(id) + n;
  bus.emit('item', id);
  store.touch('item');
}
export function takeItem(id: string, n = 1) {
  const c = count(id);
  if (c < n) return false;
  if (c === n) delete S().inventory[id]; else S().inventory[id] = c - n;
  store.touch('item');
  return true;
}

// ------------------------------------------------------------ friendship
export function friend(id: string) {
  const f = S().friends;
  if (!f[id]) f[id] = { pts: 0, met: false, lastChat: '', lastGift: '', story: 0 };
  return f[id];
}
export function addFriend(id: string, pts: number) {
  const f = friend(id);
  const before = heartsFor(f.pts);
  f.pts += pts;
  const after = heartsFor(f.pts);
  if (after > before) bus.emit('heartup', { id, hearts: after });
  store.touch('friend');
  checkAchievements();
}

// ------------------------------------------------------------ achievements
export const ACHIEVEMENTS: { id: string; icon: string; test: () => boolean }[] = [
  { id: 'first_steps', icon: '👋', test: () => NPCS.every((n) => friend(n.id).met) },
  { id: 'words_10', icon: '🌱', test: () => metWords().length >= 10 },
  { id: 'words_30', icon: '🌿', test: () => metWords().length >= 30 },
  { id: 'words_60', icon: '🌳', test: () => metWords().length >= 60 },
  { id: 'heart_3', icon: '💛', test: () => NPCS.some((n) => heartsFor(friend(n.id).pts) >= 3) },
  { id: 'first_fish', icon: '🎣', test: () => S().stats.fishCaught > 0 },
  { id: 'fish_5', icon: '🐠', test: () => Object.values(S().collection).filter((c) => c.known).length >= 5 },
  { id: 'decorator', icon: '🛋️', test: () => S().home.placed.length >= 7 },
  { id: 'all_quests', icon: '🏅', test: () => QUESTS.every((q) => S().quests[q.id]?.state === 'done') },
  { id: 'streak_3', icon: '🔥', test: () => S().stats.streak >= 3 },
];
export function checkAchievements() {
  const got = S().achievements;
  for (const a of ACHIEVEMENTS) if (!got[a.id] && a.test()) {
    got[a.id] = Date.now();
    bus.emit('achievement', a.id);
    store.touch('ach');
  }
}

// ------------------------------------------------------------ daily
export function dailyRollover() {
  const d = S(), day = today();
  if (d.daily.day === day) return;
  d.daily = { day, reviewCoins: 0, notice: false, flowers: [], mushrooms: [], playSeconds: 0, warned: false };
  bus.emit('newday');
  const st = d.stats;
  const y = new Date(); y.setDate(y.getDate() - 1);
  const yesterday = `${y.getFullYear()}-${String(y.getMonth() + 1).padStart(2, '0')}-${String(y.getDate()).padStart(2, '0')}`;
  st.streak = st.lastDay === yesterday ? st.streak + 1 : 1;
  st.lastDay = day; st.days++;
  store.touch('daily');
  checkAchievements();
}

/** Coins for a correct due review, capped per day so practice can't be farmed. */
export function reviewReward(wasDue: boolean, correct: boolean) {
  if (!correct) return 0;
  addXP(wasDue ? 4 : 2);
  if (!wasDue || S().daily.reviewCoins >= 60) return 0;
  S().daily.reviewCoins += 4;
  addCoins(4);
  return 4;
}

// ------------------------------------------------------------ quests
export const qs = (id: string) => S().quests[id];

/** The conversation a quest wants to run with this villager, if any. */
export function questTalk(npcId: string): { quest: string; convo: string } | null {
  for (const q of QUESTS) {
    const st = qs(q.id);
    if (!st || st.state !== 'active') continue;
    const step = q.steps[st.step];
    const convo = step?.talk?.[npcId];
    if (convo && !st.talked.includes(npcId)) return { quest: q.id, convo };
  }
  return null;
}

export function finishTalk(questId: string, npcId: string) {
  const st = qs(questId), q = questDef(questId);
  st.talked.push(npcId);
  const step = q.steps[st.step];
  if (Object.keys(step.talk ?? {}).every((n) => st.talked.includes(n))) advance(questId);
  store.touch('quest');
}

export function foundItem(questId: string, itemId: string) {
  const st = qs(questId), q = questDef(questId);
  if (st.found.includes(itemId)) return;
  st.found.push(itemId);
  const step = q.steps[st.step];
  if (step.collect && step.collect.every((i) => st.found.includes(i))) advance(questId);
  store.touch('quest');
}

function advance(questId: string) {
  const st = qs(questId), q = questDef(questId);
  st.step++; st.talked = [];
  if (st.step >= q.steps.length) complete(questId);
  else if (dojoAlreadyPassed(q.town, q.steps[st.step].dojo)) advance(questId); // lesson done ahead of the story
  else bus.emit('quest:step', questId);
}

function dojoAlreadyPassed(town: string | undefined, id: string | undefined) {
  if (!town || !id) return false;
  const ts = (S() as unknown as { towns?: Record<string, { lessons: Record<string, number>; examPassed: boolean }> }).towns?.[town];
  if (!ts) return false;
  return id === 'exam' ? ts.examPassed : (ts.lessons[id] ?? 0) >= 60;
}

function complete(questId: string) {
  const q = questDef(questId), st = qs(questId);
  st.state = 'done';
  addCoins(q.reward.coins);
  for (const it of q.reward.items ?? []) giveItem(it);
  if (q.reward.friend) addFriend(q.reward.friend[0], q.reward.friend[1]);
  bus.emit('quest:done', questId);
  addXP(q.reward.xp);
  for (const nq of QUESTS) {
    if (S().quests[nq.id]) continue;
    if (nq.town && !S().flags['visited_' + nq.town]) continue; // town stories start when you arrive
    if ((nq.after ?? []).every((a) => qs(a)?.state === 'done')) {
      S().quests[nq.id] = { state: 'active', step: 0, talked: [], found: [] };
      bus.emit('quest:new', nq.id);
    }
  }
  store.touch('quest');
  checkAchievements();
}

export const activeQuests = (town?: string) => QUESTS.filter((q) => qs(q.id)?.state === 'active' && (town === undefined || (q.town ?? 'home') === town));

/** A dojo lesson or exam was passed: advance any story step waiting on it. */
export function finishDojo(id: string) {
  for (const q of QUESTS) {
    const st = qs(q.id);
    if (!st || st.state !== 'active') continue;
    if (q.steps[st.step]?.dojo === id) advance(q.id);
  }
  store.touch('dojo');
}

/** First arrival in a town starts its story. */
export function startTown(town: string) {
  if (S().flags['visited_' + town]) return false;
  S().flags['visited_' + town] = true;
  for (const q of QUESTS) {
    if (q.town !== town || S().quests[q.id] || (q.after ?? []).length) continue;
    S().quests[q.id] = { state: 'active', step: 0, talked: [], found: [] };
    bus.emit('quest:new', q.id);
  }
  store.touch('town');
  return true;
}
