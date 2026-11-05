// Captures raw gameplay scenes for the App Store screenshots (iPhone 6.9": 1290×2796).
// Needs the dev server: npm run dev -- --port 5173. Usage: node tools/store/capture.cjs <outDir>
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');
const out = process.argv[2] || path.join(__dirname, 'raw');
const BASE = process.env.BASE || 'http://localhost:5173/';
fs.mkdirSync(out, { recursive: true });

const PROFILE = { name: 'Momo', species: 'cat', color: '#F2C49B', native: 'en', target: 'ja', level: 'intermediate' };

async function page(b, query) {
  const p = await b.newPage({ viewport: { width: 430, height: 932 }, deviceScaleFactor: 3, hasTouch: true, isMobile: true });
  await p.addInitScript((profile) => {
    if (!localStorage.getItem('cozy-language-village/save')) localStorage.setItem('cozy-language-village/save', JSON.stringify({ profile }));
  }, PROFILE);
  await p.goto(BASE + query);
  await p.waitForTimeout(2500);
  await p.mouse.click(215, 640);
  await p.waitForTimeout(3500);
  await p.evaluate(() => { const d = window.__store.data; d.settings.jaScript = 'furigana'; d.settings.romaji = false; d.player.coins = 1240; window.__store.touch('shots'); });
  await skipDialogs(p);
  return p;
}
async function skipDialogs(p) {
  for (let i = 0; i < 8; i++) {
    if (await p.$('.center-card .btn')) { await p.click('.center-card .btn', { force: true }); await p.waitForTimeout(300); continue; }
    if (!(await p.$('.dlg'))) break;
    await p.click('.bubble', { force: true }).catch(() => {}); await p.waitForTimeout(400);
  }
}
const near = async (p, list, id, dz = 1.6, dx = 0.6) => {
  await p.evaluate(([list, id, dx, dz]) => {
    const g = window.__game; const n = g[list].find((m) => m.def.id === id);
    g.player.pos.set(n.pos.x + dx, 0, n.pos.z + dz); g.player.plush.targetYaw = Math.PI; g.snapCamera();
  }, [list, id, dx, dz]);
  await p.waitForTimeout(900);
  await p.evaluate(() => window.__game.snapCamera());
  await p.waitForTimeout(300);
};
async function traceCurrent(p) {
  await p.evaluate(async () => { try { await document.fonts.load('600 40px "Klee One"', window.__trace?.glyph || 'あ'); } catch {} });
  for (let i = 0, last = ''; i < 20; i++) { const r = await p.evaluate(() => JSON.stringify(document.querySelector('.trace-canvas')?.getBoundingClientRect())); if (r === last) break; last = r; await p.waitForTimeout(300); }
  const segs = await p.evaluate(() => {
    const pad = window.__trace; const r = pad.canvas.getBoundingClientRect();
    const N = 240, c = document.createElement('canvas'); c.width = c.height = N; const x = c.getContext('2d');
    x.textAlign = 'center'; x.textBaseline = 'middle'; x.font = `600 ${N * 0.78}px ${pad.face}`; x.fillText(pad.glyph, N / 2, N * 0.53);
    const d = x.getImageData(0, 0, N, N).data; const on = (i, j) => d[(j * N + i) * 4 + 3] > 120; const segs = [];
    const toC = (i, j) => [r.left + (i / N) * r.width, r.top + (j / N) * r.height];
    for (let j = 4; j < N; j += 7) { let s = -1; for (let i = 0; i <= N; i++) { const v = i < N && on(i, j); if (v && s < 0) s = i; if (!v && s >= 0) { segs.push([toC(s, j), toC(i - 1, j)]); s = -1; } } }
    return segs;
  });
  for (const [[x0, y0], [x1, y1]] of segs) { await p.mouse.move(x0, y0); await p.mouse.down(); await p.mouse.move(x1, y1, { steps: 2 }); await p.mouse.up(); }
}

