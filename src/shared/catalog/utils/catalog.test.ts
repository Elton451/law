import { describe, expect, it } from 'vitest';
import { makeCatalog, makeEdition, makeOffer } from '../test/makeCatalog';
import {
  accessEndDate,
  addDays,
  editionSituation,
  formatDate,
  formatPrice,
  openOffers,
  todayIn,
} from './catalog';

describe('dates', () => {
  it('uses the calendar day of the edition time zone', () => {
    // 01:00 UTC is still the previous day in São Paulo.
    expect(todayIn('America/Sao_Paulo', new Date('2027-01-11T01:00:00Z'))).toBe('2027-01-10');
  });

  it('formats and adds days without time-zone shifts', () => {
    expect(formatDate('2027-01-10')).toBe('10/01/2027');
    expect(addDays('2027-12-31', 1)).toBe('2028-01-01');
  });

  it('gives access until the day after the second phase (PENDENTE D02)', () => {
    expect(accessEndDate({ secondPhaseDate: '2027-01-10' })).toBe('2027-01-11');
  });

  it('marks an edition held after its second phase', () => {
    const edition = makeEdition({ secondPhaseDate: '2027-01-10' });
    expect(editionSituation(edition, new Date('2027-01-10T23:00:00-03:00'))).toBe('Prevista');
    expect(editionSituation(edition, new Date('2027-01-11T00:00:00-03:00'))).toBe('Realizada');
  });
});

describe('formatPrice', () => {
  it('formats cents as reais', () => {
    expect(formatPrice(7990).replace(/\s/g, ' ')).toBe('R$ 79,90');
  });
});

describe('openOffers', () => {
  it('keeps active offers of upcoming editions, soonest first, per discipline', () => {
    const catalog = makeCatalog({
      editions: [
        makeEdition({ id: 'e47', number: 47, secondPhaseDate: '2099-08-10' }),
        makeEdition({ id: 'e46', number: 46, secondPhaseDate: '2099-02-10' }),
        makeEdition({ id: 'e40', number: 40, secondPhaseDate: '2020-02-10' }),
      ],
      offers: [
        makeOffer({ id: 'civil-47', examEditionId: 'e47' }),
        makeOffer({ id: 'civil-46', examEditionId: 'e46' }),
        makeOffer({ id: 'civil-40', examEditionId: 'e40' }),
        makeOffer({ id: 'penal-46', disciplineId: 'penal', active: false }),
      ],
    });

    expect(openOffers(catalog, 'civil').map((offer) => offer.id)).toEqual(['civil-46', 'civil-47']);
    expect(openOffers(catalog, 'penal')).toEqual([]);
  });
});
