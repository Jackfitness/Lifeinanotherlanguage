import { pick, t } from '../core/i18n';
import { belt, dojoTown, lessonsDone, masteredIn, townMastery, townState, unitTitle, unlockedUnits, vocabCount, type SessionKind } from '../learning/dojo';
import { button, h, sheet } from './dom';
import { icon } from './icons';

export interface DojoHost {
  portrait: (id: string) => string;
  run: (kind: SessionKind, unit?: number) => void;
  examOpen: () => boolean;
}

/** The dojo: lessons per chapter, focused practice, and the Clover Exam. */
export function openDojo(host: DojoHost, onClose?: () => void) {
  const body = h('div.dojo');
  const s = sheet(t('dojo'), body, { onClose });
  s.el.classList.add('dojo-sheet');
  const go = (kind: SessionKind, unit?: number) => { s.close(); setTimeout(() => host.run(kind, unit), 280); };
  const b = belt(), ts = townState(), unlocked = unlockedUnits();
  const pct = Math.round(townMastery() * 100);

  body.append(h('div.dojo-head', null,
    h('div.avatar', { style: { background: '#E4F2DD' } }, h('img', { src: host.portrait(dojoTown().sensei), alt: '', style: { width: '100%', height: '100%', objectFit: 'cover', borderRadius: '22px' } })),
    h('div', { style: { flex: '1' } },
      h('b', { style: { fontSize: '1.1em' } }, pick(dojoTown().npcs.find((n) => n.id === dojoTown().sensei)!.name, 'ja').replace(/\{([^|}]+)\|[^}]+\}/g, '$1')),
      h('div.belt-row', null, h('span.belt', { style: { background: b.color } }), pick(b.name)),
      h('div.mastery', null, h('div.m-bar', null, h('i', { style: { width: pct + '%' } })), h('span', null, t('dojoMastery', { n: pct }))))));

  // Lessons
  body.append(h('div.section-title', null, h('span', null, t('dojoLessons')), h('span', null, `${lessonsDone()}/${dojoTown().units}`)));
  const list = h('div.lesson-list');
  for (let u = 1; u <= dojoTown().units; u++) {
    const best = ts.lessons['lesson_' + u];
    const locked = u > unlocked;
    const row = button('lesson-row' + (locked ? '.locked' : '') + (best !== undefined && best >= 60 ? '.done' : ''), [
      h('span.lr-num', null, String(u)),
      h('div.lr-text', null, h('b', null, unitTitle(u)), h('span', null, locked ? t('dojoLocked') : `${masteredIn(u)}/${vocabCount(u)} ${t('dojoWords')}`)),
      h('span.lr-status', { html: locked ? icon('lock') : best !== undefined ? `<b>${best}%</b>` : `<span class="new-pill">${t('dojoNew')}</span>` }),
    ], () => { if (!locked) go('lesson', u); });
    list.append(row);
  }
  body.append(list);

  // Practice
  body.append(h('div.section-title', null, t('dojoPractice')));
  const modes: [SessionKind, string, string][] = [
    ['daily', 'sparkle', t('dojoDaily')], ['vocab', 'book', t('dojoVocab')], ['kanji', 'kana', t('dojoKanji')],
    ['grammar', 'pencil', t('dojoGrammar')], ['listening', 'speaker', t('dojoListening')], dojoTown().script ? ['writing', 'brush', t('dojoWriting')] : ['reading', 'scroll', t('dojoReading')],
  ];
  body.append(h('div.practice-grid', null, ...modes.map(([k, ic, label]) => button('practice-tile', [h('span', { html: icon(ic) }), label], () => go(k)))));

  // Exam
  const open = host.examOpen();
  body.append(h('div.section-title', null, t('dojoExam')));
  body.append(h('div.exam-card' + (open ? '' : '.locked'), null,
    h('div.ec-icon', { html: icon(ts.examPassed ? 'medal' : 'bell') }),
    h('div', { style: { flex: '1' } }, h('b', null, pick(dojoTown().examTitle)),
      h('span', null, open ? t('examDesc', { n: dojoTown().words.length, p: dojoTown().passMark ?? 80 }) : t('examLockedDesc')),
      dojoTown().script && !ts.examPassed ? h('span.ec-best', null, t('examSkip')) : null,
      ts.examBest ? h('span.ec-best', null, t('examBest', { n: ts.examBest })) : null),
    button('btn.primary.small', open ? t('examStart') : '🔒', () => { if (open) go('exam'); }, open ? {} : { disabled: true })));
  return s;
}
