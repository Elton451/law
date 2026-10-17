import { z } from 'zod';
import { supabase } from '@shared/lib/supabase';
import type { AttemptAnswers } from './schemas';

const trailSchema = z.object({ id: z.string(), slug: z.string(), name: z.string() });
export type Trail = z.infer<typeof trailSchema>;

const answerKeySchema = z.object({
  piece: z.string(),
  addressing: z.string(),
  qualification: z.string(),
  grounds: z.string(),
  requests: z.string(),
  closing: z.string(),
});
export type AnswerKey = z.infer<typeof answerKeySchema>;

const attemptRowSchema = z.object({
  id: z.string(),
  time_limit_minutes: z.number().int(),
  started_at: z.string(),
  submitted_at: z.string().nullable(),
  identified_piece: z.string(),
  addressing: z.string(),
  qualification: z.string(),
  grounds: z.string(),
  requests: z.string(),
  closing: z.string(),
  case_study: z.object({
    id: z.string(),
    trail_id: z.string(),
    title: z.string(),
    statement: z.string(),
    origin: z.enum(['oab', 'autoral']),
    exam_edition: z.string().nullable(),
    // Null until the attempt is submitted: RLS hides the answer key before that.
    answer_key: answerKeySchema.nullable(),
  }),
});

export type CaseStudy = {
  id: string;
  trailId: string;
  title: string;
  statement: string;
  origin: 'oab' | 'autoral';
  examEdition: string | null;
};

export type Attempt = {
  id: string;
  caseStudy: CaseStudy;
  answerKey: AnswerKey | null;
  timeLimitMinutes: number;
  startedAt: Date;
  submittedAt: Date | null;
  answers: AttemptAnswers;
};

export type SubmittedAttempt = Attempt & { submittedAt: Date };

export const isSubmitted = (attempt: Attempt): attempt is SubmittedAttempt =>
  attempt.submittedAt !== null;

const ATTEMPT_COLUMNS = `
  id, time_limit_minutes, started_at, submitted_at,
  identified_piece, addressing, qualification, grounds, requests, closing,
  case_study:case_studies (
    id, trail_id, title, statement, origin, exam_edition,
    answer_key:case_study_answer_keys (piece, addressing, qualification, grounds, requests, closing)
  )
`;

const toAttempt = (row: z.infer<typeof attemptRowSchema>): Attempt => ({
  id: row.id,
  caseStudy: {
    id: row.case_study.id,
    trailId: row.case_study.trail_id,
    title: row.case_study.title,
    statement: row.case_study.statement,
    origin: row.case_study.origin,
    examEdition: row.case_study.exam_edition,
  },
  answerKey: row.case_study.answer_key,
  timeLimitMinutes: row.time_limit_minutes,
  startedAt: new Date(row.started_at),
  submittedAt: row.submitted_at ? new Date(row.submitted_at) : null,
  answers: {
    identifiedPiece: row.identified_piece,
    addressing: row.addressing,
    qualification: row.qualification,
    grounds: row.grounds,
    requests: row.requests,
    closing: row.closing,
  },
});

const toAnswersPayload = (answers: AttemptAnswers) => ({
  identified_piece: answers.identifiedPiece,
  addressing: answers.addressing,
  qualification: answers.qualification,
  grounds: answers.grounds,
  requests: answers.requests,
  closing: answers.closing,
});

export const fetchTrail = async (slug: string): Promise<Trail | null> => {
  const { data, error } = await supabase
    .from('trails')
    .select('id, slug, name')
    .eq('slug', slug)
    .maybeSingle();
  if (error) throw error;
  return data ? trailSchema.parse(data) : null;
};

export const fetchAttempt = async (attemptId: string): Promise<Attempt | null> => {
  const { data, error } = await supabase
    .from('case_attempts')
    .select(ATTEMPT_COLUMNS)
    .eq('id', attemptId)
    .maybeSingle();
  if (error) throw error;
  return data ? toAttempt(attemptRowSchema.parse(data)) : null;
};

/** Starts (or resumes) an attempt in the trail. Null when the trail has no cases yet. */
export const startAttempt = async (
  trailId: string,
  excludeCaseId?: string,
): Promise<string | null> => {
  const { data, error } = await supabase.rpc('start_case_attempt', {
    p_trail_id: trailId,
    p_exclude_case_id: excludeCaseId ?? null,
  });
  if (error) throw error;
  return z.string().nullable().parse(data);
};

export const saveDraft = async (attemptId: string, answers: AttemptAnswers) => {
  const { error } = await supabase.rpc('save_case_draft', {
    p_attempt_id: attemptId,
    p_answers: toAnswersPayload(answers),
  });
  if (error) throw error;
};

export const submitAttempt = async (attemptId: string, answers: AttemptAnswers) => {
  const { error } = await supabase.rpc('submit_case_attempt', {
    p_attempt_id: attemptId,
    p_answers: toAnswersPayload(answers),
  });
  if (error) throw error;
};

export const discardAttempt = async (attemptId: string) => {
  const { error } = await supabase.rpc('discard_case_attempt', { p_attempt_id: attemptId });
  if (error) throw error;
};
