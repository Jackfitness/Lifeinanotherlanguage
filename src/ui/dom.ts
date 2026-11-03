import { audio } from '../audio/audio';

type Child = Node | string | number | null | undefined | false;
type Props = Record<string, any> & { html?: string; style?: Record<string, string | number | undefined> | string };

/** Tiny element factory: h('div.card.big', { onclick }, child, …) */
export function h(sel: string, props: Props | null = null, ...children: Child[]): HTMLElement {
  const [tag, ...cls] = sel.split('.');
  const el = document.createElement(tag || 'div');
  if (cls.length) el.className = cls.join(' ');
  if (props) for (const [k, v] of Object.entries(props)) {
    if (v === undefined || v === null || v === false) continue;
    if (k === 'html') el.innerHTML = v;
    else if (k === 'style') typeof v === 'string' ? el.setAttribute('style', v) : Object.assign(el.style, v);
    else if (k.startsWith('on')) el.addEventListener(k.slice(2), v);
    else if (k === 'class') el.className += ' ' + v;
    else el.setAttribute(k, v === true ? '' : String(v));
  }
  for (const c of children) if (c !== null && c !== undefined && c !== false) el.append(c instanceof Node ? c : String(c));
  return el;
}

export const ui = () => document.getElementById('ui')!;

/** A button that plays a soft tap sound. */
export function button(sel: string, label: Child | Child[], onClick: (e: Event) => void, props: Props = {}) {
  const kids = Array.isArray(label) ? label : [label];
  return h('button.' + sel.replace(/^\./, ''), { ...props, type: 'button', onclick: (e: Event) => { audio.tap(); onClick(e); } }, ...kids);
}

let toastHost: HTMLElement | null = null;
export function toast(icon: string, title: string, sub?: string, ms = 2600) {
  if (!toastHost || !toastHost.isConnected) { toastHost = h('div.toasts'); ui().append(toastHost); }
  const el = h('div.toast', null, h('span.t-icon', null, icon), h('div', { html: title + (sub ? `<small>${sub}</small>` : '') }));
  toastHost.append(el);
  while (toastHost.children.length > 3) toastHost.firstElementChild!.remove();
  setTimeout(() => { el.classList.add('out'); setTimeout(() => el.remove(), 300); }, ms);
}

export function floatText(text: string, x: number, y: number, color?: string) {
  const el = h('div.float-num', { style: { left: x + 'px', top: y + 'px', color: color ?? '' } }, text);
  ui().append(el);
  setTimeout(() => el.remove(), 1100);
}

/** Bottom sheet with optional tab bar. Returns a close function. */
export function sheet(title: string, body: HTMLElement, opts: { tabs?: HTMLElement; onClose?: () => void; headExtra?: HTMLElement } = {}) {
  audio.open();
  const scrim = h('div.scrim');
  const titleEl = h('h2', null, title);
  const close = () => {
    audio.close();
    sh.classList.add('out'); scrim.style.opacity = '0'; scrim.style.transition = 'opacity .25s';
    setTimeout(() => { sh.remove(); scrim.remove(); }, 250);
    opts.onClose?.();
  };
  const sh = h('div.sheet', { role: 'dialog', 'aria-label': title },
    h('div.grab'),
    h('div.sheet-head', null, titleEl, h('div.row', null, opts.headExtra ?? null, button('icon-btn', '✕', close, { 'aria-label': 'Close' }))),
    h('div.sheet-body', null, body),
    opts.tabs ?? null,
  );
  scrim.addEventListener('click', close);
  ui().append(scrim, sh);
  return { close, titleEl, el: sh };
}

const cardQueue: (() => void)[] = [];
let cardOpen = false;
/** Celebration / info card. Cards queue so they never stack on top of each other. */
export function centerCard(icon: string, title: string, lines: (string | HTMLElement)[], cta: string, onDone?: () => void) {
  const show = () => {
    cardOpen = true;
    const scrim = h('div.scrim');
    const done = () => {
      card.remove(); scrim.remove(); cardOpen = false; onDone?.();
      const next = cardQueue.shift();
      if (next) setTimeout(next, 250);
    };
    const card = h('div.center-card', { role: 'dialog' },
      h('span.big', null, icon), h('h2', null, title),
      ...lines.map((l) => (typeof l === 'string' ? h('p', null, l) : l)),
      button('btn.primary', cta, done, { style: { marginTop: '10px', width: '100%' } }),
    );
    ui().append(scrim, card);
  };
  if (cardOpen) cardQueue.push(show); else show();
}

/** In-page yes/no confirmation (native confirm() is unavailable in some embeds). */
export function confirmCard(message: string, yes: string, no: string): Promise<boolean> {
  return new Promise((res) => {
    const scrim = h('div.scrim', { style: { zIndex: '60' } });
    const close = (v: boolean) => { card.remove(); scrim.remove(); res(v); };
    const card = h('div.center-card', { role: 'alertdialog', style: { zIndex: '61' } },
      h('span.big', null, '🌱'), h('p', { style: { color: 'var(--cocoa)', fontWeight: '700' } }, message),
      h('div.row', { style: { marginTop: '12px' } },
        button('btn.soft', no, () => close(false), { style: { flex: '1' } }),
        button('btn.primary', yes, () => close(true), { style: { flex: '1' } })));
    ui().append(scrim, card);
  });
}

export function confetti(n = 60) {
  const cols = ['#F2A7B0', '#F7D774', '#8CC084', '#9FD3E6', '#F4A88A', '#B6A3D9'];
  for (let i = 0; i < n; i++) {
    const c = h('div.confetti', { style: { left: Math.random() * 100 + 'vw', background: cols[i % cols.length], animationDuration: 1.8 + Math.random() * 1.8 + 's', animationDelay: Math.random() * 0.4 + 's' } });
    ui().append(c);
    setTimeout(() => c.remove(), 4200);
  }
}

let fadeEl: HTMLElement | null = null;
export function fadeThrough(mid: () => void | Promise<void>) {
  if (!fadeEl || !fadeEl.isConnected) { fadeEl = h('div.fade'); ui().append(fadeEl); }
  const f = fadeEl;
  f.classList.add('on');
  return new Promise<void>((res) => setTimeout(async () => { await mid(); setTimeout(() => { f.classList.remove('on'); res(); }, 120); }, 380));
}

export function seg<T extends string>(options: { v: T; label: string }[], value: T, onChange: (v: T) => void, cls = '') {
  const el = h('div.seg' + (cls ? '.' + cls : ''));
  const render = (cur: T) => {
    el.replaceChildren(...options.map((o) => button(cur === o.v ? 'on' : '', o.label, () => { render(o.v); onChange(o.v); })));
  };
  render(value);
  return el;
}

export function toggle(on: boolean, onChange: (v: boolean) => void) {
  const el = button('switch' + (on ? '.on' : ''), '', () => { on = !on; el.classList.toggle('on', on); onChange(on); }, { role: 'switch', 'aria-checked': String(on) });
  return el;
}
