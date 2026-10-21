import type { PGlite, Transaction } from '@electric-sql/pglite';
import { beforeEach, describe, expect, it } from 'vitest';
import { asUser, createCase, createDb, createUser, trailId } from './db.ts';

const ANA = '00000000-0000-4000-8000-00000000000a';
const BIA = '00000000-0000-4000-8000-00000000000b';

let db: PGlite;
let civil: string;

beforeEach(async () => {
  db = await createDb();
  await createUser(db, ANA);
  await createUser(db, BIA);
  civil = await trailId(db, 'civil');
});

const start = (tx: Transaction, trail: string, excludeCase: string | null = null) =>
  tx
    .query<{ id: string | null }>(`select public.start_case_attempt($1, $2) as id`, [
      trail,
      excludeCase,
    ])
    .then(({ rows }) => rows[0].id);

const restart = (tx: Transaction, attemptId: string) =>
  tx
    .query<{ id: string }>(`select public.restart_case_attempt($1) as id`, [attemptId])
    .then(({ rows }) => rows[0].id);

const submit = (tx: Transaction, attemptId: string) =>
  tx.query(`select public.submit_case_attempt($1, '{}'::jsonb)`, [attemptId]);

const answerKey = (tx: Transaction, attemptId: string) =>
  tx
    .query<{ piece: string }>(`select * from public.get_case_answer_key($1)`, [attemptId])
    .then(({ rows }) => rows[0] ?? null);

const attempt = (id: string) =>
  db
    .query<{ case_study_id: string; submitted_at: string | null }>(
      `select case_study_id, submitted_at from public.case_attempts where id = $1`,
      [id],
    )
    .then(({ rows }) => rows[0] ?? null);

const openAttempts = (userId: string) =>
  db
    .query<{ count: number }>(
      `select count(*)::int as count from public.case_attempts
       where user_id = $1 and submitted_at is null`,
      [userId],
    )
    .then(({ rows }) => rows[0].count);

describe('start_case_attempt', () => {
  it('resumes the unfinished attempt instead of opening another', async () => {
    await createCase(db, civil, 'Caso A');
    await createCase(db, civil, 'Caso B');

    const first = await asUser(db, ANA, (tx) => start(tx, civil));
    const second = await asUser(db, ANA, (tx) => start(tx, civil));

    expect(second).toBe(first);
    expect(await openAttempts(ANA)).toBe(1);
  });

  it('never lets a student hold two unfinished attempts in one trail', async () => {
    // Two concurrent starts both find nothing to resume and both insert. The
    // database itself must reject the second one.
    const caseA = await createCase(db, civil, 'Caso A');
    const caseB = await createCase(db, civil, 'Caso B');
    await asUser(db, ANA, (tx) => start(tx, civil));

    const insertOpen = (caseId: string) =>
      db.query(
        `insert into public.case_attempts (user_id, case_study_id, trail_id, time_limit_minutes)
         values ($1, $2, $3, 60)`,
        [ANA, caseId, civil],
      );

    await expect(insertOpen(caseA)).rejects.toThrow(/duplicate key/);
    await expect(insertOpen(caseB)).rejects.toThrow(/duplicate key/);
  });

  it('keeps unfinished attempts in different trails apart', async () => {
    const penal = await trailId(db, 'penal');
    await createCase(db, civil, 'Caso cível');
    await createCase(db, penal, 'Caso penal');

    const civilAttempt = await asUser(db, ANA, (tx) => start(tx, civil));
    const penalAttempt = await asUser(db, ANA, (tx) => start(tx, penal));

    expect(penalAttempt).not.toBe(civilAttempt);
    expect(await openAttempts(ANA)).toBe(2);
  });

  it("rejects an attempt whose trail is not its case's trail", async () => {
    const penal = await trailId(db, 'penal');
    const civilCase = await createCase(db, civil, 'Caso cível');

    await expect(
      db.query(
        `insert into public.case_attempts (user_id, case_study_id, trail_id, time_limit_minutes)
         values ($1, $2, $3, 60)`,
        [ANA, civilCase, penal],
      ),
    ).rejects.toThrow(/foreign key/);
  });
});

