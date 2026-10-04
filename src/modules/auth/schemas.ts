import { z } from 'zod';

const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .min(1, 'Informe seu e-mail.')
  .pipe(z.email('Informe um e-mail válido.'));

// Supabase hashes with bcrypt, which ignores anything past 72 bytes.
const passwordSchema = z
  .string()
  .min(8, 'A senha deve ter pelo menos 8 caracteres.')
  .max(72, 'A senha deve ter no máximo 72 caracteres.')
  .regex(/[A-Za-z]/, 'A senha deve conter pelo menos uma letra.')
  .regex(/\d/, 'A senha deve conter pelo menos um número.');

export const signUpSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, 'Informe seu nome.')
      .max(100, 'O nome deve ter no máximo 100 caracteres.'),
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string().min(1, 'Confirme sua senha.'),
  })
  .refine((values) => values.password === values.confirmPassword, {
    path: ['confirmPassword'],
    error: 'As senhas não coincidem.',
  });

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Informe sua senha.'),
});

export type SignUpValues = z.output<typeof signUpSchema>;
export type LoginValues = z.output<typeof loginSchema>;

/** A server-side failure to surface on the form: on a field, or above the form when no field. */
export type FormError = {
  field?: 'email' | 'password';
  message: string;
};
