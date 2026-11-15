import { Button, Result, Skeleton } from 'antd';
import { useNavigate } from 'react-router';
import LoadError from '@shared/components/LoadError/LoadError';
import { useDueCards } from '../../hooks/useDueCards';
import SessionHeader from '../SessionHeader/SessionHeader';
import StudySession from '../StudySession/StudySession';

type ReviewDeckProps = {
  /** Null reviews every trail. */
  trailId: string | null;
  title: string;
  backTo: string;
};

/** A review session over today's due cards (US-010). */
const ReviewDeck = ({ trailId, title, backTo }: ReviewDeckProps) => {
  const navigate = useNavigate();
  const cards = useDueCards(trailId);
  const back = (
    <Button size="large" type="primary" onClick={() => navigate(backTo)}>
      Voltar
    </Button>
  );

  if (cards.status === 'loading') return <Skeleton active />;
  if (cards.status === 'error') {
    return <LoadError title="Não foi possível carregar a revisão" onRetry={cards.reload} />;
  }
  if (cards.data.length === 0) {
    return (
      <Result
        status="success"
        title="Tudo em dia!"
        subTitle="Nenhum card para revisar hoje."
        extra={back}
      />
    );
  }

  return (
    <>
      <SessionHeader eyebrow="Revisão" title={title} />
      <StudySession cards={cards.data} summaryActions={back} />
    </>
  );
};

export default ReviewDeck;
