import { Skeleton } from 'antd';
import type { AsyncState } from '@shared/hooks/useAsync';
import type { Catalog } from '@shared/catalog/types';
import LoadError from '@shared/components/LoadError/LoadError';
import NoveloCard from '../NoveloCard/NoveloCard';
import SectionHeading from '../SectionHeading/SectionHeading';
import { Grid, Wrapper } from './styles';

type NovelosSectionProps = { catalog: AsyncState<Catalog>; onRetry: () => void };

/** The seven novelos, each opening its offer page (US02). */
const NovelosSection = ({ catalog, onRetry }: NovelosSectionProps) => {
  const renderContent = () => {
    if (catalog.status === 'loading') return <Skeleton active />;
    if (catalog.status === 'error') {
      return <LoadError title="Não foi possível carregar os novelos." onRetry={onRetry} />;
    }
    return (
      <Grid>
        {catalog.data.disciplines.map((discipline) => (
          <NoveloCard key={discipline.id} discipline={discipline} />
        ))}
      </Grid>
    );
  };

  return (
    <Wrapper id="novelos">
      <SectionHeading
        eyebrow="Novelos"
        title="Escolha sua disciplina"
        description="Cada novelo reúne o treinamento de uma disciplina da 2ª fase."
      />
      {renderContent()}
    </Wrapper>
  );
};

export default NovelosSection;
