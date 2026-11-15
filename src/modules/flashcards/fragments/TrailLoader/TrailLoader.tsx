import { Result, Skeleton } from 'antd';
import type { ReactNode } from 'react';
import LoadError from '@shared/components/LoadError/LoadError';
import type { Trail } from '../../api/flashcards';
import { useTrail } from '../../hooks/useTrail';

type TrailLoaderProps = { slug: string; children: (trail: Trail) => ReactNode };

/** Loads the trail from the URL slug, rendering `children` once it's found. */
const TrailLoader = ({ slug, children }: TrailLoaderProps) => {
  const trail = useTrail(slug);

  if (trail.status === 'loading') return <Skeleton active />;
  if (trail.status === 'error') {
    return <LoadError title="Não foi possível carregar a matéria" onRetry={trail.reload} />;
  }
  if (!trail.data) return <Result status="404" title="Matéria não encontrada" />;

  return children(trail.data);
};

export default TrailLoader;
