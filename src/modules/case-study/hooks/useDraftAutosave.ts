import { useEffect, useRef, useState } from 'react';
import { saveDraft } from '../api/caseStudy';
import { AUTOSAVE_DELAY_MS, AUTOSAVE_RETRY_DELAYS_MS } from '../constants/autosave';
import { attemptAnswersSchema, type AttemptAnswers } from '../schemas/answers';
import { createAutosaver, type Autosaver, type AutosaveStatus } from '../utils/autosave';

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
