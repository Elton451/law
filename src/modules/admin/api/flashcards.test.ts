import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  addFlashcards,
  deleteFlashcard,
  fetchFlashcardLessons,
  fetchLesson,
  fetchLessonFlashcards,
  updateFlashcard,
} from './flashcards';

const { rpc, from, order, maybeSingle } = vi.hoisted(() => {
  const maybeSingle = vi.fn();
  const query = { select: () => query, eq: () => query, order: vi.fn(), maybeSingle };
  return { rpc: vi.fn(), from: vi.fn(() => query), order: query.order, maybeSingle };
});
vi.mock('@shared/lib/supabase', () => ({ supabase: { rpc, from } }));

beforeEach(() => vi.clearAllMocks());

describe('fetchFlashcardLessons', () => {
  it('maps database rows to lessons', async () => {
    rpc.mockResolvedValue({
      data: [
        {
          trail_id: 't1',
          trail_name: 'Civil',
          module_id: 'm1',
          module_title: 'Parte geral',
          lesson_id: 'l1',
          lesson_title: 'Prescrição',
          card_count: 4,
        },
      ],
      error: null,
    });

    expect(await fetchFlashcardLessons()).toEqual([
      {
        id: 'l1',
        title: 'Prescrição',
        trailId: 't1',
        trailName: 'Civil',
        moduleTitle: 'Parte geral',
        cardCount: 4,
      },
    ]);
  });
});

describe('fetchLesson', () => {
  it('flattens the lesson’s module and trail', async () => {
    maybeSingle.mockResolvedValue({
      data: {
        id: 'l1',
        title: 'Prescrição',
        module: { title: 'Parte geral', trail: { name: 'Civil' } },
      },
      error: null,
    });

    expect(await fetchLesson('l1')).toEqual({
      id: 'l1',
      title: 'Prescrição',
      moduleTitle: 'Parte geral',
      trailName: 'Civil',
    });
    expect(from).toHaveBeenCalledWith('lessons');
  });

  it('returns null for a lesson that does not exist', async () => {
    maybeSingle.mockResolvedValue({ data: null, error: null });
    expect(await fetchLesson('nope')).toBeNull();
  });
});

describe('fetchLessonFlashcards', () => {
  it('loads the lesson’s cards in order', async () => {
    order.mockResolvedValue({ data: [{ id: 'c1', front: 'F', back: 'V' }], error: null });

    expect(await fetchLessonFlashcards('l1')).toEqual([{ id: 'c1', front: 'F', back: 'V' }]);
    expect(from).toHaveBeenCalledWith('flashcards');
    expect(order).toHaveBeenCalledWith('position');
  });
});

describe('writes', () => {
  it('adds cards in one call', async () => {
    rpc.mockResolvedValue({ data: 2, error: null });

    const cards = [
      { front: 'A', back: '1' },
      { front: 'B', back: '2' },
    ];
    expect(await addFlashcards('l1', cards)).toBe(2);
    expect(rpc).toHaveBeenCalledWith('admin_add_flashcards', { p_lesson_id: 'l1', p_cards: cards });
  });

  it('updates and deletes by id', async () => {
    rpc.mockResolvedValue({ error: null });

    await updateFlashcard('c1', { front: 'A', back: '1' });
    await deleteFlashcard('c1');

    expect(rpc).toHaveBeenCalledWith('admin_update_flashcard', {
      p_flashcard_id: 'c1',
      p_front: 'A',
      p_back: '1',
    });
    expect(rpc).toHaveBeenCalledWith('admin_delete_flashcard', { p_flashcard_id: 'c1' });
  });

  it('throws when the database refuses', async () => {
    rpc.mockResolvedValue({ data: null, error: { message: 'admin only' } });
    await expect(addFlashcards('l1', [{ front: 'A', back: '1' }])).rejects.toMatchObject({
      message: 'admin only',
    });
  });
});
