export type CaseOrigin = 'oab' | 'autoral';

/** "OAB — XXXV Exame" or "Autoral" (US-017, US-024). */
export const originLabel = ({
  origin,
  examEdition,
}: {
  origin: CaseOrigin;
  examEdition: string | null;
}) => (origin === 'oab' ? `OAB — ${examEdition ?? 'Exame'}` : 'Autoral');
