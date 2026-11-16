import type { OfferDetails } from '@shared/catalog/types';

/**
 * The offer for the exam in the URL, or undefined when that exam has no offer
 * on sale (the page then falls back to the soonest one).
 */
export const selectOffer = (offers: OfferDetails[], exam: string | undefined) =>
  exam ? offers.find((offer) => String(offer.edition.number) === exam) : undefined;
