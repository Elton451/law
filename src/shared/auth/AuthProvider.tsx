import { useEffect, useRef, useState, type ReactNode } from 'react';
import { supabase } from '@shared/lib/supabase';
import { AuthContext } from './AuthContext';
import { fetchProfile } from './authService';
import type { AuthState } from './types';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<AuthState>({ status: 'loading' });
  // Ignores profile responses that arrive after a newer auth event.
  const latestEvent = useRef(0);
  // Who the current state is about (loading or signed in), or null when signed out.
  const currentUserId = useRef<string | null>(null);

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      const userId = session?.user.id ?? null;
      // Supabase re-announces the same user on token refreshes and every time the
      // tab regains focus. Going back to 'loading' would unmount the page behind
      // RequireAuth and throw away whatever the student was typing.
      if (event !== 'INITIAL_SESSION' && userId === currentUserId.current) return;
      currentUserId.current = userId;

      const eventId = ++latestEvent.current;

      if (!userId) {
        setState({ status: 'signedOut' });
        return;
      }

      setState({ status: 'loading' });
      // Supabase warns against awaiting its own calls inside this callback.
      setTimeout(async () => {
        const profile = await fetchProfile(userId);
        if (eventId !== latestEvent.current) return;
        setState({ status: 'signedIn', userId, profile });
      }, 0);
    });

    return () => subscription.unsubscribe();
  }, []);

  return <AuthContext.Provider value={state}>{children}</AuthContext.Provider>;
};
