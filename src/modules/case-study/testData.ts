import type { Attempt } from './api';
import { emptyAnswers } from './schemas';

export const makeAttempt = (overrides: Partial<Attempt> = {}): Attempt => ({
  id: 'attempt-1',
  caseStudy: {
    id: 'case-1',
    trailId: 'trail-civil',
    title: 'Infiltração causada pelo vizinho',
    statement: 'João é proprietário de um apartamento…',
    origin: 'autoral',
    examEdition: null,
    contentUpdatedAt: new Date('2026-01-01T00:00:00Z'),
  },
  answerKey: null,
  timeLimitMinutes: 60,
  startedAt: new Date(),
  submittedAt: null,
  answers: emptyAnswers,
  ...overrides,
});
