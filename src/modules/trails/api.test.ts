import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fetchTrails } from './api';

const { rpc } = vi.hoisted(() => ({ rpc: vi.fn() }));
vi.mock('@shared/lib/supabase', () => ({ supabase: { rpc } }));

beforeEach(() => vi.clearAllMocks());

describe('fetchTrails', () => {
  it('maps database rows to trails', async () => {
    rpc.mockResolvedValue({
      data: [{ id: '1', slug: 'civil', name: 'Civil', total_lessons: 4, completed_lessons: 1 }],
      error: null,
    });

    expect(await fetchTrails()).toEqual([
      { id: '1', slug: 'civil', name: 'Civil', totalLessons: 4, completedLessons: 1 },
    ]);
    expect(rpc).toHaveBeenCalledWith('get_trails_with_progress');
  });

  it('throws on a database error', async () => {
    rpc.mockResolvedValue({ data: null, error: new Error('boom') });
    await expect(fetchTrails()).rejects.toThrow('boom');
  });

  it('rejects malformed rows', async () => {
    rpc.mockResolvedValue({ data: [{ id: '1', slug: 'civil' }], error: null });
    await expect(fetchTrails()).rejects.toThrow();
  });
});
