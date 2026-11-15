import type { PGlite, Transaction } from '@electric-sql/pglite';
import { beforeEach, describe, expect, it } from 'vitest';
import { asUser, createDb, createUser, trailId } from './db.ts';

const ANA = '00000000-0000-4000-8000-00000000000a';
const BIA = '00000000-0000-4000-8000-00000000000b';

let db: PGlite;
let civil: string;
let penal: string;

beforeEach(async () => {
  db = await createDb();
  await createUser(db, ANA);
  await createUser(db, BIA);
  civil = await trailId(db, 'civil');
  penal = await trailId(db, 'penal');
});

const insertId = (sql: string, params: unknown[]) =>
  db.query<{ id: string }>(sql, params).then(({ rows }) => rows[0].id);

/** A lesson in a new module of the trail, with one card per front given. */
const createLesson = async (trail: string, fronts: string[], position = 1) => {
  const module = await insertId(
    `insert into public.modules (trail_id, title, position) values ($1, 'Módulo', $2) returning id`,
    [trail, position],
  );
  const lesson = await insertId(
    `insert into public.lessons (module_id, title, position) values ($1, 'Lição', 1) returning id`,
    [module],
  );
  const cards: string[] = [];
  for (const [index, front] of fronts.entries()) {
    cards.push(
      await insertId(
        `insert into public.flashcards (lesson_id, front, back, position)
         values ($1, $2, 'Verso', $3) returning id`,
        [lesson, front, index],
      ),
    );
  }
  return { module, lesson, cards };
};

const review = (tx: Transaction, card: string, correct: boolean) =>
  tx
    .query<{ due: string }>(`select public.review_flashcard($1, $2)::text as due`, [card, correct])
    .then(({ rows }) => rows[0].due);

const daysFromToday = (days: number) =>
  db
    .query<{ day: string }>(`select (public.study_today() + $1::integer)::text as day`, [days])
    .then(({ rows }) => rows[0].day);

const box = (userId: string, card: string) =>
  db
    .query<{ box: number }>(
      `select box from public.flashcard_reviews where user_id = $1 and flashcard_id = $2`,
      [userId, card],
    )
    .then(({ rows }) => rows[0]?.box ?? null);

/** Makes the card due today, as if its interval had run out. */
const makeDue = (userId: string, card: string) =>
  db.query(
    `update public.flashcard_reviews set due_on = public.study_today()
     where user_id = $1 and flashcard_id = $2`,
    [userId, card],
  );

const dueCards = (tx: Transaction, trail: string | null = null, limit = 50) =>
  tx
    .query<{ front: string }>(`select front from public.get_due_flashcards($1, $2)`, [trail, limit])
    .then(({ rows }) => rows.map((row) => row.front));

const dueCount = (tx: Transaction, slug: string) =>
  tx
    .query<{ slug: string; due_count: number }>(`select * from public.get_flashcard_due_counts()`)
    .then(({ rows }) => rows.find((row) => row.slug === slug)?.due_count);

describe('review_flashcard', () => {
  it('moves the card up one box per correct answer, with growing intervals', async () => {
    const { cards } = await createLesson(civil, ['Q1']);
    const expected = [
      { box: 2, days: 3 },
      { box: 3, days: 7 },
      { box: 4, days: 14 },
      { box: 5, days: 30 },
      { box: 5, days: 30 },
    ];

    for (const step of expected) {
      const due = await asUser(db, ANA, (tx) => review(tx, cards[0], true));
      expect(await box(ANA, cards[0])).toBe(step.box);
      expect(due).toBe(await daysFromToday(step.days));
    }
  });

  it('sends a wrong card back to box 1, due tomorrow', async () => {
    const { cards } = await createLesson(civil, ['Q1']);
    await asUser(db, ANA, (tx) => review(tx, cards[0], true));
    await asUser(db, ANA, (tx) => review(tx, cards[0], true));

    const due = await asUser(db, ANA, (tx) => review(tx, cards[0], false));

    expect(await box(ANA, cards[0])).toBe(1);
    expect(due).toBe(await daysFromToday(1));
  });

  it('puts a card first answered wrong in box 1', async () => {
    const { cards } = await createLesson(civil, ['Q1']);
    await asUser(db, ANA, (tx) => review(tx, cards[0], false));
    expect(await box(ANA, cards[0])).toBe(1);
  });

  it('keeps each student’s schedule apart', async () => {
    const { cards } = await createLesson(civil, ['Q1']);
    await asUser(db, ANA, (tx) => review(tx, cards[0], true));
    await asUser(db, BIA, (tx) => review(tx, cards[0], false));

    expect(await box(ANA, cards[0])).toBe(2);
    expect(await box(BIA, cards[0])).toBe(1);
    const visible = await asUser(db, ANA, (tx) =>
      tx.query(`select * from public.flashcard_reviews`).then(({ rows }) => rows.length),
    );
    expect(visible).toBe(1);
  });

  it('keeps the review history when the admin edits the card', async () => {
    const { cards } = await createLesson(civil, ['Q1']);
    await asUser(db, ANA, (tx) => review(tx, cards[0], true));

    await db.query(`update public.flashcards set front = 'Q1 revisada' where id = $1`, [cards[0]]);

    expect(await box(ANA, cards[0])).toBe(2);
  });

  it('refuses deleted cards and cards of deleted lessons', async () => {
    const { lesson, cards } = await createLesson(civil, ['Q1', 'Q2']);
    await db.query(`update public.flashcards set deleted_at = now() where id = $1`, [cards[0]]);
    await db.query(`update public.lessons set deleted_at = now() where id = $1`, [lesson]);

    for (const card of cards) {
      await expect(asUser(db, ANA, (tx) => review(tx, card, true))).rejects.toThrow(
        'flashcard not found',
      );
    }
  });

  it('cannot be bypassed by writing the review table directly', async () => {
    const { cards } = await createLesson(civil, ['Q1']);
    await expect(
      asUser(db, ANA, (tx) =>
        tx.query(
          `insert into public.flashcard_reviews (user_id, flashcard_id, box, due_on)
           values ($1, $2, 5, '2099-01-01')`,
          [ANA, cards[0]],
        ),
      ),
    ).rejects.toThrow(/permission denied/);
  });
});

