import { describe, expect, it } from 'vitest';
import { cardsLabel } from './cardsLabel';
import { lessonStatus } from './lessonStatus';

describe('lessonStatus', () => {
  it('follows how many of the cards were answered', () => {
    expect(lessonStatus(0, 5)).toBe('new');
    expect(lessonStatus(2, 5)).toBe('inProgress');
    expect(lessonStatus(5, 5)).toBe('studied');
  });
});

describe('cardsLabel', () => {
  it('pluralizes', () => {
    expect(cardsLabel(0)).toBe('0 cards');
    expect(cardsLabel(1)).toBe('1 card');
    expect(cardsLabel(12)).toBe('12 cards');
  });
});
