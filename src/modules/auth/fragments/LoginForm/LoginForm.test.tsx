import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@shared/test/test-utils';
import LoginForm from './LoginForm';

describe('LoginForm', () => {
  it('submits the validated values', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    render(<LoginForm onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText('E-mail'), 'ana@example.com');
    await user.type(screen.getByLabelText('Senha'), 'senha1234');
    await user.click(screen.getByRole('button', { name: 'Entrar' }));

    expect(onSubmit).toHaveBeenCalledWith({ email: 'ana@example.com', password: 'senha1234' });
  });

  it('shows a form-level server error', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn().mockResolvedValue({ message: 'E-mail ou senha inválidos.' });
    render(<LoginForm onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText('E-mail'), 'ana@example.com');
    await user.type(screen.getByLabelText('Senha'), 'errada');
    await user.click(screen.getByRole('button', { name: 'Entrar' }));

    expect(await screen.findByText('E-mail ou senha inválidos.')).toBeInTheDocument();
  });
});
