import { beforeEach, describe, expect, it, vi } from 'vitest';
import { requestPasswordReset, signIn, signInWithGoogle, signUp, updatePassword } from './auth';

const { auth } = vi.hoisted(() => ({
  auth: {
    signUp: vi.fn(),
    signInWithPassword: vi.fn(),
    signInWithOAuth: vi.fn(),
    resetPasswordForEmail: vi.fn(),
    updateUser: vi.fn(),
    signOut: vi.fn(),
  },
}));

vi.mock('@shared/lib/supabase', () => ({ supabase: { auth } }));

const OFFER = '6f1c1a52-3f0e-4b8a-9d7e-2c1b0a9e8d7c';
const values = {
  name: 'Ana',
  email: 'ana@example.com',
  uf: 'SP' as const,
  offerId: OFFER,
  password: 'senhasegura12',
  confirmPassword: 'senhasegura12',
};
const authError = (code: string) => ({ code, message: code });

beforeEach(() => vi.clearAllMocks());

describe('signUp', () => {
  it('sends the profile fields as user metadata and never the role', async () => {
    auth.signUp.mockResolvedValue({
      data: { user: { identities: [{}] }, session: {} },
      error: null,
    });

    await signUp(values);

    const options = auth.signUp.mock.calls[0][0].options;
    expect(options.data).toEqual({ name: 'Ana', uf: 'SP', offer_id: OFFER });
  });

  it('reports when e-mail confirmation is required', async () => {
    auth.signUp.mockResolvedValue({
      data: { user: { identities: [{}] }, session: null },
      error: null,
    });
    expect(await signUp(values)).toEqual({ ok: true, needsEmailConfirmation: true });
  });

  it('answers an existing e-mail (no identities) exactly like a new one', async () => {
    auth.signUp.mockResolvedValue({
      data: { user: { identities: [] }, session: null },
      error: null,
    });
    expect(await signUp(values)).toEqual({ ok: true, needsEmailConfirmation: true });
  });

  it.each(['user_already_exists', 'email_exists'])(
    'does not reveal an existing e-mail on %s',
    async (code) => {
      auth.signUp.mockResolvedValue({ data: {}, error: authError(code) });
      expect(await signUp(values)).toEqual({ ok: true, needsEmailConfirmation: true });
    },
  );
});

describe('signIn', () => {
  it('returns nothing on success', async () => {
    auth.signInWithPassword.mockResolvedValue({ error: null });
    expect(await signIn(values)).toBeUndefined();
  });

  it('uses a generic message for bad credentials', async () => {
    auth.signInWithPassword.mockResolvedValue({ error: authError('invalid_credentials') });
    expect(await signIn(values)).toEqual({ message: 'E-mail ou senha inválidos.' });
  });

  it('maps rate limiting', async () => {
    auth.signInWithPassword.mockResolvedValue({ error: authError('over_request_rate_limit') });
    expect((await signIn(values))?.message).toMatch(/muitas tentativas/i);
  });
});

describe('signInWithGoogle', () => {
  it('returns to profile completion carrying the chosen offer', async () => {
    auth.signInWithOAuth.mockResolvedValue({ error: null });

    await signInWithGoogle(OFFER);

    expect(auth.signInWithOAuth).toHaveBeenCalledWith({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/completar-cadastro?oferta=${OFFER}` },
    });
  });
});

describe('requestPasswordReset', () => {
  it('answers the same whether or not the e-mail exists', async () => {
    auth.resetPasswordForEmail.mockResolvedValue({ error: authError('user_not_found') });
    expect(await requestPasswordReset({ email: 'x@example.com' })).toBeUndefined();
  });

  it('still reports rate limiting', async () => {
    auth.resetPasswordForEmail.mockResolvedValue({
      error: authError('over_email_send_rate_limit'),
    });
    expect((await requestPasswordReset({ email: 'x@example.com' }))?.message).toMatch(
      /muitas tentativas/i,
    );
  });
});

describe('updatePassword', () => {
  const passwords = { password: 'senhasegura12', confirmPassword: 'senhasegura12' };

  it('signs out the other devices after changing the password', async () => {
    auth.updateUser.mockResolvedValue({ error: null });

    expect(await updatePassword(passwords)).toBeUndefined();
    expect(auth.signOut).toHaveBeenCalledWith({ scope: 'others' });
  });

  it('keeps the other devices when the change fails', async () => {
    auth.updateUser.mockResolvedValue({ error: authError('same_password') });

    expect(await updatePassword(passwords)).toEqual({
      field: 'password',
      message: 'Escolha uma senha diferente da atual.',
    });
    expect(auth.signOut).not.toHaveBeenCalled();
  });
});
