import { describe, expect, it } from 'vitest';
import { loginSchema, resetPasswordSchema, signUpSchema } from './auth';

const validSignUp = {
  name: 'Ana Souza',
  email: 'ana@example.com',
  uf: 'SP',
  offerId: '6f1c1a52-3f0e-4b8a-9d7e-2c1b0a9e8d7c',
  password: 'senhasegura12',
  confirmPassword: 'senhasegura12',
};

const errorsFor = (result: { success: boolean; error?: { issues: { path: PropertyKey[] }[] } }) =>
  result.error?.issues.map((issue) => issue.path.join('.')) ?? [];

describe('signUpSchema', () => {
  it('accepts valid input and normalizes the e-mail', () => {
    const result = signUpSchema.parse({ ...validSignUp, email: '  Ana@Example.COM ' });
    expect(result.email).toBe('ana@example.com');
  });

  it.each([
    ['fewer than 12 characters', 'senhacurta1'],
    ['no numbers', 'somenteletrasaqui'],
    ['no letters', '123456789012'],
  ])('rejects a password with %s', (_, password) => {
    const result = signUpSchema.safeParse({ ...validSignUp, password, confirmPassword: password });
    expect(errorsFor(result)).toContain('password');
  });

  it('rejects mismatched passwords on confirmPassword', () => {
    const result = signUpSchema.safeParse({ ...validSignUp, confirmPassword: 'outrasenha123' });
    expect(errorsFor(result)).toEqual(['confirmPassword']);
  });

  it('rejects an invalid e-mail', () => {
    const result = signUpSchema.safeParse({ ...validSignUp, email: 'ana@' });
    expect(errorsFor(result)).toEqual(['email']);
  });

  it('requires the UF and the offer (exam and discipline)', () => {
    const result = signUpSchema.safeParse({ ...validSignUp, uf: '', offerId: '' });
    expect(errorsFor(result)).toEqual(['uf', 'offerId']);
  });
});

describe('resetPasswordSchema', () => {
  it('applies the same password rules and confirmation', () => {
    expect(
      errorsFor(resetPasswordSchema.safeParse({ password: 'curta1', confirmPassword: 'curta1' })),
    ).toEqual(['password']);
    expect(
      errorsFor(
        resetPasswordSchema.safeParse({
          password: 'senhasegura12',
          confirmPassword: 'senhasegura13',
        }),
      ),
    ).toEqual(['confirmPassword']);
  });
});

describe('loginSchema', () => {
  it('requires both fields', () => {
    const result = loginSchema.safeParse({ email: '', password: '' });
    expect(errorsFor(result).sort()).toEqual(['email', 'password']);
  });
});
