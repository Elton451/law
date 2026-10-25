import { beforeEach, describe, expect, it, vi } from 'vitest';
import { signIn, signUp } from './auth';

const { auth } = vi.hoisted(() => ({
  auth: { signUp: vi.fn(), signInWithPassword: vi.fn() },
}));

vi.mock('@shared/lib/supabase', () => ({ supabase: { auth } }));

const values = {
  name: 'Ana',
  email: 'ana@example.com',
  password: 'senha1234',
  confirmPassword: 'senha1234',
};
const authError = (code: string) => ({ code, message: code });

beforeEach(() => vi.clearAllMocks());

describe('signUp', () => {
  it('sends the name as user metadata and never the role', async () => {
    auth.signUp.mockResolvedValue({
      data: { user: { identities: [{}] }, session: {} },
      error: null,
    });

    await signUp(values);

    const options = auth.signUp.mock.calls[0][0].options;
    expect(options.data).toEqual({ name: 'Ana' });
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
