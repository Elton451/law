import { supabase } from '@shared/lib/supabase';
import { profileSchema, type Profile } from './types';

export const fetchProfile = async (userId: string): Promise<Profile | null> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, name, role')
    .eq('id', userId)
    .maybeSingle();

  if (error || !data) return null;

  const parsed = profileSchema.safeParse(data);
  return parsed.success ? parsed.data : null;
};

export const signOut = async () => {
  await supabase.auth.signOut();
};
