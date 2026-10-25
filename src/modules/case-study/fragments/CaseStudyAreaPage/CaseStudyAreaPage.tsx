import { Button, Result, Skeleton, Tag } from 'antd';
import { useParams } from 'react-router';
import AppShell from '@shared/components/AppShell/AppShell';
import BackLink from '@shared/components/BackLink/BackLink';
import { paths } from '@shared/routes';
import { useTrail } from '../../hooks';
import OptionCard from '../OptionCard/OptionCard';
import TrailHeader from '../TrailHeader/TrailHeader';
import TrainingCard from '../TrainingCard/TrainingCard';
import { Columns } from './styles';

const AreaContent = ({ slug }: { slug: string }) => {
  const trail = useTrail(slug);

  if (trail.status === 'loading') return <Skeleton active />;

  if (trail.status === 'error') {
    return (
      <Result
        status="error"
        title="Não foi possível carregar a matéria"
        extra={
          <Button type="primary" onClick={trail.reload}>
            Tentar novamente
          </Button>
        }
      />
    );
  }

  if (!trail.data) return <Result status="404" title="Matéria não encontrada" />;

  return (
    <>
      <TrailHeader trail={trail.data} eyebrow="Estudo de caso" />
      <Columns>
        {/* US-016 (como fazer as peças) comes in a later branch. */}
        <OptionCard
          eyebrow="Estudo"
          title="Como fazer as peças"
          description="Resumos sobre como identificar e estruturar cada peça desta matéria."
          aside={<Tag>Em breve</Tag>}
          disabled
        />
        <TrainingCard trail={trail.data} />
      </Columns>
    </>
  );
};

const CaseStudyAreaPage = () => {
  const { slug = '' } = useParams();

  return (
    <AppShell>
      <BackLink to={paths.trail(slug)}>Voltar para a matéria</BackLink>
      <AreaContent slug={slug} />
    </AppShell>
  );
};

export default CaseStudyAreaPage;
