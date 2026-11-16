import { Tag } from 'antd';
import DemoTag from '@shared/catalog/components/DemoTag/DemoTag';
import type { ExamEdition } from '@shared/catalog/types';
import { editionSituation, formatDate } from '@shared/catalog/utils/catalog';
import { Card, Dates, Header, Source, Title } from './styles';

/** One published exam edition: number, dates, situation and source (SB01). */
const EditionCard = ({ edition }: { edition: ExamEdition }) => {
  const situation = editionSituation(edition);

  return (
    <Card>
      <Header>
        <Title level={3}>{edition.number}º Exame de Ordem</Title>
        <Tag color={situation === 'Prevista' ? 'purple' : 'default'}>{situation}</Tag>
        {edition.isDemo && <DemoTag />}
      </Header>
      <Dates>
        {edition.firstPhaseDate && (
          <>
            <dt>1ª fase</dt>
            <dd>{formatDate(edition.firstPhaseDate)}</dd>
          </>
        )}
        <dt>2ª fase</dt>
        <dd>{formatDate(edition.secondPhaseDate)}</dd>
      </Dates>
      {edition.sourceLabel && (
        <Source>
          Fonte:{' '}
          {edition.sourceUrl ? (
            <a href={edition.sourceUrl} target="_blank" rel="noopener noreferrer">
              {edition.sourceLabel}
            </a>
          ) : (
            edition.sourceLabel
          )}
        </Source>
      )}
    </Card>
  );
};

export default EditionCard;
