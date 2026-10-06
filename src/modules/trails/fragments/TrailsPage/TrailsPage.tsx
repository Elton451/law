import { Button, Result, Skeleton } from 'antd';
import AppShell from '@shared/components/AppShell/AppShell';
import { useTrails } from '../../useTrails';
import TrailCard from '../TrailCard/TrailCard';
import { Grid, Subtitle, Title } from './styles';

const SKELETON_COUNT = 7;

const TrailsContent = () => {
  const trails = useTrails();

  if (trails.status === 'error') {
    return (
      <Result
        status="error"
        title="Não foi possível carregar as trilhas"
        extra={
          <Button type="primary" onClick={trails.retry}>
            Tentar novamente
          </Button>
        }
      />
    );
  }

  return (
    <Grid>
      {trails.status === 'loading'
        ? Array.from({ length: SKELETON_COUNT }, (_, index) => <Skeleton.Node key={index} active />)
        : trails.trails.map((trail) => <TrailCard key={trail.id} trail={trail} />)}
    </Grid>
  );
};

const TrailsPage = () => (
  <AppShell>
    <Title level={1}>Suas trilhas</Title>
    <Subtitle>Escolha um novelo e comece a desenrolar.</Subtitle>
    <TrailsContent />
  </AppShell>
);

export default TrailsPage;
