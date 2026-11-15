import type { PGlite, Transaction } from '@electric-sql/pglite';
import { beforeEach, describe, expect, it } from 'vitest';
import { asUser, createDb, createUser, trailId } from './db.ts';

const ADMIN = '00000000-0000-4000-8000-0000000000ad';
const ANA = '00000000-0000-4000-8000-00000000000a';

let db: PGlite;
let lesson: string;

const insertId = (sql: string, params: unknown[]) =>
  db.query<{ id: string }>(sql, params).then(({ rows }) => rows[0].id);

beforeEach(async () => {
  db = await createDb();
  await createUser(db, ADMIN);
  await createUser(db, ANA);
  await db.query(`update public.profiles set role = 'admin' where id = $1`, [ADMIN]);
  const module = await insertId(
    `insert into public.modules (trail_id, title, position) values ($1, 'Parte geral', 1) returning id`,
    [await trailId(db, 'civil')],
  );
  lesson = await insertId(
    `insert into public.lessons (module_id, title, position) values ($1, 'Prescrição', 1) returning id`,
    [module],
  );
});

const add = (tx: Transaction, cards: unknown, lessonId = lesson) =>
  tx
    .query<{ count: number }>(`select public.admin_add_flashcards($1, $2) as count`, [
      lessonId,
      JSON.stringify(cards),
    ])
    .then(({ rows }) => rows[0].count);

const cards = () =>
  db
    .query<{ id: string; front: string; back: string; position: number }>(
      `select id, front, back, position from public.flashcards
       where lesson_id = $1 and deleted_at is null order by position`,
      [lesson],
    )
    .then(({ rows }) => rows);

describe('admin_add_flashcards', () => {
  it('appends the cards to the lesson in order, trimmed', async () => {
    await asUser(db, ADMIN, (tx) => add(tx, [{ front: 'A', back: '1' }]));
    const count = await asUser(db, ADMIN, (tx) =>
      add(tx, [
        { front: '  B ', back: '2 ' },
        { front: 'C', back: '3' },
      ]),
    );

    expect(count).toBe(2);
    expect((await cards()).map(({ front, back, position }) => [front, back, position])).toEqual([
      ['A', '1', 1],
      ['B', '2', 2],
      ['C', '3', 3],
    ]);
  });

  it('adds all or none', async () => {
    await expect(
      asUser(db, ADMIN, (tx) =>
        add(tx, [
          { front: 'A', back: '1' },
          { front: 'B', back: '   ' },
        ]),
      ),
    ).rejects.toThrow(/flashcards_lengths/);
    await expect(asUser(db, ADMIN, (tx) => add(tx, [{ front: 'A' }]))).rejects.toThrow(/null/);

    expect(await cards()).toEqual([]);
  });

  it('refuses empty or oversized batches', async () => {
    await expect(asUser(db, ADMIN, (tx) => add(tx, []))).rejects.toThrow('between 1 and 200');
    const many = Array.from({ length: 201 }, (_, index) => ({ front: `Q${index}`, back: 'R' }));
    await expect(asUser(db, ADMIN, (tx) => add(tx, many))).rejects.toThrow('between 1 and 200');
  });

  it('refuses removed lessons', async () => {
    await db.query(`update public.lessons set deleted_at = now() where id = $1`, [lesson]);
    await expect(asUser(db, ADMIN, (tx) => add(tx, [{ front: 'A', back: '1' }]))).rejects.toThrow(
      'lesson not found',
    );
  });

  it('is admin only, and the table stays closed to direct writes', async () => {
    await expect(asUser(db, ANA, (tx) => add(tx, [{ front: 'A', back: '1' }]))).rejects.toThrow(
      'admin only',
    );
    await expect(
      asUser(db, ADMIN, (tx) =>
        tx.query(
          `insert into public.flashcards (lesson_id, front, back, position) values ($1, 'A', '1', 1)`,
          [lesson],
        ),
      ),
    ).rejects.toThrow(/permission denied/);
  });
});

describe('admin_update_flashcard', () => {
  it('rewrites the card and keeps students’ reviews', async () => {
    await asUser(db, ADMIN, (tx) => add(tx, [{ front: 'A', back: '1' }]));
    const [card] = await cards();
    await asUser(db, ANA, (tx) => tx.query(`select public.review_flashcard($1, true)`, [card.id]));

    await asUser(db, ADMIN, (tx) =>
      tx.query(`select public.admin_update_flashcard($1, ' A2 ', '1b')`, [card.id]),
    );

    expect(await cards()).toMatchObject([{ front: 'A2', back: '1b' }]);
    const { rows } = await db.query<{ box: number }>(
      `select box from public.flashcard_reviews where flashcard_id = $1`,
      [card.id],
    );
    expect(rows).toEqual([{ box: 2 }]);
  });

  it('is admin only', async () => {
    await asUser(db, ADMIN, (tx) => add(tx, [{ front: 'A', back: '1' }]));
    const [card] = await cards();
    await expect(
      asUser(db, ANA, (tx) =>
        tx.query(`select public.admin_update_flashcard($1, 'X', 'Y')`, [card.id]),
      ),
    ).rejects.toThrow('admin only');
  });
});

describe('admin_delete_flashcard', () => {
  it('soft-deletes the card: out of the lesson and the reviews, history kept', async () => {
    await asUser(db, ADMIN, (tx) => add(tx, [{ front: 'A', back: '1' }]));
    const [card] = await cards();
    await asUser(db, ANA, (tx) => tx.query(`select public.review_flashcard($1, false)`, [card.id]));

    await asUser(db, ADMIN, (tx) =>
      tx.query(`select public.admin_delete_flashcard($1)`, [card.id]),
    );

    expect(await cards()).toEqual([]);
    const { rows } = await db.query(
      `select 1 from public.flashcard_reviews where flashcard_id = $1`,
      [card.id],
    );
    expect(rows).toHaveLength(1);
    await expect(
      asUser(db, ADMIN, (tx) => tx.query(`select public.admin_delete_flashcard($1)`, [card.id])),
    ).rejects.toThrow('flashcard not found');
  });
});

describe('admin_list_flashcard_lessons', () => {
  it('lists live lessons with their live card count, for admins only', async () => {
    await asUser(db, ADMIN, (tx) =>
      add(tx, [
        { front: 'A', back: '1' },
        { front: 'B', back: '2' },
      ]),
    );
    const [card] = await cards();
    await asUser(db, ADMIN, (tx) =>
      tx.query(`select public.admin_delete_flashcard($1)`, [card.id]),
    );

    const rows = await asUser(db, ADMIN, (tx) =>
      tx
        .query(
          `select trail_name, module_title, lesson_title, card_count from public.admin_list_flashcard_lessons()`,
        )
        .then((result) => result.rows),
    );

    expect(rows).toEqual([
      {
        trail_name: 'Civil',
        module_title: 'Parte geral',
        lesson_title: 'Prescrição',
        card_count: 1,
      },
    ]);
    await expect(
      asUser(db, ANA, (tx) => tx.query(`select * from public.admin_list_flashcard_lessons()`)),
    ).rejects.toThrow('admin only');
  });
});
