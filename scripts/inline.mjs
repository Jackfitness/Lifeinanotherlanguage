// Inlines the Vite build into self-contained HTML:
//  - dist/cozy-language-village.html : a full standalone page (open directly or host anywhere)
//  - dist/artifact.html              : body-only variant for hosts that supply their own document skeleton
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const dist = new URL('../dist/', import.meta.url).pathname;
const assets = join(dist, 'assets');
let js = '', css = '';
for (const f of readdirSync(assets)) {
  const body = readFileSync(join(assets, f), 'utf8');
  if (f.endsWith('.js')) js += body;
  else if (f.endsWith('.css')) css += body;
}
const script = `<script type="module">${js.replace(/<\/script/g, '<\\/script')}</script>`;
const fonts = '<link rel="preconnect" href="https://fonts.googleapis.com">\n<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n<link href="https://fonts.googleapis.com/css2?family=M+PLUS+Rounded+1c:wght@400;500;700;800&display=swap" rel="stylesheet">';

let html = readFileSync(join(dist, 'index.html'), 'utf8');
html = html.replace(/<script type="module" crossorigin src="[^"]+"><\/script>/, () => '')
  .replace(/<link rel="stylesheet" crossorigin href="[^"]+">/, () => `<style>${css}</style>`)
  .replace('</body>', () => `${script}\n</body>`);
writeFileSync(join(dist, 'cozy-language-village.html'), html);

const artifact = `<title>Cozy Language Village</title>\n<meta name="theme-color" content="#FFF4E6">\n${fonts}\n<style>${css}</style>\n<canvas id="scene"></canvas>\n<div id="ui"></div>\n${script}\n`;
writeFileSync(join(dist, 'artifact.html'), artifact);
console.log('wrote dist/cozy-language-village.html', (html.length / 1024).toFixed(0) + ' KB', '+ dist/artifact.html');
