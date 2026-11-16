import { z } from 'zod';
import { fullNameSchema, offerIdSchema, ufSchema } from '@shared/profile/schemas/profileFields';

const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .min(1, 'Informe seu e-mail.')
  .pipe(z.email('Informe um e-mail válido.'));

// PROPOSTA (SB03): at least 12 characters. Supabase hashes with bcrypt, which
// ignores anything past 72 bytes. Set the same minimum in Supabase → Auth →
// Providers → Email, which enforces it on the server.
export const PASSWORD_MIN_LENGTH = 12;

const passwordSchema = z
  .string()
  .min(PASSWORD_MIN_LENGTH, `A senha deve ter pelo menos ${PASSWORD_MIN_LENGTH} caracteres.`)
  .max(72, 'A senha deve ter no máximo 72 caracteres.')
  .regex(/[A-Za-z]/, 'A senha deve conter pelo menos uma letra.')
  .regex(/\d/, 'A senha deve conter pelo menos um número.');

const newPasswordFields = {
  password: passwordSchema,
  confirmPassword: z.string().min(1, 'Confirme sua senha.'),
};

const passwordsMatch = (values: { password: string; confirmPassword: string }) =>
  values.password === values.confirmPassword;
const mismatch = { path: ['confirmPassword'], error: 'As senhas não coincidem.' };

export const signUpSchema = z
  .object({
    name: fullNameSchema,
    email: emailSchema,
    uf: ufSchema,
    offerId: offerIdSchema,
    ...newPasswordFields,
  })
  .refine(passwordsMatch, mismatch);

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Informe sua senha.'),
});

export const recoverPasswordSchema = z.object({ email: emailSchema });

export const resetPasswordSchema = z.object(newPasswordFields).refine(passwordsMatch, mismatch);

export type SignUpInput = z.input<typeof signUpSchema>;
export type SignUpValues = z.output<typeof signUpSchema>;
export type LoginValues = z.output<typeof loginSchema>;
export type RecoverPasswordValues = z.output<typeof recoverPasswordSchema>;
export type ResetPasswordValues = z.output<typeof resetPasswordSchema>;

/** A server-side failure to surface on the form: on a field, or above the form when no field. */
export type FormError<TField extends string = never> = {
  field?: TField;
  message: string;
};
