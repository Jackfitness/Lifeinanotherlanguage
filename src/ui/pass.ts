import { REGIONS, regionLevel } from '../content/regions';
import { S, store } from '../core/save';
import { pick, t } from '../core/i18n';
import { audio } from '../audio/audio';
import { button, h, sheet, toast } from './dom';
import { icon } from './icons';

/**
 * The Village Pass upgrade sheet. Payments aren't connected yet, so the call to action
 * collects interest ("Notify me") instead of pretending to charge.
 */
export function openPass(onClose?: () => void) {
  const target = S().profile.target;
  const first = regionLevel(REGIONS[0], target), last = regionLevel(REGIONS[REGIONS.length - 1], target);
  const benefit = (ic: string, title: string, sub: string) =>
    h('div.pass-benefit', null, h('div.pb-icon', { html: icon(ic) }), h('div', null, h('b', null, title), h('span', null, sub)));
  const notice = h('div.pass-note.hidden', null, t('passSoon'));
  const notify = button('btn.soft', t('passNotify'), () => {
    S().flags.passInterest = true;
    store.touch('pass');
    audio.correct();
    toast('💛', t('passNotified'));
    notify.setAttribute('disabled', '');
  });
  notify.classList.add('hidden');
  const cta = button('btn.primary.pass-cta', [h('span', { html: icon('pass') }), t('passCta')], () => {
    notice.classList.remove('hidden');
    notify.classList.remove('hidden');
    cta.classList.add('hidden');
    if (S().flags.passInterest) notify.setAttribute('disabled', '');
  });
  const body = h('div.pass',
    null,
    h('div.pass-hero', null,
      h('div.pass-badge', { html: icon('pass') }),
      h('div.pass-kicker', null, t('pass')),
      h('h3', null, t('passHeadline')),
      h('p', null, t('passSub'))),
    h('div.pass-towns', null,
      h('div.section-title', null, t('passTowns')),
      h('div.pass-town-row', null, ...REGIONS.map((r) =>
        h('div.pass-town', { style: { background: r.color } },
          h('span.lvl-badge', null, regionLevel(r, target)),
          h('div.pt-animals', { html: r.animals.map((a) => icon(a.icon)).join('') }),
          h('span.pt-name', null, pick(r.name)))))),
    h('div.pass-benefits', null,
      benefit('hourglass', t('passB1'), t('passB1d')),
      benefit('map', t('passB2'), t('passB2d', { a: first, b: last })),
      benefit('heart', t('passB3'), t('passB3d')),
      benefit('sprout', t('passB4'), t('passB4d'))),
    h('div.pass-actions', null, cta, notice, notify),
  );
  const s = sheet(t('pass'), body, { onClose });
  s.el.classList.add('pass-sheet');
  const later = button('btn.soft.small', t('passLater'), () => s.close());
  body.append(h('div', { style: { textAlign: 'center', marginTop: '6px' } }, later));
  return s;
}
