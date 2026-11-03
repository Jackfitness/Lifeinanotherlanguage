import { t } from '../core/i18n';
import { audio } from '../audio/audio';
import { button, h, ui } from './dom';
import { icon } from './icons';

/** Gentle end-of-day screen shown when the daily free play time is used up. */
export function showBedtime(opts: { minutes: number; words: number; msToNextDay: () => number; onReview: () => void; onPass: () => void }) {
  const fmt = (ms: number) => {
    const m = Math.max(1, Math.ceil(ms / 60000));
    const hh = Math.floor(m / 60), mm = m % 60;
    return hh ? `${hh}h ${String(mm).padStart(2, '0')}m` : `${mm}m`;
  };
  const countdown = h('div.bed-count');
  const tick = () => { countdown.innerHTML = icon('clock2') + ' ' + t('bedCountdown', { t: fmt(opts.msToNextDay()) }); };
  tick();
  const timer = window.setInterval(tick, 30_000);
  const stars = h('div.bed-stars', { 'aria-hidden': 'true' });
  for (let i = 0; i < 40; i++) {
    stars.append(h('i', { style: { left: Math.random() * 100 + '%', top: Math.random() * 60 + '%', animationDelay: Math.random() * 3 + 's', transform: `scale(${0.5 + Math.random()})` } }));
  }
  const root = h('div.bedtime', { role: 'dialog', 'aria-label': t('bedTitle') },
    stars,
    h('div.bed-card', null,
      h('div.bed-moon', { html: icon('moon') + `<span class="bed-z">${icon('zzz')}</span>` }),
      h('h2', null, t('bedTitle')),
      h('p', null, (opts.minutes === 1 ? t('bedBody1') : t('bedBody', { m: opts.minutes }))),
      h('div.bed-recap', null, h('span', { html: icon('book') }), t('bedRecap', { n: opts.words })),
      countdown,
      button('btn.primary.bed-pass', [h('span', { html: icon('pass') }), t('bedPass')], () => opts.onPass()),
      button('btn.soft', [h('span', { html: icon('book') }), t('bedReview')], () => opts.onReview()),
    ),
  );
  ui().append(root);
  audio.close();
  return {
    el: root,
    close: () => { clearInterval(timer); root.remove(); },
  };
}
