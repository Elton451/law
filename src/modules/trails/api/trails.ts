import { z } from 'zod';
import { supabase } from '@shared/lib/supabase';

const trailRowSchema = z.object({
  id: z.string(),
  slug: z.string(),
  name: z.string(),
  total_lessons: z.number().int().nonnegative(),
  completed_lessons: z.number().int().nonnegative(),
});

export type Trail = {
  id: string;
  slug: string;
  name: string;
  totalLessons: number;
  completedLessons: number;
};

/** The 7 trails, alphabetical, with the signed-in student's progress. */
export const fetchTrails = async (): Promise<Trail[]> => {
  const { data, error } = await supabase.rpc('get_trails_with_progress');
  if (error) throw error;

  return z
    .array(trailRowSchema)
    .parse(data)
    .map((row) => ({
      id: row.id,
      slug: row.slug,
      name: row.name,
      totalLessons: row.total_lessons,
      completedLessons: row.completed_lessons,
    }));
};
