import userEvent from '@testing-library/user-event';
import { Route, Routes } from 'react-router';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@shared/test/test-utils';
import { fetchCase, fetchTrails, saveCase, type CaseDetail } from '../../api';
import CaseFormPage from './CaseFormPage';

vi.mock('../../api', async (importOriginal) => ({
  ...(await importOriginal<typeof import('../../api')>()),
  fetchTrails: vi.fn(),
  fetchCase: vi.fn(),
  saveCase: vi.fn(),
}));
vi.mock('@shared/auth/authService', () => ({ signOut: vi.fn() }));

const existing: CaseDetail = {
  id: 'case-1',
  attemptCount: 2,
  values: {
    trailId: 'trail-civil',
    title: 'Infiltração causada pelo vizinho',
    statement: 'Enunciado',
    origin: 'autoral',
    examEdition: '',
    isActive: true,
    piece: 'Petição inicial',
    addressing: 'E',
    qualification: 'Q',
    grounds: 'F',
    requests: 'P',
    closing: 'C',
  },
};

const renderPage = (route: string) =>
  render(
    <Routes>
      <Route path="/admin/casos" element={<p>cases list</p>} />
      <Route path="/admin/casos/novo" element={<CaseFormPage />} />
      <Route path="/admin/casos/:caseId" element={<CaseFormPage />} />
    </Routes>,
    { route },
  );

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(fetchTrails).mockResolvedValue([
    { id: 'trail-civil', name: 'Civil' },
    { id: 'trail-penal', name: 'Penal' },
  ]);
  vi.mocked(fetchCase).mockResolvedValue(existing);
  vi.mocked(saveCase).mockResolvedValue('case-1');
});

describe('CaseFormPage', () => {
  it('creates a case with its answer key', async () => {
    const user = userEvent.setup();
    renderPage('/admin/casos/novo');

    await user.click(await screen.findByLabelText('Trilha'));
    await user.click(await screen.findByTitle('Penal'));
    const fill = async (label: string, text: string) => {
      await user.click(screen.getByLabelText(label));
      await user.paste(text);
    };
    await fill('Título', 'Furto qualificado');
    await fill('Exame da OAB', 'XL Exame');
    await fill('Enunciado', 'Enunciado do caso');
    await fill('Peça cabível', 'Resposta à acusação');
    for (const label of ['Endereçamento', 'Qualificação', 'Fundamentação', 'Pedidos']) {
      await fill(label, `${label} do gabarito`);
    }
    await fill('Fechamento', 'Termos em que pede deferimento.');
    await user.click(screen.getByRole('button', { name: 'Salvar caso' }));

    expect(await screen.findByText('cases list')).toBeInTheDocument();
    expect(saveCase).toHaveBeenCalledWith(null, {
      trailId: 'trail-penal',
      title: 'Furto qualificado',
      statement: 'Enunciado do caso',
      origin: 'oab',
      examEdition: 'XL Exame',
      isActive: true,
      piece: 'Resposta à acusação',
      addressing: 'Endereçamento do gabarito',
      qualification: 'Qualificação do gabarito',
      grounds: 'Fundamentação do gabarito',
      requests: 'Pedidos do gabarito',
      closing: 'Termos em que pede deferimento.',
    });
  });

  it('does not save an incomplete case', async () => {
    const user = userEvent.setup();
    renderPage('/admin/casos/novo');

    await user.click(await screen.findByRole('button', { name: 'Salvar caso' }));

    expect(await screen.findByText('Escolha a trilha.')).toBeInTheDocument();
    expect(screen.getByText('Informe o exame da OAB (ex.: XXXV Exame).')).toBeInTheDocument();
    expect(saveCase).not.toHaveBeenCalled();
  });

  it('edits a case, keeping the trail of one with attempts', async () => {
    const user = userEvent.setup();
    renderPage('/admin/casos/case-1');

    const title = await screen.findByLabelText('Título');
    expect(title).toHaveValue(existing.values.title);
    expect(screen.getByText(/já tem 2 tentativa/)).toBeInTheDocument();
    expect(screen.getByLabelText('Trilha')).toBeDisabled();
    expect(screen.queryByLabelText('Exame da OAB')).not.toBeInTheDocument();

    await user.clear(title);
    await user.type(title, 'Novo título');
    await user.click(screen.getByRole('button', { name: 'Salvar caso' }));

    expect(await screen.findByText('cases list')).toBeInTheDocument();
    expect(saveCase).toHaveBeenCalledWith('case-1', { ...existing.values, title: 'Novo título' });
  });

  it('says so when the case does not exist', async () => {
    vi.mocked(fetchCase).mockResolvedValue(null);
    renderPage('/admin/casos/missing');

    expect(await screen.findByText('Caso não encontrado')).toBeInTheDocument();
  });
});
