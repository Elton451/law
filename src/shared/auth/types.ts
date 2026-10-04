import { z } from 'zod';

export const userRoleSchema = z.enum(['estudante', 'admin']);
export type UserRole = z.infer<typeof userRoleSchema>;

export const profileSchema = z.object({
  id: z.string(),
  name: z.string(),
  role: userRoleSchema,
});
export type Profile = z.infer<typeof profileSchema>;

export type AuthState =
  | { status: 'loading' }
  | { status: 'signedOut' }
  | { status: 'signedIn'; userId: string; profile: Profile | null };
