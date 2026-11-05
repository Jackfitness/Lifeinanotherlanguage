// Final app icons from concept A in icon.html: iOS (opaque 1024) + Android adaptive foreground/background.
// Usage: node tools/brand/render-app-icons.cjs tools/brand assets && npm run app:assets
const { chromium } = require('playwright');
const path = require('path');
const dir = path.resolve(process.argv[2] || 'tools/brand'), assets = path.resolve(process.argv[3] || 'assets');
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1024, height: 1024 } });
  await p.goto('file://' + path.join(dir, 'icon.html'));
  await p.evaluate(async () => { await document.fonts.load('500 100px "Kiwi Maru"', 'あ'); for (const g of ['B', 'C']) document.getElementById(g).style.display = 'none'; });
  await p.waitForTimeout(300);
  await p.screenshot({ path: path.join(assets, 'icon-only.png') });                     // iOS + legacy Android
  // Android adaptive: background gradient, and the bear shrunk into the 66% safe zone
  await p.evaluate(() => { const a = document.getElementById('A'); const bg = a.querySelector('rect'); bg.style.display = 'none'; [...a.children].forEach((c) => { if (c !== bg) c.setAttribute('transform', 'translate(512 512) scale(0.70) translate(-512 -512) ' + (c.getAttribute('transform') || '')); }); });
  await p.waitForTimeout(300);
  await p.screenshot({ path: path.join(assets, 'icon-foreground.png'), omitBackground: true });
  await p.evaluate(() => { const a = document.getElementById('A'); [...a.children].forEach((c, i) => { c.style.display = i === 0 ? '' : 'none'; }); a.querySelector('rect').style.display = ''; });
  await p.waitForTimeout(200);
  await p.screenshot({ path: path.join(assets, 'icon-background.png') });
  await b.close();
})();
