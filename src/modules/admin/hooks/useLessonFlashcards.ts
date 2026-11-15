import { useCallback } from 'react';
import { useAsync } from '@shared/hooks/useAsync';
import { fetchLessonFlashcards } from '../api/flashcards';

export const useLessonFlashcards = (lessonId: string) => {
  const load = useCallback(() => fetchLessonFlashcards(lessonId), [lessonId]);
  return useAsync(load);
};
