import { describe, expect, it } from 'vitest';
import { flashcardFormSchema, flashcardImportSchema } from './flashcardForm';

const importError = (markdown: string) => {
  const result = flashcardImportSchema.safeParse({ markdown });
  return result.success ? null : result.error.issues[0].message;
};

describe('flashcardFormSchema', () => {
  it('trims both sides and requires them', () => {
    expect(flashcardFormSchema.parse({ front: ' Pergunta ', back: ' Resposta ' })).toEqual({
      front: 'Pergunta',
      back: 'Resposta',
    });
    expect(flashcardFormSchema.safeParse({ front: '  ', back: 'R' }).success).toBe(false);
  });

  it('limits the length of each side', () => {
    expect(flashcardFormSchema.safeParse({ front: 'x'.repeat(2001), back: 'R' }).success).toBe(
      false,
    );
    expect(flashcardFormSchema.safeParse({ front: 'P', back: 'x'.repeat(5001) }).success).toBe(
      false,
    );
  });
});

describe('flashcardImportSchema', () => {
  it('outputs only the cards to add', () => {
    expect(flashcardImportSchema.parse({ markdown: 'A::1\nB:::2' })).toEqual({
      cards: [
        { front: 'A', back: '1' },
        { front: 'B', back: '2' },
        { front: '2', back: 'B' },
      ],
    });
  });

  it('refuses text with errors, without cards, or with too many', () => {
    expect(importError('Pergunta\n?')).toBe('Corrija os erros apontados abaixo antes de importar.');
    expect(importError('# Só um título')).toBe('Nenhum flashcard encontrado no texto.');
    expect(importError(Array.from({ length: 201 }, (_, i) => `Q${i}::R`).join('\n'))).toBe(
      'Importe no máximo 200 cards por vez.',
    );
  });
});
