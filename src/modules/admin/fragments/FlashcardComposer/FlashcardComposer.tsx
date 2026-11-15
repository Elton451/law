import { Card, Tabs } from 'antd';
import { useAddFlashcards } from '../../hooks/useAddFlashcards';
import FlashcardForm from '../FlashcardForm/FlashcardForm';
import MarkdownImport from '../MarkdownImport/MarkdownImport';

type FlashcardComposerProps = { lessonId: string; onAdded: () => void };

/** Adds cards to the lesson: one by one, or many from Markdown, without leaving the page. */
const FlashcardComposer = ({ lessonId, onAdded }: FlashcardComposerProps) => {
  const { add, holder } = useAddFlashcards(lessonId, onAdded);

  return (
    <Card>
      {holder}
      <Tabs
        items={[
          {
            key: 'single',
            label: 'Card a card',
            children: (
              <FlashcardForm
                submitLabel="Adicionar card"
                onSubmit={(values) => add([values])}
                resetAfterSubmit
              />
            ),
          },
          {
            key: 'markdown',
            label: 'Importar Markdown',
            children: <MarkdownImport onImport={add} />,
          },
        ]}
      />
    </Card>
  );
};

export default FlashcardComposer;
