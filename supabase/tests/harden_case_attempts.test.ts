import { describe, expect, it } from 'vitest';
import { createCase, createDb, createUser, migrate, trailId } from './db.ts';

const MIGRATION = '20261017000000_harden_case_attempts.sql';
const ANA = '00000000-0000-4000-8000-00000000000a';

describe(MIGRATION, () => {
  it('keeps only the newest unfinished attempt per trail, and every submitted one', async () => {
    const db = await createDb({ before: MIGRATION });
    await createUser(db, ANA);
    const civil = await trailId(db, 'civil');
    const penal = await trailId(db, 'penal');
    const civilCase = await createCase(db, civil, 'Caso cível');
    const penalCase = await createCase(db, penal, 'Caso penal');

    // The state the start_case_attempt race could leave behind.
    const insert = (caseId: string, startedAt: string, submittedAt: string | null = null) =>
      db
        .query<{ id: string }>(
          `insert into public.case_attempts (user_id, case_study_id, time_limit_minutes, started_at, submitted_at)
           values ($1, $2, 60, $3, $4) returning id`,
          [ANA, caseId, startedAt, submittedAt],
        )
        .then(({ rows }) => rows[0].id);
    const submitted = await insert(civilCase, '2026-10-01T10:00Z', '2026-10-01T11:00Z');
    await insert(civilCase, '2026-10-02T10:00Z');
    const newestCivil = await insert(civilCase, '2026-10-02T10:00:01Z');
    const onlyPenal = await insert(penalCase, '2026-10-01T09:00Z');

    await migrate(db, (file) => file === MIGRATION);

    const { rows } = await db.query<{ id: string; trail_id: string }>(
      `select id, trail_id from public.case_attempts order by started_at`,
    );
    expect(rows).toEqual([
      { id: onlyPenal, trail_id: penal },
      { id: submitted, trail_id: civil },
      { id: newestCivil, trail_id: civil },
    ]);
  });
});
