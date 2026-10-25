import { useLocation } from 'react-router';
import { paths } from '@shared/routes';

/** The case list, with the filters it had when the admin left it to open a case. */
export const useListPath = () => {
  const { state } = useLocation();
  const listSearch = (state as { listSearch?: unknown } | null)?.listSearch;
  return `${paths.adminCases}${typeof listSearch === 'string' ? listSearch : ''}`;
};
