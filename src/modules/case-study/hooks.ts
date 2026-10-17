import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAsync } from '@shared/hooks/useAsync';
import { paths } from '@shared/routes';
import { fetchAttempt, fetchTrail, saveDraft, startAttempt } from './api';
import { attemptAnswersSchema, type AttemptAnswers } from './schemas';
import { countdown } from './timer';

export const useTrail = (slug: string) => {
  const load = useCallback(() => fetchTrail(slug), [slug]);
  return useAsync(load);
};

export const useAttempt = (attemptId: string) => {
  const load = useCallback(() => fetchAttempt(attemptId), [attemptId]);
  return useAsync(load);
};

/** The current time, refreshed every `intervalMs`. */
const useNow = (intervalMs = 1000) => {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), intervalMs);
    return () => clearInterval(timer);
  }, [intervalMs]);

  return now;
};

export const useCountdown = (startedAt: Date, timeLimitMinutes: number) =>
  countdown(startedAt, timeLimitMinutes, useNow());

type StartState = 'idle' | 'starting' | 'noCases' | 'error';

/** Starts a training attempt and opens it. `justStarted` tells the page to show the start notice. */
export const useStartAttempt = (trailSlug: string) => {
  const navigate = useNavigate();
  const [state, setState] = useState<StartState>('idle');

  const start = useCallback(
    async (trailId: string, options: { excludeCaseId?: string; replace?: boolean } = {}) => {
      setState('starting');
      try {
        const attemptId = await startAttempt(trailId, options.excludeCaseId);
        if (!attemptId) {
          setState('noCases');
          return;
        }
        setState('idle');
        navigate(paths.caseAttempt(trailSlug, attemptId), {
          replace: options.replace,
          state: { justStarted: true },
        });
      } catch {
        setState('error');
      }
    },
    [navigate, trailSlug],
  );

  return { start, state };
};

export type AutosaveStatus = 'idle' | 'saving' | 'saved' | 'error';

const AUTOSAVE_DELAY_MS = 1500;

/** Saves the draft shortly after the student stops typing (US-017). */
export const useDraftAutosave = (attemptId: string, values: AttemptAnswers) => {
  const [status, setStatus] = useState<AutosaveStatus>('idle');
  const serialized = JSON.stringify(values);
  const lastSaved = useRef(serialized);

  useEffect(() => {
    if (serialized === lastSaved.current) return;

    const timer = setTimeout(async () => {
      // Invalid input (e.g. too long) stays local; the form already shows the error.
      const parsed = attemptAnswersSchema.safeParse(JSON.parse(serialized));
      if (!parsed.success) return;

      setStatus('saving');
      try {
        await saveDraft(attemptId, parsed.data);
        lastSaved.current = serialized;
        setStatus('saved');
      } catch {
        setStatus('error');
      }
    }, AUTOSAVE_DELAY_MS);

    return () => clearTimeout(timer);
  }, [attemptId, serialized]);

  return status;
};
