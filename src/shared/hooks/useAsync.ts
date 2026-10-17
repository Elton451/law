import { useCallback, useEffect, useState } from 'react';

export type AsyncState<T> =
  { status: 'loading' } | { status: 'error'; error: unknown } | { status: 'success'; data: T };

type Settled<T> = { load: () => Promise<T>; run: number; state: AsyncState<T> };

/**
 * Runs `load` and tracks its result. Pass a stable function (module-level, or
 * wrapped in useCallback): a new `load` starts a new request, and the previous
 * result is never shown for it. `reload` runs it again.
 */
export const useAsync = <T>(load: () => Promise<T>) => {
  const [run, setRun] = useState(0);
  const [settled, setSettled] = useState<Settled<T> | null>(null);

  useEffect(() => {
    let cancelled = false;
    const settle = (state: AsyncState<T>) => !cancelled && setSettled({ load, run, state });

    load().then(
      (data) => settle({ status: 'success', data }),
      (error: unknown) => settle({ status: 'error', error }),
    );

    return () => {
      cancelled = true;
    };
  }, [load, run]);

  const reload = useCallback(() => setRun((current) => current + 1), []);

  const isCurrent = settled?.load === load && settled.run === run;
  const state: AsyncState<T> = isCurrent ? settled.state : { status: 'loading' };

  return { ...state, reload };
};
