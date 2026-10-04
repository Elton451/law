import { Result } from 'antd';
import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router';
import FullPageSpinner from '@shared/components/FullPageSpinner/FullPageSpinner';
import { paths } from '@shared/routes';
import type { UserRole } from './types';
import { useAuth } from './useAuth';

type RequireAuthProps = {
  role?: UserRole;
  children: ReactNode;
};

const RequireAuth = ({ role, children }: RequireAuthProps) => {
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

  return children;
};

export default RequireAuth;
