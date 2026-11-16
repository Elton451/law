import { z } from 'zod';

/** A discipline is a novelo (stored as a trail): Civil, Penal… */
export const disciplineSchema = z.object({
  id: z.string(),
  slug: z.string(),
  name: z.string(),
});
export type Discipline = z.infer<typeof disciplineSchema>;

const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);

export const examEditionSchema = z.object({
  id: z.string(),
  number: z.number().int().positive(),
  firstPhaseDate: isoDate.nullable(),
  secondPhaseDate: isoDate,
  timezone: z.string(),
  sourceLabel: z.string().nullable(),
  sourceUrl: z.string().nullable(),
  isDemo: z.boolean(),
});
export type ExamEdition = z.infer<typeof examEditionSchema>;

export const offerSchema = z.object({
  id: z.string(),
  disciplineId: z.string(),
  examEditionId: z.string(),
  priceCents: z.number().int().positive(),
  active: z.boolean(),
});
export type Offer = z.infer<typeof offerSchema>;

export type Catalog = {
  disciplines: Discipline[];
  editions: ExamEdition[];
  offers: Offer[];
};

/** An offer with the discipline and edition it sells. */
export type OfferDetails = Offer & { discipline: Discipline; edition: ExamEdition };
