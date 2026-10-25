import { z } from 'zod';
import type { CaseOrigin } from '@shared/case-studies/origin';
import { supabase } from '@shared/lib/supabase';
import { caseOriginSchema, type CaseFormValues } from './schemas';

const trailSchema = z.object({ id: z.string(), name: z.string() });
export type Trail = z.infer<typeof trailSchema>;

const caseSummaryRowSchema = z.object({
  id: z.string(),
  trail_id: z.string(),
  trail_name: z.string(),
  title: z.string(),
  origin: caseOriginSchema,
  exam_edition: z.string().nullable(),
  is_active: z.boolean(),
  attempt_count: z.number().int(),
});

export type CaseSummary = {
  id: string;
  trailId: string;
  trailName: string;
  title: string;
  origin: CaseOrigin;
  examEdition: string | null;
  isActive: boolean;
  attemptCount: number;
};

const caseDetailRowSchema = z.object({
  id: z.string(),
  trail_id: z.string(),
  title: z.string(),
  statement: z.string(),
  origin: caseOriginSchema,
  exam_edition: z.string().nullable(),
  is_active: z.boolean(),
  attempt_count: z.number().int(),
  piece: z.string(),
  addressing: z.string(),
  qualification: z.string(),
  grounds: z.string(),
  requests: z.string(),
  closing: z.string(),
});

export type CaseDetail = { id: string; attemptCount: number; values: CaseFormValues };

export type CaseFilters = { trailId?: string; origin?: CaseOrigin };

/** Raised when an action needs a case nobody attempted yet (deleting it, moving its trail). */
export class CaseHasAttemptsError extends Error {
  constructor() {
    super('case has attempts');
    this.name = 'CaseHasAttemptsError';
  }
}

// The admin functions raise `foreign_key_violation` when a case's attempts block the change.
const FOREIGN_KEY_VIOLATION = '23503';

const throwIfFailed = (error: { code?: string } | null) => {
  if (!error) return;
  if (error.code === FOREIGN_KEY_VIOLATION) throw new CaseHasAttemptsError();
  throw error;
};

export const fetchTrails = async (): Promise<Trail[]> => {
  const { data, error } = await supabase.from('trails').select('id, name').order('name');
  if (error) throw error;
  return z.array(trailSchema).parse(data);
};

export const fetchCases = async ({ trailId, origin }: CaseFilters): Promise<CaseSummary[]> => {
  const { data, error } = await supabase.rpc('admin_list_case_studies', {
    p_trail_id: trailId ?? null,
    p_origin: origin ?? null,
  });
  if (error) throw error;
  return z
    .array(caseSummaryRowSchema)
    .parse(data)
    .map((row) => ({
      id: row.id,
      trailId: row.trail_id,
      trailName: row.trail_name,
      title: row.title,
      origin: row.origin,
      examEdition: row.exam_edition,
      isActive: row.is_active,
      attemptCount: row.attempt_count,
    }));
};

/** The case with its answer key, as form values. Null when it doesn't exist. */
export const fetchCase = async (caseId: string): Promise<CaseDetail | null> => {
  const { data, error } = await supabase
    .rpc('admin_get_case_study', { p_case_id: caseId })
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;

  const row = caseDetailRowSchema.parse(data);
  return {
    id: row.id,
    attemptCount: row.attempt_count,
    values: {
      trailId: row.trail_id,
      title: row.title,
      statement: row.statement,
      origin: row.origin,
      examEdition: row.exam_edition ?? '',
      isActive: row.is_active,
      piece: row.piece,
      addressing: row.addressing,
      qualification: row.qualification,
      grounds: row.grounds,
      requests: row.requests,
      closing: row.closing,
    },
  };
};

/** Creates the case (`caseId` null) or updates it, with its answer key. Returns its id. */
export const saveCase = async (caseId: string | null, values: CaseFormValues): Promise<string> => {
  const { data, error } = await supabase.rpc('admin_save_case_study', {
    p_case_id: caseId,
    p_case: {
      trail_id: values.trailId,
      title: values.title,
      statement: values.statement,
      origin: values.origin,
      exam_edition: values.origin === 'oab' ? values.examEdition : null,
      is_active: values.isActive,
      piece: values.piece,
      addressing: values.addressing,
      qualification: values.qualification,
      grounds: values.grounds,
      requests: values.requests,
      closing: values.closing,
    },
  });
  throwIfFailed(error);
  return z.string().parse(data);
};

export const setCaseActive = async (caseId: string, active: boolean) => {
  const { error } = await supabase.rpc('admin_set_case_study_active', {
    p_case_id: caseId,
    p_active: active,
  });
  throwIfFailed(error);
};

/** Rejects with CaseHasAttemptsError when students attempted it: deactivate it instead. */
export const deleteCase = async (caseId: string) => {
  const { error } = await supabase.rpc('admin_delete_case_study', { p_case_id: caseId });
  throwIfFailed(error);
};
