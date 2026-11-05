import type { Step } from '../content/dialogues';
import type { Expr } from '../core/types';
import { lex } from '../content/lexicon';
import { phrase, PHRASES } from '../content/phrases';
import { S } from '../core/save';
import { pick, t } from '../core/i18n';
import { addXP, reviewReward } from '../core/progress';
import { audio } from '../audio/audio';
import { speech } from '../learning/tts';
import {
  card, distractors, stopSpeaking, renderOpts, expose, exposePhrase, glossVisible, levelNum, lexNative, lexPlain, lexTarget, markNote, noteFor,
  phraseNative, phraseSyllables, phraseTarget, phraseTiles, review, say, sayLex, sayPhrase, shuffle, target,
} from '../learning/engine';
import { tracePad } from './trace';
import { button, floatText, h, toast, ui } from './dom';
import type { DojoQ } from '../learning/dojo';
import { renderTarget } from '../learning/text';

export interface Speaker {
  name: string;
  color: string;
  voice: { pitch: number; speed: number };
  setExpr?: (e: Expr) => void;
  setTalking?: (on: boolean) => void;
}

export interface DialogueHost {
  effect: (fn: string, arg: unknown) => void | Promise<void>;
}

export interface ConvoResult { correct: number; total: number; closed: boolean }

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));
/** Little vocal reactions that go with each expression. */
const EMOTE: Partial<Record<Expr, string>> = { happy: 'giggle', love: 'yay', surprised: 'gasp', thinking: 'hmm', sad: 'aww', sleepy: 'yawn' };

/** Wrap characters (and whole <ruby> units) in spans so they can be revealed one by one. */
function prepareTypewriter(el: HTMLElement): HTMLElement[] {
  const units: HTMLElement[] = [];
  const walk = (node: Node) => {
    for (const child of [...node.childNodes]) {
      if (child.nodeType === 3) {
        const frag = document.createDocumentFragment();
        for (const ch of child.textContent ?? '') {
          const s = document.createElement('span'); s.className = 'ch'; s.textContent = ch;
          frag.append(s); units.push(s);
        }
        child.replaceWith(frag);
      } else if (child instanceof HTMLElement) {
        if (child.tagName === 'RUBY' || child.classList.contains('romaji')) { child.classList.add('ch'); units.push(child); }
        else walk(child);
      }
    }
  };
  walk(el);
  return units;
}

export class Dialogue {
  root = h('div.dlg', { role: 'dialog', 'aria-live': 'polite' });
  result: ConvoResult = { correct: 0, total: 0, closed: false };
  private closed = false;
  private lastSay: { p: string; item?: string } | null = null;
  private resolveClose?: () => void;
  private lastExpr: Expr = 'neutral';
  private lastEmote = 0;

  constructor(private speaker: Speaker | null, private host: DialogueHost, private opts: { closable?: boolean } = {}) {
    ui().append(this.root);
  }

  async run(steps: Step[]): Promise<ConvoResult> {
    for (const s of steps) {
      if (this.closed) break;
      await this.step(s);
    }
    this.finish();
    return this.result;
  }

  finish() {
    if (!this.root.isConnected) return;
    this.speaker?.setTalking?.(false);
    this.speaker?.setExpr?.('neutral');
    stopSpeaking();
    this.root.style.transition = 'opacity .2s, transform .2s';
    this.root.style.opacity = '0';
    setTimeout(() => this.root.remove(), 200);
  }

  close() { this.closed = true; this.result.closed = true; this.resolveClose?.(); this.finish(); }

  private async step(s: Step): Promise<void> {
    switch (s.t) {
      case 'say': return this.say(s.p, s.e, s.item);
      case 'narrate': return this.narrate(pick(s.text), s.icon);
      case 'reply': return this.reply(s.ok, s.bad ?? [], s.item, s.e);
      case 'build': return this.build(s.p, s.item);
      case 'name': await this.nameIt(s.w, s.opts, s.due); return;
      case 'listen': await this.listen(s.w, s.opts, s.due); return;
      case 'meaning': return this.meaning(s.p);
      case 'ask': return this.ask(pick(s.q), s.w, s.opts);
      case 'quiz': return void (await this.quizStep(pick(s.q), s.options, s.answer));
      case 'do': return this.host.effect(s.fn, s.arg);
    }
  }

