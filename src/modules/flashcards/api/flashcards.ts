import { z } from 'zod';
import { supabase } from '@shared/lib/supabase';

const trailSchema = z.object({ id: z.string(), slug: z.string(), name: z.string() });
export type Trail = z.infer<typeof trailSchema>;

const flashcardSchema = z.object({ id: z.string(), front: z.string(), back: z.string() });
export type Flashcard = z.infer<typeof flashcardSchema>;

const lessonDeckRowSchema = z.object({
  id: z.string(),
  title: z.string(),
  flashcards: z.array(flashcardSchema),
});
export type LessonDeck = z.infer<typeof lessonDeckRowSchema>;

const lessonRowSchema = z.object({
  module_id: z.string(),
  module_title: z.string(),
  lesson_id: z.string(),
  lesson_title: z.string(),
  card_count: z.number().int().nonnegative(),
  studied_count: z.number().int().nonnegative(),
});

export type FlashcardLesson = {
  id: string;
  title: string;
  cardCount: number;
  /** Cards of the lesson the student has answered at least once. */
  studiedCount: number;
};

export type FlashcardModule = { id: string; title: string; lessons: FlashcardLesson[] };

const dueCountRowSchema = z.object({
  trail_id: z.string(),
  slug: z.string(),
  name: z.string(),
  due_count: z.number().int().nonnegative(),
});

export type TrailDueCount = Trail & { dueCount: number };

export const fetchTrail = async (slug: string): Promise<Trail | null> => {
  const { data, error } = await supabase
    .from('trails')
    .select('id, slug, name')
    .eq('slug', slug)
    .maybeSingle();
  if (error) throw error;
  return data ? trailSchema.parse(data) : null;
};

/** The trail's lessons that have flashcards, grouped by module, in the admin's order. */
export const fetchTrailLessons = async (trailId: string): Promise<FlashcardModule[]> => {
  const { data, error } = await supabase.rpc('get_trail_flashcard_lessons', {
    p_trail_id: trailId,
  });
  if (error) throw error;

  const modules: FlashcardModule[] = [];
  for (const row of z.array(lessonRowSchema).parse(data)) {
    const lesson = {
      id: row.lesson_id,
      title: row.lesson_title,
      cardCount: row.card_count,
      studiedCount: row.studied_count,
    };
    const last = modules.at(-1);
    if (last?.id === row.module_id) last.lessons.push(lesson);
    else modules.push({ id: row.module_id, title: row.module_title, lessons: [lesson] });
  }
  return modules;
};

/** Cards due for review today in each trail, alphabetical. */
export const fetchDueCounts = async (): Promise<TrailDueCount[]> => {
  const { data, error } = await supabase.rpc('get_flashcard_due_counts');
  if (error) throw error;

  return z
    .array(dueCountRowSchema)
    .parse(data)
    .map((row) => ({ id: row.trail_id, slug: row.slug, name: row.name, dueCount: row.due_count }));
};

/** A lesson with its live cards, in order. Null when it doesn't exist (or was removed). */
export const fetchLessonDeck = async (lessonId: string): Promise<LessonDeck | null> => {
  const { data, error } = await supabase
    .from('lessons')
    .select('id, title, flashcards (id, front, back)')
    .eq('id', lessonId)
    .order('position', { referencedTable: 'flashcards' })
    .maybeSingle();
  if (error) throw error;
  return data ? lessonDeckRowSchema.parse(data) : null;
};

/** The student's cards due today, oldest first, from one trail or all of them. */
export const fetchDueCards = async (
  trailId: string | null,
  limit: number,
): Promise<Flashcard[]> => {
  const { data, error } = await supabase.rpc('get_due_flashcards', {
    p_trail_id: trailId,
    p_limit: limit,
  });
  if (error) throw error;
  return z.array(flashcardSchema).parse(data);
};

/** Records the student's answer and schedules the card's next review (US-010). */
export const reviewFlashcard = async (flashcardId: string, correct: boolean) => {
  const { error } = await supabase.rpc('review_flashcard', {
    p_flashcard_id: flashcardId,
    p_correct: correct,
  });
  if (error) throw error;
};
