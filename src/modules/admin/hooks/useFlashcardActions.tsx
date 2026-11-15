import { message, Modal } from 'antd';
import { useState } from 'react';
import { deleteFlashcard, updateFlashcard, type AdminFlashcard } from '../api/flashcards';
import type { FlashcardFormValues } from '../schemas/flashcardForm';

/** Preview, edit and delete for the lesson's cards. `onChanged` reloads the list. */
export const useFlashcardActions = (onChanged: () => void) => {
  const [modal, modalHolder] = Modal.useModal();
  const [messages, messageHolder] = message.useMessage();
  const [previewing, setPreviewing] = useState<AdminFlashcard | null>(null);
  const [editing, setEditing] = useState<AdminFlashcard | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  /** Throws on failure, so the edit form can show it. */
  const save = async (values: FlashcardFormValues) => {
    if (!editing) return;
    await updateFlashcard(editing.id, values);
    setEditing(null);
    void messages.success('Card atualizado.');
    onChanged();
  };

  const remove = async (card: AdminFlashcard) => {
    const confirmed = await modal.confirm({
      title: 'Excluir card?',
      content: 'Ele sai da lição e das revisões dos estudantes.',
      okText: 'Excluir',
      okButtonProps: { danger: true },
      cancelText: 'Cancelar',
    });
    if (!confirmed) return;

    setBusyId(card.id);
    try {
      await deleteFlashcard(card.id);
      void messages.success('Card excluído.');
      onChanged();
    } catch {
      void messages.error('Não foi possível excluir o card. Tente novamente.');
    } finally {
      setBusyId(null);
    }
  };

  return {
    previewing,
    editing,
    busyId,
    preview: setPreviewing,
    closePreview: () => setPreviewing(null),
    edit: setEditing,
    cancelEdit: () => setEditing(null),
    save,
    remove,
    holders: (
      <>
        {modalHolder}
        {messageHolder}
      </>
    ),
  };
};
