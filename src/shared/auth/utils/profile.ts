import { paths } from '@shared/routes';
import type { Profile } from '../types';

/**
 * Whether a participant has every sign-up field (SB03). A Google sign-up
 * starts without UF, offer and sometimes the name. Admins have no offer.
 */
export const isProfileComplete = (profile: Profile | null) =>
  !profile || profile.role === 'admin' || Boolean(profile.name && profile.uf && profile.offerId);

/** Where a signed-in user lands: admin panel, profile completion, or the dashboard. */
export const homePathFor = (profile: Profile | null) => {
  if (profile?.role === 'admin') return paths.admin;
  if (!isProfileComplete(profile)) return paths.completeProfile;
  return paths.dashboard;
};
