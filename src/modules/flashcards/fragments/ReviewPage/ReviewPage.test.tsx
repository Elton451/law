import userEvent from '@testing-library/user-event';
import { Route, Routes } from 'react-router';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, within } from '@shared/test/test-utils';
import { fetchDueCounts } from '../../api/flashcards';
import ReviewPage from './ReviewPage';

vi.mock('../../api/flashcards', () => ({ fetchDueCounts: vi.fn() }));
vi.mock('@shared/auth/authService', () => ({ signOut: vi.fn() }));

const renderPage = () =>
  render(
    <Routes>
      <Route path="/revisao" element={<ReviewPage />} />
      <Route path="/revisao/sessao" element={<p>review all</p>} />
    </Routes>,
    { route: '/revisao' },
  );

beforeEach(() => vi.clearAllMocks());

describe('ReviewPage', () => {
  it('shows the total and each trail’s pending cards', async () => {
    const user = userEvent.setup();
    vi.mocked(fetchDueCounts).mockResolvedValue([
      { id: 't1', slug: 'civil', name: 'Civil', dueCount: 2 },
      { id: 't2', slug: 'penal', name: 'Penal', dueCount: 0 },
      { id: 't3', slug: 'tributario', name: 'Tributário', dueCount: 1 },
    ]);
    renderPage();

    const all = await screen.findByRole('region', { name: 'Todas as trilhas' });
    expect(all).toHaveTextContent('3 cards para revisar hoje');

    const perTrail = screen.getByRole('list', { name: 'Pendentes por trilha' });
    expect(within(perTrail).getByRole('link', { name: /Civil/ })).toHaveAttribute(
      'href',
      '/trilhas/civil/flashcards/revisao',
    );
    expect(within(perTrail).queryByRole('link', { name: /Penal/ })).not.toBeInTheDocument();
    expect(within(perTrail).getByText('1 card')).toBeInTheDocument();

    await user.click(within(all).getByRole('button', { name: 'Revisar agora' }));
    expect(await screen.findByText('review all')).toBeInTheDocument();
  });

  it('has nothing to start when no card is due', async () => {
    vi.mocked(fetchDueCounts).mockResolvedValue([
      { id: 't1', slug: 'civil', name: 'Civil', dueCount: 0 },
    ]);
    renderPage();

    const all = await screen.findByRole('region', { name: 'Todas as trilhas' });
    expect(all).toHaveTextContent('Nenhum card para revisar hoje.');
    expect(within(all).getByRole('button', { name: 'Revisar agora' })).toBeDisabled();
  });
});
