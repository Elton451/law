// Limits mirror the checks in the database (20261025010000_create_flashcards.sql and
// 20261025020000_admin_flashcards.sql).
export const FLASHCARD_LIMITS = { front: 2000, back: 5000 } as const;

/** Most cards one Markdown import can add. */
export const MAX_IMPORT_CARDS = 200;

export const MAX_IMPORT_LENGTH = 100_000;
