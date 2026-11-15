export type LessonStatus = 'new' | 'inProgress' | 'studied';

/** Where the student is in a lesson's deck: untouched, partly answered, or fully answered. */
export const lessonStatus = (studiedCount: number, cardCount: number): LessonStatus => {
  if (studiedCount === 0) return 'new';
  return studiedCount >= cardCount ? 'studied' : 'inProgress';
};
