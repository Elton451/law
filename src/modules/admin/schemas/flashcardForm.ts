import { z } from 'zod';
import { FLASHCARD_LIMITS, MAX_IMPORT_CARDS, MAX_IMPORT_LENGTH } from '../constants/flashcards';
import { hasErrors, parseFlashcardMarkdown } from '../utils/parseFlashcardMarkdown';

const requiredText = (max: number) =>
  z
    .string()
    .trim()
    .min(1, 'Preencha este campo.')
    .max(max, `Use no máximo ${max.toLocaleString('pt-BR')} caracteres.`);

export const flashcardFormSchema = z.object({
  front: requiredText(FLASHCARD_LIMITS.front),
  back: requiredText(FLASHCARD_LIMITS.back),
});

export type FlashcardFormValues = z.output<typeof flashcardFormSchema>;

export const emptyFlashcardForm: FlashcardFormValues = { front: '', back: '' };

/** Markdown in Obsidian Spaced Repetition's formats, turned into the cards to add. */
export const flashcardImportSchema = z
  .object({
    markdown: z
      .string()
      .max(
        MAX_IMPORT_LENGTH,
        `Use no máximo ${MAX_IMPORT_LENGTH.toLocaleString('pt-BR')} caracteres.`,
      ),
  })
  .transform(({ markdown }, ctx) => {
    const fail = (message: string) => {
      ctx.addIssue({ code: 'custom', path: ['markdown'], message });
      return z.NEVER;
    };

    const parsed = parseFlashcardMarkdown(markdown);
    if (hasErrors(parsed)) return fail('Corrija os erros apontados abaixo antes de importar.');
    if (parsed.cards.length === 0) return fail('Nenhum flashcard encontrado no texto.');
    if (parsed.cards.length > MAX_IMPORT_CARDS) {
      return fail(`Importe no máximo ${MAX_IMPORT_CARDS} cards por vez.`);
    }

    // The parser already checked the sides; this is the same rule the single-card form uses.
    const cards = z.array(flashcardFormSchema).safeParse(parsed.cards);
    if (!cards.success) return fail('Há cards inválidos no texto.');
    return { cards: cards.data };
  });

export type FlashcardImportInput = z.input<typeof flashcardImportSchema>;
