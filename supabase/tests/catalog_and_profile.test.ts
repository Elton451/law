import type { PGlite } from '@electric-sql/pglite';
import { describe, expect, it } from 'vitest';
import { asAnon, asUser, createDb, createUser, trailId } from './db.ts';

const ANA = '00000000-0000-4000-8000-00000000000a';
const BIA = '00000000-0000-4000-8000-00000000000b';

const createEdition = async (db: PGlite, number: number, secondPhase: string, published = true) => {
  const { rows } = await db.query<{ id: string }>(
    `insert into public.exam_editions (number, second_phase_date, published)
     values ($1, $2, $3) returning id`,
    [number, secondPhase, published],
  );
  return rows[0].id;
};

const createOffer = async (db: PGlite, trail: string, edition: string, active = true) => {
  const { rows } = await db.query<{ id: string }>(
    `insert into public.offers (trail_id, exam_edition_id, price_cents, active)
     values ($1, $2, 7990, $3) returning id`,
    [trail, edition, active],
  );
  return rows[0].id;
};

/** A catalog with one open offer (Civil, exam 99 next year). */
const setup = async () => {
  const db = await createDb();
  const civil = await trailId(db, 'civil');
  const nextYear = `${new Date().getFullYear() + 1}-06-01`;
  const edition = await createEdition(db, 99, nextYear);
  const offer = await createOffer(db, civil, edition);
  return { db, civil, edition, offer };
};

const passwordSignUp = (db: PGlite, id: string, meta: Record<string, unknown>) =>
  db.query(
    `insert into auth.users (id, raw_user_meta_data, raw_app_meta_data) values ($1, $2, $3)`,
    [id, meta, { provider: 'email' }],
  );

const profile = async (db: PGlite, id: string) => {
  const { rows } = await db.query<{ name: string | null; uf: string | null; offer_id: string }>(
    `select name, uf, offer_id from public.profiles where id = $1`,
    [id],
  );
  return rows[0];
};

describe('catalog', () => {
  it('lets visitors read trails, published editions and their offers only', async () => {
    const { db, civil, offer } = await setup();
    const hidden = await createEdition(db, 98, '2030-01-01', false);
    await createOffer(db, civil, hidden);

    const result = await asAnon(db, async (tx) => ({
      trails: (await tx.query(`select 1 from public.trails`)).rows.length,
      editions: (await tx.query<{ number: number }>(`select number from public.exam_editions`))
        .rows,
      offers: (await tx.query<{ id: string }>(`select id from public.offers`)).rows,
    }));

    expect(result).toEqual({ trails: 7, editions: [{ number: 99 }], offers: [{ id: offer }] });
  });

  it('does not let visitors or users write to the catalog', async () => {
    const { db, offer } = await setup();
    await createUser(db, ANA);

    await expect(
      asAnon(db, (tx) =>
        tx.query(`update public.offers set price_cents = 1 where id = $1`, [offer]),
      ),
    ).rejects.toThrow(/permission denied/);
    await expect(
      asUser(db, ANA, (tx) =>
        tx.query(`update public.offers set price_cents = 1 where id = $1`, [offer]),
      ),
    ).rejects.toThrow(/permission denied/);
  });

  it('only sells active offers whose second phase has not passed', async () => {
    const { db, civil, edition, offer } = await setup();
    const penal = await trailId(db, 'penal');
    const inactive = await createOffer(db, penal, edition, false);
    const past = await createEdition(db, 10, '2020-01-01');
    const expired = await createOffer(db, civil, past);

    const isOpen = async (id: string) =>
      (await db.query<{ open: boolean }>(`select public.offer_is_open($1) as open`, [id])).rows[0]
        .open;

    expect([await isOpen(offer), await isOpen(inactive), await isOpen(expired)]).toEqual([
      true,
      false,
      false,
    ]);
  });
});

