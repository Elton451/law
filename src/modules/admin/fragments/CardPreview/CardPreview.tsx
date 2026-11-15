import { useState } from 'react';
import FlipCard from '@shared/components/FlipCard/FlipCard';
import type { FlashcardFormValues } from '../../schemas/flashcardForm';
import { Caption, Wrapper } from './styles';

const placeholder = (text: string, fallback: string) => (text.trim() ? text : `*${fallback}*`);

/** The card exactly as students see it, turning over on click (US-023). */
const CardPreview = ({ card }: { card: FlashcardFormValues }) => {
  const [flipped, setFlipped] = useState(false);

  return (
    <Wrapper>
      <FlipCard
        card={{
          front: placeholder(card.front, 'A pergunta aparece aqui'),
          back: placeholder(card.back, 'A resposta aparece aqui'),
        }}
        flipped={flipped}
        onFlip={() => setFlipped((current) => !current)}
      />
      <Caption>Pré-visualização: clique no card para virar.</Caption>
    </Wrapper>
  );
};

export default CardPreview;
