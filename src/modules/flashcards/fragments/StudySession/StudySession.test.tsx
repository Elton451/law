import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@shared/test/test-utils';
import { reviewFlashcard } from '../../api/flashcards';
import StudySession from './StudySession';

vi.mock('../../api/flashcards', () => ({ reviewFlashcard: vi.fn() }));

const cards = [
  { id: 'c1', front: 'Qual remédio protege a locomoção?', back: 'Habeas corpus' },
  { id: 'c2', front: 'Quem propõe ação popular?', back: 'Qualquer cidadão' },
];

const renderSession = () =>
  render(<StudySession cards={cards} summaryActions={<button>Voltar</button>} />);

const flip = (user: ReturnType<typeof userEvent.setup>, front: string) =>
  user.click(screen.getByRole('button', { name: new RegExp(front.slice(0, 10)) }));

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(reviewFlashcard).mockResolvedValue();
});

describe('StudySession', () => {
  it('shows the question first, with the progress, and the answer only after flipping', async () => {
    const user = userEvent.setup();
    renderSession();

    expect(screen.getByText(cards[0].front)).toBeInTheDocument();
    expect(screen.getByLabelText('Card 1 de 2')).toHaveTextContent('1/2');
    expect(screen.queryByText('Habeas corpus')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Acertei/ })).toBeDisabled();
    expect(screen.getByRole('button', { name: /Errei/ })).toBeDisabled();

    await flip(user, cards[0].front);

    expect(screen.getByText('Habeas corpus')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Acertei/ })).toBeEnabled();
  });

  it('saves each answer and ends with the summary', async () => {
    const user = userEvent.setup();
    renderSession();

    await flip(user, cards[0].front);
    await user.click(screen.getByRole('button', { name: /Acertei/ }));

    expect(reviewFlashcard).toHaveBeenCalledWith('c1', true);
    expect(await screen.findByLabelText('Card 2 de 2')).toBeInTheDocument();
    expect(screen.queryByText('Qualquer cidadão')).not.toBeInTheDocument();

    await flip(user, cards[1].front);
    await user.click(screen.getByRole('button', { name: /Errei/ }));

    expect(reviewFlashcard).toHaveBeenCalledWith('c2', false);
    const summary = await screen.findByRole('region', { name: 'Resumo da sessão' });
    expect(summary).toHaveTextContent('Acertos1');
    expect(summary).toHaveTextContent('Erros1');
    expect(screen.getByRole('button', { name: 'Voltar' })).toBeInTheDocument();
  });

  it('stays on the card when the answer cannot be saved', async () => {
    const user = userEvent.setup();
    vi.mocked(reviewFlashcard).mockRejectedValueOnce(new Error('offline'));
    renderSession();

    await flip(user, cards[0].front);
    await user.click(screen.getByRole('button', { name: /Acertei/ }));

    expect(
      await screen.findByText('Não foi possível salvar sua resposta. Tente novamente.'),
    ).toBeInTheDocument();
    expect(screen.getByLabelText('Card 1 de 2')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /Acertei/ }));

    expect(await screen.findByLabelText('Card 2 de 2')).toBeInTheDocument();
    expect(reviewFlashcard).toHaveBeenCalledTimes(2);
  });
});
