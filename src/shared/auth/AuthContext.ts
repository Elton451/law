import { createContext } from 'react';
import type { AuthState } from './types';

export const AuthContext = createContext<AuthState | null>(null);

/** Reloads the signed-in user's profile, after it was changed (completar cadastro, Minha conta). */
export const RefreshProfileContext = createContext<(() => Promise<void>) | null>(null);
