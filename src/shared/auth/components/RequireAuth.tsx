import { Result } from 'antd';
import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router';
import FullPageSpinner from '@shared/components/FullPageSpinner/FullPageSpinner';
import { paths } from '@shared/routes';
import type { UserRole } from '../types';
import { useAuth } from '../hooks/useAuth';
import { isProfileComplete } from '../utils/profile';

type RequireAuthProps = {
  role?: UserRole;
  /** For the page that completes the profile itself. */
  allowIncompleteProfile?: boolean;
  children: ReactNode;
};

/**
 * Signed-in pages. Authorization here is only navigation: the database (RLS
 * and security definer functions) is what actually enforces it.
 */
const RequireAuth = ({ role, allowIncompleteProfile = false, children }: RequireAuthProps) => {
  const auth = useAuth();
  const location = useLocation();

  if (auth.status === 'loading') return <FullPageSpinner />;

  if (auth.status === 'signedOut') {
    return <Navigate to={paths.login} replace state={{ from: location.pathname }} />;
  }

  if (role && auth.profile?.role !== role) {
    return (
      <Result
        status="403"
        title="Acesso negado"
        subTitle="Você não tem permissão para acessar esta página."
      />
    );
  }

  // A Google sign-up still lacks UF and the chosen offer (SB03).
  if (!allowIncompleteProfile && !isProfileComplete(auth.profile)) {
    return <Navigate to={paths.completeProfile} replace />;
  }

  return children;
};

export default RequireAuth;
