import { h, ui } from './dom';

/** Floating thumb joystick (appears where you touch) + WASD/arrow keys on desktop. */
export class Joystick {
  x = 0; z = 0;
  enabled = true;
  zone: HTMLElement;
  private base: HTMLElement;
  private knob: HTMLElement;
  private hint: HTMLElement;
  private id: number | null = null;
  private ox = 0; private oy = 0;
  private keys = new Set<string>();

  constructor(hintText: string) {
    this.knob = h('div.joy-knob');
    this.base = h('div.joy-base', { style: { opacity: '0' } }, this.knob);
    this.zone = h('div.joy-zone', { 'aria-hidden': 'true' }, this.base);
    this.hint = h('div.joy-hint', null, hintText);
    ui().append(this.zone, this.hint);
    this.zone.addEventListener('pointerdown', (e) => this.down(e));
    window.addEventListener('pointermove', (e) => this.move(e));
    window.addEventListener('pointerup', (e) => this.up(e));
    window.addEventListener('pointercancel', (e) => this.up(e));
    window.addEventListener('keydown', (e) => { if (!(e.target instanceof HTMLInputElement)) this.keys.add(e.key.toLowerCase()); });
    window.addEventListener('keyup', (e) => this.keys.delete(e.key.toLowerCase()));
    window.addEventListener('blur', () => this.keys.clear());
  }

  private down(e: PointerEvent) {
    if (!this.enabled || this.id !== null) return;
    this.id = e.pointerId;
    this.ox = e.clientX; this.oy = e.clientY;
    this.base.style.left = this.ox + 'px'; this.base.style.top = (this.oy - this.zone.getBoundingClientRect().top) + 'px';
    this.base.style.opacity = '1';
    this.hint.style.opacity = '0';
  }
  private move(e: PointerEvent) {
    if (e.pointerId !== this.id) return;
    let dx = e.clientX - this.ox, dy = e.clientY - this.oy;
    const d = Math.hypot(dx, dy), max = 50;
    if (d > max) { dx = (dx / d) * max; dy = (dy / d) * max; }
    this.knob.style.transform = `translate(${dx}px, ${dy}px)`;
    const mag = Math.min(1, d / max);
    this.x = d > 4 ? (dx / max) : 0; this.z = d > 4 ? (dy / max) : 0;
    if (mag < 0.15) { this.x = 0; this.z = 0; }
  }
  private up(e: PointerEvent) {
    if (e.pointerId !== this.id) return;
    this.id = null; this.x = 0; this.z = 0;
    this.knob.style.transform = '';
    this.base.style.opacity = '0';
  }

  read(): { x: number; z: number } {
    if (!this.enabled) return { x: 0, z: 0 };
    let kx = 0, kz = 0;
    const k = this.keys;
    if (k.has('a') || k.has('arrowleft')) kx -= 1;
    if (k.has('d') || k.has('arrowright')) kx += 1;
    if (k.has('w') || k.has('arrowup')) kz -= 1;
    if (k.has('s') || k.has('arrowdown')) kz += 1;
    if (kx || kz) { const l = Math.hypot(kx, kz); return { x: kx / l, z: kz / l }; }
    return { x: this.x, z: this.z };
  }

  setEnabled(on: boolean) {
    this.enabled = on;
    this.zone.style.display = on ? '' : 'none';
    if (!on) { this.id = null; this.x = this.z = 0; this.base.style.opacity = '0'; }
  }
  remove() { this.zone.remove(); this.hint.remove(); }
}
