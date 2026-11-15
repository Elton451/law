import { Route, Routes } from 'react-router';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@shared/test/test-utils';
import { fetchDueCards, fetchTrail } from '../../api/flashcards';
import ReviewSessionPage from './ReviewSessionPage';

vi.mock('../../api/flashcards', () => ({
  fetchDueCards: vi.fn(),
  fetchTrail: vi.fn(),
  reviewFlashcard: vi.fn(),
}));
vi.mock('@shared/auth/authService', () => ({ signOut: vi.fn() }));

const renderPage = (route: string) =>
  render(
    <Routes>
      <Route path="/revisao/sessao" element={<ReviewSessionPage />} />
      <Route path="/trilhas/:slug/flashcards/revisao" element={<ReviewSessionPage />} />
    </Routes>,
    { route },
  );

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(fetchTrail).mockResolvedValue({ id: 'trail-civil', slug: 'civil', name: 'Civil' });
  vi.mocked(fetchDueCards).mockResolvedValue([{ id: 'c1', front: 'Prazo geral?', back: '10' }]);
});

describe('ReviewSessionPage', () => {
  it('reviews the due cards of every trail, capped at 50', async () => {
    renderPage('/revisao/sessao');

    expect(await screen.findByRole('heading', { name: 'Todas as trilhas' })).toBeInTheDocument();
    expect(screen.getByText('Prazo geral?')).toBeInTheDocument();
    expect(fetchDueCards).toHaveBeenCalledWith(null, 50);
  });

  it('reviews only the trail in the URL', async () => {
    renderPage('/trilhas/civil/flashcards/revisao');

    expect(await screen.findByRole('heading', { name: 'Civil' })).toBeInTheDocument();
    expect(fetchDueCards).toHaveBeenCalledWith('trail-civil', 50);
  });

  it('celebrates when nothing is due', async () => {
    vi.mocked(fetchDueCards).mockResolvedValue([]);
    renderPage('/revisao/sessao');
    expect(await screen.findByText('Tudo em dia!')).toBeInTheDocument();
  });
});
