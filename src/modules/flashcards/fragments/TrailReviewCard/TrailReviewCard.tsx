import { Skeleton } from 'antd';
import LoadError from '@shared/components/LoadError/LoadError';
import { paths } from '@shared/routes';
import type { Trail } from '../../api/flashcards';
import { useDueCounts } from '../../hooks/useDueCounts';
import DueReviewCard from '../DueReviewCard/DueReviewCard';

/** The trail's pending review (US-010). */
const TrailReviewCard = ({ trail }: { trail: Trail }) => {
  const counts = useDueCounts();

  if (counts.status === 'loading') return <Skeleton active paragraph={{ rows: 1 }} />;
  if (counts.status === 'error') {
    return <LoadError title="Não foi possível carregar a revisão" onRetry={counts.reload} />;
  }

  const dueCount = counts.data.find((count) => count.id === trail.id)?.dueCount ?? 0;
  return (
    <DueReviewCard title="Cards pendentes" dueCount={dueCount} to={paths.trailReview(trail.slug)} />
  );
};

export default TrailReviewCard;
