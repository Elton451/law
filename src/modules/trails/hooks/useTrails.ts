import { useAsync } from '@shared/hooks/useAsync';
import { fetchTrails } from '../api/trails';

export const useTrails = () => useAsync(fetchTrails);
