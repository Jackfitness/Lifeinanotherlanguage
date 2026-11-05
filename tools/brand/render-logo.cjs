// Renders tools/brand/logo.html to transparent PNGs (and the WebP used on the title screen).
// Usage: node tools/brand/render-logo.cjs [outDir]
const { chromium } = require('playwright');
const path = require('path');
const out = process.argv[2] || path.join(__dirname, 'out');
(async () => {
  require('fs').mkdirSync(out, { recursive: true });
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1440, height: 1130 }, deviceScaleFactor: 2 });
  await p.goto('file://' + path.join(__dirname, 'logo.html'));
  await p.evaluate(async () => { await document.fonts.ready; await Promise.all(['900 100px Fraunces', '900 40px "Zen Maru Gothic"', '500 40px "Kiwi Maru"'].map((f) => document.fonts.load(f, 'Lifeあ'))); });
  await p.waitForTimeout(500);
  await p.screenshot({ path: path.join(out, 'logo@2x.png'), omitBackground: true });
  await p.setContent(`<body style="margin:0;background:#FFF4E6"><img src="file://${path.join(out, 'logo@2x.png')}" style="width:1440px"></body>`);
  await p.screenshot({ path: path.join(out, 'logo-on-cream.png') });
  await b.close();
  console.log('wrote', out);
})();
