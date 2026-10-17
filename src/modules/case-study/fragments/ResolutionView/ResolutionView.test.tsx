import userEvent from '@testing-library/user-event';
import { Route, Routes, useLocation } from 'react-router';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@shared/test/test-utils';
import { discardAttempt, startAttempt } from '../../api';
import { makeAttempt } from '../../testData';
import ResolutionView from './ResolutionView';

vi.mock('../../api', () => ({
  discardAttempt: vi.fn(),
  startAttempt: vi.fn(),
  saveDraft: vi.fn(),
  submitAttempt: vi.fn(),
}));

const attemptPath = '/trilhas/civil/estudo-de-caso/tentativas/attempt-1';

const LocationState = () => (
  <output data-testid="location-state">{JSON.stringify(useLocation().state)}</output>
);

const renderView = (attempt = makeAttempt(), state?: unknown) =>
  render(
    <Routes>
      <Route
        path="/trilhas/:slug/estudo-de-caso/tentativas/:attemptId"
        element={
          <>
            <ResolutionView attempt={attempt} trailSlug="civil" onSubmitted={vi.fn()} />
            <LocationState />
          </>
        }
      />
    </Routes>,
    { route: { pathname: attemptPath, state } },
  );

beforeEach(() => vi.clearAllMocks());

// jsdom has no media queries, so the view renders its small-screen layout: one pane at a time.
const showAnswerPane = (user = userEvent.setup()) => user.click(screen.getByText('Sua peça'));

describe('ResolutionView', () => {
  it('shows the start notice for a new attempt', async () => {
    const user = userEvent.setup();
    renderView(makeAttempt(), { justStarted: true });

    expect(screen.getByText('Sua peça começou!')).toBeInTheDocument();
    expect(screen.getByText(/Você tem 1h/)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Começar' }));
    // Cleared history state = the notice won't come back on reload. (antd's close
    // animation never finishes in jsdom, so the modal itself stays in the DOM.)
    await waitFor(() => expect(screen.getByTestId('location-state')).toHaveTextContent('null'));
  });

  it('does not show the start notice when reopening an attempt', () => {
    renderView();
    expect(screen.queryByText('Sua peça começou!')).not.toBeInTheDocument();
  });

  it('counts down from the time limit', () => {
    renderView();
    expect(screen.getByRole('timer')).toHaveTextContent(/^(1:00:00|59:5\d)$/);
    expect(screen.queryByText('O tempo acabou!')).not.toBeInTheDocument();
  });

  it('turns into overtime once the limit passes, without blocking the form', async () => {
    const startedAt = new Date(Date.now() - (60 * 60 + 90) * 1000);
    renderView(makeAttempt({ startedAt }));

    expect(screen.getByRole('timer')).toHaveTextContent(/^\+01:3\d$/);
    expect(screen.getByText('O tempo acabou!')).toBeInTheDocument();
    await showAnswerPane();
    expect(screen.getByRole('button', { name: 'Enviar' })).toBeEnabled();
  });

  it('shows where the case comes from', () => {
    renderView();
    expect(screen.getByText('Autoral')).toBeInTheDocument();
  });

  it('discards the attempt and opens another case, skipping the current one', async () => {
    const user = userEvent.setup();
    vi.mocked(discardAttempt).mockResolvedValue();
    vi.mocked(startAttempt).mockResolvedValue('attempt-2');
    renderView();

    await showAnswerPane(user);
    await user.click(screen.getByRole('button', { name: 'Gerar outro teste' }));
    await user.click(await screen.findByRole('button', { name: 'Descartar e gerar outro' }));

    await waitFor(() => expect(startAttempt).toHaveBeenCalledWith('trail-civil', 'case-1'));
    expect(discardAttempt).toHaveBeenCalledWith('attempt-1');
  });
});
