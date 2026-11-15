import userEvent from '@testing-library/user-event';
import { Route, Routes } from 'react-router';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor, within } from '@shared/test/test-utils';
import {
  addFlashcards,
  deleteFlashcard,
  fetchLesson,
  fetchLessonFlashcards,
  updateFlashcard,
} from '../../api/flashcards';
import LessonFlashcardsPage from './LessonFlashcardsPage';

vi.mock('../../api/flashcards', () => ({
  fetchLesson: vi.fn(),
  fetchLessonFlashcards: vi.fn(),
  addFlashcards: vi.fn(),
  updateFlashcard: vi.fn(),
  deleteFlashcard: vi.fn(),
}));
vi.mock('@shared/auth/authService', () => ({ signOut: vi.fn() }));

const renderPage = () =>
  render(
    <Routes>
      <Route path="/admin/flashcards/licoes/:lessonId" element={<LessonFlashcardsPage />} />
    </Routes>,
    { route: '/admin/flashcards/licoes/l1' },
  );

const existing = { id: 'c1', front: 'Prazo geral?', back: '10 anos' };

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(fetchLesson).mockResolvedValue({
    id: 'l1',
    title: 'Prescrição',
    moduleTitle: 'Parte geral',
    trailName: 'Civil',
  });
  vi.mocked(fetchLessonFlashcards).mockResolvedValue([existing]);
  vi.mocked(addFlashcards).mockImplementation(async (_, cards) => cards.length);
  vi.mocked(updateFlashcard).mockResolvedValue();
  vi.mocked(deleteFlashcard).mockResolvedValue();
});

describe('LessonFlashcardsPage', () => {
  it('shows the lesson and its cards', async () => {
    renderPage();

    expect(await screen.findByRole('heading', { name: 'Prescrição' })).toBeInTheDocument();
    expect(screen.getByText('Civil · Parte geral')).toBeInTheDocument();
    const list = await screen.findByRole('list', { name: 'Cards da lição' });
    expect(within(list).getByText('Prazo geral?')).toBeInTheDocument();
  });

  it('adds cards one after another without leaving the form', async () => {
    const user = userEvent.setup();
    renderPage();

    await user.click(await screen.findByLabelText('Frente'));
    await user.paste('Reparação civil?');
    await user.click(screen.getByLabelText('Verso'));
    await user.paste('3 anos');
    await user.click(screen.getByRole('button', { name: 'Adicionar card' }));

    await waitFor(() =>
      expect(addFlashcards).toHaveBeenCalledWith('l1', [
        { front: 'Reparação civil?', back: '3 anos' },
      ]),
    );
    await waitFor(() => expect(screen.getByLabelText('Frente')).toHaveValue(''));
    await waitFor(() => expect(screen.getByLabelText('Frente')).toHaveFocus());
    expect(fetchLessonFlashcards).toHaveBeenCalledTimes(2);
  });

  it('requires both sides', async () => {
    const user = userEvent.setup();
    renderPage();

    await user.type(await screen.findByLabelText('Frente'), 'Só a pergunta');
    await user.click(screen.getByRole('button', { name: 'Adicionar card' }));

    expect(await screen.findByText('Preencha este campo.')).toBeInTheDocument();
    expect(addFlashcards).not.toHaveBeenCalled();
  });

  it('previews the card turning over while it is typed', async () => {
    const user = userEvent.setup();
    renderPage();

    await user.click(await screen.findByLabelText('Frente'));
    await user.paste('Pergunta nova');
    await user.click(screen.getByLabelText('Verso'));
    await user.paste('Resposta nova');
    const card = screen.getByRole('button', { name: /Pergunta nova/ });
    expect(within(card).queryByText('Resposta nova')).not.toBeInTheDocument();

    await user.click(card);

    expect(within(card).getByText('Resposta nova')).toBeInTheDocument();
  });

  it('imports many cards from Obsidian Markdown', async () => {
    const user = userEvent.setup();
    renderPage();

    await user.click(await screen.findByRole('tab', { name: 'Importar Markdown' }));
    const editor = screen.getByLabelText('Markdown');
    // `{` and `[` are special to user.type, so paste instead.
    await user.click(editor);
    await user.paste('#flashcards\nA::1\nB:::2\n\nPergunta\n?\nResposta');

    const preview = screen.getByRole('list', { name: 'Cards a importar' });
    expect(within(preview).getAllByRole('listitem')).toHaveLength(4);

    await user.click(screen.getByRole('button', { name: 'Adicionar 4 cards' }));

    await waitFor(() =>
      expect(addFlashcards).toHaveBeenCalledWith('l1', [
        { front: 'A', back: '1' },
        { front: 'B', back: '2' },
        { front: '2', back: 'B' },
        { front: 'Pergunta', back: 'Resposta' },
      ]),
    );
    await waitFor(() => expect(screen.getByLabelText('Markdown')).toHaveValue(''));
  });

  it('blocks the import while the text has errors', async () => {
    const user = userEvent.setup();
    renderPage();

    await user.click(await screen.findByRole('tab', { name: 'Importar Markdown' }));
    await user.click(screen.getByLabelText('Markdown'));
    await user.paste('A::1\n\nSem resposta\n?');

    expect(screen.getByText('Linha 3: Card sem resposta.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Adicionar/ })).toBeDisabled();
  });

  it('edits a card', async () => {
    const user = userEvent.setup();
    renderPage();

    const list = await screen.findByRole('list', { name: 'Cards da lição' });
    await user.click(within(list).getByRole('button', { name: 'Editar' }));
    const dialog = await screen.findByRole('dialog', { name: 'Editar card' });
    const back = within(dialog).getByLabelText('Verso');
    await user.clear(back);
    await user.type(back, '10 anos (art. 205)');
    await user.click(within(dialog).getByRole('button', { name: 'Salvar card' }));

    await waitFor(() =>
      expect(updateFlashcard).toHaveBeenCalledWith('c1', {
        front: 'Prazo geral?',
        back: '10 anos (art. 205)',
      }),
    );
  });

  it('deletes a card after confirming', async () => {
    const user = userEvent.setup();
    renderPage();

    const list = await screen.findByRole('list', { name: 'Cards da lição' });
    await user.click(within(list).getByRole('button', { name: 'Excluir' }));
    const dialog = await screen.findByRole('dialog');
    await user.click(within(dialog).getByRole('button', { name: 'Excluir' }));

    await waitFor(() => expect(deleteFlashcard).toHaveBeenCalledWith('c1'));
  });

  it('handles an unknown lesson', async () => {
    vi.mocked(fetchLesson).mockResolvedValue(null);
    renderPage();
    expect(await screen.findByText('Lição não encontrada')).toBeInTheDocument();
  });
});