describe('profile on sign-up', () => {
  it('stores the validated fields of a password sign-up', async () => {
    const { db, offer } = await setup();
    await passwordSignUp(db, ANA, { name: '  Ana Souza ', uf: 'sp', offer_id: offer });

    expect(await profile(db, ANA)).toEqual({ name: 'Ana Souza', uf: 'SP', offer_id: offer });
  });

  it.each([
    ['a missing UF', { name: 'Ana Souza', uf: 'XX' }, /invalid uf/],
    ['a short name', { name: 'A', uf: 'SP' }, /invalid name/],
    ['a garbage offer', { name: 'Ana Souza', uf: 'SP', offer_id: 'x' }, /invalid offer/],
  ])('rejects a password sign-up with %s', async (_, meta, error) => {
    const { db, offer } = await setup();
    await expect(passwordSignUp(db, ANA, { offer_id: offer, ...meta })).rejects.toThrow(error);
  });

  it('keeps the account when the offer closed during sign-up, without the offer', async () => {
    const { db, civil } = await setup();
    const past = await createEdition(db, 10, '2020-01-01');
    const expired = await createOffer(db, civil, past);

    await passwordSignUp(db, ANA, { name: 'Ana Souza', uf: 'SP', offer_id: expired });

    expect(await profile(db, ANA)).toEqual({ name: 'Ana Souza', uf: 'SP', offer_id: null });
  });

  it('accepts a Google sign-up without the fields, to be completed later', async () => {
    const { db } = await setup();
    await db.query(
      `insert into auth.users (id, raw_user_meta_data, raw_app_meta_data) values ($1, $2, $3)`,
      [ANA, { full_name: 'Ana Souza', uf: 'ZZ' }, { provider: 'google' }],
    );

    expect(await profile(db, ANA)).toEqual({ name: 'Ana Souza', uf: null, offer_id: null });
  });
});

describe('update_profile', () => {
  const update = (db: PGlite, user: string, name: string, uf: string, offer: string | null) =>
    asUser(db, user, (tx) =>
      tx.query(`select public.update_profile($1, $2, $3)`, [name, uf, offer]),
    );

  it('completes the caller’s own profile and nobody else’s', async () => {
    const { db, offer } = await setup();
    await createUser(db, ANA);
    await createUser(db, BIA);

    await update(db, ANA, 'Ana Souza', 'rj', offer);

    expect(await profile(db, ANA)).toEqual({ name: 'Ana Souza', uf: 'RJ', offer_id: offer });
    expect((await profile(db, BIA)).uf).toBeNull();
  });

  it('validates every field', async () => {
    const { db, offer } = await setup();
    await createUser(db, ANA);

    await expect(update(db, ANA, 'A', 'SP', offer)).rejects.toThrow(/invalid name/);
    await expect(update(db, ANA, 'Ana Souza', 'XX', offer)).rejects.toThrow(/invalid uf/);
    await expect(update(db, ANA, 'Ana Souza', 'SP', null)).rejects.toThrow(/invalid offer/);
  });

  it('keeps an offer that has closed, but does not switch to one', async () => {
    const { db, civil, offer } = await setup();
    await createUser(db, ANA);
    await update(db, ANA, 'Ana Souza', 'SP', offer);
    await db.query(`update public.offers set active = false where id = $1`, [offer]);

    await update(db, ANA, 'Ana Lima', 'SP', offer);
    expect((await profile(db, ANA)).name).toBe('Ana Lima');

    const past = await createEdition(db, 10, '2020-01-01');
    const expired = await createOffer(db, civil, past);
    await expect(update(db, ANA, 'Ana Lima', 'SP', expired)).rejects.toThrow(/invalid offer/);
  });

  it('still forbids writing the profile, role included, directly', async () => {
    const { db } = await setup();
    await createUser(db, ANA);

    await expect(
      asUser(db, ANA, (tx) =>
        tx.query(`update public.profiles set role = 'admin' where id = $1`, [ANA]),
      ),
    ).rejects.toThrow(/permission denied/);
  });
});
