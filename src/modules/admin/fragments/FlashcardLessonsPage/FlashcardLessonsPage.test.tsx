import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@shared/test/test-utils';
import { fetchFlashcardLessons } from '../../api/flashcards';
import FlashcardLessonsPage from './FlashcardLessonsPage';

vi.mock('../../api/flashcards', () => ({ fetchFlashcardLessons: vi.fn() }));
vi.mock('@shared/auth/authService', () => ({ signOut: vi.fn() }));

describe('FlashcardLessonsPage', () => {
  it('lists the lessons, linking to their cards', async () => {
    vi.mocked(fetchFlashcardLessons).mockResolvedValue([
      {
        id: 'l1',
        title: 'Prescrição',
        trailId: 't1',
        trailName: 'Civil',
        moduleTitle: 'Parte geral',
        cardCount: 4,
      },
    ]);
    render(<FlashcardLessonsPage />, { route: '/admin/flashcards' });

    expect(await screen.findByRole('link', { name: 'Prescrição' })).toHaveAttribute(
      'href',
      '/admin/flashcards/licoes/l1',
    );
    expect(screen.getByRole('menuitem', { name: /Flashcards/ })).not.toHaveAttribute(
      'aria-disabled',
      'true',
    );
  });
});
