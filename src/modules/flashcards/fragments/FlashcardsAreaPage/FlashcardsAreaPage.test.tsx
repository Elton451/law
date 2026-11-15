import userEvent from '@testing-library/user-event';
import { Route, Routes } from 'react-router';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, within } from '@shared/test/test-utils';
import { fetchDueCounts, fetchTrail, fetchTrailLessons } from '../../api/flashcards';
import FlashcardsAreaPage from './FlashcardsAreaPage';

vi.mock('../../api/flashcards', () => ({
  fetchTrail: vi.fn(),
  fetchTrailLessons: vi.fn(),
  fetchDueCounts: vi.fn(),
}));
vi.mock('@shared/auth/authService', () => ({ signOut: vi.fn() }));

const civil = { id: 'trail-civil', slug: 'civil', name: 'Civil' };

const renderPage = () =>
  render(
    <Routes>
      <Route path="/trilhas/:slug/flashcards" element={<FlashcardsAreaPage />} />
      <Route path="/trilhas/:slug/flashcards/revisao" element={<p>review session</p>} />
    </Routes>,
    { route: '/trilhas/civil/flashcards' },
  );

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(fetchTrail).mockResolvedValue(civil);
  vi.mocked(fetchDueCounts).mockResolvedValue([
    { ...civil, dueCount: 3 },
    { id: 'trail-penal', slug: 'penal', name: 'Penal', dueCount: 9 },
  ]);
  vi.mocked(fetchTrailLessons).mockResolvedValue([
    {
      id: 'm1',
      title: 'Parte geral',
      lessons: [
        { id: 'l1', title: 'Prescrição', cardCount: 4, studiedCount: 0 },
        { id: 'l2', title: 'Decadência', cardCount: 2, studiedCount: 1 },
        { id: 'l3', title: 'Negócio jurídico', cardCount: 1, studiedCount: 1 },
      ],
    },
  ]);
});

describe('FlashcardsAreaPage', () => {
  it('lists the lessons by module, with their status, linking to each session', async () => {
    renderPage();

    const module = await screen.findByRole('region', { name: 'Parte geral' });
    const prescricao = within(module).getByRole('link', { name: /Prescrição/ });
    expect(prescricao).toHaveAttribute('href', '/trilhas/civil/flashcards/licoes/l1');
    expect(prescricao).toHaveTextContent('Não iniciada');
    expect(within(module).getByRole('link', { name: /Decadência/ })).toHaveTextContent(
      'Em andamento',
    );
    expect(within(module).getByRole('link', { name: /Negócio jurídico/ })).toHaveTextContent(
      'Estudada',
    );
  });

  it('shows the trail’s own pending review and opens it', async () => {
    const user = userEvent.setup();
    renderPage();

    const review = await screen.findByRole('region', { name: 'Cards pendentes' });
    expect(review).toHaveTextContent('3 cards para revisar hoje');

    await user.click(within(review).getByRole('button', { name: 'Revisar agora' }));

    expect(await screen.findByText('review session')).toBeInTheDocument();
  });

  it('says so when the trail has no flashcards yet', async () => {
    vi.mocked(fetchTrailLessons).mockResolvedValue([]);
    renderPage();
    expect(await screen.findByText('Ainda não há flashcards nesta matéria.')).toBeInTheDocument();
  });

  it('handles an unknown trail', async () => {
    vi.mocked(fetchTrail).mockResolvedValue(null);
    renderPage();
    expect(await screen.findByText('Matéria não encontrada')).toBeInTheDocument();
  });
});
