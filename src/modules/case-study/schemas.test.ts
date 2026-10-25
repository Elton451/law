import { describe, expect, it } from 'vitest';
import { originLabel } from '@shared/case-studies/origin';
import { attemptAnswersSchema, blankFieldLabels, emptyAnswers } from './schemas';

describe('attemptAnswersSchema', () => {
  it('accepts empty answers (blank fields are allowed on submit)', () => {
    expect(attemptAnswersSchema.safeParse(emptyAnswers).success).toBe(true);
  });

  it('rejects a section over 20.000 characters', () => {
    const result = attemptAnswersSchema.safeParse({ ...emptyAnswers, grounds: 'x'.repeat(20001) });
    expect(result.error?.issues[0].path).toEqual(['grounds']);
  });

  it('trims the identified piece', () => {
    const result = attemptAnswersSchema.parse({ ...emptyAnswers, identifiedPiece: '  Apelação ' });
    expect(result.identifiedPiece).toBe('Apelação');
  });
});

describe('blankFieldLabels', () => {
  it('lists blank or whitespace-only fields in form order', () => {
    expect(
      blankFieldLabels({
        ...emptyAnswers,
        identifiedPiece: 'Apelação',
        addressing: 'Excelentíssimo…',
        grounds: '   ',
        closing: 'Pede deferimento.',
      }),
    ).toEqual(['Qualificação', 'Fundamentação', 'Pedidos']);
  });
});

describe('originLabel', () => {
  it('names the OAB exam or marks the case as authored', () => {
    expect(originLabel({ origin: 'oab', examEdition: 'XXXV Exame' })).toBe('OAB — XXXV Exame');
    expect(originLabel({ origin: 'autoral', examEdition: null })).toBe('Autoral');
  });
});
