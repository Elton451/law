import { Button } from 'antd';
import { useNavigate } from 'react-router';
import NoveloImage from '@shared/catalog/components/NoveloImage/NoveloImage';
import type { Discipline } from '@shared/catalog/types';
import { disciplineTitle } from '@shared/catalog/utils/catalog';
import { paths } from '@shared/routes';
import { Card, Name } from './styles';

/** A discipline's novelo with its name and "Conhecer o novelo" (SB01). */
const NoveloCard = ({ discipline }: { discipline: Discipline }) => {
  const navigate = useNavigate();
  const title = disciplineTitle(discipline);

  return (
    <Card>
      <NoveloImage slug={discipline.slug} size={96} />
      <Name level={3}>{title}</Name>
      <Button
        onClick={() => navigate(paths.discipline(discipline.slug))}
        aria-label={`Conhecer o novelo de ${title}`}
      >
        Conhecer o novelo
      </Button>
    </Card>
  );
};

export default NoveloCard;
