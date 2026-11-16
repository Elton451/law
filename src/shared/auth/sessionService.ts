import { z } from 'zod';
import { supabase } from '@shared/lib/supabase';
import type { DeviceSession, SessionStatus } from './types';

/**
 * Claims this device's place among the two allowed (US26). Returns 'revoked'
 * when another login already took it.
 */
export const registerSession = async (): Promise<SessionStatus> => {
  const { data, error } = await supabase.rpc('register_session');
  if (error) throw error;
  return z.enum(['active', 'revoked']).parse(data);
};

const sessionRowSchema = z
  .object({
    id: z.string(),
    created_at: z.string(),
    last_active_at: z.string(),
    user_agent: z.string().nullable(),
    is_current: z.boolean(),
  })
  .transform((row): DeviceSession => ({
    id: row.id,
    createdAt: row.created_at,
    lastActiveAt: row.last_active_at,
    userAgent: row.user_agent,
    isCurrent: row.is_current,
  }));

/** The signed-in devices of the current user, newest login first. */
export const fetchSessions = async (): Promise<DeviceSession[]> => {
  const { data, error } = await supabase.rpc('list_my_sessions');
  if (error) throw error;
  return z.array(sessionRowSchema).parse(data);
};

/** Signs out another device of the current user. */
export const endSession = async (sessionId: string) => {
  const { error } = await supabase.rpc('end_session', { p_session_id: sessionId });
  if (error) throw error;
};
