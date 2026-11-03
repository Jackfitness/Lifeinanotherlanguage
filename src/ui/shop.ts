import { ITEMS, type ItemDef } from '../content/items';
import { lex } from '../content/lexicon';
import { S } from '../core/save';
import { t } from '../core/i18n';
import { count, playerLevel } from '../core/progress';
import { expose, lexNative, lexTarget, masteryOf, sayLex, target } from '../learning/engine';
import { audio } from '../audio/audio';
import { button, h, sheet } from './dom';

/** Shop browser. Names are shown for unfamiliar items (exposure) and hidden once familiar (recall). */
export function openShop(kind: 'cafe' | 'store', onBuy: (it: ItemDef) => void) {
  const items = ITEMS.filter((i) => i.shop === kind);
  const body = h('div');
  const s = sheet(t(kind === 'cafe' ? 'shop_cafe' : 'shop_store'), body);
  let sel: ItemDef | null = null;
  const lvl = playerLevel();
  const render = () => {
    const top = h('div.card', { style: { minHeight: '120px' } });
    if (sel) {
      const it = sel;
      const known = masteryOf('lex', it.lex) >= 3;
      const nameEl = known ? h('div.muted', { style: { fontWeight: 700 } }, '🤫 ' + t('recallHint'))
        : h('div', null, h('b', { lang: target(), style: { fontSize: '1.3em' }, html: lexTarget(it.lex) }), h('div.muted', { html: lexNative(it.lex) }));
      if (!known) expose('lex', it.lex);
      const affordable = S().player.coins >= (it.price ?? 0);
      top.append(h('div.row', null,
        h('div.big-icon', { style: { fontSize: '3.2em' } }, lex(it.lex).icon),
        h('div', { style: { flex: 1 } }, nameEl,
          h('div.muted', { style: { fontSize: '0.85em', marginTop: '4px' } }, `🪙 ${it.price} · ${t('owned', { n: count(it.id) })}`)),
        known ? null : button('icon-btn', '🔊', () => sayLex(it.lex))),
        h('div.row.end', { style: { marginTop: '10px' } },
          button('btn.primary', (affordable ? '🛍️ ' : '') + (affordable ? t('buy') : t('coinsShort')), () => { if (!affordable) return; s.close(); onBuy(it); }, affordable ? {} : { disabled: true })));
    } else {
      top.append(h('div', { style: { textAlign: 'center', padding: '18px 0', fontWeight: 700 }, class: 'muted' }, kind === 'cafe' ? '🧁 ☕ 🍰' : '🪑 💡 👒'));
    }
    const grid = h('div.grid');
    for (const it of items) {
      const locked = (it.minLevel ?? 1) > lvl;
      const known = masteryOf('lex', it.lex) >= 3;
      const el = h('div.slot' + (locked ? '.locked' : '') + (sel === it ? '.sel' : ''), { role: 'button', tabindex: '0' },
        count(it.id) ? h('span.cnt', null, '×' + count(it.id)) : null,
        h('span.si', null, lex(it.lex).icon),
        locked ? h('span', null, '🔒 ' + t('needLevel', { n: it.minLevel ?? 1 })) : h('span', { lang: target(), html: known ? '？' : lexTarget(it.lex) }),
        locked ? null : h('div.price', null, '🪙' + it.price));
      if (!locked) el.addEventListener('click', () => { audio.tap(); sel = it; if (!known) sayLex(it.lex); render(); });
      grid.append(el);
    }
    body.replaceChildren(top, grid);
  };
  render();
  return s;
}
