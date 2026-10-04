import { useContext } from 'react';
import { AuthContext } from './AuthContext';

export const useAuth = () => {
  const state = useContext(AuthContext);
  if (!state) throw new Error('useAuth must be used inside <AuthProvider>');
  return state;
};
