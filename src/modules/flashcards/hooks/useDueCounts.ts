import { useAsync } from '@shared/hooks/useAsync';
import { fetchDueCounts } from '../api/flashcards';

export const useDueCounts = () => useAsync(fetchDueCounts);
