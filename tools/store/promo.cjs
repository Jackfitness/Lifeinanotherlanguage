// Promotional artwork for App Store featuring: a clean village scene with the logo.
// Needs the dev server. Usage: node tools/store/promo.cjs <outDir>
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');
const out = process.argv[2] || path.join(__dirname, '..', '..', 'store', 'promo');
(async () => {
  const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  const p = await b.newPage({ viewport: { width: 1311, height: 738 }, deviceScaleFactor: 4 });
  await p.goto('http://localhost:5173/?hour=10.5&weather=sunny&season=spring');
  await p.waitForTimeout(6000);
  await p.evaluate(() => { document.getElementById('ui').style.display = 'none'; });
  await p.waitForTimeout(800);
  const scene = path.join(out, 'scene.png');
  await p.screenshot({ path: scene, timeout: 180000 });
  const logo = 'data:image/png;base64,' + fs.readFileSync(path.join(__dirname, '..', '..', 'store', 'logo.png')).toString('base64');
  const bg = 'data:image/png;base64,' + fs.readFileSync(scene).toString('base64');
  const art = await b.newPage({ viewport: { width: 5244, height: 2950 }, deviceScaleFactor: 1 });
  for (const [name, w, h] of [['promo-5244x2950', 5244, 2950], ['promo-3840x1646', 3840, 1646]]) {
    await art.setViewportSize({ width: w, height: h });
    await art.setContent(`<html><body style="margin:0;width:${w}px;height:${h}px;overflow:hidden;background:url(${bg}) center/cover">
      <div style="position:absolute;inset:0;background:radial-gradient(ellipse at 50% 50%, rgba(255,246,234,.55), rgba(255,246,234,0) 60%)"></div>
      <img src="${logo}" style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);height:${Math.round(h * 0.62)}px;filter:drop-shadow(0 ${h * 0.01}px ${h * 0.02}px rgba(70,40,20,.25))">
      </body></html>`);
    await art.waitForTimeout(500);
    await art.screenshot({ path: path.join(out, name + '.png'), timeout: 180000 });
  }
  fs.unlinkSync(scene);
  await b.close();
  console.log('wrote', out);
})();
