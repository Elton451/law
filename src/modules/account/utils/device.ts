const BROWSERS: [RegExp, string][] = [
  [/Edg\//, 'Edge'],
  [/OPR\//, 'Opera'],
  [/Firefox\//, 'Firefox'],
  [/Chrome\//, 'Chrome'],
  [/Safari\//, 'Safari'],
];

const SYSTEMS: [RegExp, string][] = [
  [/Android/, 'Android'],
  [/iPhone|iPad/, 'iOS'],
  [/Windows/, 'Windows'],
  [/Mac OS X|Macintosh/, 'macOS'],
  [/Linux/, 'Linux'],
];

const match = (userAgent: string, table: [RegExp, string][]) =>
  table.find(([pattern]) => pattern.test(userAgent))?.[1];

/** "Chrome no Windows", from a session's user agent, for the device list. */
export const describeDevice = (userAgent: string | null) => {
  if (!userAgent) return 'Dispositivo desconhecido';
  const browser = match(userAgent, BROWSERS) ?? 'Navegador';
  const system = match(userAgent, SYSTEMS);
  return system ? `${browser} no ${system}` : browser;
};

/** A timestamp in pt-BR, in the São Paulo time zone (contratos técnicos). */
export const formatDateTime = (iso: string) =>
  new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
    timeZone: 'America/Sao_Paulo',
  }).format(new Date(iso));
