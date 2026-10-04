import { paths } from '@shared/routes';
import type { UserRole } from './types';

export const homePathForRole = (role: UserRole | undefined) =>
  role === 'admin' ? paths.admin : paths.trails;
