import { useCallback, useEffect, useState } from 'react';
import { fetchTrails, type Trail } from './api';

type TrailsState =
  { status: 'loading' } | { status: 'error' } | { status: 'success'; trails: Trail[] };

export const useTrails = () => {
  const [state, setState] = useState<TrailsState>({ status: 'loading' });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;

    fetchTrails()
      .then((trails) => !cancelled && setState({ status: 'success', trails }))
      .catch(() => !cancelled && setState({ status: 'error' }));

    return () => {
      cancelled = true;
    };
  }, [attempt]);

  const retry = useCallback(() => {
    setState({ status: 'loading' });
    setAttempt((current) => current + 1);
  }, []);

  return { ...state, retry };
};
