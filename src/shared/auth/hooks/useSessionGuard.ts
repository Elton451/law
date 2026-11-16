import { useEffect } from 'react';
import { supabase } from '@shared/lib/supabase';
import { registerSession } from '../sessionService';
import { rememberRevokedSession } from '../utils/revokedNotice';

export const SESSION_CHECK_INTERVAL_MS = 60_000;

/**
 * While signed in, keeps this device registered under the two-device limit
 * (US26) and signs it out as soon as another login revoked it: on sign-in, when
 * the tab regains focus, and every minute.
 */
export const useSessionGuard = (userId: string | null) => {
  useEffect(() => {
    if (!userId) return;
    let cancelled = false;

    const check = async () => {
      try {
        const status = await registerSession();
        if (cancelled || status !== 'revoked') return;
        rememberRevokedSession();
        await supabase.auth.signOut({ scope: 'local' });
      } catch {
        // Offline or a transient error: try again on the next check.
      }
    };

    const onVisible = () => document.visibilityState === 'visible' && void check();

    void check();
    const interval = window.setInterval(() => void check(), SESSION_CHECK_INTERVAL_MS);
    document.addEventListener('visibilitychange', onVisible);
    window.addEventListener('focus', onVisible);

    return () => {
      cancelled = true;
      window.clearInterval(interval);
      document.removeEventListener('visibilitychange', onVisible);
      window.removeEventListener('focus', onVisible);
    };
  }, [userId]);
};