describe('restart_case_attempt', () => {
  it('swaps the unfinished attempt for one at another case, in one step', async () => {
    await createCase(db, civil, 'Caso A');
    await createCase(db, civil, 'Caso B');
    const current = await asUser(db, ANA, (tx) => start(tx, civil));
    const currentCase = (await attempt(current!))!.case_study_id;

    const next = await asUser(db, ANA, (tx) => restart(tx, current!));

    expect(next).not.toBe(current);
    expect(await attempt(current!)).toBeNull();
    expect((await attempt(next))!.case_study_id).not.toBe(currentCase);
    expect(await openAttempts(ANA)).toBe(1);
  });

  it('starts the same case again when it is the only one in the trail', async () => {
    const onlyCase = await createCase(db, civil, 'Caso único');
    const current = await asUser(db, ANA, (tx) => start(tx, civil));

    const next = await asUser(db, ANA, (tx) => restart(tx, current!));

    expect(next).not.toBe(current);
    expect((await attempt(next))!.case_study_id).toBe(onlyCase);
  });

  it('keeps the current attempt when no new one can be started', async () => {
    const onlyCase = await createCase(db, civil, 'Caso único');
    const current = await asUser(db, ANA, (tx) => start(tx, civil));
    await db.query(`update public.case_studies set is_active = false where id = $1`, [onlyCase]);

    await expect(asUser(db, ANA, (tx) => restart(tx, current!))).rejects.toThrow(/no active case/);
    expect(await attempt(current!)).not.toBeNull();
  });

  it('refuses a submitted attempt and leaves it untouched', async () => {
    await createCase(db, civil, 'Caso A');
    const current = await asUser(db, ANA, (tx) => start(tx, civil));
    await asUser(db, ANA, (tx) => submit(tx, current!));

    await expect(asUser(db, ANA, (tx) => restart(tx, current!))).rejects.toThrow(
      /attempt not found/,
    );
    expect((await attempt(current!))!.submitted_at).not.toBeNull();
    expect(await openAttempts(ANA)).toBe(0);
  });

  it("refuses another student's attempt and leaves it untouched", async () => {
    await createCase(db, civil, 'Caso A');
    const anas = await asUser(db, ANA, (tx) => start(tx, civil));

    await expect(asUser(db, BIA, (tx) => restart(tx, anas!))).rejects.toThrow(/attempt not found/);
    expect(await attempt(anas!)).not.toBeNull();
    expect(await openAttempts(BIA)).toBe(0);
  });
});

describe('answer keys', () => {
  it('unlocks the answer key once the attempt is submitted', async () => {
    await createCase(db, civil, 'Caso A');
    const current = await asUser(db, ANA, (tx) => start(tx, civil));

    expect(await asUser(db, ANA, (tx) => answerKey(tx, current!))).toBeNull();
    await asUser(db, ANA, (tx) => submit(tx, current!));
    expect(await asUser(db, ANA, (tx) => answerKey(tx, current!))).toMatchObject({
      piece: 'Petição inicial',
    });
  });

  it('keeps it hidden from a new attempt at a case the student already submitted', async () => {
    await createCase(db, civil, 'Caso único');
    const first = await asUser(db, ANA, (tx) => start(tx, civil));
    await asUser(db, ANA, (tx) => submit(tx, first!));

    const retake = await asUser(db, ANA, (tx) => start(tx, civil));

    expect(retake).not.toBe(first);
    expect(await asUser(db, ANA, (tx) => answerKey(tx, retake!))).toBeNull();
  });

  it("never shows another student's answer key", async () => {
    await createCase(db, civil, 'Caso A');
    const anas = await asUser(db, ANA, (tx) => start(tx, civil));
    await asUser(db, ANA, (tx) => submit(tx, anas!));

    expect(await asUser(db, BIA, (tx) => answerKey(tx, anas!))).toBeNull();
  });

  it('cannot be read straight from the table', async () => {
    await createCase(db, civil, 'Caso A');
    const current = await asUser(db, ANA, (tx) => start(tx, civil));
    await asUser(db, ANA, (tx) => submit(tx, current!));

    await expect(
      asUser(db, ANA, (tx) => tx.query(`select * from public.case_study_answer_keys`)),
    ).rejects.toThrow(/permission denied/);
  });
});
