import { useAsync } from '@shared/hooks/useAsync';
import { fetchCatalog } from '../api/catalog';

/** The public catalog: novelos, published exam editions and offers. */
export const useCatalog = () => useAsync(fetchCatalog);
