import { Empty, Skeleton } from 'antd';
import type { AsyncState } from '@shared/hooks/useAsync';
import type { Catalog } from '@shared/catalog/types';
import LoadError from '@shared/components/LoadError/LoadError';
import EditionCard from '../EditionCard/EditionCard';
import SectionHeading from '../SectionHeading/SectionHeading';
import { Grid, Wrapper } from './styles';

type ExamCalendarSectionProps = { catalog: AsyncState<Catalog>; onRetry: () => void };

/** Published exam editions, only with the dates the admin entered (SB01). */
const ExamCalendarSection = ({ catalog, onRetry }: ExamCalendarSectionProps) => {
  const renderContent = () => {
    if (catalog.status === 'loading') return <Skeleton active />;
    if (catalog.status === 'error') {
      return <LoadError title="Não foi possível carregar o calendário." onRetry={onRetry} />;
    }
    if (!catalog.data.editions.length) {
      return <Empty description="As próximas datas serão publicadas aqui." />;
    }
    return (
      <Grid>
        {catalog.data.editions.map((edition) => (
          <EditionCard key={edition.id} edition={edition} />
        ))}
      </Grid>
    );
  };

  return (
    <Wrapper id="calendario">
      <SectionHeading
        eyebrow="Calendário"
        title="Datas do Exame de Ordem"
        description="Datas das provas conforme publicadas pela organização do exame."
      />
      {renderContent()}
    </Wrapper>
  );
};

export default ExamCalendarSection;
