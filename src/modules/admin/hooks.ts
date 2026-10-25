import { useCallback, useMemo } from 'react';
import { useLocation, useSearchParams } from 'react-router';
import type { CaseOrigin } from '@shared/case-studies/origin';
import { useAsync } from '@shared/hooks/useAsync';
import { paths } from '@shared/routes';
import { fetchCase, fetchCases, fetchTrails, type CaseFilters } from './api';
import { caseOriginSchema } from './schemas';

export const useTrails = () => useAsync(fetchTrails);

export const useCases = ({ trailId, origin }: CaseFilters) => {
  const load = useCallback(() => fetchCases({ trailId, origin }), [trailId, origin]);
  return useAsync(load);
};

export const useCase = (caseId: string) => {
  const load = useCallback(() => fetchCase(caseId), [caseId]);
  return useAsync(load);
};

const TRAIL_PARAM = 'trilha';
const ORIGIN_PARAM = 'origem';

/** The list filters, kept in the URL so they survive editing a case and coming back. */
export const useCaseFilters = () => {
  const [params, setParams] = useSearchParams();
  const trailParam = params.get(TRAIL_PARAM);
  const originParam = caseOriginSchema.safeParse(params.get(ORIGIN_PARAM));

  const filters = useMemo<CaseFilters>(
    () => ({
      trailId: trailParam ?? undefined,
      origin: originParam.success ? originParam.data : undefined,
    }),
    [trailParam, originParam.success, originParam.data],
  );

  const setFilters = useCallback(
    (next: { trailId?: string; origin?: CaseOrigin }) => {
      const updated = new URLSearchParams();
      if (next.trailId) updated.set(TRAIL_PARAM, next.trailId);
      if (next.origin) updated.set(ORIGIN_PARAM, next.origin);
      setParams(updated, { replace: true });
    },
    [setParams],
  );

  return { filters, setFilters };
};

/** The case list, with the filters it had when the admin left it to open a case. */
export const useListPath = () => {
  const { state } = useLocation();
  const listSearch = (state as { listSearch?: unknown } | null)?.listSearch;
  return `${paths.adminCases}${typeof listSearch === 'string' ? listSearch : ''}`;
};
