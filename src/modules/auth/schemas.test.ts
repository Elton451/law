import { describe, expect, it } from 'vitest';
import { loginSchema, signUpSchema } from './schemas';

const validSignUp = {
  name: 'Ana Souza',
  email: 'ana@example.com',
  password: 'senha1234',
  confirmPassword: 'senha1234',
};

const errorsFor = (result: { success: boolean; error?: { issues: { path: PropertyKey[] }[] } }) =>
  result.error?.issues.map((issue) => issue.path.join('.')) ?? [];

describe('signUpSchema', () => {
  it('accepts valid input and normalizes the e-mail', () => {
    const result = signUpSchema.parse({ ...validSignUp, email: '  Ana@Example.COM ' });
    expect(result.email).toBe('ana@example.com');
  });

  it.each([
    ['too short', 'abc123'],
    ['no numbers', 'somenteletras'],
    ['no letters', '12345678'],
  ])('rejects a password with %s', (_, password) => {
    const result = signUpSchema.safeParse({ ...validSignUp, password, confirmPassword: password });
    expect(errorsFor(result)).toContain('password');
  });

  it('rejects mismatched passwords on confirmPassword', () => {
    const result = signUpSchema.safeParse({ ...validSignUp, confirmPassword: 'outra1234' });
    expect(errorsFor(result)).toEqual(['confirmPassword']);
  });

  it('rejects an invalid e-mail', () => {
    const result = signUpSchema.safeParse({ ...validSignUp, email: 'ana@' });
    expect(errorsFor(result)).toEqual(['email']);
  });
});

describe('loginSchema', () => {
  it('requires both fields', () => {
    const result = loginSchema.safeParse({ email: '', password: '' });
    expect(errorsFor(result).sort()).toEqual(['email', 'password']);
  });
});
