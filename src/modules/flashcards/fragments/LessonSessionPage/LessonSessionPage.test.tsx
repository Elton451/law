import userEvent from '@testing-library/user-event';
import { Route, Routes } from 'react-router';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@shared/test/test-utils';
import { fetchLessonDeck, reviewFlashcard } from '../../api/flashcards';
import LessonSessionPage from './LessonSessionPage';

vi.mock('../../api/flashcards', () => ({ fetchLessonDeck: vi.fn(), reviewFlashcard: vi.fn() }));
vi.mock('@shared/auth/authService', () => ({ signOut: vi.fn() }));

const renderPage = () =>
  render(
    <Routes>
      <Route path="/trilhas/:slug/flashcards/licoes/:lessonId" element={<LessonSessionPage />} />
      <Route path="/trilhas/:slug/flashcards" element={<p>lesson list</p>} />
    </Routes>,
    { route: '/trilhas/civil/flashcards/licoes/l1' },
  );

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(reviewFlashcard).mockResolvedValue();
  vi.mocked(fetchLessonDeck).mockResolvedValue({
    id: 'l1',
    title: 'Prescrição',
    flashcards: [{ id: 'c1', front: 'Prazo geral?', back: '10 anos' }],
  });
});

describe('LessonSessionPage', () => {
  it('runs the lesson’s deck and can start it over', async () => {
    const user = userEvent.setup();
    renderPage();

    expect(await screen.findByRole('heading', { name: 'Prescrição' })).toBeInTheDocument();
    expect(fetchLessonDeck).toHaveBeenCalledWith('l1');

    await user.click(screen.getByRole('button', { name: /Prazo geral/ }));
    await user.click(screen.getByRole('button', { name: /Acertei/ }));
    expect(await screen.findByText('Sessão concluída!')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Estudar de novo' }));
    expect(screen.getByLabelText('Card 1 de 1')).toBeInTheDocument();
  });

  it('goes back to the lessons after the summary', async () => {
    const user = userEvent.setup();
    renderPage();

    await user.click(await screen.findByRole('button', { name: /Prazo geral/ }));
    await user.click(screen.getByRole('button', { name: /Errei/ }));
    await user.click(await screen.findByRole('button', { name: 'Voltar às lições' }));

    expect(await screen.findByText('lesson list')).toBeInTheDocument();
  });

  it('handles a lesson without cards', async () => {
    vi.mocked(fetchLessonDeck).mockResolvedValue({ id: 'l1', title: 'Vazia', flashcards: [] });
    renderPage();
    expect(await screen.findByText('Esta lição ainda não tem flashcards')).toBeInTheDocument();
  });

  it('handles an unknown lesson', async () => {
    vi.mocked(fetchLessonDeck).mockResolvedValue(null);
    renderPage();
    expect(await screen.findByText('Lição não encontrada')).toBeInTheDocument();
  });
});
