export type AutosaveStatus = 'idle' | 'saving' | 'saved' | 'error';

export type Autosaver<T> = {
  /** Queues `value` to be saved once the student pauses; replaces any older queued value. */
  schedule: (value: T) => void;
  /** Stops the timers and saves whatever is still queued, without reporting back. */
  dispose: () => void;
};

type AutosaverOptions = {
  delayMs: number;
  /** Waits before each retry after a failure; the last one repeats. */
  retryDelaysMs: readonly number[];
};

/**
 * Debounced saving with at most one save in flight, so saves land in order and
 * an older value never overwrites a newer one. A failed save is retried on its
 * own until it succeeds or a newer value replaces it.
 */
export const createAutosaver = <T>(
  save: (value: T) => Promise<void>,
  onStatus: (status: AutosaveStatus) => void,
  { delayMs, retryDelaysMs }: AutosaverOptions,
): Autosaver<T> => {
  let queued: { value: T } | null = null;
  let inFlight: Promise<void> | null = null;
  let failures = 0;
  let timer: ReturnType<typeof setTimeout> | undefined;
  let disposed = false;

  const flushIn = (ms: number) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      timer = undefined;
      void flush();
    }, ms);
  };

  const flush = async () => {
    // A save in flight picks up the queued value when it finishes.
    if (inFlight || !queued) return;
    const { value } = queued;
    queued = null;
    onStatus('saving');

    try {
      inFlight = save(value);
      await inFlight;
      failures = 0;
      if (disposed) return;
      onStatus('saved');
    } catch {
      if (disposed) return;
      queued ??= { value };
      failures += 1;
      onStatus('error');
      flushIn(retryDelaysMs[Math.min(failures, retryDelaysMs.length) - 1]);
      return;
    } finally {
      inFlight = null;
    }

    // Typed while saving and the pause already passed: save the newer value now.
    if (queued && !timer) void flush();
  };

  return {
    schedule: (value) => {
      queued = { value };
      flushIn(delayMs);
    },
    dispose: () => {
      disposed = true;
      clearTimeout(timer);
      if (!queued) return;
      const { value } = queued;
      const saveLast = () => save(value).catch(() => {});
      // Still in order: wait for the save in flight, if any.
      if (inFlight) void inFlight.catch(() => {}).then(saveLast);
      else void saveLast();
    },
  };
};
