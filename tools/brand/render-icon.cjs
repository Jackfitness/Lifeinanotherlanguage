// Renders the icon concepts in tools/brand/icon.html to 1024×1024 PNGs (opaque, as Apple requires).
// Usage: node tools/brand/render-icon.cjs <outDir> [A|B|C ...]
const { chromium } = require('playwright');
const path = require('path');
const out = process.argv[2] || path.join(__dirname, 'out');
const which = process.argv.slice(3).length ? process.argv.slice(3) : ['A', 'B', 'C'];
(async () => {
  require('fs').mkdirSync(out, { recursive: true });
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1024, height: 1024 } });
  await p.goto('file://' + path.join(__dirname, 'icon.html'));
  await p.evaluate(async () => { await document.fonts.load('500 100px "Kiwi Maru"', 'あいう'); });
  for (const id of which) {
    await p.evaluate((id) => { for (const g of ['A', 'B', 'C']) document.getElementById(g).style.display = g === id ? '' : 'none'; }, id);
    await p.waitForTimeout(300);
    await p.screenshot({ path: path.join(out, `icon-${id}.png`) });
  }
  await b.close();
  console.log('wrote', which.map((w) => `icon-${w}.png`).join(', '));
})();
