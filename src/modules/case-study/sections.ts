/** The five sections of a legal document (peça), in the order they're written. */
export const pieceSections = [
  { key: 'addressing', label: 'Endereçamento' },
  { key: 'qualification', label: 'Qualificação' },
  { key: 'grounds', label: 'Fundamentação' },
  { key: 'requests', label: 'Pedidos' },
  { key: 'closing', label: 'Fechamento' },
] as const;

export type PieceSectionKey = (typeof pieceSections)[number]['key'];

/** Every answer field: the identified piece first, then the five sections. */
export const answerFields = [
  { key: 'identifiedPiece', label: 'Peça cabível' },
  ...pieceSections,
] as const;