  /** Change the villager's face, with a matching little sound when it changes. */
  private express(e: Expr) {
    if (!this.speaker) return;
    this.speaker.setExpr?.(e);
    if (e === this.lastExpr) return;
    this.lastExpr = e;
    const kind = EMOTE[e], now = performance.now();
    if (kind && S().settings.blips && this.speaker.voice.pitch > 0 && now - this.lastEmote > 1800) {
      this.lastEmote = now;
      audio.emote(kind, this.speaker.voice.pitch);
    }
  }

  // ------------------------------------------------------------ building blocks
  private nametag() {
    if (!this.speaker) return h('div.nametag.narrator', null, '✦');
    return h('div.nametag', { style: { background: this.speaker.color } }, this.speaker.name);
  }

  private bubble(...children: (HTMLElement | null)[]) {
    const b = h('div.bubble', null, this.nametag(), ...children);
    if (this.opts.closable) b.append(button('close-x', '✕', () => this.close(), { 'aria-label': t('close') }));
    return b;
  }

  private waitTap(el: HTMLElement) {
    return new Promise<void>((res) => {
      this.resolveClose = res;
      el.classList.add('tap');
      el.addEventListener('click', (e) => {
        if ((e.target as HTMLElement).closest('button, .chip, .gloss.veiled')) return;
        audio.soft(); res();
      });
    });
  }

  /** Reveal text with villager voice blips; resolves when done (tap to skip). */
  private type(el: HTMLElement, holder: HTMLElement, syllables: string[] = []) {
    const units = prepareTypewriter(el);
    const v = this.speaker?.voice ?? { pitch: 260, speed: 1 };
    const blips = S().settings.blips && !!this.speaker && v.pitch > 0;
    this.speaker?.setTalking?.(true);
    return new Promise<void>((res) => {
      let i = 0, done = false, sylAt = -1;
      const finish = () => {
        if (done) return; done = true;
        units.forEach((u) => u.classList.add('on'));
        this.speaker?.setTalking?.(false);
        holder.removeEventListener('click', skip, true);
        res();
      };
      const skip = (e: Event) => { if (!done) { e.stopPropagation(); finish(); } };
      holder.addEventListener('click', skip, true);
      const tick = () => {
        if (done || this.closed) return finish();
        const n = Math.max(1, Math.round(v.speed * 1.4));
        for (let k = 0; k < n && i < units.length; k++, i++) {
          units[i].classList.add('on');
          if (!blips) continue;
          if (syllables.length) {
            // Spread the line's syllables across the reveal so the babble ends with the text.
            const want = Math.floor((i / units.length) * syllables.length);
            if (want > sylAt) { sylAt = want; audio.syllable(syllables[want], v.pitch); }
          } else if (i % 2 === 0 && /\S/.test(units[i].textContent ?? '')) audio.blip(v.pitch);
        }
        if (i >= units.length) finish(); else setTimeout(tick, 42);
      };
      tick();
    });
  }

  private chips(words: string[]) {
    if (!words.length) return null;
    return h('div.chips', null, ...words.map((w) => {
      const isNew = (card('lex', w)?.seen ?? 0) <= 1;
      const c = h('span.chip' + (isNew ? '.new' : ''), { role: 'button', tabindex: '0', html: `<span class="ci">${lex(w).icon}</span>${lexTarget(w)}` });
      c.addEventListener('click', () => { audio.tap(); sayLex(w); toast(lex(w).icon, lexNative(w), lexTarget(w), 2000); });
      return c;
    }));
  }

  private speakBtn(fn: () => void) {
    return button('icon-btn', '🔊', (e) => { e.stopPropagation(); fn(); }, { 'aria-label': t('listen') });
  }

