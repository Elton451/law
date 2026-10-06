import { describe, expect, it } from 'vitest';
import { progressPercent } from './progress';

describe('progressPercent', () => {
  it.each([
    [0, 0, 0],
    [0, 10, 0],
    [1, 3, 33],
    [2, 3, 67],
    [10, 10, 100],
    [12, 10, 100],
  ])('%i of %i lessons → %i%', (completed, total, expected) => {
    expect(progressPercent(completed, total)).toBe(expected);
  });
});
