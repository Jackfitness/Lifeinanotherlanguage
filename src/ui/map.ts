import { EDGES, NODES, SPOTS } from '../content/places';
import { HOME_REGION, REGIONS, regionLevel, type Region } from '../content/regions';
import { S } from '../core/save';
import { pick, t } from '../core/i18n';
import { lexTarget, sayLex } from '../learning/engine';
import { audio } from '../audio/audio';
import { button, h, seg, sheet } from './dom';
import { icon } from './icons';
import { openPass } from './pass';

interface MapHost {
  player: () => { x: number; z: number };
  villagers: () => { icon: string; x: number; z: number }[];
  place: string;
  canTravel: (id: string) => boolean;
  travel: (id: string) => void;
}

// Village bounds → SVG coordinates
const VX = (x: number) => ((x + 32) / 64) * 340 + 10;
const VZ = (z: number) => ((z + 36) / 64) * 340 + 10;

const PLACES: { lex: string; at: [number, number]; ic: string }[] = [
  { lex: 'cafe', at: [-12, -8.6], ic: 'cafe' },
  { lex: 'store', at: [12, -8.6], ic: 'store' },
  { lex: 'house', at: [0, 14.6], ic: 'house' },
  { lex: 'plaza', at: [0, 0], ic: 'fountain' },
  { lex: 'pond', at: [-14, 10], ic: 'pond' },
  { lex: 'garden', at: [10.5, 10.5], ic: 'garden' },
  { lex: 'bridge', at: [0, -20], ic: 'bridge' },
  { lex: 'forest', at: [0, -29], ic: 'forest' },
];

function villageMap(host: MapHost) {
  const p = SPOTS.pond, st = SPOTS.stream;
  const paths = EDGES.map(([a, b]) => `<path d="M${VX(NODES[a][0])} ${VZ(NODES[a][1])}L${VX(NODES[b][0])} ${VZ(NODES[b][1])}"/>`).join('');
  const me = host.player();
  const svg = `
  <svg viewBox="0 0 360 360" class="vmap" role="img" aria-label="${t('mapVillage')}">
    <rect x="6" y="6" width="348" height="348" rx="36" fill="#BFE0A5" stroke="#5B4636" stroke-width="3"/>
    <path d="M6 ${VZ(-35)}h348v${VZ(st.z - st.half - 1) - VZ(-35)}H6z" fill="#8FC27B" opacity=".7"/>
    <rect x="6" y="${VZ(st.z - st.half)}" width="348" height="${VZ(st.z + st.half) - VZ(st.z - st.half)}" fill="#8CCFD6"/>
    <ellipse cx="${VX(p.x)}" cy="${VZ(p.z)}" rx="${(p.rx / 64) * 340}" ry="${(p.rz / 64) * 340}" fill="#8CCFD6" stroke="#5B4636" stroke-width="2"/>
    <g stroke="#F3E2C2" stroke-width="9" stroke-linecap="round" fill="none">${paths}</g>
    <circle cx="${VX(0)}" cy="${VZ(0)}" r="${(7.4 / 64) * 340}" fill="#F3E2C2"/>
  </svg>`;
  const wrap = h('div.vmap-wrap', { html: svg });
  for (const pl of PLACES) {
    const b = button('vmap-pin', [h('span', { html: icon(pl.ic) }), h('span.vp-label', { lang: S().profile.target, html: lexTarget(pl.lex) })], () => { sayLex(pl.lex); }, {
      style: { left: `${(VX(pl.at[0]) / 360) * 100}%`, top: `${(VZ(pl.at[1]) / 360) * 100}%` },
    });
    wrap.append(b);
  }
  for (const v of host.villagers()) {
    wrap.append(h('div.vmap-npc', { style: { left: `${(VX(v.x) / 360) * 100}%`, top: `${(VZ(v.z) / 360) * 100}%` }, html: icon(v.icon) }));
  }
  wrap.append(h('div.vmap-me', { style: { left: `${(VX(me.x) / 360) * 100}%`, top: `${(VZ(me.z) / 360) * 100}%` } }, h('span.vm-dot'), h('span.vm-label', null, t('youAreHere'))));
  return h('div', null, wrap, h('p.muted.map-hint', null, '🔊 ' + t('mapTapPlace')));
}