  private sayLine(p: string, item?: string) {
    const ph = phrase(p);
    const sayEl = h('div.say', { lang: target(), html: phraseTarget(p, item) });
    if (S().settings.jaScript === 'kanji' && target() === 'ja') {
      let ruby = false;
      sayEl.addEventListener('click', (e) => {
        e.stopPropagation(); ruby = !ruby;
        sayEl.innerHTML = phraseTarget(p, item, { showRuby: ruby });
        sayEl.querySelectorAll('.ch').forEach((c) => c.classList.add('on'));
      });
    }
    let gloss: HTMLElement;
    if (glossVisible(ph)) gloss = h('div.gloss', { html: phraseNative(p, item) });
    else {
      gloss = h('div.gloss.veiled', { role: 'button', tabindex: '0' }, '👀 ' + t('showMeaning'));
      gloss.addEventListener('click', (e) => { e.stopPropagation(); audio.tap(); gloss.className = 'gloss'; gloss.innerHTML = phraseNative(p, item); }, { once: true });
    }
    return { sayEl, gloss };
  }

  private async noteCheck(p: string) {
    const n = noteFor(phrase(p));
    if (!n) return;
    markNote(n.id);
    audio.discovery();
    const nc = h('div.note-card', null,
      h('div.kicker', null, '✨ ' + t('discovery')), h('h3', null, pick(n.title)), h('div', null, pick(n.body)),
      h('div.row.end', { style: { marginTop: '12px' } }, null));
    const okBtn = button('btn.primary.small', t('gotIt'), () => {});
    nc.lastElementChild!.append(okBtn);
    this.root.replaceChildren(nc);
    await new Promise<void>((res) => okBtn.addEventListener('click', () => res()));
  }

  // ------------------------------------------------------------ steps
  async say(p: string, e: Expr = 'neutral', item?: string) {
    exposePhrase(p);
    this.lastSay = { p, item };
    this.express(e);
    const { sayEl, gloss } = this.sayLine(p, item);
    if (e === 'surprised') sayEl.classList.add('shout');
    const next = h('div.next');
    next.style.visibility = 'hidden';
    const tools = h('div.bubble-tools', null, this.speakBtn(() => sayPhrase(p, item)), this.chips(phrase(p).words ?? []), next);
    const b = this.bubble(sayEl, gloss, tools);
    this.root.replaceChildren(b);
    await this.type(sayEl, b, phraseSyllables(p, item));
    if (S().settings.autoplay) sayPhrase(p, item);
    next.style.visibility = '';
    await this.waitTap(b);
    await this.noteCheck(p);
  }

  async narrate(text: string, icon?: string) {
    const prev = this.speaker;
    const b = h('div.bubble', null, h('div.nametag.narrator', null, icon ?? '✦'), h('div.say.narration', null, text), h('div.bubble-tools', null, h('div.next')));
    this.root.replaceChildren(b);
    void prev;
    await this.waitTap(b);
  }

  /** Re-show the last villager line (compact) above an exercise. */
  private contextBubble() {
    if (!this.lastSay) return null;
    const { p, item } = this.lastSay;
    const { sayEl, gloss } = this.sayLine(p, item);
    sayEl.querySelectorAll('*').forEach((c) => c.classList.add('on'));
    return this.bubble(sayEl, gloss, h('div.bubble-tools', null, this.speakBtn(() => sayPhrase(p, item))));
  }

  private tip(lines: string[]) {
    return h('div.tip', null, h('span.tip-i', null, '🧵'), h('div', { html: lines.join('<br>') }));
  }

  private async afterAnswer(correct: boolean, tipLines: string[], el: HTMLElement | null, reward: () => number | void) {
    this.result.total++;
    if (correct) {
      this.result.correct++;
      audio.correct();
      this.express('happy');
      const coins = reward();
      if (el) {
        const r = el.getBoundingClientRect();
        floatText(coins ? `+${coins} 🪙` : '✨', r.right - 60, r.top - 6);
      }
      await wait(850);
      return;
    }
    audio.gentleWrong();
    this.express('thinking');
    reward();
    const cont = button('btn.primary.small', '→', () => {}, { 'aria-label': t('continue') });
    cont.style.marginLeft = 'auto';
    const tipEl = this.tip(tipLines);
    tipEl.append(cont);
    this.root.append(tipEl);
    await new Promise<void>((res) => cont.addEventListener('click', () => { audio.soft(); res(); }));
    this.express('neutral');
  }

