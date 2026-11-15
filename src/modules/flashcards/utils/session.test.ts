import { describe, expect, it } from 'vitest';
import { currentCard, isFinished, sessionReducer, startSession } from './session';

const cards = [
  { id: 'c1', front: 'F1', back: 'V1' },
  { id: 'c2', front: 'F2', back: 'V2' },
];

describe('sessionReducer', () => {
  it('flips the card back and forth', () => {
    const flipped = sessionReducer(startSession(cards), { type: 'flip' });
    expect(flipped.flipped).toBe(true);
    expect(sessionReducer(flipped, { type: 'flip' }).flipped).toBe(false);
  });

  it('ignores answers before the card is flipped', () => {
    const state = startSession(cards);
    expect(sessionReducer(state, { type: 'answer', correct: true })).toBe(state);
  });

  it('counts the answer and moves to the next card, face down', () => {
    const flipped = sessionReducer(startSession(cards), { type: 'flip' });
    const next = sessionReducer(flipped, { type: 'answer', correct: false });

    expect(next).toMatchObject({ index: 1, flipped: false, correct: 0, wrong: 1 });
    expect(currentCard(next)?.id).toBe('c2');
  });

  it('finishes after the last card', () => {
    let state = startSession(cards);
    for (const correct of [true, true]) {
      state = sessionReducer(state, { type: 'flip' });
      state = sessionReducer(state, { type: 'answer', correct });
    }

    expect(isFinished(state)).toBe(true);
    expect(currentCard(state)).toBeNull();
    expect(state).toMatchObject({ correct: 2, wrong: 0 });
    expect(sessionReducer(state, { type: 'flip' })).toBe(state);
  });
});
