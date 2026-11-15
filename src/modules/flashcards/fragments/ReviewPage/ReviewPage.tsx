import { Skeleton } from 'antd';
import AppShell from '@shared/components/AppShell/AppShell';
import LoadError from '@shared/components/LoadError/LoadError';
import { paths } from '@shared/routes';
import { useDueCounts } from '../../hooks/useDueCounts';
import { totalDue } from '../../utils/dueCounts';
import DueReviewCard from '../DueReviewCard/DueReviewCard';
import TrailDueList from '../TrailDueList/TrailDueList';
import { Sections, Subtitle, Title } from './styles';

const ReviewOverview = () => {
  const counts = useDueCounts();

  if (counts.status === 'loading') return <Skeleton active />;
  if (counts.status === 'error') {
    return <LoadError title="Não foi possível carregar a revisão" onRetry={counts.reload} />;
  }

  return (
    <Sections>
      <DueReviewCard
        title="Todas as trilhas"
        dueCount={totalDue(counts.data)}
        to={paths.reviewSession}
      />
      <TrailDueList counts={counts.data} />
    </Sections>
  );
};

/** Today's pending flashcards, in total and per trail (US-010). */
const ReviewPage = () => (
  <AppShell>
    <Title level={1}>Revisão</Title>
    <Subtitle>Os cards voltam no ritmo do seu desempenho: o que você erra volta antes.</Subtitle>
    <ReviewOverview />
  </AppShell>
);

export default ReviewPage;