  async reply(ok: string[], bad: string[], item?: string, e?: Expr) {
    const n = levelNum() >= 3 ? 4 : 3;
    let opts = [...ok.slice(0, 1), ...shuffle([...ok.slice(1), ...bad])].slice(0, n);
    if (opts.length < n) {
      const pool = PHRASES.filter((p) => p.lvl <= levelNum() + 1 && !opts.includes(p.id) && !p.t.en.includes('$') && p.id[1] !== '_');
      opts.push(...shuffle(pool).slice(0, n - opts.length).map((p) => p.id));
    }
    opts = shuffle(opts);
    const main = ok[0];
    const firstTime = !card('phr', main);
    const ctx = this.contextBubble();
    const prompt = h('div.prompt', null, '💬 ' + t('yourReply'));
    let hinted = !!S().settings.showMeanings;
    void firstTime;
    const list = h('div.options');
    const showGloss = () => list.querySelectorAll('.opt-gloss').forEach((g) => ((g as HTMLElement).style.display = 'block'));
    const hintBtn: HTMLElement | null = levelNum() < 3 ? button('btn.soft.small', '💡 ' + t('hint'), () => { hinted = true; showGloss(); hintBtn?.remove(); }) : null;
    const answered = new Promise<{ id: string; el: HTMLElement }>((res) => {
      for (const id of opts) {
        const glossEl = h('div.opt-gloss.muted', { style: { display: hinted ? 'block' : 'none', fontSize: '0.78em', fontWeight: '500' }, html: phraseNative(id, item) });
        const el = h('button.opt', { type: 'button' },
          h('span.ot', null, h('span', { lang: target(), html: phraseTarget(id, item) }), glossEl),
          h('span.spk', { role: 'button', 'aria-label': t('listen') }, '🔊'));
        el.addEventListener('click', (ev) => {
          if ((ev.target as HTMLElement).closest('.spk')) { ev.stopPropagation(); sayPhrase(id, item); return; }
          res({ id, el });
        });
        list.append(el);
      }
    });
    this.root.replaceChildren(...[ctx, h('div.row', null, prompt, hintBtn ? h('div', { style: { marginLeft: 'auto' } }, hintBtn) : null), list].filter(Boolean) as HTMLElement[]);
    const { id, el } = await answered;
    list.querySelectorAll('.opt').forEach((o) => ((o as HTMLButtonElement).disabled = true));
    const correct = ok.includes(id);
    el.classList.add(correct ? 'right' : 'wrong');
    sayPhrase(id, item);
    if (!correct) {
      list.querySelectorAll('.opt').forEach((o, i) => { if (opts[i] === main) o.classList.add('right'); else if (o !== el) o.classList.add('dim'); });
    }
    exposePhrase(id);
    await this.afterAnswer(correct, [
      t('tipMeans', { a: phraseTarget(id, item), b: phraseNative(id, item) }),
      t('tipTry', { a: `<b>${phraseTarget(main, item)}</b>`, b: phraseNative(main, item) }),
    ], el, () => { const r = review('phr', correct ? id : main, correct, hinted); return correct ? (addXP(hinted ? 2 : 4), 0) : (void r, 0); });
    if (correct && e) this.express(e);
    await this.noteCheck(correct ? id : main);
  }

