import type { SrsCard } from '../core/save';

/**
 * A gentle SM-2 variant. Early steps are in minutes so a single play session
 * can see a word come back; later intervals grow in days.
 */
const MIN = 60_000, DAY = 86_400_000;

export const newCard = (now = Date.now()): SrsCard =>
  ({ reps: 0, ease: 2.3, ivl: 0, due: now, seen: 0, right: 0, wrong: 0, first: now, last: now });

export function grade(c: SrsCard, correct: boolean, assisted = false, now = Date.now()): SrsCard {
  const n = { ...c, last: now };
  if (correct && !assisted) {
    n.right++;
    if (n.reps === 0) n.ivl = 10 * MIN;
    else if (n.reps === 1) n.ivl = DAY;
    else if (n.reps === 2) n.ivl = 3 * DAY;
    else n.ivl = Math.round(n.ivl * n.ease);
    n.reps++;
    n.ease = Math.min(2.8, n.ease + 0.05);
  } else {
    if (!correct) n.wrong++;
    n.reps = Math.max(0, n.reps - (correct ? 0 : 2));
    n.ivl = 5 * MIN;
    n.ease = Math.max(1.3, n.ease - (correct ? 0.05 : 0.2));
  }
  n.due = now + n.ivl;
  return n;
}

export const isDue = (c: SrsCard, now = Date.now()) => c.due <= now;

/** 0 new · 1 seen · 2 learning · 3 familiar · 4 strong · 5 mastered */
export function mastery(c?: SrsCard): number {
  if (!c) return 0;
  if (c.reps === 0) return 1;
  if (c.ivl < DAY) return 2;
  if (c.ivl < 4 * DAY) return 3;
  if (c.ivl < 14 * DAY) return 4;
  return 5;
}
