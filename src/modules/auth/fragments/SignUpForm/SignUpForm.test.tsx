import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import type { OfferDetails } from '@shared/catalog/types';
import { render, screen } from '@shared/test/test-utils';
import SignUpForm from './SignUpForm';

const OFFER = '6f1c1a52-3f0e-4b8a-9d7e-2c1b0a9e8d7c';
const civil: OfferDetails = {
  id: OFFER,
  disciplineId: 'civil',
  examEditionId: 'e46',
  priceCents: 7990,
  active: true,
  discipline: { id: 'civil', slug: 'civil', name: 'Civil' },
  edition: {
    id: 'e46',
    number: 46,
    firstPhaseDate: null,
    secondPhaseDate: '2099-01-10',
    timezone: 'America/Sao_Paulo',
    sourceLabel: null,
    sourceUrl: null,
    isDemo: true,
  },
};

const chooseUf = async (user: ReturnType<typeof userEvent.setup>) => {
  await user.click(screen.getByLabelText('UF'));
  await user.click(await screen.findByTitle('São Paulo'));
};

const fillValidForm = async (user: ReturnType<typeof userEvent.setup>) => {
  await user.type(screen.getByLabelText('Nome completo (como no documento oficial)'), 'Ana Souza');
  await user.type(screen.getByLabelText('E-mail'), 'ana@example.com');
  await chooseUf(user);
  await user.type(screen.getByLabelText('Senha (mínimo de 12 caracteres)'), 'senhasegura12');
  await user.type(screen.getByLabelText('Confirmar senha'), 'senhasegura12');
};

describe('SignUpForm', () => {
  it('shows field errors and does not submit invalid input', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<SignUpForm offers={[civil]} onSubmit={onSubmit} />);

    await user.click(screen.getByRole('button', { name: 'Criar conta' }));

    expect(await screen.findByText('Informe seu nome completo.')).toBeInTheDocument();
    expect(screen.getByText('Informe seu e-mail.')).toBeInTheDocument();
    expect(screen.getByText('Selecione sua UF.')).toBeInTheDocument();
    expect(screen.getByText('Escolha o exame e a disciplina.')).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('keeps the offer chosen on the offer page and says what is being chosen', () => {
    render(<SignUpForm offers={[civil]} defaultOfferId={OFFER} onSubmit={vi.fn()} />);

    expect(
      screen.getByText('Você está escolhendo Direito Civil para o Exame 46.'),
    ).toBeInTheDocument();
  });

  it('submits the validated values', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    render(<SignUpForm offers={[civil]} defaultOfferId={OFFER} onSubmit={onSubmit} />);

    await fillValidForm(user);
    await user.click(screen.getByRole('button', { name: 'Criar conta' }));

    expect(onSubmit).toHaveBeenCalledWith({
      name: 'Ana Souza',
      email: 'ana@example.com',
      uf: 'SP',
      offerId: OFFER,
      password: 'senhasegura12',
      confirmPassword: 'senhasegura12',
    });
  });

  it('shows a server error on the matching field without clearing the input', async () => {
    const user = userEvent.setup();
    const onSubmit = vi
      .fn()
      .mockResolvedValue({ field: 'email', message: 'Informe um e-mail válido.' });
    render(<SignUpForm offers={[civil]} defaultOfferId={OFFER} onSubmit={onSubmit} />);

    await fillValidForm(user);
    await user.click(screen.getByRole('button', { name: 'Criar conta' }));

    expect(await screen.findByText('Informe um e-mail válido.')).toBeInTheDocument();
    expect(screen.getByLabelText('E-mail')).toHaveValue('ana@example.com');
  });
});
