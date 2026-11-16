import { beforeEach, describe, expect, it, vi } from 'vitest';
import { rememberRevokedSession } from '@shared/auth/utils/revokedNotice';
import { render, screen } from '@shared/test/test-utils';
import LoginPage from './LoginPage';

vi.mock('../../api/auth', () => ({ signIn: vi.fn(), signInWithGoogle: vi.fn() }));

beforeEach(() => sessionStorage.clear());

describe('LoginPage (A02)', () => {
  it('offers Google and password recovery', () => {
    render(<LoginPage />);

    expect(screen.getByRole('button', { name: /Continuar com Google/ })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Esqueci minha senha' })).toHaveAttribute(
      'href',
      '/recuperar-senha',
    );
  });

  it('explains, once, that another device took the session', () => {
    rememberRevokedSession();
    const { unmount } = render(<LoginPage />);

    expect(
      screen.getByText('Sua sessão foi encerrada porque houve acesso em outro dispositivo.'),
    ).toBeInTheDocument();

    unmount();
    render(<LoginPage />);
    expect(screen.queryByText(/Sua sessão foi encerrada/)).not.toBeInTheDocument();
  });
});
