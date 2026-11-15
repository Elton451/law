import { Empty, Skeleton } from 'antd';
import LoadError from '@shared/components/LoadError/LoadError';
import type { Trail } from '../../api/flashcards';
import { useTrailLessons } from '../../hooks/useTrailLessons';
import LessonList from '../LessonList/LessonList';

const TrailLessons = ({ trail }: { trail: Trail }) => {
  const modules = useTrailLessons(trail.id);

  if (modules.status === 'loading') return <Skeleton active />;
  if (modules.status === 'error') {
    return <LoadError title="Não foi possível carregar as lições" onRetry={modules.reload} />;
  }
  if (modules.data.length === 0) {
    return <Empty description="Ainda não há flashcards nesta matéria." />;
  }

  return <LessonList trailSlug={trail.slug} modules={modules.data} />;
};

export default TrailLessons;
