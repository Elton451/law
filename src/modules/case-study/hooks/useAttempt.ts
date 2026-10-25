import { useCallback } from 'react';
import { useAsync } from '@shared/hooks/useAsync';
import { fetchAttempt } from '../api/caseStudy';

export const useAttempt = (attemptId: string) => {
  const load = useCallback(() => fetchAttempt(attemptId), [attemptId]);
  return useAsync(load);
};
