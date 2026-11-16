import { z } from 'zod';
import { UF_VALUES } from '../constants/ufs';

// The profile fields of SB03, shared by sign-up, "completar cadastro" and
// "Minha conta". The database validates the same rules (update_profile).

/** Full name as on the official document: a single field (SB03). */
export const fullNameSchema = z
  .string()
  .trim()
  .min(2, 'Informe seu nome completo.')
  .max(100, 'O nome deve ter no máximo 100 caracteres.');

export const ufSchema = z.enum(UF_VALUES, { error: 'Selecione sua UF.' });

export const offerIdSchema = z.uuid({ error: 'Escolha o exame e a disciplina.' });

export const profileFieldsSchema = z.object({
  name: fullNameSchema,
  uf: ufSchema,
  offerId: offerIdSchema,
});

export type ProfileFieldsInput = z.input<typeof profileFieldsSchema>;
export type ProfileFields = z.output<typeof profileFieldsSchema>;
