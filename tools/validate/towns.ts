// Checks every town's content for broken references and kanji without readings.
// Run: npm run validate:towns
import { LEXICON } from '../../src/content/lexicon';
import { PHRASES } from '../../src/content/phrases';
import { ITEMS } from '../../src/content/items';
import { ALL_NPCS } from '../../src/content/characters';
import { CONVOS } from '../../src/content/dialogues';
import { TOWNS, registerTowns } from '../../src/content/towns';

registerTowns();
const errors: string[] = [];
const warn = (m: string) => errors.push(m);
const lexIds = new Set(LEXICON.map((l) => l.id));
const phraseIds = new Set(PHRASES.map((p) => p.id));
const itemIds = new Set(ITEMS.map((i) => i.id));
const npcIds = new Set(ALL_NPCS.map((n) => n.id));

const KANJI = /[一-龯々]/;
function checkJa(where: string, s: string | undefined) {
  if (!s) { warn(`${where}: missing Japanese`); return; }
  const opens = (s.match(/\{/g) ?? []).length, closes = (s.match(/\}/g) ?? []).length, bars = (s.match(/\|/g) ?? []).length;
  if (opens !== closes || opens !== bars) warn(`${where}: unbalanced ruby in "${s}"`);
  const outside = s.replace(/\{[^}]*\}/g, '');
  if (KANJI.test(outside)) warn(`${where}: kanji without reading in "${s}"`);
  for (const m of s.matchAll(/\{([^|}]*)\|([^}]*)\}/g)) {
    if (!KANJI.test(m[1])) warn(`${where}: ruby base has no kanji "${m[0]}"`);
    if (KANJI.test(m[2])) warn(`${where}: ruby reading has kanji "${m[0]}"`);
  }
}

const seenIds = new Map<string, string>();
for (const t of TOWNS) {
  if (!t.words.length) { warn(`${t.id}: no words yet`); continue; }
  for (const w of t.words) {
    checkJa(`${t.id} word ${w.id}`, w.t.ja);
    if (seenIds.has(w.id)) warn(`${t.id}: duplicate word id ${w.id} (also in ${seenIds.get(w.id)})`);
    seenIds.set(w.id, t.id);
    if (!w.t.en || !w.t.es) warn(`${t.id} word ${w.id}: missing en/es`);
  }
  const units = new Set(t.words.map((w) => w.unit));
  for (let u = 1; u <= t.units; u++) {
    if (!units.has(u)) warn(`${t.id}: no words in unit ${u}`);
    if (!t.grammar.some((g) => g.unit === u)) warn(`${t.id}: no grammar in unit ${u}`);
    if (!t.readings.some((r) => r.unit === u)) warn(`${t.id}: no reading in unit ${u}`);
  }
  for (const g of t.grammar) {
    checkJa(`${t.id} grammar ${g.id} example`, g.example);
    for (const [i, it] of g.items.entries()) {
      checkJa(`${t.id} grammar ${g.id}#${i} q`, it.q);
      if (!it.q.includes('＿＿')) warn(`${t.id} grammar ${g.id}#${i}: no blank`);
      checkJa(`${t.id} grammar ${g.id}#${i} a`, it.a);
      for (const w of it.wrong) { checkJa(`${t.id} grammar ${g.id}#${i} wrong`, w); if (w === it.a) warn(`${t.id} grammar ${g.id}#${i}: wrong == answer`); }
    }
  }
  for (const r of t.readings) { checkJa(`${t.id} reading ${r.id}`, r.text); if (r.options.length < 3) warn(`${t.id} reading ${r.id}: few options`); }
  for (const p of t.phrases) {
    checkJa(`${t.id} phrase ${p.id}`, p.t.ja);
    for (const w of p.words ?? []) if (!lexIds.has(w)) warn(`${t.id} phrase ${p.id}: unknown word ${w}`);
  }
  for (const [k, v] of Object.entries(t.signs)) checkJa(`${t.id} sign ${k}`, v);
  for (const n of t.npcs) {
    checkJa(`${t.id} npc ${n.id} name`, n.name.ja);
    for (const f of [...n.favorites, ...n.likes]) if (!itemIds.has(f)) warn(`${t.id} npc ${n.id}: unknown item ${f}`);
    for (const s of n.stories) if (!phraseIds.has(s)) warn(`${t.id} npc ${n.id}: unknown story ${s}`);
  }
  if (!t.npcs.some((n) => n.id === t.sensei)) warn(`${t.id}: sensei ${t.sensei} not in town`);
  for (const [cid, steps] of Object.entries(t.convos)) {
    for (const st of steps) {
      if (st.t === 'say' || st.t === 'build' || st.t === 'meaning') { if (!phraseIds.has(st.p)) warn(`${t.id} ${cid}: unknown phrase ${st.p}`); }
      if (st.t === 'reply') for (const p of [...st.ok, ...(st.bad ?? [])]) if (!phraseIds.has(p)) warn(`${t.id} ${cid}: unknown reply ${p}`);
      if (st.t === 'quiz') { for (const o of st.options) checkJa(`${t.id} ${cid} quiz`, o); }
      if (st.t === 'do' && (st.fn === 'giveItem' || st.fn === 'takeItem') && !itemIds.has(st.arg as string)) warn(`${t.id} ${cid}: unknown item ${st.arg}`);
      if (st.t === 'do' && st.fn === 'meet' && !t.npcs.some((n) => n.id === st.arg)) warn(`${t.id} ${cid}: meet unknown ${st.arg}`);
    }
  }
  const usedConvos = new Set<string>();
  for (const q of t.quests) {
    for (const s of q.steps) {
      for (const [npc, cid] of Object.entries(s.talk ?? {})) {
        usedConvos.add(cid);
        if (!t.npcs.some((n) => n.id === npc)) warn(`${t.id} ${q.id}: talk to unknown npc ${npc}`);
        if (!CONVOS[cid]) warn(`${t.id} ${q.id}: unknown convo ${cid}`);
      }
      if (s.dojo && s.dojo !== 'exam' && !/^lesson_\d$/.test(s.dojo)) warn(`${t.id} ${q.id}: bad dojo ${s.dojo}`);
    }
    for (const it of q.reward.items ?? []) if (!itemIds.has(it)) warn(`${t.id} ${q.id}: unknown reward ${it}`);
  }
  for (let u = 1; u <= t.units; u++) if (!t.quests.some((q) => q.steps.some((s) => s.dojo === 'lesson_' + u))) warn(`${t.id}: lesson_${u} is never required`);
  for (const cid of Object.keys(t.convos)) if (!usedConvos.has(cid)) warn(`${t.id}: convo ${cid} is never used`);
  if (!t.quests.find((q) => q.id === t.finaleQuest)?.steps.some((s) => s.dojo === 'exam')) warn(`${t.id}: finale has no exam`);
  console.log(`${t.id}: ${t.words.length} words, ${t.grammar.length} grammar, ${t.readings.length} readings, ${t.phrases.length} phrases, ${Object.keys(t.convos).length} convos, ${t.quests.length} chapters`);
}
for (const n of ALL_NPCS) if (!npcIds.has(n.id)) warn('npc registry mismatch ' + n.id);
const dupNpc = ALL_NPCS.map((n) => n.id).filter((id, i, a) => a.indexOf(id) !== i);
if (dupNpc.length) warn('duplicate npc ids: ' + dupNpc.join(', '));
if (errors.length) { console.log(errors.join('\n')); console.log(`\n${errors.length} problem(s)`); process.exitCode = 1; } else console.log('All towns OK');
