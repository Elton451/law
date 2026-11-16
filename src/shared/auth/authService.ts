import { z } from 'zod';
import { supabase } from '@shared/lib/supabase';
import { profileSchema, type Profile } from './types';

const profileRowSchema = z
  .object({
    id: z.string(),
    name: z.string().nullable(),
    role: z.string(),
    uf: z.string().nullable(),
    offer_id: z.string().nullable(),
  })
  .transform(({ offer_id, ...row }) => ({ ...row, offerId: offer_id }));

export const fetchProfile = async (userId: string): Promise<Profile | null> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, name, role, uf, offer_id')
    .eq('id', userId)
    .maybeSingle();

  if (error || !data) return null;

  const row = profileRowSchema.safeParse(data);
  if (!row.success) return null;
  const parsed = profileSchema.safeParse(row.data);
  return parsed.success ? parsed.data : null;
};

/**
 * Signs out this device only. Supabase's default scope ('global') would sign
 * out every device of the account, which "Sair" must not do (US26).
 */
export const signOut = async () => {
  await supabase.auth.signOut({ scope: 'local' });
};
