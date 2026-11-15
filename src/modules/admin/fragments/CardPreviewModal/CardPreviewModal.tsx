import { Modal } from 'antd';
import type { AdminFlashcard } from '../../api/flashcards';
import CardPreview from '../CardPreview/CardPreview';

type CardPreviewModalProps = { card: AdminFlashcard | null; onClose: () => void };

const CardPreviewModal = ({ card, onClose }: CardPreviewModalProps) => (
  <Modal open={card !== null} title="Pré-visualizar card" footer={null} onCancel={onClose}>
    {/* Keyed so each card opens on its front. */}
    {card && <CardPreview key={card.id} card={card} />}
  </Modal>
);

export default CardPreviewModal;
