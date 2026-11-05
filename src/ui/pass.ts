import { REGIONS, regionLevel } from '../content/regions';
import { S } from '../core/save';
import { pick, t } from '../core/i18n';
import { billing, hasPass, type Plan } from '../core/billing';
import { audio } from '../audio/audio';
import { button, centerCard, confetti, h, sheet, toast } from './dom';
import { icon } from './icons';

/** Store-required links on any screen that sells a subscription (Apple's standard EULA and our privacy policy). */
export const TERMS_URL = 'https://www.apple.com/legal/internet-services/itunes/dev/stdeula/';
export const PRIVACY_URL = 'https://jackfitness.github.io/Lifeinanotherlanguage/privacy.html';
const legal = (href: string, label: string) => h('a.linkish', { href, target: '_blank', rel: 'noopener' }, label);

/** Why the sheet opened: changes the headline so the offer fits the moment. */
export type PassReason = 'default' | 'preview' | 'bedtime' | 'town';

/**
 * The Village Pass sheet: two plans (one-time lifetime, monthly with a free trial), restore
 * purchases and the store-required renewal terms. Purchases go through `core/billing.ts`.
 */
export function openPass(onClose?: () => void, reason: PassReason = 'default') {
  const target = S().profile.target;
  const first = regionLevel(REGIONS[1], target), last = regionLevel(REGIONS[REGIONS.length - 1], target);
  const benefit = (ic: string, title: string, sub: string) =>
    h('div.pass-benefit', null, h('div.pb-icon', { html: icon(ic) }), h('div', null, h('b', null, title), h('span', null, sub)));

  if (hasPass()) {
    const s = sheet(t('pass'), h('div.pass', null, h('div.pass-hero', null, h('div.pass-badge', { html: icon('pass') }), h('h3', null, t('passOwned')), h('p', null, t('passOwnedSub')))), { onClose });
    s.el.classList.add('pass-sheet');
    return s;
  }

  const headline = { default: t('passHeadline'), preview: t('passPreviewHead'), bedtime: t('passBedHead'), town: t('passTownHead') }[reason];
  const sub = { default: t('passSub'), preview: t('passPreviewSub'), bedtime: t('passSub'), town: t('passSub') }[reason];

  let plans: Plan[] = [];
  let chosen = 0;
  const planBox = h('div.plans', null, h('div.muted', { style: { textAlign: 'center', padding: '14px' } }, '…'));
  const cta = button('btn.primary.pass-cta', [h('span', { html: icon('pass') }), t('passCta')], () => void buy());
  const fine = h('p.pass-fine');
  const drawPlans = () => {
    planBox.replaceChildren(...plans.map((p, i) => {
      const lifetime = p.id === 'village_pass_lifetime';
      return button('plan' + (i === chosen ? '.on' : '') + (lifetime ? '.best' : ''), [
        lifetime ? h('span.plan-tag', null, t('planBest')) : null,
        h('div.plan-main', null,
          h('b', null, lifetime ? t('planLifetime') : t('planMonthly')),
          h('span', null, lifetime ? t('planLifetimeSub') : p.trialDays ? t('planTrial', { n: p.trialDays }) : t('planMonthlySub'))),
        h('div.plan-price', null, h('b', null, p.price), h('small', null, lifetime ? t('planOnce') : t('planPerMonth'))),
      ], () => { chosen = i; audio.select(); drawPlans(); });
    }));
    const p = plans[chosen];
    if (!p) return;
    const lifetime = p.id === 'village_pass_lifetime';
    cta.querySelector('span:last-child')!.textContent = lifetime ? t('ctaLifetime', { p: p.price }) : p.trialDays ? t('ctaTrial', { n: p.trialDays }) : t('ctaMonthly', { p: p.price });
    fine.textContent = lifetime ? t('fineLifetime') : t('fineMonthly', { p: p.price, n: p.trialDays ?? 0 });
  };
  // the CTA label lives in a second span so we can rewrite it per plan
  cta.append(h('span', null, t('passCta')));
  cta.childNodes.forEach((n) => { if (n.nodeType === 3) n.remove(); });

  const buy = async () => {
    const p = plans[chosen];
    if (!p) return;
    cta.setAttribute('disabled', '');
    const r = await billing.purchase(p);
    cta.removeAttribute('disabled');
    if (r === 'ok') {
      s.close();
      audio.levelUp(); confetti(120);
      centerCard('🎟️', t('passWelcome'), [t('passWelcomeSub')], t('gotIt'));
    } else if (r === 'error') toast('⚠️', t('passError'));
  };
  const restore = button('linkish', t('passRestore'), async () => {
    const ok = await billing.restore();
    if (ok) { s.close(); toast('🎟️', t('passRestored')); } else toast('🔎', t('passNothing'));
  });

  const testNote = h('div.pass-test.hidden', null, t('passTestMode'));
  void billing.ready().then((real) => { if (!real) testNote.classList.remove('hidden'); });
  const right = h('div.pass-right', null, planBox, h('div.pass-actions', null, cta), fine, h('div.pass-links', null, restore, legal(TERMS_URL, t('passTerms')), legal(PRIVACY_URL, t('passPrivacy'))));
  const body = h('div.pass', null,
    h('div.pass-left', null,
    testNote,
    h('div.pass-hero', null,
      h('div.pass-badge', { html: icon('pass') }),
      h('div.pass-kicker', null, t('pass')),
      h('h3', null, headline),
      h('p', null, sub)),
    h('div.pass-towns', null,
      h('div.section-title', null, t('passTowns')),
      h('div.pass-town-row', null, ...REGIONS.filter((r) => r.id !== 'ink').map((r) =>
        h('div.pass-town', { style: { background: r.color } },
          h('span.lvl-badge', null, regionLevel(r, target)),
          h('div.pt-animals', { html: r.animals.map((a) => icon(a.icon)).join('') }),
          h('span.pt-name', null, pick(r.name)))))),
    h('div.pass-benefits', null,
      benefit('hourglass', t('passB1'), t('passB1d')),
      benefit('map', t('passB2'), t('passB2d', { a: first, b: last })),
      benefit('heart', t('passB3'), t('passB3d')),
      benefit('sprout', t('passB4'), t('passB4d')))),
    right,
  );
  const s = sheet(t('pass'), body, { onClose });
  s.el.classList.add('pass-sheet');
  const later = button('btn.soft.small', t('passLater'), () => s.close());
  right.append(h('div', { style: { textAlign: 'center', marginTop: '6px' } }, later));
  void billing.plans().then((p) => {
    // lifetime first: it's the plan we feature
    plans = p.sort((a, b) => (a.id === 'village_pass_lifetime' ? -1 : 1) - (b.id === 'village_pass_lifetime' ? -1 : 1));
    if (!plans.length) { planBox.replaceChildren(h('p.muted', null, t('passError'))); cta.setAttribute('disabled', ''); return; }
    drawPlans();
  }).catch(() => { planBox.replaceChildren(h('p.muted', null, t('passError'))); cta.setAttribute('disabled', ''); });
  return s;
}
