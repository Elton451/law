import { describe, expect, it } from 'vitest';
import { caseFormSchema, emptyCaseForm, type CaseFormValues } from './caseForm';

const valid: CaseFormValues = {
  ...emptyCaseForm,
  trailId: 'trail-civil',
  title: 'Caso',
  statement: 'Enunciado',
  origin: 'oab',
  examEdition: 'XXXV Exame',
  piece: 'Apelação',
  addressing: 'E',
  qualification: 'Q',
  grounds: 'F',
  requests: 'P',
  closing: 'Termos em que…',
};

const errorPaths = (values: CaseFormValues) => {
  const result = caseFormSchema.safeParse(values);
  return result.success ? [] : result.error.issues.map(({ path }) => path.join('.'));
};

describe('caseFormSchema', () => {
  it('accepts a complete case, trimming the text', () => {
    expect(caseFormSchema.parse({ ...valid, title: '  Caso  ' }).title).toBe('Caso');
  });

  it('requires every answer key section', () => {
    expect(errorPaths({ ...valid, grounds: '   ', closing: '' })).toEqual(['grounds', 'closing']);
  });

  it('requires the exam edition only for OAB cases', () => {
    expect(errorPaths({ ...valid, examEdition: ' ' })).toEqual(['examEdition']);
    expect(errorPaths({ ...valid, origin: 'autoral', examEdition: '' })).toEqual([]);
  });

  it('enforces the database limits', () => {
    expect(errorPaths({ ...valid, title: 'a'.repeat(201) })).toEqual(['title']);
  });
});
