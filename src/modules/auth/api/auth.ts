import type { AuthError } from '@supabase/supabase-js';
import { supabase } from '@shared/lib/supabase';
import { OFFER_PARAM, paths } from '@shared/routes';
import type {
  FormError,
  LoginValues,
  RecoverPasswordValues,
  ResetPasswordValues,
  SignUpValues,
} from '../schemas/auth';

const GENERIC_ERROR = 'Não foi possível concluir agora. Tente novamente em instantes.';

const rateLimitError = (error: AuthError): FormError | undefined =>
  error.code?.startsWith('over_')
    ? { message: 'Muitas tentativas. Aguarde alguns minutos e tente novamente.' }
    : undefined;

const signUpError = (error: AuthError): FormError<'email' | 'password'> => {
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

const url = (path: string) => `${window.location.origin}${path}`;

export type SignUpResult =
  | { ok: true; needsEmailConfirmation: boolean }
  | { ok: false; error: FormError<'email' | 'password'> };

export const signUp = async ({
  name,
  email,
  uf,
  offerId,
  password,
}: SignUpValues): Promise<SignUpResult> => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      // Validated again by the profile trigger in the database. Never the role.
      data: { name, uf, offer_id: offerId },
      emailRedirectTo: url(paths.dashboard),
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

/**
 * Redirects to Google. Back in the app, the profile completion page asks for
 * what Google doesn't provide (UF, exam and discipline), keeping the chosen offer.
 */
export const signInWithGoogle = async (offerId?: string): Promise<FormError | undefined> => {
  const query = offerId ? `?${OFFER_PARAM}=${encodeURIComponent(offerId)}` : '';
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: url(`${paths.completeProfile}${query}`) },
  });
  return error ? (rateLimitError(error) ?? { message: GENERIC_ERROR }) : undefined;
};

/** Always answers the same way whether or not the e-mail has an account (US06). */
export const requestPasswordReset = async ({
  email,
}: RecoverPasswordValues): Promise<FormError | undefined> => {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: url(paths.resetPassword),
  });
  return error ? rateLimitError(error) : undefined;
};

/**
 * Sets a new password from the recovery link, then signs out every other
 * device (US06: trocar senha revoga sessões).
 */
export const updatePassword = async ({
  password,
}: ResetPasswordValues): Promise<FormError<'password'> | undefined> => {
  const { error } = await supabase.auth.updateUser({ password });
  if (error) {
    switch (error.code) {
      case 'same_password':
        return { field: 'password', message: 'Escolha uma senha diferente da atual.' };
      case 'weak_password':
        return { field: 'password', message: 'Escolha uma senha mais forte.' };
      case 'session_not_found':
      case 'session_expired':
        return { message: 'O link expirou. Peça um novo link de recuperação.' };
      default:
        return rateLimitError(error) ?? { message: GENERIC_ERROR };
    }
  }
  await supabase.auth.signOut({ scope: 'others' });
  return undefined;
};
