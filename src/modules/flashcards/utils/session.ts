import type { Flashcard } from '../api/flashcards';

export type SessionState = {
  cards: Flashcard[];
  /** The card being shown; equals `cards.length` once the session is over. */
  index: number;
  flipped: boolean;
  correct: number;
  wrong: number;
};

export type SessionAction = { type: 'flip' } | { type: 'answer'; correct: boolean };

export const startSession = (cards: Flashcard[]): SessionState => ({
  cards,
  index: 0,
  flipped: false,
  correct: 0,
  wrong: 0,
});

export const currentCard = (state: SessionState): Flashcard | null =>
  state.cards[state.index] ?? null;

export const isFinished = (state: SessionState) => state.index >= state.cards.length;

export const sessionReducer = (state: SessionState, action: SessionAction): SessionState => {
  if (isFinished(state)) return state;

  switch (action.type) {
    case 'flip':
      return { ...state, flipped: !state.flipped };
    case 'answer':
      // The student answers only after seeing the back (US-009).
      if (!state.flipped) return state;
      return {
        ...state,
        index: state.index + 1,
        flipped: false,
        correct: state.correct + (action.correct ? 1 : 0),
        wrong: state.wrong + (action.correct ? 0 : 1),
      };
  }
};
