import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAsync } from '@shared/hooks/useAsync';
import { paths } from '@shared/routes';
import { fetchAttempt, fetchTrail, restartAttempt, saveDraft, startAttempt } from './api';
import { createAutosaver, type Autosaver, type AutosaveStatus } from './autosave';
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

export type { AutosaveStatus };

const AUTOSAVE_DELAY_MS = 1500;
const AUTOSAVE_RETRY_DELAYS_MS = [2000, 5000, 15000, 30000];

/** Saves the draft shortly after the student stops typing, retrying on failure (US-017). */
export const useDraftAutosave = (attemptId: string, values: AttemptAnswers) => {
  const [status, setStatus] = useState<AutosaveStatus>('idle');
  const autosaver = useRef<Autosaver<AttemptAnswers> | null>(null);
  const serialized = JSON.stringify(values);
  const lastScheduled = useRef(serialized);

  useEffect(() => {
    const saver = createAutosaver(
      (answers: AttemptAnswers) => saveDraft(attemptId, answers),
      setStatus,
      { delayMs: AUTOSAVE_DELAY_MS, retryDelaysMs: AUTOSAVE_RETRY_DELAYS_MS },
    );
    autosaver.current = saver;
    return () => saver.dispose();
  }, [attemptId]);

  useEffect(() => {
    if (serialized === lastScheduled.current) return;
    lastScheduled.current = serialized;

    // Invalid input (e.g. too long) stays local; the form already shows the error.
    const parsed = attemptAnswersSchema.safeParse(JSON.parse(serialized));
    if (parsed.success) autosaver.current?.schedule(parsed.data);
  }, [serialized]);

  return status;
};
