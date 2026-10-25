import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router';
import { paths } from '@shared/routes';
import { startAttempt } from '../api/caseStudy';

type StartState = 'idle' | 'starting' | 'noCases' | 'error';

/** Starts a training attempt and opens it. `justStarted` tells the page to show the start notice. */
export const useStartAttempt = (trailSlug: string) => {
  const navigate = useNavigate();
  const [state, setState] = useState<StartState>('idle');

  const start = useCallback(
    async (trailId: string, options: { excludeCaseId?: string } = {}) => {
      setState('starting');
      try {
        const attemptId = await startAttempt(trailId, options.excludeCaseId);
        if (!attemptId) {
          setState('noCases');
          return;
        }
        setState('idle');
        navigate(paths.caseAttempt(trailSlug, attemptId), { state: { justStarted: true } });
      } catch {
        setState('error');
      }
    },
    [navigate, trailSlug],
  );

  return { start, state };
};
