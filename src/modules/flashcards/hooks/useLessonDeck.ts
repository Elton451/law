import { useCallback } from 'react';
import { useAsync } from '@shared/hooks/useAsync';
import { fetchLessonDeck } from '../api/flashcards';

export const useLessonDeck = (lessonId: string) => {
  const load = useCallback(() => fetchLessonDeck(lessonId), [lessonId]);
  return useAsync(load);
};
