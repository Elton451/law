import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fetchAttempt, saveDraft, startAttempt } from './api';
import { emptyAnswers } from './schemas';

const { rpc, from, maybeSingle } = vi.hoisted(() => {
  const maybeSingle = vi.fn();
  const query = { select: () => query, eq: () => query, maybeSingle };
  return { rpc: vi.fn(), from: vi.fn(() => query), maybeSingle };
});
vi.mock('@shared/lib/supabase', () => ({ supabase: { rpc, from } }));

beforeEach(() => vi.clearAllMocks());

const row = {
  id: 'attempt-1',
  time_limit_minutes: 60,
  started_at: '2026-10-06T12:00:00Z',
  submitted_at: null,
  identified_piece: 'Apelação',
  addressing: 'Excelentíssimo…',
  qualification: '',
  grounds: '',
  requests: '',
  closing: '',
  case_study: {
    id: 'case-1',
    trail_id: 'trail-1',
    title: 'Caso',
    statement: 'Enunciado',
    origin: 'oab',
    exam_edition: 'XXXV Exame',
    answer_key: null,
  },
};

describe('fetchAttempt', () => {
  it('maps the row, keeping the answer key hidden before submission', async () => {
    maybeSingle.mockResolvedValue({ data: row, error: null });

    const attempt = await fetchAttempt('attempt-1');

    expect(from).toHaveBeenCalledWith('case_attempts');
    expect(attempt).toMatchObject({
      id: 'attempt-1',
      caseStudy: { trailId: 'trail-1', origin: 'oab', examEdition: 'XXXV Exame' },
      answerKey: null,
      startedAt: new Date('2026-10-06T12:00:00Z'),
      submittedAt: null,
      answers: { identifiedPiece: 'Apelação', addressing: 'Excelentíssimo…' },
    });
  });

  it('returns null for an attempt that does not exist (or is not yours)', async () => {
    maybeSingle.mockResolvedValue({ data: null, error: null });
    expect(await fetchAttempt('nope')).toBeNull();
  });
});

describe('startAttempt', () => {
  it('passes the trail and the case to skip', async () => {
    rpc.mockResolvedValue({ data: 'attempt-2', error: null });

    expect(await startAttempt('trail-1', 'case-1')).toBe('attempt-2');
    expect(rpc).toHaveBeenCalledWith('start_case_attempt', {
      p_trail_id: 'trail-1',
      p_exclude_case_id: 'case-1',
    });
  });

  it('returns null when the trail has no cases', async () => {
    rpc.mockResolvedValue({ data: null, error: null });
    expect(await startAttempt('trail-1')).toBeNull();
  });
});

describe('saveDraft', () => {
  it('sends the answers with database column names', async () => {
    rpc.mockResolvedValue({ error: null });

    await saveDraft('attempt-1', { ...emptyAnswers, identifiedPiece: 'Apelação' });

    expect(rpc).toHaveBeenCalledWith('save_case_draft', {
      p_attempt_id: 'attempt-1',
      p_answers: {
        identified_piece: 'Apelação',
        addressing: '',
        qualification: '',
        grounds: '',
        requests: '',
        closing: '',
      },
    });
  });
});
