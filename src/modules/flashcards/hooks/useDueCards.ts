import { useCallback } from 'react';
import { useAsync } from '@shared/hooks/useAsync';
import { fetchDueCards } from '../api/flashcards';
import { REVIEW_SESSION_LIMIT } from '../constants/review';

/** Today's review session: the student's due cards in the trail, or in every trail when null. */
export const useDueCards = (trailId: string | null) => {
  const load = useCallback(() => fetchDueCards(trailId, REVIEW_SESSION_LIMIT), [trailId]);
  return useAsync(load);
};
