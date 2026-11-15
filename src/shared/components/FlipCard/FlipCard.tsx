import Markdown from '@shared/components/Markdown/Markdown';
import { Face, Hint, Inner, Label, Scene, Text } from './styles';

type FlipCardProps = {
  card: { front: string; back: string };
  flipped: boolean;
  onFlip: () => void;
};

/** Front/back card that turns over on tap or click (US-009). Both sides are Markdown. */
const FlipCard = ({ card, flipped, onFlip }: FlipCardProps) => (
  <Scene type="button" onClick={onFlip} aria-pressed={flipped}>
    <Inner $flipped={flipped}>
      <Face aria-hidden={flipped || undefined}>
        <Label>Pergunta</Label>
        <Text>
          <Markdown>{card.front}</Markdown>
        </Text>
        <Hint>Toque para ver a resposta</Hint>
      </Face>
      {/* The answer only exists once the card is turned, so it can't be read early. */}
      <Face $back aria-hidden={!flipped || undefined}>
        <Label>Resposta</Label>
        <Text>{flipped && <Markdown>{card.back}</Markdown>}</Text>
        <Hint>Toque para ver a pergunta</Hint>
      </Face>
    </Inner>
  </Scene>
);

export default FlipCard;
