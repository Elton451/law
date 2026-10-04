import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@shared/test/test-utils';
import SignUpForm from './SignUpForm';

const fillValidForm = async (user: ReturnType<typeof userEvent.setup>) => {
  await user.type(screen.getByLabelText('Nome'), 'Ana Souza');
  await user.type(screen.getByLabelText('E-mail'), 'ana@example.com');
  await user.type(screen.getByLabelText('Senha'), 'senha1234');
  await user.type(screen.getByLabelText('Confirmar senha'), 'senha1234');
};

describe('SignUpForm', () => {
  it('shows field errors and does not submit invalid input', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<SignUpForm onSubmit={onSubmit} />);

    await user.click(screen.getByRole('button', { name: 'Criar conta' }));

    expect(await screen.findByText('Informe seu nome.')).toBeInTheDocument();
    expect(screen.getByText('Informe seu e-mail.')).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('submits the validated values', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    render(<SignUpForm onSubmit={onSubmit} />);

    await fillValidForm(user);
    await user.click(screen.getByRole('button', { name: 'Criar conta' }));

    expect(onSubmit).toHaveBeenCalledWith({
      name: 'Ana Souza',
      email: 'ana@example.com',
      password: 'senha1234',
      confirmPassword: 'senha1234',
    });
  });

  it('shows a server error on the matching field', async () => {
    const user = userEvent.setup();
    const onSubmit = vi
      .fn()
      .mockResolvedValue({ field: 'email', message: 'Informe um e-mail válido.' });
    render(<SignUpForm onSubmit={onSubmit} />);

    await fillValidForm(user);
    await user.click(screen.getByRole('button', { name: 'Criar conta' }));

    expect(await screen.findByText('Informe um e-mail válido.')).toBeInTheDocument();
  });
});
