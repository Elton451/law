import { useSearchParams } from 'react-router';
import { OFFER_PARAM } from '@shared/routes';

/** The offer id carried in the URL from the offer page (?oferta=…), if any. */
export const useOfferParam = () => {
  const [params] = useSearchParams();
  return params.get(OFFER_PARAM) ?? undefined;
};
