import { useContext } from 'react';
import { RefreshProfileContext } from '../AuthContext';

export const useRefreshProfile = () => {
  const refresh = useContext(RefreshProfileContext);
  if (!refresh) throw new Error('useRefreshProfile must be used inside <AuthProvider>');
  return refresh;
};
