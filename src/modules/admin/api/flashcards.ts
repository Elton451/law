import { z } from 'zod';
import { supabase } from '@shared/lib/supabase';
import type { FlashcardFormValues } from '../schemas/flashcardForm';

const lessonRowSchema = z.object({
  trail_id: z.string(),
  trail_name: z.string(),
  module_id: z.string(),
  module_title: z.string(),
  lesson_id: z.string(),
  lesson_title: z.string(),
  card_count: z.number().int().nonnegative(),
});

export type FlashcardLesson = {
  id: string;
  title: string;
  trailId: string;
  trailName: string;
  moduleTitle: string;
  cardCount: number;
};

const lessonDetailRowSchema = z.object({
  id: z.string(),
  title: z.string(),
  module: z.object({ title: z.string(), trail: z.object({ name: z.string() }) }),
});

export type LessonDetail = { id: string; title: string; moduleTitle: string; trailName: string };

const flashcardSchema = z.object({ id: z.string(), front: z.string(), back: z.string() });
export type AdminFlashcard = z.infer<typeof flashcardSchema>;

/** Every lesson, in trail, module and lesson order, with how many cards it has. */
export const fetchFlashcardLessons = async (): Promise<FlashcardLesson[]> => {
  const { data, error } = await supabase.rpc('admin_list_flashcard_lessons');
  if (error) throw error;

  return z
    .array(lessonRowSchema)
    .parse(data)
    .map((row) => ({
      id: row.lesson_id,
      title: row.lesson_title,
      trailId: row.trail_id,
      trailName: row.trail_name,
      moduleTitle: row.module_title,
      cardCount: row.card_count,
    }));
};

/** The lesson with where it sits. Null when it doesn't exist (or was removed). */
export const fetchLesson = async (lessonId: string): Promise<LessonDetail | null> => {
  const { data, error } = await supabase
    .from('lessons')
    .select('id, title, module:modules (title, trail:trails (name))')
    .eq('id', lessonId)
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;

  const row = lessonDetailRowSchema.parse(data);
  return {
    id: row.id,
    title: row.title,
    moduleTitle: row.module.title,
    trailName: row.module.trail.name,
  };
};

/** The lesson's live cards, in order. */
export const fetchLessonFlashcards = async (lessonId: string): Promise<AdminFlashcard[]> => {
  const { data, error } = await supabase
    .from('flashcards')
    .select('id, front, back')
    .eq('lesson_id', lessonId)
    .order('position');
  if (error) throw error;
  return z.array(flashcardSchema).parse(data);
};

/** Appends the cards to the end of the lesson, all or none. Returns how many were added. */
export const addFlashcards = async (
  lessonId: string,
  cards: FlashcardFormValues[],
): Promise<number> => {
  const { data, error } = await supabase.rpc('admin_add_flashcards', {
    p_lesson_id: lessonId,
    p_cards: cards.map(({ front, back }) => ({ front, back })),
  });
  if (error) throw error;
  return z.number().int().parse(data);
};

/** Students keep the card's review history (US-023). */
export const updateFlashcard = async (flashcardId: string, values: FlashcardFormValues) => {
  const { error } = await supabase.rpc('admin_update_flashcard', {
    p_flashcard_id: flashcardId,
    p_front: values.front,
    p_back: values.back,
  });
  if (error) throw error;
};

export const deleteFlashcard = async (flashcardId: string) => {
  const { error } = await supabase.rpc('admin_delete_flashcard', { p_flashcard_id: flashcardId });
  if (error) throw error;
};
