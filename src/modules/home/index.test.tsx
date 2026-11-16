import { describe, expect, it, vi } from 'vitest';
import { fetchCatalog } from '@shared/catalog/api/catalog';
import { makeCatalog } from '@shared/catalog/test/makeCatalog';
import { render, screen, within } from '@shared/test/test-utils';
import Home from './index';

vi.mock('@shared/auth/hooks/useAuth', () => ({ useAuth: () => ({ status: 'signedOut' }) }));
vi.mock('@shared/catalog/api/catalog', () => ({ fetchCatalog: vi.fn() }));

describe('Home (P01)', () => {
  it('shows the public navigation and a video area without a play button', async () => {
    vi.mocked(fetchCatalog).mockResolvedValue(makeCatalog());
    render(<Home />);

    const header = screen.getByRole('banner');
    for (const item of ['Como funciona', 'Novelos', 'Calendário', 'Entrar']) {
      expect(within(header).getByText(item)).toBeInTheDocument();
    }
    expect(
      screen.getByRole('img', { name: 'Vídeo explicativo em preparação' }),
    ).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /reproduzir|play/i })).not.toBeInTheDocument();
  });

  it('lists the seven novelos and labels demonstrative exam dates', async () => {
    vi.mocked(fetchCatalog).mockResolvedValue(makeCatalog());
    render(<Home />);

    expect(await screen.findAllByRole('button', { name: /Conhecer o novelo de/ })).toHaveLength(7);
    expect(screen.getByText('46º Exame de Ordem')).toBeInTheDocument();
    expect(screen.getByText('Demonstrativo')).toBeInTheDocument();
  });

  it('says when no exam dates are published yet', async () => {
    vi.mocked(fetchCatalog).mockResolvedValue(makeCatalog({ editions: [], offers: [] }));
    render(<Home />);

    expect(await screen.findByText('As próximas datas serão publicadas aqui.')).toBeInTheDocument();
  });

  it('offers to try again when the catalog fails to load', async () => {
    vi.mocked(fetchCatalog).mockRejectedValue(new Error('offline'));
    render(<Home />);

    expect(await screen.findByText('Não foi possível carregar o calendário.')).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: 'Tentar novamente' }).length).toBeGreaterThan(0);
  });
});
