import { describe, expect, it } from 'vitest';
import { profileFieldsSchema } from './profileFields';

const OFFER = '6f1c1a52-3f0e-4b8a-9d7e-2c1b0a9e8d7c';

describe('profileFieldsSchema', () => {
  it('trims the name and accepts a valid UF and offer', () => {
    expect(profileFieldsSchema.parse({ name: '  Ana Souza ', uf: 'SP', offerId: OFFER })).toEqual({
      name: 'Ana Souza',
      uf: 'SP',
      offerId: OFFER,
    });
  });

  it('rejects an unknown UF and a missing offer', () => {
    const result = profileFieldsSchema.safeParse({ name: 'Ana Souza', uf: 'XX', offerId: '' });
    expect(result.success).toBe(false);
    expect(result.error?.issues.map((issue) => issue.message)).toEqual([
      'Selecione sua UF.',
      'Escolha o exame e a disciplina.',
    ]);
  });
});
