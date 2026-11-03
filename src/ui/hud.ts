import { S } from '../core/save';
import { pick, t } from '../core/i18n';
import { activeQuests, playerLevel, qs, xpAt } from '../core/progress';
import { button, h, ui } from './dom';

export class Hud {
  root = h('div.hud-top');
  private clock = h('span.clock');
  private weather = h('span');
  private coins = h('span');
  private lvlText = h('span');
  private ring: SVGCircleElement;
  private tracker = h('div.tracker', { role: 'button', tabindex: '0' });
  private menuDot = h('span.dot.hidden');
  private actionWrap: HTMLElement;
  private actionBtn: HTMLButtonElement;
  private actionLabel = h('div.action-label');
  private onAction: (() => void) | null = null;

  constructor(private openMenu: (tab?: string) => void) {
    const svgNS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(svgNS, 'svg');
    svg.setAttribute('viewBox', '0 0 42 42');
    const bg = document.createElementNS(svgNS, 'circle');
    Object.entries({ cx: 21, cy: 21, r: 18, fill: 'none', stroke: 'rgba(91,70,54,.12)', 'stroke-width': 4 }).forEach(([k, v]) => bg.setAttribute(k, String(v)));
    this.ring = document.createElementNS(svgNS, 'circle');
    Object.entries({ cx: 21, cy: 21, r: 18, fill: 'none', stroke: '#8CC084', 'stroke-width': 4, 'stroke-linecap': 'round', 'stroke-dasharray': '113' }).forEach(([k, v]) => this.ring.setAttribute(k, String(v)));
    svg.append(bg, this.ring);
    const lvl = h('div.lvl', { 'aria-label': t('level') }, this.lvlText);
    lvl.prepend(svg as unknown as HTMLElement);

    const menu = button('menu-btn', ['📒', this.menuDot], () => openMenu(), { 'aria-label': 'Notebook' });
    this.tracker.addEventListener('click', () => openMenu('quests'));
    this.root.append(
      h('div.hud-left', null, h('div.pill', null, this.weather, this.clock), this.tracker),
      h('div.hud-right', null, h('div.hud-row', null, h('div.pill', null, '🪙', this.coins), lvl), menu),
    );
    this.actionBtn = button('action-btn', '', () => this.onAction?.()) as HTMLButtonElement;
    this.actionWrap = h('div.action-wrap.off', null, this.actionBtn, this.actionLabel);
    ui().append(this.root, this.actionWrap);
    this.refresh();
  }

  setTime(hour: number, weatherIcon: string) {
    const hh = Math.floor(hour), mm = Math.floor((hour - hh) * 60);
    this.clock.textContent = `${hh}:${String(mm).padStart(2, '0')}`;
    this.weather.textContent = weatherIcon;
  }

  setAction(a: { icon: string; label: string; use: () => void } | null) {
    if (!a) { this.actionWrap.classList.add('off'); this.onAction = null; return; }
    this.actionWrap.classList.remove('off');
    if (this.actionBtn.textContent !== a.icon) this.actionBtn.textContent = a.icon;
    this.actionBtn.setAttribute('aria-label', a.label);
    if (this.actionLabel.textContent !== a.label) this.actionLabel.textContent = a.label;
    this.onAction = a.use;
  }

  setMenuDot(on: boolean) { this.menuDot.classList.toggle('hidden', !on); }

  refresh() {
    const d = S();
    this.coins.textContent = String(d.player.coins);
    const l = playerLevel();
    this.lvlText.textContent = String(l);
    const frac = (d.player.xp - xpAt(l)) / (xpAt(l + 1) - xpAt(l));
    this.ring.setAttribute('stroke-dashoffset', String(113 * (1 - frac)));
    const q = activeQuests()[0];
    if (q) {
      const step = q.steps[qs(q.id).step];
      this.tracker.replaceChildren(h('span.q-icon', null, q.icon), h('div', null, pick(q.title), h('small', null, pick(step.objective))));
      this.tracker.classList.remove('hidden');
    } else this.tracker.classList.add('hidden');
  }

  show(on: boolean) {
    this.root.style.display = on ? '' : 'none';
    if (!on) this.actionWrap.classList.add('off');
  }
}