  async build(p: string, item?: string) {
    exposePhrase(p);
    const tiles = phraseTiles(p, item);
    const extra: { html: string; key: string }[] = [];
    const lv = levelNum();
    if (lv >= 2) {
      const others = shuffle(PHRASES.filter((x) => x.id !== p && !x.t.en.includes('$') && x.lvl <= lv)).slice(0, 3);
      for (const o of others) for (const tl of phraseTiles(o.id)) if (extra.length < lv - 1 && !tiles.some((x) => x.key === tl.key)) extra.push(tl);
    }
    if (tiles.length === 1) { await this.say(p, 'happy', item); return; }
    const pool = shuffle([...tiles.map((x, i) => ({ ...x, i })), ...extra.map((x) => ({ ...x, i: -1 }))]);
    const chosen: number[] = [];
    const prompt = h('div.prompt-card', null, h('div.prompt', { html: t('buildPrompt', { a: phraseNative(p, item) }) }));
    const tray = h('div.build-tray', { lang: target() });
    const tileBox = h('div.tiles', { lang: target() });
    const sayBtn = button('btn.primary', '🗣️ ' + t('check'), () => {});
    sayBtn.setAttribute('disabled', '');
    const render = () => {
      tray.replaceChildren(...chosen.map((pi, k) => {
        const b = button('tile', '', () => { chosen.splice(k, 1); render(); });
        b.innerHTML = pool[pi].html; return b;
      }));
      tileBox.replaceChildren(...pool.map((tl, pi) => {
        const b = button('tile' + (chosen.includes(pi) ? '.used' : ''), '', () => { chosen.push(pi); render(); });
        b.innerHTML = tl.html; return b;
      }));
      if (chosen.length >= tiles.length) sayBtn.removeAttribute('disabled'); else sayBtn.setAttribute('disabled', '');
    };
    render();
    this.root.replaceChildren(...[this.contextBubble(), prompt, tray, tileBox, h('div.row.end', null, sayBtn)].filter(Boolean) as HTMLElement[]);
    await new Promise<void>((res) => sayBtn.addEventListener('click', () => res()));
    const built = chosen.map((pi) => pool[pi].key).join(' ');
    const correct = built === tiles.map((x) => x.key).join(' ');
    tray.style.background = correct ? 'var(--leaf-soft)' : 'var(--rose-soft)';
    tileBox.remove(); sayBtn.remove();
    sayPhrase(p, item);
    await this.afterAnswer(correct, [t('tipOrder', { a: `<b>${phraseTarget(p, item)}</b>` }) + ' — ' + phraseNative(p, item)], tray,
      () => { review('phr', p, correct); if (correct) addXP(5); });
  }

  private async lexChoice(w: string, opts: string[] | undefined, mode: 'name' | 'listen', due?: boolean) {
    const isNew = expose('lex', w);
    const n = levelNum() >= 3 ? 4 : 3;
    const options = shuffle(opts ? [...opts] : [w, ...distractors(w, n - 1)]);
    const top = mode === 'name'
      ? h('div', null, h('div.prompt-card', null, h('div.prompt', null, '❓ ' + t('whatCalled'))), h('div.big-icon', null, lex(w).icon))
      : h('div', null, h('div.prompt-card', null, h('div.prompt', null, '👂 ' + t('whatHeard'))),
        h('div', { style: { textAlign: 'center', margin: '10px 0' } }, button('btn.primary', '🔊 ' + t('listen'), () => sayLex(w))));
    const list = h(mode === 'name' ? 'div.options' : 'div.icon-grid');
    const answered = new Promise<{ id: string; el: HTMLElement }>((res) => {
      for (const id of options) {
        const el = mode === 'name'
          ? h('button.opt', { type: 'button' }, h('span.ot', { lang: target(), html: lexTarget(id) }), h('span.spk', { role: 'button' }, '🔊'))
          : h('button.opt.icon-opt', { type: 'button', 'aria-label': lexPlain(id) }, lex(id).icon);
        el.addEventListener('click', (ev) => {
          if ((ev.target as HTMLElement).closest('.spk')) { ev.stopPropagation(); sayLex(id); return; }
          res({ id, el });
        });
        list.append(el);
      }
    });
    this.root.replaceChildren(top, list);
    if (mode === 'listen') setTimeout(() => sayLex(w), 350);
    const { id, el } = await answered;
    list.querySelectorAll('.opt').forEach((o) => ((o as HTMLButtonElement).disabled = true));
    const correct = id === w;
    el.classList.add(correct ? 'right' : 'wrong');
    if (!correct) list.querySelectorAll('.opt').forEach((o, i) => { if (options[i] === w) o.classList.add('right'); });
    sayLex(w);
    await this.afterAnswer(correct, [
      t('tipWord', { a: `<b>${lex(w).icon} ${lexTarget(w)}</b>`, b: lexNative(w) }),
      ...(id !== w ? [t('tipMeans', { a: lexTarget(id), b: lexNative(id) })] : []),
    ], el, () => {
      const { wasDue } = review('lex', w, correct, isNew);
      if (due) return reviewReward(wasDue, correct);
      if (correct) addXP(3);
    });
    return correct;
  }

