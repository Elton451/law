import { useCallback } from 'react';
import { useNavigate } from 'react-router';
import { paths } from '@shared/routes';
import { restartAttempt } from '../api/caseStudy';

/**
 * "Gerar outro teste": swaps the attempt for one at another case and opens it.
 * Rejects when that fails, and the current attempt is then left untouched.
 */
export const useRestartAttempt = (trailSlug: string) => {
  const navigate = useNavigate();

  return useCallback(
    async (attemptId: string) => {
      const nextId = await restartAttempt(attemptId);
      navigate(paths.caseAttempt(trailSlug, nextId), {
        replace: true,
        state: { justStarted: true },
      });
    },
    [navigate, trailSlug],
  );
};
