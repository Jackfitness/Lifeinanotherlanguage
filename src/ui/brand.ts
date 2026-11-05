import logoUrl from './assets/logo.webp';
import { t, uiLang } from '../core/i18n';
import { h } from './dom';

/** The game logo for title screens. The art is in English; other languages also get a translated tagline. */
export function logoBlock() {
  return h('div.logo', null,
    h('h1.sr-only', null, t('title')),
    h('img.logo-img', { src: logoUrl, alt: 'Life in Another Language: learn Japanese, one cozy day at a time', draggable: 'false' }),
    uiLang() !== 'en' ? h('p.tagline', null, t('subtitle')) : null,
  );
}
