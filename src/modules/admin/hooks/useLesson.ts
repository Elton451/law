import { useCallback } from 'react';
import { useAsync } from '@shared/hooks/useAsync';
import { fetchLesson } from '../api/flashcards';

export const useLesson = (lessonId: string) => {
  const load = useCallback(() => fetchLesson(lessonId), [lessonId]);
  return useAsync(load);
};
