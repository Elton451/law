import userEvent from '@testing-library/user-event';
import { Route, Routes } from 'react-router';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@shared/test/test-utils';
import { fetchTrail, startAttempt } from '../../api';
import CaseStudyAreaPage from './CaseStudyAreaPage';

vi.mock('../../api', () => ({ fetchTrail: vi.fn(), startAttempt: vi.fn() }));
vi.mock('@shared/auth/authService', () => ({ signOut: vi.fn() }));

const renderPage = () =>
  render(
    <Routes>
      <Route path="/trilhas/:slug/estudo-de-caso" element={<CaseStudyAreaPage />} />
      <Route
        path="/trilhas/:slug/estudo-de-caso/tentativas/:attemptId"
        element={<p>attempt page</p>}
      />
    </Routes>,
    { route: '/trilhas/civil/estudo-de-caso' },
  );

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(fetchTrail).mockResolvedValue({ id: 'trail-civil', slug: 'civil', name: 'Civil' });
});

describe('CaseStudyAreaPage', () => {
  it('shows the trail with the study and training options', async () => {
    renderPage();

    expect(await screen.findByRole('heading', { name: 'Civil' })).toBeInTheDocument();
    expect(screen.getByText('Como fazer as peças')).toBeInTheDocument();
    expect(screen.getByText('Identificação das peças')).toBeInTheDocument();
  });

  it('starts a training attempt and opens it', async () => {
    const user = userEvent.setup();
    vi.mocked(startAttempt).mockResolvedValue('attempt-1');
    renderPage();

    await user.click(await screen.findByRole('button', { name: 'Iniciar treino' }));

    expect(await screen.findByText('attempt page')).toBeInTheDocument();
    expect(startAttempt).toHaveBeenCalledWith('trail-civil', undefined);
  });

  it('says so when the trail has no cases yet', async () => {
    const user = userEvent.setup();
    vi.mocked(startAttempt).mockResolvedValue(null);
    renderPage();

    await user.click(await screen.findByRole('button', { name: 'Iniciar treino' }));

    expect(
      await screen.findByText('Ainda não há casos concretos para esta matéria.'),
    ).toBeInTheDocument();
  });

  it('explains the training rules', async () => {
    const user = userEvent.setup();
    renderPage();

    await user.click(await screen.findByRole('button', { name: 'Regras do treino' }));

    expect(await screen.findByText(/O cronômetro começa/)).toBeInTheDocument();
  });

  it('handles an unknown trail', async () => {
    vi.mocked(fetchTrail).mockResolvedValue(null);
    renderPage();
    expect(await screen.findByText('Matéria não encontrada')).toBeInTheDocument();
  });
});
