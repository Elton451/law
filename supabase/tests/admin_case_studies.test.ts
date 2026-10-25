import type { PGlite, Transaction } from '@electric-sql/pglite';
import { beforeEach, describe, expect, it } from 'vitest';
import { asUser, createCase, createDb, createUser, trailId } from './db.ts';

const ADMIN = '00000000-0000-4000-8000-0000000000ad';
const ANA = '00000000-0000-4000-8000-00000000000a';

let db: PGlite;
let civil: string;
let penal: string;

beforeEach(async () => {
  db = await createDb();
  await createUser(db, ADMIN);
  await createUser(db, ANA);
  await db.query(`update public.profiles set role = 'admin' where id = $1`, [ADMIN]);
  civil = await trailId(db, 'civil');
  penal = await trailId(db, 'penal');
});

const caseInput = (overrides: Record<string, unknown> = {}) => ({
  trail_id: civil,
  title: '  Caso novo  ',
  statement: 'Enunciado',
  origin: 'oab',
  exam_edition: 'XXXV Exame',
  is_active: true,
  piece: 'Apelação',
  addressing: 'Endereçamento',
  qualification: 'Qualificação',
  grounds: 'Fundamentos',
  requests: 'Pedidos',
  closing: 'Fechamento',
  ...overrides,
});

const save = (tx: Transaction, caseId: string | null, input = caseInput()) =>
  tx
    .query<{ id: string }>(`select public.admin_save_case_study($1, $2) as id`, [caseId, input])
    .then(({ rows }) => rows[0].id);

const list = (tx: Transaction, trail: string | null = null, origin: string | null = null) =>
  tx
    .query<{ id: string; title: string; attempt_count: number; is_active: boolean }>(
      `select * from public.admin_list_case_studies($1, $2)`,
      [trail, origin],
    )
    .then(({ rows }) => rows);

const get = (tx: Transaction, caseId: string) =>
  tx
    .query<Record<string, unknown>>(`select * from public.admin_get_case_study($1)`, [caseId])
    .then(({ rows }) => rows[0] ?? null);

const startAndSubmit = (caseTrail: string) =>
  asUser(db, ANA, async (tx) => {
    const { rows } = await tx.query<{ id: string }>(`select public.start_case_attempt($1) as id`, [
      caseTrail,
    ]);
    await tx.query(`select public.submit_case_attempt($1, '{}'::jsonb)`, [rows[0].id]);
  });

describe('admin access', () => {
  it('refuses every admin function to students', async () => {
    const caseId = await createCase(db, civil, 'Caso A');
    const calls = [
      `select * from public.admin_list_case_studies()`,
      `select * from public.admin_get_case_study('${caseId}')`,
      `select public.admin_save_case_study(null, '{}'::jsonb)`,
      `select public.admin_set_case_study_active('${caseId}', false)`,
      `select public.admin_delete_case_study('${caseId}')`,
    ];

    for (const sql of calls) {
      await expect(asUser(db, ANA, (tx) => tx.query(sql))).rejects.toThrow('admin only');
    }
  });

  it('lets the admin see deactivated cases, which students no longer can', async () => {
    const caseId = await createCase(db, civil, 'Caso A');
    await asUser(db, ADMIN, (tx) =>
      tx.query(`select public.admin_set_case_study_active($1, false)`, [caseId]),
    );

    const seenBy = (userId: string) =>
      asUser(db, userId, (tx) => tx.query(`select id from public.case_studies`)).then(
        ({ rows }) => rows.length,
      );

    expect(await seenBy(ADMIN)).toBe(1);
    expect(await seenBy(ANA)).toBe(0);
  });
});

