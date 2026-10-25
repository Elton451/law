import { useCallback } from 'react';
import { useAsync } from '@shared/hooks/useAsync';
import { fetchCases, type CaseFilters } from '../api/cases';

export const useCases = ({ trailId, origin }: CaseFilters) => {
  const load = useCallback(() => fetchCases({ trailId, origin }), [trailId, origin]);
  return useAsync(load);
};
