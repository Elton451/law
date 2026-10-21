import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, renderHook } from '@shared/test/test-utils';
import { saveDraft } from './api';
import { useDraftAutosave } from './hooks';
import { emptyAnswers, type AttemptAnswers } from './schemas';

vi.mock('./api', () => ({ saveDraft: vi.fn() }));

const draft = (requests: string): AttemptAnswers => ({ ...emptyAnswers, requests });

const renderAutosave = () =>
  renderHook(({ values }) => useDraftAutosave('attempt-1', values), {
    initialProps: { values: emptyAnswers },
  });

/** Lets timers fire and the promises they start settle. */
const wait = (ms: number) => act(() => vi.advanceTimersByTimeAsync(ms));

const deferred = () => {
  let resolve!: () => void;
  const promise = new Promise<void>((done) => (resolve = done));
  return { promise, resolve };
};

beforeEach(() => {
  vi.clearAllMocks();
  vi.useFakeTimers();
});
afterEach(() => vi.useRealTimers());

describe('useDraftAutosave', () => {
  it('saves shortly after the student stops typing', async () => {
    vi.mocked(saveDraft).mockResolvedValue();
    const { result, rerender } = renderAutosave();

    rerender({ values: draft('a) citação') });
    await wait(1000);
    expect(saveDraft).not.toHaveBeenCalled();
    await wait(500);

    expect(saveDraft).toHaveBeenCalledExactlyOnceWith('attempt-1', draft('a) citação'));
    expect(result.current).toBe('saved');
  });

  it('retries a failed save on its own, without the student typing again', async () => {
    vi.mocked(saveDraft)
      .mockRejectedValueOnce(new Error('offline'))
      .mockRejectedValueOnce(new Error('offline'))
      .mockResolvedValue();
    const { result, rerender } = renderAutosave();

    rerender({ values: draft('a) citação') });
    await wait(1500);
    expect(result.current).toBe('error');

    await wait(60_000);

    expect(saveDraft).toHaveBeenCalledTimes(3);
    expect(saveDraft).toHaveBeenLastCalledWith('attempt-1', draft('a) citação'));
    expect(result.current).toBe('saved');
  });

  it('never runs two saves at once, so an older text cannot overwrite a newer one', async () => {
    const slow = deferred();
    vi.mocked(saveDraft).mockReturnValueOnce(slow.promise).mockResolvedValue();
    const { result, rerender } = renderAutosave();

    rerender({ values: draft('a)') });
    await wait(1500);
    rerender({ values: draft('a) citação') });
    await wait(5000);
    expect(saveDraft).toHaveBeenCalledTimes(1);

    slow.resolve();
    await wait(0);

    expect(saveDraft).toHaveBeenCalledTimes(2);
    expect(saveDraft).toHaveBeenLastCalledWith('attempt-1', draft('a) citação'));
    expect(result.current).toBe('saved');
  });

  it('saves a text reverted to what was loaded, since a newer one may be stored', async () => {
    vi.mocked(saveDraft).mockResolvedValue();
    const { rerender } = renderAutosave();

    rerender({ values: draft('a)') });
    await wait(1500);
    rerender({ values: emptyAnswers });
    await wait(1500);

    expect(saveDraft).toHaveBeenLastCalledWith('attempt-1', emptyAnswers);
  });

  it('keeps invalid text local', async () => {
    const { rerender } = renderAutosave();

    rerender({ values: draft('x'.repeat(20_001)) });
    await wait(60_000);

    expect(saveDraft).not.toHaveBeenCalled();
  });

  it('saves the pending text right away when the page closes', async () => {
    vi.mocked(saveDraft).mockResolvedValue();
    const { rerender, unmount } = renderAutosave();

    rerender({ values: draft('a) citação') });
    unmount();

    expect(saveDraft).toHaveBeenCalledExactlyOnceWith('attempt-1', draft('a) citação'));
    await wait(60_000);
    expect(saveDraft).toHaveBeenCalledTimes(1);
  });
});