  nameIt(w: string, opts?: string[], due?: boolean) { return this.lexChoice(w, opts, 'name', due); }
  listen(w: string, opts?: string[], due?: boolean) { return this.lexChoice(w, opts, 'listen', due); }

  async meaning(p: string) {
    const others = shuffle(PHRASES.filter((x) => x.id !== p && !x.id.startsWith('n_') && x.t[S().profile.native] !== phrase(p).t[S().profile.native] && Math.abs(x.lvl - phrase(p).lvl) <= 1)).slice(0, levelNum() >= 3 ? 3 : 2);
    const opts = shuffle([p, ...others.map((x) => x.id)]);
    const ctx = this.lastSay?.p === p ? this.contextBubble() : this.bubble(h('div.say', { html: phraseTarget(p) }));
    ctx?.querySelector('.gloss')?.remove();
    const list = h('div.options');
    const answered = new Promise<{ id: string; el: HTMLElement }>((res) => {
      for (const id of opts) {
        const el = h('button.opt', { type: 'button' }, h('span.ot', { html: phraseNative(id) }));
        el.addEventListener('click', () => res({ id, el }));
        list.append(el);
      }
    });
    this.root.replaceChildren(...[ctx, h('div.prompt', null, '🤔 ' + t('whatMeans', { npc: this.speaker?.name ?? '' })), list].filter(Boolean) as HTMLElement[]);
    const { id, el } = await answered;
    list.querySelectorAll('.opt').forEach((o) => ((o as HTMLButtonElement).disabled = true));
    const correct = id === p;
    el.classList.add(correct ? 'right' : 'wrong');
    if (!correct) list.querySelectorAll('.opt').forEach((o, i) => { if (opts[i] === p) o.classList.add('right'); });
    await this.afterAnswer(correct, [t('tipMeans', { a: `<b>${phraseTarget(p)}</b>`, b: phraseNative(p) })], el,
      () => { review('phr', p, correct); if (correct) addXP(4); });
  }

  async ask(q: string, w: string, opts: string[]) {
    const options = shuffle([...opts]);
    const list = h('div.icon-grid');
    const answered = new Promise<{ id: string; el: HTMLElement }>((res) => {
      for (const id of options) {
        const el = h('button.opt.icon-opt', { type: 'button', 'aria-label': lexPlain(id) }, lex(id).icon);
        el.addEventListener('click', () => res({ id, el }));
        list.append(el);
      }
    });
    this.root.replaceChildren(...[this.contextBubble(), h('div.prompt-card', null, h('div.prompt', null, '🤔 ' + q)), list].filter(Boolean) as HTMLElement[]);
    const { id, el } = await answered;
    list.querySelectorAll('.opt').forEach((o) => ((o as HTMLButtonElement).disabled = true));
    const correct = id === w;
    el.classList.add(correct ? 'right' : 'wrong');
    if (!correct) list.querySelectorAll('.opt').forEach((o, i) => { if (options[i] === w) o.classList.add('right'); });
    expose('lex', w);
    sayLex(w);
    await this.afterAnswer(correct, [t('tipWord', { a: `<b>${lex(w).icon} ${lexTarget(w)}</b>`, b: lexNative(w) })], el,
      () => { review('lex', w, correct); if (correct) addXP(4); });
  }