describe('admin_save_case_study', () => {
  it('creates the case and its answer key, trimmed, ready for the draw', async () => {
    const caseId = await asUser(db, ADMIN, (tx) => save(tx, null));

    expect(await asUser(db, ADMIN, (tx) => get(tx, caseId))).toMatchObject({
      title: 'Caso novo',
      origin: 'oab',
      exam_edition: 'XXXV Exame',
      is_active: true,
      piece: 'Apelação',
      closing: 'Fechamento',
      attempt_count: 0,
    });

    const attempt = await asUser(db, ANA, (tx) =>
      tx.query<{ id: string }>(`select public.start_case_attempt($1) as id`, [civil]),
    );
    expect(attempt.rows[0].id).not.toBeNull();
  });

  it('updates the case and its answer key', async () => {
    const caseId = await asUser(db, ADMIN, (tx) => save(tx, null));

    await asUser(db, ADMIN, (tx) =>
      save(tx, caseId, caseInput({ title: 'Editado', origin: 'autoral', grounds: 'Novos' })),
    );

    expect(await asUser(db, ADMIN, (tx) => get(tx, caseId))).toMatchObject({
      title: 'Editado',
      origin: 'autoral',
      // Authored cases have no exam edition, whatever the payload says.
      exam_edition: null,
      grounds: 'Novos',
    });
  });

  it('saves nothing when part of it is invalid', async () => {
    await expect(
      asUser(db, ADMIN, (tx) => save(tx, null, caseInput({ closing: '   ' }))),
    ).rejects.toThrow();

    expect(await asUser(db, ADMIN, (tx) => list(tx))).toHaveLength(0);
  });

  it('requires the exam edition of OAB cases', async () => {
    await expect(
      asUser(db, ADMIN, (tx) => save(tx, null, caseInput({ exam_edition: ' ' }))),
    ).rejects.toThrow();
  });

  it('keeps a case with attempts in its trail', async () => {
    const caseId = await asUser(db, ADMIN, (tx) => save(tx, null));
    await startAndSubmit(civil);

    await expect(
      asUser(db, ADMIN, (tx) => save(tx, caseId, caseInput({ trail_id: penal }))),
    ).rejects.toThrow('its trail cannot change');
  });
});

describe('admin_list_case_studies', () => {
  it('filters by trail and origin and counts attempts', async () => {
    const caseA = await createCase(db, civil, 'Caso A');
    await createCase(db, penal, 'Caso B');
    await startAndSubmit(civil);

    const all = await asUser(db, ADMIN, (tx) => list(tx));
    expect(all).toHaveLength(2);
    expect(all.find(({ id }) => id === caseA)?.attempt_count).toBe(1);

    expect(await asUser(db, ADMIN, (tx) => list(tx, civil))).toMatchObject([{ title: 'Caso A' }]);
    expect(await asUser(db, ADMIN, (tx) => list(tx, null, 'oab'))).toHaveLength(0);
  });
});

describe('admin_delete_case_study', () => {
  it('deletes a case nobody attempted, with its answer key', async () => {
    const caseId = await createCase(db, civil, 'Caso A');

    await asUser(db, ADMIN, (tx) =>
      tx.query(`select public.admin_delete_case_study($1)`, [caseId]),
    );

    const { rows } = await db.query(
      `select 1 from public.case_study_answer_keys where case_study_id = $1`,
      [caseId],
    );
    expect(rows).toHaveLength(0);
    expect(await asUser(db, ADMIN, (tx) => list(tx))).toHaveLength(0);
  });

  it('refuses to delete a case with attempts', async () => {
    const caseId = await createCase(db, civil, 'Caso A');
    await startAndSubmit(civil);

    await expect(
      asUser(db, ADMIN, (tx) => tx.query(`select public.admin_delete_case_study($1)`, [caseId])),
    ).rejects.toThrow('deactivate it instead');
  });
});

describe('content_updated_at', () => {
  const contentUpdatedAt = (caseId: string) =>
    db
      .query<{ at: Date }>(
        `select content_updated_at as at from public.case_studies where id = $1`,
        [caseId],
      )
      .then(({ rows }) => rows[0].at.getTime());

  it('moves when the statement or the answer key changes', async () => {
    const caseId = await asUser(db, ADMIN, (tx) => save(tx, null));
    const created = await contentUpdatedAt(caseId);

    await asUser(db, ADMIN, (tx) => save(tx, caseId, caseInput({ statement: 'Novo' })));
    const afterStatement = await contentUpdatedAt(caseId);
    expect(afterStatement).toBeGreaterThan(created);

    await asUser(db, ADMIN, (tx) =>
      save(tx, caseId, caseInput({ statement: 'Novo', grounds: 'X' })),
    );
    expect(await contentUpdatedAt(caseId)).toBeGreaterThan(afterStatement);
  });

  it('stays put when nothing in the content changes', async () => {
    const caseId = await asUser(db, ADMIN, (tx) => save(tx, null));
    const created = await contentUpdatedAt(caseId);

    await asUser(db, ADMIN, (tx) => save(tx, caseId));
    await asUser(db, ADMIN, (tx) =>
      tx.query(`select public.admin_set_case_study_active($1, false)`, [caseId]),
    );

    expect(await contentUpdatedAt(caseId)).toBe(created);
  });
});
