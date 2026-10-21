import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor, within } from '@shared/test/test-utils';
import { saveDraft, submitAttempt } from '../../api';
import { makeAttempt } from '../../testData';
import AnswerForm from './AnswerForm';

vi.mock('../../api', () => ({ saveDraft: vi.fn(), submitAttempt: vi.fn() }));

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(saveDraft).mockResolvedValue();
});

const setup = () => {
  const user = userEvent.setup();
  const onSubmitted = vi.fn();
  const onNewCase = vi.fn().mockResolvedValue(undefined);
  render(<AnswerForm attempt={makeAttempt()} onSubmitted={onSubmitted} onNewCase={onNewCase} />);
  return { user, onSubmitted, onNewCase };
};

describe('AnswerForm', () => {
  it('warns about blank fields, then submits the answers', async () => {
    vi.mocked(submitAttempt).mockResolvedValue();
    const { user, onSubmitted } = setup();

    await user.type(screen.getByLabelText('Peça cabível'), 'Petição inicial');
    await user.type(screen.getByLabelText('Fundamentação'), 'Arts. 186 e 927 do CC.');
    await user.click(screen.getByRole('button', { name: 'Enviar' }));

    const dialog = await screen.findByRole('dialog');
    expect(
      within(dialog).getByText(/Endereçamento, Qualificação, Pedidos, Fechamento/),
    ).toBeInTheDocument();
    await user.click(within(dialog).getByRole('button', { name: 'Enviar' }));

    await waitFor(() => expect(onSubmitted).toHaveBeenCalled());
    expect(submitAttempt).toHaveBeenCalledWith(
      'attempt-1',
      expect.objectContaining({
        identifiedPiece: 'Petição inicial',
        grounds: 'Arts. 186 e 927 do CC.',
        addressing: '',
      }),
    );
  });

  it('does not submit when the student keeps writing', async () => {
    const { user } = setup();

    await user.click(screen.getByRole('button', { name: 'Enviar' }));
    await user.click(await screen.findByRole('button', { name: 'Continuar escrevendo' }));

    expect(submitAttempt).not.toHaveBeenCalled();
  });

  it('asks before discarding the answer for a new case', async () => {
    const { user, onNewCase } = setup();

    await user.click(screen.getByRole('button', { name: 'Gerar outro teste' }));
    await user.click(await screen.findByRole('button', { name: 'Descartar e gerar outro' }));

    await waitFor(() => expect(onNewCase).toHaveBeenCalled());
  });

  it('autosaves the draft after the student stops typing', async () => {
    vi.mocked(saveDraft).mockResolvedValue();
    const { user } = setup();

    await user.type(screen.getByLabelText('Pedidos'), 'a) citação');

    await waitFor(() => expect(screen.getByText('Rascunho salvo')).toBeInTheDocument(), {
      timeout: 3000,
    });
    expect(saveDraft).toHaveBeenCalledTimes(1);
    expect(saveDraft).toHaveBeenCalledWith(
      'attempt-1',
      expect.objectContaining({ requests: 'a) citação' }),
    );
  });
});