function worldMap(host: MapHost, close: () => void) {
  const target = S().profile.target;
  const detail = h('div.region-detail');
  const showRegion = (r: Region | null) => {
    if (!r) {
      detail.replaceChildren(
        h('div.rd-head', null, h('span.lvl-badge.home', null, t('starter')), h('h3', null, pick(HOME_REGION.name))),
        h('p', null, t('homeTown')),
        h('div.rd-animals', { html: ['bear', 'bunny', 'capybara'].map((a) => icon(a)).join('') }),
        ...(host.place !== 'home' ? [button('btn.primary.rd-cta', [h('span', { html: icon('house') }), t('goHome')], () => { close(); host.travel('home'); })] : []));
      return;
    }
    detail.replaceChildren(
      h('div.rd-head', null, h('span.lvl-badge', null, regionLevel(r, target)), h('h3', null, pick(r.name)), h('span.rd-lock', { html: icon('lock') })),
      h('p', null, pick(r.blurb)),
      h('div.section-title', { style: { margin: '10px 0 6px' } }, t('whoLives')),
      h('div.rd-animals', null, ...r.animals.map((a) => h('span.rd-animal', null, h('span', { html: icon(a.icon) }), pick(a.name)))),
      host.canTravel(r.id)
        ? (host.place === r.id ? h('p.muted', null, '📍 ' + t('youAreHere'))
          : button('btn.primary.rd-cta', [h('span', { html: icon('map') }), t('travelTo', { town: pick(r.name) })], () => { close(); host.travel(r.id); }))
        : S().flags.villagePass || new URLSearchParams(location.search).get('pass') === '1'
          ? h('p.muted', null, t('townSoon'))
          : button('btn.primary.rd-cta', [h('span', { html: icon('pass') }), t('unlockWithPass')], () => openPass()),
    );
  };
  // Sea, islands and dotted ferry routes
  const [hx, hy] = HOME_REGION.at;
  const routes = REGIONS.map((r) => `<path d="M${hx * 3.6} ${hy * 3.6}Q${(hx + r.at[0]) * 1.8} ${(hy + r.at[1]) * 1.8 - 30} ${r.at[0] * 3.6} ${r.at[1] * 3.6}"/>`).join('');
  const isle = (x: number, y: number, fill: string, rr: number) =>
    `<path d="M${x - rr} ${y}c0-${rr * 0.7} ${rr * 0.4}-${rr} ${rr}-${rr}s${rr} ${rr * 0.3} ${rr} ${rr}c0 ${rr * 0.7}-${rr * 0.5} ${rr * 0.9}-${rr} ${rr * 0.9}s-${rr}-${rr * 0.2}-${rr}-${rr * 0.9}z" fill="${fill}" stroke="#5B4636" stroke-width="3"/>`;
  const svg = `
  <svg viewBox="0 0 360 360" class="wmap" role="img" aria-label="${t('mapWorld')}">
    <rect width="360" height="360" rx="36" fill="#9FD3E6"/>
    <g fill="#fff" opacity=".35">${[[40, 30], [300, 300], [120, 330], [320, 110]].map(([x, y]) => `<path d="M${x} ${y}q8-6 16 0t16 0" stroke="#fff" stroke-width="3" fill="none"/>`).join('')}</g>
    <g stroke="#5B4636" stroke-width="2.5" stroke-dasharray="2 8" stroke-linecap="round" fill="none" opacity=".55">${routes}</g>
    ${isle(hx * 3.6, hy * 3.6, '#BFE0A5', 46)}
    ${REGIONS.map((r) => isle(r.at[0] * 3.6, r.at[1] * 3.6, r.color, 36)).join('')}
  </svg>`;
  const wrap = h('div.wmap-wrap', { html: svg });
  const home = button('wmap-pin.home', [h('span.wp-icon', { html: icon('house') }), h('span.wp-label', null, pick(HOME_REGION.name)), host.place === 'home' ? h('span.wp-here', null, t('youAreHere')) : null], () => showRegion(null), {
    style: { left: `${hx}%`, top: `${hy}%` },
  });
  wrap.append(home);
  for (const r of REGIONS) {
    wrap.append(button('wmap-pin', [
      h('span.wp-icon', { html: icon(r.animals[0].icon) }),
      h('span.wp-label', null, h('b', null, regionLevel(r, target)), ' ', pick(r.name)),
      host.canTravel(r.id) ? null : h('span.wp-lock', { html: icon('lock') }),
      host.place === r.id ? h('span.wp-here', null, t('youAreHere')) : null,
    ], () => { audio.select(); showRegion(r); }, { style: { left: `${r.at[0]}%`, top: `${r.at[1]}%` } }));
  }
  showRegion(host.place === 'home' ? REGIONS[0] : REGIONS.find((r) => r.id === host.place) ?? null);
  return h('div', null, wrap, detail);
}

export function openMap(host: MapHost, onClose?: () => void) {
  const body = h('div');
  let view: 'village' | 'world' = 'world';
  let s: { close: () => void } | null = null;
  const close = () => s?.close();
  const render = () => body.replaceChildren(
    ...(host.place === 'home' ? [seg([{ v: 'world', label: '🗺️ ' + t('mapWorld') }, { v: 'village', label: '🏠 ' + t('mapVillage') }], view, (v) => { view = v as typeof view; audio.page(); render(); }, 'wide')] : []),
    view === 'world' || host.place !== 'home' ? worldMap(host, close) : villageMap(host),
  );
  render();
  s = sheet(t('map'), body, { onClose });
  return s;
}
