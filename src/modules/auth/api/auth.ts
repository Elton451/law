import type { AuthError } from '@supabase/supabase-js';
import { supabase } from '@shared/lib/supabase';
import { paths } from '@shared/routes';
import type { FormError, LoginValues, SignUpValues } from '../schemas/auth';

const GENERIC_ERROR = 'Não foi possível concluir agora. Tente novamente em instantes.';

const rateLimitError = (error: AuthError): FormError | undefined =>
  error.code?.startsWith('over_')
    ? { message: 'Muitas tentativas. Aguarde alguns minutos e tente novamente.' }
    : undefined;

const signUpError = (error: AuthError): FormError => {
  switch (error.code) {
    case 'email_address_invalid':
      return { field: 'email', message: 'Informe um e-mail válido.' };
    case 'weak_password':
      return { field: 'password', message: 'Escolha uma senha mais forte.' };
    default:
      return rateLimitError(error) ?? { message: GENERIC_ERROR };
  }
};

const signInError = (error: AuthError): FormError => {
  switch (error.code) {
    case 'invalid_credentials':
      // Deliberately generic: never reveal whether the e-mail exists.
      return { message: 'E-mail ou senha inválidos.' };
    case 'email_not_confirmed':
      return { message: 'Confirme seu e-mail pelo link que enviamos antes de entrar.' };
    default:
      return rateLimitError(error) ?? { message: GENERIC_ERROR };
  }
};

export type SignUpResult =
  { ok: true; needsEmailConfirmation: boolean } | { ok: false; error: FormError };

export const signUp = async ({ name, email, password }: SignUpValues): Promise<SignUpResult> => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { name },
      emailRedirectTo: `${window.location.origin}${paths.trails}`,
    },
  });

  // Never reveal that an e-mail is already registered: answer exactly as for a new account.
  // (With e-mail confirmation on, Supabase signals a duplicate as a user with no identities.)
  if (error?.code === 'user_already_exists' || error?.code === 'email_exists') {
    return { ok: true, needsEmailConfirmation: true };
  }
  if (error) return { ok: false, error: signUpError(error) };

  return { ok: true, needsEmailConfirmation: !data.session };
};

export const signIn = async ({ email, password }: LoginValues): Promise<FormError | undefined> => {
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  return error ? signInError(error) : undefined;
};