describe('get_due_flashcards', () => {
  it('lists only the student’s cards due today, never unseen ones', async () => {
    const { cards } = await createLesson(civil, ['Vencido', 'Futuro', 'Nunca visto']);
    await asUser(db, ANA, async (tx) => {
      await review(tx, cards[0], true);
      await review(tx, cards[1], true);
    });
    await makeDue(ANA, cards[0]);

    expect(await asUser(db, ANA, (tx) => dueCards(tx))).toEqual(['Vencido']);
    expect(await asUser(db, BIA, (tx) => dueCards(tx))).toEqual([]);
  });

  it('filters by trail and caps the session', async () => {
    const civilLesson = await createLesson(civil, ['C1', 'C2']);
    const penalLesson = await createLesson(penal, ['P1']);
    for (const card of [...civilLesson.cards, ...penalLesson.cards]) {
      await asUser(db, ANA, (tx) => review(tx, card, false));
      await makeDue(ANA, card);
    }

    expect(await asUser(db, ANA, (tx) => dueCards(tx, penal))).toEqual(['P1']);
    expect(await asUser(db, ANA, (tx) => dueCards(tx))).toHaveLength(3);
    expect(await asUser(db, ANA, (tx) => dueCards(tx, null, 2))).toHaveLength(2);
  });

  it('skips cards that were deleted after being studied', async () => {
    const { cards } = await createLesson(civil, ['Q1']);
    await asUser(db, ANA, (tx) => review(tx, cards[0], false));
    await makeDue(ANA, cards[0]);

    await db.query(`update public.flashcards set deleted_at = now() where id = $1`, [cards[0]]);

    expect(await asUser(db, ANA, (tx) => dueCards(tx))).toEqual([]);
  });
});

describe('get_flashcard_due_counts', () => {
  it('counts due cards per trail, with zero for the rest', async () => {
    const { cards } = await createLesson(civil, ['C1', 'C2', 'C3']);
    await asUser(db, ANA, async (tx) => {
      for (const card of cards) await review(tx, card, true);
    });
    await makeDue(ANA, cards[0]);
    await makeDue(ANA, cards[1]);

    expect(await asUser(db, ANA, (tx) => dueCount(tx, 'civil'))).toBe(2);
    expect(await asUser(db, ANA, (tx) => dueCount(tx, 'penal'))).toBe(0);
    expect(await asUser(db, BIA, (tx) => dueCount(tx, 'civil'))).toBe(0);
  });
});

describe('get_trail_flashcard_lessons', () => {
  it('lists the trail’s lessons with cards, and how many the student studied', async () => {
    const first = await createLesson(civil, ['Q1', 'Q2'], 1);
    await createLesson(civil, ['Q3'], 2);
    await createLesson(civil, [], 3);
    await asUser(db, ANA, (tx) => review(tx, first.cards[0], true));

    const rows = await asUser(db, ANA, (tx) =>
      tx
        .query<{ card_count: number; studied_count: number }>(
          `select card_count, studied_count from public.get_trail_flashcard_lessons($1)`,
          [civil],
        )
        .then((result) => result.rows),
    );

    expect(rows).toEqual([
      { card_count: 2, studied_count: 1 },
      { card_count: 1, studied_count: 0 },
    ]);
  });
});

describe('flashcards', () => {
  it('hides deleted cards from students', async () => {
    const { cards } = await createLesson(civil, ['Viva', 'Removida']);
    await db.query(`update public.flashcards set deleted_at = now() where id = $1`, [cards[1]]);

    const fronts = await asUser(db, ANA, (tx) =>
      tx
        .query<{ front: string }>(`select front from public.flashcards`)
        .then(({ rows }) => rows.map((row) => row.front)),
    );

    expect(fronts).toEqual(['Viva']);
  });
});
