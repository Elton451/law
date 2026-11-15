import { useCallback } from 'react';
import { useAsync } from '@shared/hooks/useAsync';
import { fetchTrail } from '../api/flashcards';

export const useTrail = (slug: string) => {
  const load = useCallback(() => fetchTrail(slug), [slug]);
  return useAsync(load);
};
