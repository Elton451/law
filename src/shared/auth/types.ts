import { z } from 'zod';

export const userRoleSchema = z.enum(['estudante', 'admin']);
export type UserRole = z.infer<typeof userRoleSchema>;

export const profileSchema = z.object({
  id: z.string(),
  // Null until a Google sign-up completes the profile (SB03).
  name: z.string().nullable(),
  role: userRoleSchema,
  uf: z.string().nullable(),
  /** The offer (exam + discipline) chosen at sign-up. Choosing grants no access. */
  offerId: z.string().nullable(),
});
export type Profile = z.infer<typeof profileSchema>;

export type AuthState =
  | { status: 'loading' }
  | { status: 'signedOut' }
  | { status: 'signedIn'; userId: string; email: string | null; profile: Profile | null };

export type SessionStatus = 'active' | 'revoked';

export type DeviceSession = {
  id: string;
  createdAt: string;
  lastActiveAt: string;
  userAgent: string | null;
  isCurrent: boolean;
};
