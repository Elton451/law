export const colors = {
  bgBase: '#1C1C1F', // page background (neutral dark gray, generation base)
  bgContainer: '#242428', // cards, headers, containers
  bgElevated: '#2C2C31', // hover/elevated surfaces
  bgLayout: '#18181B', // outer layout background
  border: '#3A3A40',
  borderSecondary: '#2E2E33',

  primary: '#C9A64A', // gold — CTAs, wordmark accent
  primaryHover: '#D9BC6F',
  primaryActive: '#B38F3D',

  accent: '#6B7280', // neutral accent — secondary accent, focus rings, links
  accentSoft: '#9CA3AF',

  textPrimary: '#EDEDED',
  textSecondary: '#A1A1AA',
  textTertiary: '#71717A',
  textQuaternary: '#52525B',
  textOnPrimary: '#1C1C1F', // text on gold buttons

  success: '#4C9A6A',
  warning: '#C98A3E',
  error: '#C9524A',
  info: '#6B7280',
} as const;

export const typography = {
  fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  fontFamilyCode: "'Fira Code', monospace",
  fontSize: 14,
} as const;

export const radii = {
  sm: 6,
  md: 8,
  lg: 12,
  pill: 999,
} as const;

export const spacing = {
  base: 16,
  lg: 24,
} as const;
