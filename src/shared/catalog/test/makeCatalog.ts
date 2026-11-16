import type { Catalog, ExamEdition, Offer } from '../types';

const DISCIPLINES = [
  ['administrativo', 'Administrativo'],
  ['civil', 'Civil'],
  ['constitucional', 'Constitucional'],
  ['empresarial', 'Empresarial'],
  ['penal', 'Penal'],
  ['trabalhista', 'Trabalhista'],
  ['tributario', 'Tributário'],
] as const;

export const makeEdition = (overrides: Partial<ExamEdition> = {}): ExamEdition => ({
  id: 'e46',
  number: 46,
  firstPhaseDate: '2099-01-05',
  secondPhaseDate: '2099-02-10',
  timezone: 'America/Sao_Paulo',
  sourceLabel: null,
  sourceUrl: null,
  isDemo: true,
  ...overrides,
});

export const makeOffer = (overrides: Partial<Offer> = {}): Offer => ({
  id: 'offer-civil-46',
  disciplineId: 'civil',
  examEditionId: 'e46',
  priceCents: 7990,
  active: true,
  ...overrides,
});

/** The seven novelos, with the given editions and offers (discipline ids are their slugs). */
export const makeCatalog = ({
  editions = [makeEdition()],
  offers = [makeOffer()],
}: Partial<Pick<Catalog, 'editions' | 'offers'>> = {}): Catalog => ({
  disciplines: DISCIPLINES.map(([slug, name]) => ({ id: slug, slug, name })),
  editions,
  offers,
});
