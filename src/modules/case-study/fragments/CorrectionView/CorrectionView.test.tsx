import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { render, screen, within } from '@shared/test/test-utils';
import type { SubmittedAttempt } from '../../api';
import { emptyAnswers } from '../../schemas';
import { makeAttempt } from '../../testData';
import CorrectionView from './CorrectionView';

vi.mock('../../api', async (importOriginal) => ({
  ...(await importOriginal<typeof import('../../api')>()),
  startAttempt: vi.fn(),
}));

const startedAt = new Date('2026-10-06T12:00:00Z');

const submitted = (minutesSpent: number): SubmittedAttempt => ({
  ...makeAttempt({ startedAt }),
  submittedAt: new Date(startedAt.getTime() + minutesSpent * 60 * 1000),
  answerKey: {
    piece: 'Petição inicial',
    addressing: 'Excelentíssimo Senhor Doutor Juiz…',
    qualification: 'João, brasileiro…',
    grounds: 'Arts. 186 e 927 do CC.',
    requests: 'a) citação…',
    closing: 'Pede deferimento.',
  },
  answers: { ...emptyAnswers, identifiedPiece: 'Contestação', grounds: 'Art. 186 do CC.' },
});

describe('CorrectionView', () => {
  it('compares each section with the answer key', () => {
    render(<CorrectionView attempt={submitted(45)} trailSlug="civil" />);

    const piece = screen.getByRole('heading', { name: 'Peça cabível' }).parentElement!;
    expect(within(piece).getByText('Petição inicial')).toBeInTheDocument();
    expect(within(piece).getByText('Contestação')).toBeInTheDocument();

    const addressing = screen.getByRole('heading', { name: 'Endereçamento' }).parentElement!;
    expect(within(addressing).getByText('Em branco')).toBeInTheDocument();
  });

  it('reports time within the limit', () => {
    render(<CorrectionView attempt={submitted(45)} trailSlug="civil" />);
    expect(screen.getByText('Dentro do tempo')).toBeInTheDocument();
    expect(screen.getByText(/Tempo gasto: 45:00 de 1h/)).toBeInTheDocument();
  });

  it('reports time over the limit', () => {
    render(<CorrectionView attempt={submitted(75)} trailSlug="civil" />);
    expect(screen.getByText('Fora do tempo')).toBeInTheDocument();
  });

  it('shows the case statement again on request', async () => {
    const user = userEvent.setup();
    render(<CorrectionView attempt={submitted(45)} trailSlug="civil" />);

    await user.click(screen.getByRole('button', { name: 'Rever caso concreto' }));

    expect(await screen.findByRole('dialog')).toHaveTextContent('João é proprietário');
  });

  it('warns when the case was edited after the answer was sent', () => {
    const attempt = submitted(45);
    attempt.caseStudy.contentUpdatedAt = new Date(attempt.submittedAt.getTime() + 1000);
    render(<CorrectionView attempt={attempt} trailSlug="civil" />);

    expect(
      screen.getByText('Este caso foi editado depois que você enviou sua resposta.'),
    ).toBeInTheDocument();
  });

  it('does not warn when the case is unchanged since the answer was sent', () => {
    render(<CorrectionView attempt={submitted(45)} trailSlug="civil" />);
    expect(screen.queryByText(/foi editado depois/)).not.toBeInTheDocument();
  });
});
