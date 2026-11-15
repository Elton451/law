import { Modal } from 'antd';
import type { AdminFlashcard } from '../../api/flashcards';
import type { FlashcardFormValues } from '../../schemas/flashcardForm';
import FlashcardForm from '../FlashcardForm/FlashcardForm';

type EditFlashcardModalProps = {
  card: AdminFlashcard | null;
  onSave: (values: FlashcardFormValues) => Promise<void>;
  onCancel: () => void;
};

const EditFlashcardModal = ({ card, onSave, onCancel }: EditFlashcardModalProps) => (
  <Modal open={card !== null} title="Editar card" footer={null} onCancel={onCancel} width={960}>
    {card && (
      <FlashcardForm
        key={card.id}
        initialValues={{ front: card.front, back: card.back }}
        submitLabel="Salvar card"
        onSubmit={onSave}
        onCancel={onCancel}
      />
    )}
  </Modal>
);

export default EditFlashcardModal;
