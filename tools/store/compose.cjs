// Turns raw gameplay captures into captioned App Store screenshots (1290×2796, iPhone 6.9").
// Usage: node tools/store/compose.cjs <rawDir> <outDir>
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const raw = process.argv[2] || path.join(__dirname, 'raw');
const out = process.argv[3] || path.join(__dirname, 'screenshots');
fs.mkdirSync(out, { recursive: true });

const SLIDES = [
  { file: '1-village', bg: ['#FCE6D4', '#F6CDB4'], title: 'Learn Japanese by living in a cozy village', sub: 'Make plush friends who only speak Japanese' },
  { file: '2-talk', bg: ['#E4F2DD', '#C6E3B9'], title: 'Real conversations, with furigana', sub: 'Chat, reply and build your own sentences' },
  { file: '3-trace', bg: ['#F4EFE6', '#E4DACA'], title: 'Learn to read and write, free', sub: 'Trace hiragana, katakana and kanji by hand' },
  { file: '4-lesson', bg: ['#FFF3C9', '#F9DF8E'], title: 'Bite-size lessons in every dojo', sub: 'Grammar, vocabulary, listening and reading' },
  { file: '5-map', bg: ['#DDF0F6', '#B8DCEA'], title: 'Six towns, from first kana to N1', sub: 'A story, a dojo and an exam in each' },
  { file: '7-snow', bg: ['#EEF3F6', '#D5E2EA'], title: 'New towns, new neighbors', sub: 'Penguins, foxes, owls, deer and more' },
  { file: '6-festival', bg: ['#EFE4F6', '#D9C6EB'], title: 'Pass the exam, ring the bell', sub: 'Celebrate every level with your neighbors' },
];

(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1290, height: 2796 }, deviceScaleFactor: 1 });
  for (const [i, s] of SLIDES.entries()) {
    const img = 'data:image/png;base64,' + fs.readFileSync(path.join(raw, s.file + '.png')).toString('base64');
    await p.setContent(`<!doctype html><html><head>
      <link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght,SOFT,WONK@9..144,900,100,0&family=Zen+Maru+Gothic:wght@700&display=swap" rel="stylesheet">
      <style>
        html,body{margin:0;width:1290px;height:2796px;overflow:hidden}
        body{background:linear-gradient(170deg,${s.bg[0]},${s.bg[1]});font-family:'Zen Maru Gothic',sans-serif;color:#5A3925;position:relative}
        .cap{position:absolute;left:90px;right:90px;top:150px;text-align:center}
        h1{margin:0;font-family:'Fraunces',serif;font-weight:900;font-variation-settings:'SOFT' 100,'opsz' 144;font-size:104px;line-height:1.08;letter-spacing:-0.5px;text-wrap:balance}
        p{margin:34px 0 0;font-size:50px;line-height:1.3;color:#7A5A44;text-wrap:balance}
        .phone{position:absolute;left:50%;top:640px;transform:translateX(-50%);width:1000px;height:2167px;border-radius:84px;overflow:hidden;
          border:16px solid #FFFCF6;box-shadow:0 40px 90px rgba(70,40,20,.28),0 6px 18px rgba(70,40,20,.18);background:#FFF4E6}
        .phone img{width:100%;height:100%;object-fit:cover;object-position:top;display:block}
        .dots{position:absolute;bottom:-60px}
        .leaf{position:absolute;width:120px;height:56px;border-radius:60px 0;background:#8CC084;opacity:.5}
      </style></head><body>
      <div class="leaf" style="left:-30px;top:520px;transform:rotate(-25deg)"></div>
      <div class="leaf" style="right:-30px;top:470px;transform:rotate(200deg)"></div>
      <div class="cap"><h1>${s.title}</h1><p>${s.sub}</p></div>
      <div class="phone"><img src="${img}"></div>
      </body></html>`, { waitUntil: 'networkidle' });
    await p.evaluate(async () => { await document.fonts.ready; });
    await p.waitForTimeout(300);
    await p.screenshot({ path: path.join(out, `${String(i + 1).padStart(2, '0')}-${s.file.replace(/^\d-/, '')}.png`) });
  }
  await b.close();
  console.log('wrote', out);
})();
