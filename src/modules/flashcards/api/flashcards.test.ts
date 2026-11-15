import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  fetchDueCards,
  fetchDueCounts,
  fetchLessonDeck,
  fetchTrailLessons,
  reviewFlashcard,
} from './flashcards';

const { rpc, from, order, maybeSingle } = vi.hoisted(() => {
  const maybeSingle = vi.fn();
  const query = { select: () => query, eq: () => query, order: vi.fn(() => query), maybeSingle };
  return { rpc: vi.fn(), from: vi.fn(() => query), order: query.order, maybeSingle };
});
vi.mock('@shared/lib/supabase', () => ({ supabase: { rpc, from } }));

beforeEach(() => vi.clearAllMocks());

const lessonRow = (moduleId: string, lessonId: string) => ({
  module_id: moduleId,
  module_title: `Módulo ${moduleId}`,
  lesson_id: lessonId,
  lesson_title: `Lição ${lessonId}`,
  card_count: 4,
  studied_count: 1,
});

describe('fetchTrailLessons', () => {
  it('groups the lessons by module, keeping their order', async () => {
    rpc.mockResolvedValue({
      data: [lessonRow('m1', 'l1'), lessonRow('m1', 'l2'), lessonRow('m2', 'l3')],
      error: null,
    });

    const modules = await fetchTrailLessons('trail-1');

    expect(rpc).toHaveBeenCalledWith('get_trail_flashcard_lessons', { p_trail_id: 'trail-1' });
    expect(modules.map((module) => module.lessons.map((lesson) => lesson.id))).toEqual([
      ['l1', 'l2'],
      ['l3'],
    ]);
    expect(modules[0]).toMatchObject({
      title: 'Módulo m1',
      lessons: [{ title: 'Lição l1', cardCount: 4, studiedCount: 1 }, {}],
    });
  });
});

describe('fetchDueCounts', () => {
  it('maps database rows to due counts', async () => {
    rpc.mockResolvedValue({
      data: [{ trail_id: 't1', slug: 'civil', name: 'Civil', due_count: 3 }],
      error: null,
    });

    expect(await fetchDueCounts()).toEqual([
      { id: 't1', slug: 'civil', name: 'Civil', dueCount: 3 },
    ]);
  });

  it('throws on a database error', async () => {
    rpc.mockResolvedValue({ data: null, error: new Error('boom') });
    await expect(fetchDueCounts()).rejects.toThrow('boom');
  });
});

describe('fetchLessonDeck', () => {
  it('loads the lesson with its cards in order', async () => {
    const deck = { id: 'l1', title: 'Lição', flashcards: [{ id: 'c1', front: 'F', back: 'V' }] };
    maybeSingle.mockResolvedValue({ data: deck, error: null });

    expect(await fetchLessonDeck('l1')).toEqual(deck);
    expect(from).toHaveBeenCalledWith('lessons');
    expect(order).toHaveBeenCalledWith('position', { referencedTable: 'flashcards' });
  });

  it('returns null for a lesson that does not exist', async () => {
    maybeSingle.mockResolvedValue({ data: null, error: null });
    expect(await fetchLessonDeck('nope')).toBeNull();
  });
});

describe('fetchDueCards', () => {
  it('asks for the trail’s due cards, capped', async () => {
    rpc.mockResolvedValue({ data: [{ id: 'c1', front: 'F', back: 'V' }], error: null });

    expect(await fetchDueCards('t1', 50)).toEqual([{ id: 'c1', front: 'F', back: 'V' }]);
    expect(rpc).toHaveBeenCalledWith('get_due_flashcards', { p_trail_id: 't1', p_limit: 50 });
  });

  it('rejects malformed rows', async () => {
    rpc.mockResolvedValue({ data: [{ id: 'c1' }], error: null });
    await expect(fetchDueCards(null, 50)).rejects.toThrow();
  });
});

describe('reviewFlashcard', () => {
  it('sends the answer', async () => {
    rpc.mockResolvedValue({ error: null });

    await reviewFlashcard('c1', true);

    expect(rpc).toHaveBeenCalledWith('review_flashcard', { p_flashcard_id: 'c1', p_correct: true });
  });

  it('throws when the database refuses', async () => {
    rpc.mockResolvedValue({ error: { message: 'flashcard not found' } });
    await expect(reviewFlashcard('c1', false)).rejects.toMatchObject({
      message: 'flashcard not found',
    });
  });
});
