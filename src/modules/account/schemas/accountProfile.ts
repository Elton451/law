import { z } from 'zod';
import { fullNameSchema, ufSchema } from '@shared/profile/schemas/profileFields';

/** What "Minha conta" edits; exam and discipline stay as chosen at sign-up. */
export const accountProfileSchema = z.object({ name: fullNameSchema, uf: ufSchema });

export type AccountProfileInput = z.input<typeof accountProfileSchema>;
export type AccountProfileValues = z.output<typeof accountProfileSchema>;
