import { describe, expect, it } from 'vitest';
import { describeDevice, formatDateTime } from './device';

describe('describeDevice', () => {
  it.each([
    [
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36',
      'Chrome no Windows',
    ],
    [
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36 Edg/130.0',
      'Edge no Windows',
    ],
    [
      'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1',
      'Safari no iOS',
    ],
    ['Mozilla/5.0 (X11; Linux x86_64; rv:132.0) Gecko/20100101 Firefox/132.0', 'Firefox no Linux'],
    [null, 'Dispositivo desconhecido'],
  ])('describes %s', (userAgent, expected) => {
    expect(describeDevice(userAgent)).toBe(expected);
  });
});

describe('formatDateTime', () => {
  it('shows São Paulo time', () => {
    expect(formatDateTime('2026-11-15T15:30:00Z')).toBe('15/11/2026, 12:30');
  });
});
