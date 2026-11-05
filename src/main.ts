import { billing } from './core/billing';
import './styles.css';
import { store } from './core/save';
import { setUiLang, t } from './core/i18n';
import { audio } from './audio/audio';
import { speech } from './learning/tts';
import { Game } from './game';
import { runOnboarding } from './ui/onboarding';
import { fadeThrough, h, ui } from './ui/dom';
import { applyFont } from './ui/fonts';
import { logoBlock } from './ui/brand';
import { installLexiconIcons } from './ui/icons';
import { voicePack } from './audio/voicepack';
import { LEXICON } from './content/lexicon';
import { registerTowns } from './content/towns';

registerTowns();
installLexiconIcons(LEXICON);

async function boot() {
  const canvas = document.getElementById('scene') as HTMLCanvasElement;
  const game = new Game(canvas);
  Object.assign(window, { __game: game, __audio: audio, __voice: voicePack, __store: store }); // debug handles for automated tests
  const hasSave = await store.load();
  void applyFont(hasSave ? store.data.settings.font : 'cozy');

  if (hasSave) {
    setUiLang(store.data.profile.native);
    const title = h('div.onb.title-screen', null,
      logoBlock(),
      h('div.tap-start', null, t('tapStart')));
    ui().append(title);
    await new Promise<void>((res) => title.addEventListener('click', () => res(), { once: true }));
    audio.unlock(); audio.open(); speech.prime();
    await fadeThrough(() => { title.remove(); game.startPlay(false); });
    return;
  }

  const r = await runOnboarding();
  store.create({ name: r.name, species: r.species, color: r.color, native: r.native, target: r.target, level: r.level });
  store.data.settings.jaScript = r.jaScript;
  store.data.settings.romaji = r.romaji;
  store.touch('onboard');
  await fadeThrough(() => game.startPlay(true));
}

// The game is played sideways: phones held upright see a gentle "turn your phone" card.
{
  const hint = document.createElement('div');
  hint.className = 'rotate-hint';
  hint.innerHTML = `<div class="rh-phone"></div><div>${t('rotateHint')}</div>`;
  document.body.append(hint);
}

const persist = () => { (window as unknown as { __game?: Game }).__game?.persistPosition(); store.flush(); };
window.addEventListener('pagehide', persist);
document.addEventListener('visibilitychange', () => { if (document.hidden) persist(); else void billing.refresh(); });
void billing.refresh(); // pick up purchases, renewals or refunds made outside the game
void boot();

// ---- Native app (iOS / Android) niceties
void (async () => {
  const { Capacitor } = await import('@capacitor/core');
  if (!Capacitor.isNativePlatform()) return;
  const { App } = await import('@capacitor/app');
  // Android back button: close whatever panel is open, otherwise send the app to the background.
  void App.addListener('backButton', () => {
    const closer = document.querySelector<HTMLElement>('.sheet .icon-btn, .dlg .close, .center-card .btn, .confirm-card .btn.soft');
    if (closer) closer.click(); else void App.minimizeApp();
  });
  // Save when the app is backgrounded; re-check purchases when it returns.
  void App.addListener('appStateChange', ({ isActive }) => { if (!isActive) persist(); else void billing.refresh(); });
})();
