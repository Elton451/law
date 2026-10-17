import { describe, expect, it, vi } from 'vitest';
import { act, renderHook, waitFor } from '@shared/test/test-utils';
import { useAsync } from './useAsync';

describe('useAsync', () => {
  it('loads data', async () => {
    const load = vi.fn().mockResolvedValue('data');
    const { result } = renderHook(() => useAsync(load));

    expect(result.current.status).toBe('loading');
    await waitFor(() => expect(result.current).toMatchObject({ status: 'success', data: 'data' }));
  });

  it('reports errors and retries on reload', async () => {
    const load = vi.fn().mockRejectedValueOnce(new Error('offline')).mockResolvedValue('data');
    const { result } = renderHook(() => useAsync(load));

    await waitFor(() => expect(result.current.status).toBe('error'));
    act(() => result.current.reload());
    await waitFor(() => expect(result.current).toMatchObject({ status: 'success', data: 'data' }));
  });

  it('never shows the previous result for a new request', async () => {
    const first = vi.fn().mockResolvedValue('first');
    const second = () => new Promise<string>(() => {});
    const { result, rerender } = renderHook(({ load }) => useAsync(load), {
      initialProps: { load: first as () => Promise<string> },
    });
    await waitFor(() => expect(result.current.status).toBe('success'));

    rerender({ load: second });

    expect(result.current.status).toBe('loading');
  });
});
