import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router';
import type { CaseOrigin } from '@shared/case-studies/origin';
import type { CaseFilters } from '../api/cases';
import { ORIGIN_PARAM, TRAIL_PARAM } from '../constants/filters';
import { caseOriginSchema } from '../schemas/caseForm';

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
