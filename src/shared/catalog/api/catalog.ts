import { z } from 'zod';
import { supabase } from '@shared/lib/supabase';
import {
  disciplineSchema,
  examEditionSchema,
  offerSchema,
  type Catalog,
  type Discipline,
  type ExamEdition,
  type Offer,
} from '../types';

const editionRowSchema = z
  .object({
    id: z.string(),
    number: z.number(),
    first_phase_date: z.string().nullable(),
    second_phase_date: z.string(),
    timezone: z.string(),
    source_label: z.string().nullable(),
    source_url: z.string().nullable(),
    is_demo: z.boolean(),
  })
  .transform((row): ExamEdition =>
    examEditionSchema.parse({
      id: row.id,
      number: row.number,
      firstPhaseDate: row.first_phase_date,
      secondPhaseDate: row.second_phase_date,
      timezone: row.timezone,
      sourceLabel: row.source_label,
      sourceUrl: row.source_url,
      isDemo: row.is_demo,
    }),
  );

const offerRowSchema = z
  .object({
    id: z.string(),
    trail_id: z.string(),
    exam_edition_id: z.string(),
    price_cents: z.number(),
    active: z.boolean(),
  })
  .transform((row): Offer =>
    offerSchema.parse({
      id: row.id,
      disciplineId: row.trail_id,
      examEditionId: row.exam_edition_id,
      priceCents: row.price_cents,
      active: row.active,
    }),
  );

const fetchDisciplines = async (): Promise<Discipline[]> => {
  const { data, error } = await supabase.from('trails').select('id, slug, name').order('name');
  if (error) throw error;
  return z.array(disciplineSchema).parse(data);
};

// RLS returns only published editions and their offers.
const fetchEditions = async (): Promise<ExamEdition[]> => {
  const { data, error } = await supabase
    .from('exam_editions')
    .select(
      'id, number, first_phase_date, second_phase_date, timezone, source_label, source_url, is_demo',
    )
    .order('second_phase_date');
  if (error) throw error;
  return z.array(editionRowSchema).parse(data);
};

const fetchOffers = async (): Promise<Offer[]> => {
  const { data, error } = await supabase
    .from('offers')
    .select('id, trail_id, exam_edition_id, price_cents, active');
  if (error) throw error;
  return z.array(offerRowSchema).parse(data);
};

/** Everything a visitor may see: the seven novelos, published editions and their offers. */
export const fetchCatalog = async (): Promise<Catalog> => {
  const [disciplines, editions, offers] = await Promise.all([
    fetchDisciplines(),
    fetchEditions(),
    fetchOffers(),
  ]);
  return { disciplines, editions, offers };
};
