import { message } from 'antd';
import { useCallback } from 'react';
import { addFlashcards } from '../api/flashcards';
import type { FlashcardFormValues } from '../schemas/flashcardForm';

/** Adds cards to the lesson and confirms it. Failures reach the form, which shows them. */
export const useAddFlashcards = (lessonId: string, onAdded: () => void) => {
  const [messages, holder] = message.useMessage();

  const add = useCallback(
    async (cards: FlashcardFormValues[]) => {
      const count = await addFlashcards(lessonId, cards);
      void messages.success(count === 1 ? 'Card adicionado.' : `${count} cards adicionados.`);
      onAdded();
    },
    [lessonId, messages, onAdded],
  );

  return { add, holder };
};
