import { describe, expect, it } from 'vitest';
import { attemptDuration, countdown, formatDuration, formatTimeLimit } from './timer';

const start = new Date('2026-10-06T12:00:00Z');
const at = (seconds: number) => new Date(start.getTime() + seconds * 1000);

describe('formatDuration', () => {
  it.each([
    [0, '00:00'],
    [59, '00:59'],
    [754, '12:34'],
    [3600, '1:00:00'],
    [3754, '1:02:34'],
  ])('%i s → %s', (seconds, expected) => expect(formatDuration(seconds)).toBe(expected));
});

describe('formatTimeLimit', () => {
  it.each([
    [30, '30 min'],
    [60, '1h'],
    [75, '1h15'],
    [90, '1h30'],
  ])('%i min → %s', (minutes, expected) => expect(formatTimeLimit(minutes)).toBe(expected));
});

describe('countdown', () => {
  it('counts down while there is time left', () => {
    expect(countdown(start, 60, at(0))).toEqual({ overtime: false, label: '1:00:00' });
    expect(countdown(start, 60, at(3599))).toEqual({ overtime: false, label: '00:01' });
    expect(countdown(start, 60, at(3600))).toEqual({ overtime: false, label: '00:00' });
  });

  it('shows the overtime once the limit passes', () => {
    expect(countdown(start, 60, at(3600 + 332))).toEqual({ overtime: true, label: '+05:32' });
  });
});

describe('attemptDuration', () => {
  it('reports time spent within the limit', () => {
    expect(attemptDuration(start, at(50 * 60), 60)).toEqual({ label: '50:00', withinLimit: true });
  });

  it('reports time spent over the limit', () => {
    expect(attemptDuration(start, at(61 * 60), 60)).toEqual({
      label: '1:01:00',
      withinLimit: false,
    });
  });
});
