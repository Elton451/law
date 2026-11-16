import userEvent from '@testing-library/user-event';
import { Route, Routes } from 'react-router';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useAuth } from '@shared/auth/hooks/useAuth';
import type { AuthState } from '@shared/auth/types';
import { fetchCatalog } from '@shared/catalog/api/catalog';
import { makeCatalog, makeEdition, makeOffer } from '@shared/catalog/test/makeCatalog';
import { render, screen } from '@shared/test/test-utils';
import OfferPage from './OfferPage';

vi.mock('@shared/auth/hooks/useAuth', () => ({ useAuth: vi.fn() }));
vi.mock('@shared/catalog/api/catalog', () => ({ fetchCatalog: vi.fn() }));

const renderAt = (route: string) =>
  render(
    <Routes>
      <Route path="/novelos/:disciplina" element={<OfferPage />} />
      <Route path="/novelos/:disciplina/:exame" element={<OfferPage />} />
      <Route path="/cadastro" element={<p>sign-up page</p>} />
    </Routes>,
    { route },
  );

const twoEditions = makeCatalog({
  editions: [
    makeEdition({ id: 'e46', number: 46, secondPhaseDate: '2099-02-10' }),
    makeEdition({ id: 'e47', number: 47, secondPhaseDate: '2099-08-10' }),
  ],
  offers: [
    makeOffer({ id: 'civil-46', examEditionId: 'e46' }),
    makeOffer({ id: 'civil-47', examEditionId: 'e47', priceCents: 8990 }),
  ],
});

beforeEach(() => {
  vi.mocked(useAuth).mockReturnValue({ status: 'signedOut' } satisfies AuthState);
});

describe('OfferPage (P02)', () => {
  it('opens the soonest open edition of the discipline', async () => {
    vi.mocked(fetchCatalog).mockResolvedValue(twoEditions);
    renderAt('/novelos/civil');

    expect(await screen.findByRole('heading', { name: 'Direito Civil' })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: /Exame 46/ })).toBeChecked();
    expect(screen.getByText(/79,90/)).toBeInTheDocument();
    expect(screen.getByText('10/02/2099')).toBeInTheDocument();
    expect(screen.getByText('11/02/2099 (dia seguinte à prova)')).toBeInTheDocument();
  });

  it('shows the edition in the URL and updates the summary on another choice', async () => {
    vi.mocked(fetchCatalog).mockResolvedValue(twoEditions);
    renderAt('/novelos/civil/47');

    expect(await screen.findByRole('radio', { name: /Exame 47/ })).toBeChecked();
    expect(screen.getByText(/89,90/)).toBeInTheDocument();
  });

  it('states the one-discipline restriction before payment', async () => {
    vi.mocked(fetchCatalog).mockResolvedValue(twoEditions);
    renderAt('/novelos/civil/46');

    expect(await screen.findByText('Uma disciplina por exame')).toBeInTheDocument();
  });

  it('takes a visitor to sign-up carrying the offer', async () => {
    vi.mocked(fetchCatalog).mockResolvedValue(twoEditions);
    const user = userEvent.setup();
    renderAt('/novelos/civil/46');

    await user.click(await screen.findByRole('button', { name: 'Criar conta e continuar' }));

    expect(screen.getByText('sign-up page')).toBeInTheDocument();
  });

  it('disables the purchase when no edition is open', async () => {
    vi.mocked(fetchCatalog).mockResolvedValue(twoEditions);
    renderAt('/novelos/penal');

    expect(await screen.findByText('Sem turma disponível')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Criar conta e continuar' })).toBeDisabled();
  });

  it('says when the novelo does not exist', async () => {
    vi.mocked(fetchCatalog).mockResolvedValue(twoEditions);
    renderAt('/novelos/eleitoral');

    expect(await screen.findByText('Novelo não encontrado')).toBeInTheDocument();
  });
});
