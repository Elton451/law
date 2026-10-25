import { useAsync } from '@shared/hooks/useAsync';
import { fetchTrails } from '../api/cases';

export const useTrails = () => useAsync(fetchTrails);
