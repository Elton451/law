import { useAsync } from '@shared/hooks/useAsync';
import { fetchTrails } from './api';

export const useTrails = () => useAsync(fetchTrails);