const ONLY = (process.env.SCENES || '').split(',').filter(Boolean);
const want = (n) => !ONLY.length || ONLY.includes(String(n));
(async () => {
  const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  const shot = (p, name) => p.screenshot({ path: path.join(out, name + '.png') });

  // 1 · The starter village with plush neighbors
  if (want(1)) {
  let p = await page(b, '?hour=10.5&weather=sunny&season=spring');
  await near(p, 'npcs', 'biscuit', 2.6, 1.2);
  await shot(p, '1-village'); await p.close(); }

  // 2 · A conversation with furigana (Clover Meadow, first meeting with the mayor)
  if (want(2)) {
  p = await page(b, '?hour=11&weather=sunny&pass=1');
  await p.evaluate(() => window.__game.travel('clover', true)); await p.waitForTimeout(2500); await skipDialogs(p);
  await near(p, 'townNpcs', 'ponpon', 1.5, 0);
  await p.click('.action-btn', { force: true });
  for (let i = 0; i < 6; i++) { await p.waitForTimeout(1200); const t = await p.evaluate(() => document.querySelector('.bubble .say')?.textContent || ''); if (t.includes('ポンポン')) break; await p.click('.bubble', { force: true }).catch(() => {}); }
  await p.waitForTimeout(2500);
  await shot(p, '2-talk'); await p.close(); }

  // 3 · Tracing in Inkbrush Village
  if (want(3)) {
  p = await page(b, '?hour=11&weather=sunny');
  await p.evaluate(() => window.__game.travel('ink', true)); await p.waitForTimeout(2500); await skipDialogs(p);
  await near(p, 'townNpcs', 'hari', 1.5, 0);
  await p.evaluate(() => { void window.__game.runDojo('writing'); });
  for (let i = 0; i < 20 && !(await p.$('.trace-pad')); i++) await p.waitForTimeout(300);
  await traceCurrent(p); await p.waitForTimeout(500);
  await shot(p, '3-trace'); await p.close(); }

  // 4 · A dojo lesson question
  if (want(4)) {
  p = await page(b, '?hour=11&weather=sunny&pass=1');
  await p.evaluate(() => window.__game.travel('clover', true)); await p.waitForTimeout(2500); await skipDialogs(p);
  await near(p, 'townNpcs', 'kero', 1.5, 0);
  await p.evaluate(() => { void window.__game.runDojo('lesson', 2); });
  for (let i = 0; i < 40; i++) {
    await p.waitForTimeout(500);
    if (await p.$('.note-card .btn')) { await p.click('.note-card .btn', { force: true }); continue; }
    const sub = await p.evaluate(() => document.querySelector('.dojo-sub')?.textContent || '');
    const opts = await p.$$('.opt:not([disabled])');
    if (opts.length && /Fill in the blank/.test(sub)) break;
    if (opts.length) { const ai = await p.evaluate(() => window.__dojoAnswer ?? 0); await opts[ai].click({ force: true }); await p.waitForTimeout(1200); }
  }
  await p.waitForTimeout(600);
  await shot(p, '4-lesson'); await p.close(); }

  // 5 · The world map
  if (want(5)) {
  p = await page(b, '?hour=10&weather=sunny&pass=1');
  await p.evaluate(() => window.__game.openMapSheet()); await p.waitForTimeout(1200);
  const pins = await p.$$('.wmap-pin'); if (pins[3]) await pins[3].evaluate((e) => e.click());
  await p.waitForTimeout(800);
  await shot(p, '5-map'); await p.close(); }

  // 6 · Starlight City at dusk: the bell rings for opening night
  if (want(6)) {
  p = await page(b, '?hour=18.6&weather=sunny&pass=1');
  await p.evaluate(() => window.__game.travel('starlight', true)); await p.waitForTimeout(2500); await skipDialogs(p);
  await near(p, 'townNpcs', 'shiba', 1.5, 1.1);
  await p.evaluate(() => window.__game.ringBell());
  await p.waitForTimeout(650);
  await shot(p, '6-festival'); await p.close(); }

  // 7 · Snowcap Peaks: owls, deer and a hot spring
  if (want(7)) {
  p = await page(b, '?hour=15&weather=snowy&pass=1');
  await p.evaluate(() => window.__game.travel('snowcap', true)); await p.waitForTimeout(2500); await skipDialogs(p);
  await near(p, 'townNpcs', 'yuki', 2.4, 1.0);
  await shot(p, '7-snow'); await p.close(); }

  await b.close();
  console.log('captured to', out);
})();
