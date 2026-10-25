import { useCallback } from 'react';
import { useAsync } from '@shared/hooks/useAsync';
import { fetchCase } from '../api/cases';

export const useCase = (caseId: string) => {
  const load = useCallback(() => fetchCase(caseId), [caseId]);
  return useAsync(load);
};
