import { useCallback, useReducer, useState } from 'react';
import { reviewFlashcard, type Flashcard } from '../api/flashcards';
import { currentCard, isFinished, sessionReducer, startSession } from '../utils/session';

type SaveState = 'idle' | 'saving' | 'error';

/**
 * A front/back session over `cards` (US-009). Each answer is saved before moving
 * on, so it feeds the spaced repetition even if the student leaves halfway (US-010).
 */
export const useStudySession = (cards: Flashcard[]) => {
  const [state, dispatch] = useReducer(sessionReducer, cards, startSession);
  const [saveState, setSaveState] = useState<SaveState>('idle');
  const card = currentCard(state);

  const flip = useCallback(() => dispatch({ type: 'flip' }), []);

  const answer = useCallback(
    async (correct: boolean) => {
      if (!card || saveState === 'saving') return;
      setSaveState('saving');
      try {
        await reviewFlashcard(card.id, correct);
        dispatch({ type: 'answer', correct });
        setSaveState('idle');
      } catch {
        setSaveState('error');
      }
    },
    [card, saveState],
  );

  return {
    card,
    flipped: state.flipped,
    position: state.index + 1,
    total: state.cards.length,
    correct: state.correct,
    wrong: state.wrong,
    finished: isFinished(state),
    saveState,
    flip,
    answer,
  };
};
