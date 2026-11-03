/**
 * Font presets. Each pairs a characterful display face (titles, names, buttons, shouted lines)
 * with a readable body face. Every family covers Latin (incl. Spanish accents) and Japanese.
 */
export type FontId = 'pop' | 'hand' | 'classic';

interface FontPreset { display: string; body: string; displayWeight: number; css: string }

const FALLBACK = "'Hiragino Maru Gothic ProN', 'Arial Rounded MT Bold', system-ui, sans-serif";

export const FONTS: Record<FontId, FontPreset> = {
  pop: {
    display: `'Mochiy Pop One', ${FALLBACK}`,
    body: `'Zen Maru Gothic', ${FALLBACK}`,
    displayWeight: 400,
    css: 'https://fonts.googleapis.com/css2?family=Mochiy+Pop+One&family=Zen+Maru+Gothic:wght@500;700;900&display=swap',
  },
  hand: {
    display: `'Hachi Maru Pop', ${FALLBACK}`,
    body: `'Klee One', ${FALLBACK}`,
    displayWeight: 400,
    css: 'https://fonts.googleapis.com/css2?family=Hachi+Maru+Pop&family=Klee+One:wght@400;600&display=swap',
  },
  classic: {
    display: `'M PLUS Rounded 1c', ${FALLBACK}`,
    body: `'M PLUS Rounded 1c', ${FALLBACK}`,
    displayWeight: 800,
    css: 'https://fonts.googleapis.com/css2?family=M+PLUS+Rounded+1c:wght@400;500;700;800&display=swap',
  },
};

/** Switch fonts: loads the stylesheet once, then swaps the CSS variables. Resolves when the faces are ready. */
export async function applyFont(id: FontId = 'pop') {
  const f = FONTS[id] ?? FONTS.pop;
  if (!document.querySelector(`link[data-font="${id}"]`)) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = f.css;
    link.dataset.font = id;
    document.head.append(link);
  }
  const root = document.documentElement.style;
  root.setProperty('--font', f.body);
  root.setProperty('--font-display', f.display);
  root.setProperty('--display-weight', String(f.displayWeight));
  document.documentElement.dataset.font = id;
  try {
    const family = (s: string) => s.split(',')[0].replace(/'/g, '');
    await Promise.race([
      Promise.all([
        document.fonts.load(`${f.displayWeight} 20px "${family(f.display)}"`, 'Aaあア字ñ'),
        document.fonts.load(`700 20px "${family(f.body)}"`, 'Aaあア字ñ'),
      ]),
      new Promise((r) => setTimeout(r, 3000)),
    ]);
  } catch { /* fonts are optional: fallbacks already apply */ }
}

/** Canvas text (shop signs) needs a concrete family name. */
export const displayFamily = () => getComputedStyle(document.documentElement).getPropertyValue('--font-display').trim() || FALLBACK;
