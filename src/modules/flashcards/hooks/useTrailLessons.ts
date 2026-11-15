import { useCallback } from 'react';
import { useAsync } from '@shared/hooks/useAsync';
import { fetchTrailLessons } from '../api/flashcards';

export const useTrailLessons = (trailId: string) => {
  const load = useCallback(() => fetchTrailLessons(trailId), [trailId]);
  return useAsync(load);
};
