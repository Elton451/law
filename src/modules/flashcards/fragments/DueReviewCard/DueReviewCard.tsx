import { Button } from 'antd';
import { useNavigate } from 'react-router';
import { cardsLabel } from '../../utils/cardsLabel';
import { Card, Count, Eyebrow, Title } from './styles';

type DueReviewCardProps = { title: string; dueCount: number; to: string };

/** How many cards are due today, with the way into their review session (US-010). */
const DueReviewCard = ({ title, dueCount, to }: DueReviewCardProps) => {
  const navigate = useNavigate();

  return (
    <Card aria-label={title}>
      <div>
        <Eyebrow>Revisão</Eyebrow>
        <Title>{title}</Title>
        <Count>
          {dueCount === 0
            ? 'Nenhum card para revisar hoje.'
            : `${cardsLabel(dueCount)} para revisar hoje`}
        </Count>
      </div>
      <Button type="primary" size="large" disabled={dueCount === 0} onClick={() => navigate(to)}>
        Revisar agora
      </Button>
    </Card>
  );
};

export default DueReviewCard;
