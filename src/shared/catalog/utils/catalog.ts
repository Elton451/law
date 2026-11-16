import type { Catalog, Discipline, ExamEdition, OfferDetails } from '../types';

/** Today's calendar date ('YYYY-MM-DD') in `timeZone`. */
export const todayIn = (timeZone: string, now: Date = new Date()) =>
  new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(now);

/** A calendar date ('YYYY-MM-DD') as dd/mm/aaaa, with no time-zone shift. */
export const formatDate = (isoDate: string) => {
  const [year, month, day] = isoDate.split('-');
  return `${day}/${month}/${year}`;
};

/** Adds whole days to a calendar date ('YYYY-MM-DD'). */
export const addDays = (isoDate: string, days: number) => {
  const date = new Date(`${isoDate}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
};

export const formatPrice = (cents: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(cents / 100);

/** "Direito Civil", as the offer copy reads (SB02). */
export const disciplineTitle = (discipline: Pick<Discipline, 'name'>) =>
  `Direito ${discipline.name}`;

/**
 * Last day of access to the material: the day after the second phase (RN02).
 * PENDENTE D02 — the exact limit still needs the owner's confirmation.
 */
export const accessEndDate = (edition: Pick<ExamEdition, 'secondPhaseDate'>) =>
  addDays(edition.secondPhaseDate, 1);

export type EditionSituation = 'Prevista' | 'Realizada';

export const editionSituation = (edition: ExamEdition, now: Date = new Date()): EditionSituation =>
  edition.secondPhaseDate >= todayIn(edition.timezone, now) ? 'Prevista' : 'Realizada';

/**
 * On sale while active and before the second phase (mirrors `offer_is_open` in
 * the database, which is what actually decides).
 */
export const isOfferOpen = (
  offer: { active: boolean },
  edition: ExamEdition,
  now: Date = new Date(),
) => offer.active && editionSituation(edition, now) === 'Prevista';

/** Every offer with its discipline and edition, dropping any whose relations aren't visible. */
export const offerDetails = (catalog: Catalog): OfferDetails[] =>
  catalog.offers.flatMap((offer) => {
    const discipline = catalog.disciplines.find((d) => d.id === offer.disciplineId);
    const edition = catalog.editions.find((e) => e.id === offer.examEditionId);
    return discipline && edition ? [{ ...offer, discipline, edition }] : [];
  });

/** Offers on sale, soonest exam first; only for `disciplineSlug` when given. */
export const openOffers = (catalog: Catalog, disciplineSlug?: string, now: Date = new Date()) =>
  offerDetails(catalog)
    .filter((offer) => !disciplineSlug || offer.discipline.slug === disciplineSlug)
    .filter((offer) => isOfferOpen(offer, offer.edition, now))
    .sort((a, b) => a.edition.secondPhaseDate.localeCompare(b.edition.secondPhaseDate));

export const findOffer = (catalog: Catalog, offerId: string | null | undefined) =>
  offerId ? offerDetails(catalog).find((offer) => offer.id === offerId) : undefined;
