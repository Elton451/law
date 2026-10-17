import type { CaseStudy } from './api';

/** "OAB — XXXV Exame" or "Autoral" (US-017). */
export const originLabel = ({ origin, examEdition }: Pick<CaseStudy, 'origin' | 'examEdition'>) =>
  origin === 'oab' ? `OAB — ${examEdition ?? 'Exame'}` : 'Autoral';
