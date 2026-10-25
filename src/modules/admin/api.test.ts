import { beforeEach, describe, expect, it, vi } from 'vitest';
import { CaseHasAttemptsError, deleteCase, fetchCase, fetchCases, saveCase } from './api';
import { emptyCaseForm } from './schemas';

const { rpc, maybeSingle } = vi.hoisted(() => {
  const maybeSingle = vi.fn();
  return { rpc: vi.fn(() => ({ maybeSingle })), maybeSingle };
});
vi.mock('@shared/lib/supabase', () => ({ supabase: { rpc } }));

beforeEach(() => vi.clearAllMocks());

describe('fetchCases', () => {
  it('passes the filters and maps the rows', async () => {
    rpc.mockResolvedValueOnce({
      data: [
        {
          id: 'case-1',
          trail_id: 'trail-civil',
          trail_name: 'Civil',
          title: 'Caso',
          origin: 'oab',
          exam_edition: 'XXXV Exame',
          is_active: true,
          created_at: '2026-10-25T12:00:00Z',
          attempt_count: 2,
        },
      ],
      error: null,
    } as never);

    const cases = await fetchCases({ origin: 'oab' });

    expect(rpc).toHaveBeenCalledWith('admin_list_case_studies', {
      p_trail_id: null,
      p_origin: 'oab',
    });
    expect(cases).toEqual([
      {
        id: 'case-1',
        trailId: 'trail-civil',
        trailName: 'Civil',
        title: 'Caso',
        origin: 'oab',
        examEdition: 'XXXV Exame',
        isActive: true,
        attemptCount: 2,
      },
    ]);
  });
});

describe('fetchCase', () => {
  it('returns form values, with an empty exam edition for authored cases', async () => {
    maybeSingle.mockResolvedValue({
      data: {
        id: 'case-1',
        trail_id: 'trail-civil',
        title: 'Caso',
        statement: 'Enunciado',
        origin: 'autoral',
        exam_edition: null,
        is_active: false,
        attempt_count: 0,
        piece: 'Apelação',
        addressing: 'E',
        qualification: 'Q',
        grounds: 'F',
        requests: 'P',
        closing: 'C',
      },
      error: null,
    });

    expect(await fetchCase('case-1')).toEqual({
      id: 'case-1',
      attemptCount: 0,
      values: {
        trailId: 'trail-civil',
        title: 'Caso',
        statement: 'Enunciado',
        origin: 'autoral',
        examEdition: '',
        isActive: false,
        piece: 'Apelação',
        addressing: 'E',
        qualification: 'Q',
        grounds: 'F',
        requests: 'P',
        closing: 'C',
      },
    });
  });

  it('returns null for an unknown case', async () => {
    maybeSingle.mockResolvedValue({ data: null, error: null });
    expect(await fetchCase('missing')).toBeNull();
  });
});

describe('saveCase', () => {
  it('drops the exam edition of authored cases', async () => {
    rpc.mockResolvedValueOnce({ data: 'case-1', error: null } as never);

    await saveCase(null, { ...emptyCaseForm, origin: 'autoral', examEdition: 'XXXV Exame' });

    expect(rpc).toHaveBeenCalledWith(
      'admin_save_case_study',
      expect.objectContaining({
        p_case_id: null,
        p_case: expect.objectContaining({ origin: 'autoral', exam_edition: null }),
      }),
    );
  });
});

describe('deleteCase', () => {
  it('tells apart a case that has attempts', async () => {
    rpc.mockResolvedValueOnce({ error: { code: '23503', message: 'case has attempts' } } as never);
    await expect(deleteCase('case-1')).rejects.toBeInstanceOf(CaseHasAttemptsError);

    const failure = { code: '42501', message: 'admin only' };
    rpc.mockResolvedValueOnce({ error: failure } as never);
    await expect(deleteCase('case-1')).rejects.toBe(failure);
  });
});
