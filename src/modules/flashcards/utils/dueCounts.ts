import type { TrailDueCount } from '../api/flashcards';

export const totalDue = (counts: TrailDueCount[]) =>
  counts.reduce((total, trail) => total + trail.dueCount, 0);
