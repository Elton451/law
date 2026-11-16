import { supabase } from '@shared/lib/supabase';
import type { ProfileFields } from '../schemas/profileFields';

export type UpdateProfileError = { field?: 'offerId'; message: string };

/**
 * Saves the caller's own profile fields through `update_profile`, which
 * validates them again. The offer can be kept after it closed, not switched to
 * a closed one.
 */
export const updateProfile = async ({
  name,
  uf,
  offerId,
}: ProfileFields): Promise<UpdateProfileError | undefined> => {
  const { error } = await supabase.rpc('update_profile', {
    p_name: name,
    p_uf: uf,
    p_offer_id: offerId,
  });
  if (!error) return undefined;
  if (error.message.includes('invalid offer')) {
    return { field: 'offerId', message: 'Esta turma não está mais disponível. Escolha outra.' };
  }
  return { message: 'Não foi possível salvar agora. Tente novamente em instantes.' };
};
