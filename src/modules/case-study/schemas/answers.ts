import { z } from 'zod';
import { answerFields } from '../constants/answerFields';

// Limits mirror the `case_attempts_answer_lengths` check in the database.
const sectionText = z.string().max(20000, 'Use no máximo 20.000 caracteres.');

export const attemptAnswersSchema = z.object({
  identifiedPiece: z.string().trim().max(200, 'Use no máximo 200 caracteres.'),
  addressing: sectionText,
  qualification: sectionText,
  grounds: sectionText,
  requests: sectionText,
  closing: sectionText,
});

export type AttemptAnswers = z.output<typeof attemptAnswersSchema>;

export const emptyAnswers: AttemptAnswers = {
  identifiedPiece: '',
  addressing: '',
  qualification: '',
  grounds: '',
  requests: '',
  closing: '',
};

/** Labels of the fields left blank, to warn before submitting (US-017). */
export const blankFieldLabels = (answers: AttemptAnswers) =>
  answerFields.filter(({ key }) => answers[key].trim() === '').map(({ label }) => label);
