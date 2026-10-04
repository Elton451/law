import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router';
import FullPageSpinner from '@shared/components/FullPageSpinner/FullPageSpinner';
import { homePathForRole } from './homePathForRole';
import { useAuth } from './useAuth';

// Only same-app paths: "/x" but not "//evil.com" or "/\\evil.com", which browsers treat as other hosts.
const isInternalPath = (path: string) => /^\/(?![/\\])/.test(path);

const fromPath = (state: unknown): string | undefined => {
  if (state && typeof state === 'object' && 'from' in state && typeof state.from === 'string') {
    return isInternalPath(state.from) ? state.from : undefined;
  }
  return undefined;
};

/** Guest-only pages (login, sign-up): send signed-in users to where they belong. */
const RedirectIfAuthenticated = ({ children }: { children: ReactNode }) => {
  const auth = useAuth();
  const location = useLocation();

  if (auth.status === 'loading') return <FullPageSpinner />;

  if (auth.status === 'signedIn') {
    const to = fromPath(location.state) ?? homePathForRole(auth.profile?.role);
    return <Navigate to={to} replace />;
  }

  return children;
};

export default RedirectIfAuthenticated;
