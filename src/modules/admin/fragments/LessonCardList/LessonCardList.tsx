import { Button, Empty } from 'antd';
import Markdown from '@shared/components/Markdown/Markdown';
import type { AdminFlashcard } from '../../api/flashcards';
import { useFlashcardActions } from '../../hooks/useFlashcardActions';
import CardPreviewModal from '../CardPreviewModal/CardPreviewModal';
import EditFlashcardModal from '../EditFlashcardModal/EditFlashcardModal';
import { Actions, Back, Front, Item, List, Number } from './styles';

type LessonCardListProps = { cards: AdminFlashcard[]; onChanged: () => void };

/** The lesson's cards in order, each with preview, edit and delete (US-023). */
const LessonCardList = ({ cards, onChanged }: LessonCardListProps) => {
  const actions = useFlashcardActions(onChanged);

  if (cards.length === 0) return <Empty description="Esta lição ainda não tem cards." />;

  return (
    <>
      {actions.holders}
      <List aria-label="Cards da lição">
        {cards.map((card, index) => (
          <Item key={card.id}>
            <Number>{index + 1}</Number>
            <Front>
              <Markdown>{card.front}</Markdown>
            </Front>
            <Back>
              <Markdown>{card.back}</Markdown>
            </Back>
            <Actions>
              <Button size="small" onClick={() => actions.preview(card)}>
                Pré-visualizar
              </Button>
              <Button size="small" onClick={() => actions.edit(card)}>
                Editar
              </Button>
              <Button
                size="small"
                danger
                disabled={actions.busyId === card.id}
                onClick={() => void actions.remove(card)}
              >
                Excluir
              </Button>
            </Actions>
          </Item>
        ))}
      </List>
      <CardPreviewModal card={actions.previewing} onClose={actions.closePreview} />
      <EditFlashcardModal
        card={actions.editing}
        onSave={actions.save}
        onCancel={actions.cancelEdit}
      />
    </>
  );
};

export default LessonCardList;
