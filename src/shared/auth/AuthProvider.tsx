import { useEffect, useRef, useState, type ReactNode } from 'react';
import { supabase } from '@shared/lib/supabase';
import { AuthContext } from './AuthContext';
import { fetchProfile } from './authService';
import type { AuthState } from './types';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<AuthState>({ status: 'loading' });
  // Ignores profile responses that arrive after a newer auth event.
  const latestEvent = useRef(0);

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      // Token refreshes don't change who is signed in; skip the refetch.
      if (event === 'TOKEN_REFRESHED') return;

      const eventId = ++latestEvent.current;

      if (!session) {
        setState({ status: 'signedOut' });
        return;
      }

      setState({ status: 'loading' });
      // Supabase warns against awaiting its own calls inside this callback.
      setTimeout(async () => {
        const profile = await fetchProfile(session.user.id);
        if (eventId !== latestEvent.current) return;
        setState({ status: 'signedIn', userId: session.user.id, profile });
      }, 0);
    });

    return () => subscription.unsubscribe();
  }, []);

  return <AuthContext.Provider value={state}>{children}</AuthContext.Provider>;
};
