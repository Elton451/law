import { useAsync } from '@shared/hooks/useAsync';
import { fetchFlashcardLessons } from '../api/flashcards';

export const useFlashcardLessons = () => useAsync(fetchFlashcardLessons);
