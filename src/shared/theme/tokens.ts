// Brand palette (docs/README.md → Identidade visual): marfim as the base, ameixa
// for text and navigation, lavanda for supporting surfaces, ametista for
// selection and dourado for highlighted actions.
export const colors = {
  bgBase: '#FFFFFF', // cards, headers, containers on top of the marfim page
  bgContainer: '#FFFFFF',
  bgElevated: '#F3EFF7', // hover/elevated and inset surfaces (light lavanda)
  bgLayout: '#F8F6F2', // marfim — page background
  surface: '#E7E0EF', // lavanda — supporting surfaces (highlights, side panels)
  border: '#D9D0E3',
  borderSecondary: '#E9E3EF',

  primary: '#C6A15B', // dourado — highlighted actions (CTAs)
  primaryHover: '#D2B373',
  primaryActive: '#AE8A46',
  primaryText: '#7A5B1E', // dourado dark enough for text on marfim/white (AA)

  accent: '#8063AD', // ametista — selection, focus, links
  accentSoft: '#6A4F96', // ametista hover (darker on light backgrounds)

  textPrimary: '#302638', // ameixa
  textSecondary: '#5C5066',
  textTertiary: '#7A6F84',
  textQuaternary: '#A79EB0',
  textOnPrimary: '#302638', // ameixa on dourado (white wouldn't have enough contrast)
  textOnAccent: '#FFFFFF',

  success: '#2E7D4F',
  warning: '#9A6212',
  error: '#B3261E',
  info: '#8063AD',
} as const;

// One identity color per discipline (novelo), keyed by the trail slug in the
// database. Approximations from the reference; never the only way to tell
// disciplines apart (always shown with the name).
export const trailColors: Record<string, string> = {
  administrativo: '#F084CF',
  civil: '#74C8F0',
  constitucional: '#4CCD73',
  empresarial: '#575757',
  penal: '#F16F70',
  trabalhista: '#F99F78',
  tributario: '#F6E9A4',
};

// PROPOSTA (docs/README.md): official fonts weren't named yet — Georgia for
// headings and the system sans-serif for the interface, until replaced.
export const typography = {
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
  fontFamilyHeading: "Georgia, 'Times New Roman', serif",
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
