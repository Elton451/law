import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { signOut } from '@shared/auth/authService';
import { render, screen, within } from '@shared/test/test-utils';
import { fetchTrails, type Trail } from '../../api/trails';
import TrailsPage from './TrailsPage';

vi.mock('../../api/trails', () => ({ fetchTrails: vi.fn() }));
vi.mock('@shared/auth/authService', () => ({ signOut: vi.fn() }));

const trails: Trail[] = [
  { id: '1', slug: 'administrativo', name: 'Administrativo', totalLessons: 4, completedLessons: 1 },
  { id: '2', slug: 'civil', name: 'Civil', totalLessons: 0, completedLessons: 0 },
];

beforeEach(() => vi.mocked(fetchTrails).mockReset());

describe('TrailsPage', () => {
  it('lists each trail with its progress, linking to its page', async () => {
    vi.mocked(fetchTrails).mockResolvedValue(trails);
    render(<TrailsPage />, { route: '/trilhas' });

    const administrativo = await screen.findByRole('link', { name: /Administrativo/ });
    expect(administrativo).toHaveAttribute('href', '/trilhas/administrativo');
    expect(within(administrativo).getByText('25% desenrolado')).toBeInTheDocument();

    const civil = screen.getByRole('link', { name: /Civil/ });
    expect(within(civil).getByText('0% desenrolado')).toBeInTheDocument();
  });

  it('offers a retry when loading fails', async () => {
    const user = userEvent.setup();
    vi.mocked(fetchTrails).mockRejectedValueOnce(new Error('offline')).mockResolvedValue(trails);
    render(<TrailsPage />, { route: '/trilhas' });

    await user.click(await screen.findByRole('button', { name: 'Tentar novamente' }));

    expect(await screen.findByRole('link', { name: /Civil/ })).toBeInTheDocument();
    expect(fetchTrails).toHaveBeenCalledTimes(2);
  });

  it('logs out from the side menu', async () => {
    const user = userEvent.setup();
    vi.mocked(fetchTrails).mockResolvedValue(trails);
    render(<TrailsPage />, { route: '/trilhas' });

    await user.click(screen.getByRole('menuitem', { name: /Sair/ }));

    expect(signOut).toHaveBeenCalled();
  });
});