  /** Ordering: every option uses the same phrase with a different item ("I'd like the ___, please"). */
  async replyItem(p: string, want: string, others: string[]) {
    const opts = shuffle([want, ...others.slice(0, levelNum() >= 3 ? 3 : 2)]);
    const ctx = this.contextBubble();
    const list = h('div.options');
    const answered = new Promise<{ id: string; el: HTMLElement }>((res) => {
      for (const w of opts) {
        const el = h('button.opt', { type: 'button' },
          h('span', { style: { fontSize: '1.4em' } }, lex(w).icon),
          h('span.ot', { lang: target(), html: phraseTarget(p, w) }),
          h('span.spk', { role: 'button', 'aria-label': t('listen') }, '🔊'));
        el.addEventListener('click', (ev) => {
          if ((ev.target as HTMLElement).closest('.spk')) { ev.stopPropagation(); sayPhrase(p, w); return; }
          res({ id: w, el });
        });
        list.append(el);
      }
    });
    this.root.replaceChildren(...[ctx, h('div.row', null, h('div.prompt', null, '🛍️ ' + t('yourReply')), h('div.big-icon', { style: { fontSize: '2.2em', marginLeft: 'auto' } }, lex(want).icon)), list].filter(Boolean) as HTMLElement[]);
    const { id, el } = await answered;
    list.querySelectorAll('.opt').forEach((o) => ((o as HTMLButtonElement).disabled = true));
    const correct = id === want;
    el.classList.add(correct ? 'right' : 'wrong');
    if (!correct) list.querySelectorAll('.opt').forEach((o, i) => { if (opts[i] === want) o.classList.add('right'); });
    sayPhrase(p, want);
    exposePhrase(p);
    await this.afterAnswer(correct, [
      t('tipWord', { a: `<b>${lex(want).icon} ${lexTarget(want)}</b>`, b: lexNative(want) }),
      ...(correct ? [] : [t('tipMeans', { a: lexTarget(id), b: lexNative(id) })]),
    ], el, () => {
      const { wasDue } = review('lex', want, correct);
      review('phr', p, correct);
      return reviewReward(wasDue, correct);
    });
    return correct;
  }

  /** Comprehension question in the player's language about what was just said, answered in Japanese. */
  async quizStep(q: string, options: string[], answer: number) {
    const opts = options.map((o) => ({ html: renderTarget(o, target(), renderOpts()), ja: true }));
    const order = shuffle(opts.map((_, i) => i));
    return this.dojo({
      section: 'reading', prompt: '', promptJa: false, sub: q,
      options: order.map((i) => opts[i]), answer: order.indexOf(answer),
      explain: opts[answer].html, grade: () => {},
    }, undefined, true);
  }

  /** One dojo / exam question. Resolves with whether it was answered correctly. */
  async dojo(q: DojoQ, progress?: { i: number; n: number; label?: string }, keepContext = false): Promise<boolean> {
    const parts: HTMLElement[] = [];
    if (progress) {
      parts.push(h('div.dojo-progress', null,
        h('div.dp-bar', null, h('i', { style: { width: `${(progress.i / progress.n) * 100}%` } })),
        h('span', null, `${progress.label ? progress.label + ' · ' : ''}${progress.i + 1} / ${progress.n}`)));
    }
    if (keepContext && this.lastSay) { const c = this.contextBubble(); if (c) parts.push(c); }
    const card = h('div.dojo-card');
    if (q.autoSpeak) {
      card.append(button('btn.primary.listen-big', ['🔊', ' ', t('listen')], () => q.speak?.()));
    } else if (q.prompt) {
      const pr = h('div.dojo-prompt' + (q.promptJa ? '.ja' : ''), { lang: q.promptJa ? target() : undefined, html: q.prompt });
      card.append(pr);
      if (q.speak) card.append(button('icon-btn.dojo-spk', '🔊', () => q.speak?.(), { 'aria-label': t('listen') }));
    }
    if (q.sub) card.append(h('div.dojo-sub', { html: q.sub }));
    // Question and answers sit in a split: stacked on a tall screen, side by side when sideways.
    const answers = h('div.dojo-a');
    parts.push(h('div.dojo-split', null, h('div.dojo-q', null, card), answers));
    if (q.trace) {
      // Writing drill: trace the character, then score the ink.
      const res = await new Promise<{ ok: boolean; el: HTMLElement }>((done) => {
        const pad = tracePad(q.trace!, (r) => done({ ok: r.ok, el: pad.el }));
        answers.append(pad.el);
        this.root.replaceChildren(...parts);
        (window as unknown as { __trace?: unknown }).__trace = { canvas: pad.canvas, score: pad.score, get face() { return pad.face; }, glyph: q.trace }; // test hook
      });
      res.el.classList.add(res.ok ? 'right' : 'wrong');
      res.el.querySelectorAll('button').forEach((b) => ((b as HTMLButtonElement).disabled = true));
      if (q.speak) q.speak();
      await this.afterAnswer(res.ok, [q.explain], res.el, () => { q.grade(res.ok); if (res.ok) addXP(2); });
      return res.ok;
    }
    const list = h('div.options');
    const answered = new Promise<{ idx: number; el: HTMLElement }>((res) => {
      q.options.forEach((o, idx) => {
        const el = h('button.opt', { type: 'button' }, h('span.ot', { lang: o.ja ? target() : undefined, html: o.html }));
        el.addEventListener('click', () => res({ idx, el }));
        list.append(el);
      });
    });
    answers.append(list);
    this.root.replaceChildren(...parts);
    (window as unknown as { __dojoAnswer?: number }).__dojoAnswer = q.answer; // test hook
    if (q.autoSpeak) setTimeout(() => q.speak?.(), 300);
    const { idx, el } = await answered;
    list.querySelectorAll('.opt').forEach((o) => ((o as HTMLButtonElement).disabled = true));
    const correct = idx === q.answer;
    el.classList.add(correct ? 'right' : 'wrong');
    if (!correct) list.querySelectorAll('.opt')[q.answer]?.classList.add('right');
    if (q.speak && (q.section === 'kanji' || q.section === 'vocab')) q.speak();
    await this.afterAnswer(correct, [q.explain], el, () => { q.grade(correct); if (correct) addXP(2); });
    return correct;
  }

