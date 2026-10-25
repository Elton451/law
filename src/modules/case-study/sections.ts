import { pieceSections } from '@shared/case-studies/sections';

/** Every answer field: the identified piece first, then the five sections. */
export const answerFields = [
  { key: 'identifiedPiece', label: 'Peça cabível' },
  ...pieceSections,
] as const;
