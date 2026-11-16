import type { PGlite } from '@electric-sql/pglite';
import { describe, expect, it } from 'vitest';
import { asUser, createCase, createDb, createUser, trailId } from './db.ts';

const ANA = '00000000-0000-4000-8000-00000000000a';
const BIA = '00000000-0000-4000-8000-00000000000b';
const session = (n: number) => `00000000-0000-4000-9000-${String(n).padStart(12, '0')}`;

/** A login on a new device: Supabase creates the auth session, then the app registers it. */
const login = async (db: PGlite, user: string, n: number, createdAt: string) => {
  await db.query(`insert into auth.sessions (id, user_id, created_at) values ($1, $2, $3)`, [
    session(n),
    user,
    createdAt,
  ]);
  return register(db, user, n);
};

const register = (db: PGlite, user: string, n: number) =>
  asUser(
    db,
    user,
    async (tx) =>
      (await tx.query<{ status: string }>(`select public.register_session() as status`)).rows[0]
        .status,
    { sessionId: session(n) },
  );

const liveSessions = async (db: PGlite, user: string) =>
  (
    await db.query<{ id: string }>(
      `select id from auth.sessions where user_id = $1 order by created_at`,
      [user],
    )
  ).rows.map((row) => row.id);

describe('register_session', () => {
  it('keeps two devices and revokes the oldest login on the third', async () => {
    const db = await createDb();
    await createUser(db, ANA);

    expect(await login(db, ANA, 1, '2026-11-01T10:00Z')).toBe('active');
    expect(await login(db, ANA, 2, '2026-11-01T11:00Z')).toBe('active');
    expect(await liveSessions(db, ANA)).toEqual([session(1), session(2)]);

    expect(await login(db, ANA, 3, '2026-11-01T12:00Z')).toBe('active');
    expect(await liveSessions(db, ANA)).toEqual([session(2), session(3)]);

    // The revoked device learns why on its next check, and can't come back.
    expect(await register(db, ANA, 1)).toBe('revoked');
  });

  it('is idempotent for the same session (tabs of one browser profile)', async () => {
    const db = await createDb();
    await createUser(db, ANA);
    await login(db, ANA, 1, '2026-11-01T10:00Z');
    await login(db, ANA, 2, '2026-11-01T11:00Z');

    expect(await register(db, ANA, 2)).toBe('active');
    expect(await register(db, ANA, 2)).toBe('active');
    expect(await liveSessions(db, ANA)).toEqual([session(1), session(2)]);
  });

  it('never touches another user’s sessions', async () => {
    const db = await createDb();
    await createUser(db, ANA);
    await createUser(db, BIA);
    await login(db, BIA, 9, '2026-11-01T09:00Z');

    await login(db, ANA, 1, '2026-11-01T10:00Z');
    await login(db, ANA, 2, '2026-11-01T11:00Z');
    await login(db, ANA, 3, '2026-11-01T12:00Z');

    expect(await liveSessions(db, BIA)).toEqual([session(9)]);
  });

  it('requires a session in the JWT', async () => {
    const db = await createDb();
    await createUser(db, ANA);

    await expect(
      asUser(db, ANA, (tx) => tx.query(`select public.register_session()`)),
    ).rejects.toThrow(/not authenticated/);
  });
});

describe('end_session', () => {
  const end = (db: PGlite, user: string, from: number, target: number) =>
    asUser(db, user, (tx) => tx.query(`select public.end_session($1)`, [session(target)]), {
      sessionId: session(from),
    });

  it('signs out another of the caller’s devices', async () => {
    const db = await createDb();
    await createUser(db, ANA);
    await login(db, ANA, 1, '2026-11-01T10:00Z');
    await login(db, ANA, 2, '2026-11-01T11:00Z');

    await end(db, ANA, 2, 1);

    expect(await liveSessions(db, ANA)).toEqual([session(2)]);
    expect(await register(db, ANA, 1)).toBe('revoked');
  });

  it('refuses the current session and other users’ sessions', async () => {
    const db = await createDb();
    await createUser(db, ANA);
    await createUser(db, BIA);
    await login(db, ANA, 1, '2026-11-01T10:00Z');
    await login(db, BIA, 9, '2026-11-01T10:00Z');

    await expect(end(db, ANA, 1, 1)).rejects.toThrow(/current session/);
    await expect(end(db, ANA, 1, 9)).rejects.toThrow(/not found/);
    expect(await liveSessions(db, BIA)).toEqual([session(9)]);
  });
});

describe('list_my_sessions', () => {
  it('lists only the caller’s live devices, marking the current one', async () => {
    const db = await createDb();
    await createUser(db, ANA);
    await createUser(db, BIA);
    await login(db, ANA, 1, '2026-11-01T10:00Z');
    await login(db, ANA, 2, '2026-11-01T11:00Z');
    await login(db, BIA, 9, '2026-11-01T11:00Z');

    const rows = await asUser(
      db,
      ANA,
      async (tx) =>
        (
          await tx.query<{ id: string; is_current: boolean }>(
            `select id, is_current from public.list_my_sessions()`,
          )
        ).rows,
      { sessionId: session(1) },
    );

    expect(rows).toEqual([
      { id: session(2), is_current: false },
      { id: session(1), is_current: true },
    ]);
  });
});

describe('writes from a revoked device', () => {
  it('cannot overwrite the case draft', async () => {
    const db = await createDb();
    await createUser(db, ANA);
    const civil = await trailId(db, 'civil');
    await createCase(db, civil, 'Caso cível');
    await login(db, ANA, 1, '2026-11-01T10:00Z');
    const attempt = await asUser(
      db,
      ANA,
      async (tx) =>
        (await tx.query<{ id: string }>(`select public.start_case_attempt($1) as id`, [civil]))
          .rows[0].id,
      { sessionId: session(1) },
    );
    await login(db, ANA, 2, '2026-11-01T11:00Z');
    await login(db, ANA, 3, '2026-11-01T12:00Z');

    await expect(
      asUser(db, ANA, (tx) => tx.query(`select public.save_case_draft($1, '{}')`, [attempt]), {
        sessionId: session(1),
      }),
    ).rejects.toThrow(/session revoked/);
  });
});