  /** A note card (grammar explanations in lessons). Resolves when dismissed. */
  async noteCard(kicker: string, title: string, bodyHtml: string, exampleHtml?: string) {
    const ok = button('btn.primary.small', t('gotIt'), () => {});
    const nc = h('div.note-card', null, h('div.kicker', null, kicker), h('h3', null, title), h('div', { html: bodyHtml }),
      exampleHtml ? h('div.note-example', { lang: target(), html: exampleHtml }) : null,
      h('div.row.end', { style: { marginTop: '12px' } }, ok));
    this.root.replaceChildren(nc);
    await new Promise<void>((res) => ok.addEventListener('click', () => res()));
  }

  /** Pick something from a list of icon tiles (gifts). */
  async pickTile(prompt: string, tiles: { id: string; icon: string; label: string }[]): Promise<string | null> {
    const grid = h('div.icon-grid');
    const res = new Promise<string | null>((r) => {
      for (const tl of tiles) {
        const b = h('button.opt.icon-opt', { type: 'button', style: { flexDirection: 'column', fontSize: '1em', gap: '2px' } },
          h('span', { style: { fontSize: '2.2em' } }, tl.icon), h('span', { style: { fontSize: '0.8em' }, lang: target(), html: tl.label }));
        b.addEventListener('click', () => { audio.tap(); r(tl.id); });
        grid.append(b);
      }
      this.resolveClose = () => r(null);
    });
    this.root.replaceChildren(h('div.prompt-card', null, h('div.prompt', null, prompt)), grid, h('div.row.end', null, button('btn.soft.small', t('close'), () => this.close())));
    return res;
  }

  /** A simple menu of choices in the native language (talk / gift / shop …). */
  async menu(prompt: { p: string; e?: Expr } | null, choices: { id: string; label: string }[]): Promise<string> {
    if (prompt) {
      exposePhrase(prompt.p);
      this.lastSay = { p: prompt.p };
      this.express(prompt.e ?? 'happy');
    }
    const ctx = prompt ? this.contextBubble() : null;
    if (ctx && prompt) {
      const sayEl = ctx.querySelector('.say') as HTMLElement;
      sayEl.innerHTML = phraseTarget(prompt.p);
      void this.type(sayEl, ctx, phraseSyllables(prompt.p)).then(() => { if (S().settings.autoplay) sayPhrase(prompt.p); });
    }
    const grid = h('div.menu-opts');
    const res = new Promise<string>((r) => {
      for (const c of choices) grid.append(button('opt', c.label, () => r(c.id)));
    });
    this.root.replaceChildren(...[ctx, grid].filter(Boolean) as HTMLElement[]);
    const closeP = new Promise<string>((r) => { this.resolveClose = () => r('bye'); });
    return Promise.race([res, closeP]);
  }
}

export { say };
