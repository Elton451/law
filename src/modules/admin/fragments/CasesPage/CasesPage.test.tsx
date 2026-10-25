import userEvent from '@testing-library/user-event';
import { Route, Routes } from 'react-router';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, within } from '@shared/test/test-utils';
import { deleteCase, fetchCases, fetchTrails, setCaseActive, type CaseSummary } from '../../api';
import CasesPage from './CasesPage';

vi.mock('../../api', async (importOriginal) => ({
  ...(await importOriginal<typeof import('../../api')>()),
  fetchTrails: vi.fn(),
  fetchCases: vi.fn(),
  setCaseActive: vi.fn(),
  deleteCase: vi.fn(),
}));
vi.mock('@shared/auth/authService', () => ({ signOut: vi.fn() }));

const activeCase: CaseSummary = {
  id: 'case-1',
  trailId: 'trail-civil',
  trailName: 'Civil',
  title: 'Infiltração causada pelo vizinho',
  origin: 'oab',
  examEdition: 'XXXV Exame',
  isActive: true,
  attemptCount: 0,
};

const attemptedCase: CaseSummary = {
  ...activeCase,
  id: 'case-2',
  title: 'Aprovada e não nomeada',
  origin: 'autoral',
  examEdition: null,
  isActive: false,
  attemptCount: 3,
};

const renderPage = (route = '/admin/casos') =>
  render(
    <Routes>
      <Route path="/admin/casos" element={<CasesPage />} />
      <Route path="/admin/casos/novo" element={<p>new case page</p>} />
    </Routes>,
    { route },
  );

const row = async (title: string) => (await screen.findByText(title)).closest('tr')!;

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(fetchTrails).mockResolvedValue([{ id: 'trail-civil', name: 'Civil' }]);
  vi.mocked(fetchCases).mockResolvedValue([activeCase, attemptedCase]);
  vi.mocked(setCaseActive).mockResolvedValue();
  vi.mocked(deleteCase).mockResolvedValue();
});

describe('CasesPage', () => {
  it('lists the cases with their status', async () => {
    renderPage();

    expect(within(await row(activeCase.title)).getByText('Ativo')).toBeInTheDocument();
    expect(within(await row(attemptedCase.title)).getByText('Inativo')).toBeInTheDocument();
  });

  it('applies the filters in the URL', async () => {
    renderPage('/admin/casos?trilha=trail-civil&origem=oab');

    await screen.findByText(activeCase.title);
    expect(fetchCases).toHaveBeenCalledWith({ trailId: 'trail-civil', origin: 'oab' });
  });

  it('deactivates a case after confirming, then reloads the list', async () => {
    const user = userEvent.setup();
    renderPage();

    await user.click(
      within(await row(activeCase.title)).getByRole('button', { name: 'Desativar' }),
    );
    await user.click(
      within(await screen.findByRole('dialog')).getByRole('button', { name: 'Desativar' }),
    );

    expect(setCaseActive).toHaveBeenCalledWith('case-1', false);
    expect(await screen.findByText('Caso desativado.')).toBeInTheDocument();
    expect(fetchCases).toHaveBeenCalledTimes(2);
  });

  it('deletes a case nobody attempted after confirming', async () => {
    const user = userEvent.setup();
    renderPage();

    await user.click(within(await row(activeCase.title)).getByRole('button', { name: 'Excluir' }));
    await user.click(
      within(await screen.findByRole('dialog')).getByRole('button', { name: 'Excluir' }),
    );

    expect(deleteCase).toHaveBeenCalledWith('case-1');
  });

  it('does not offer to delete a case with attempts', async () => {
    renderPage();

    expect(
      within(await row(attemptedCase.title)).getByRole('button', { name: 'Excluir' }),
    ).toBeDisabled();
  });

  it('opens the form for a new case', async () => {
    const user = userEvent.setup();
    renderPage();

    await user.click(screen.getByRole('button', { name: 'Novo caso' }));

    expect(await screen.findByText('new case page')).toBeInTheDocument();
  });
});
