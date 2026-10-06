/** Whole-number percentage of lessons completed; a trail with no lessons yet is at 0%. */
export const progressPercent = (completed: number, total: number) => {
  if (total <= 0) return 0;
  return Math.min(100, Math.round((completed / total) * 100));
};
