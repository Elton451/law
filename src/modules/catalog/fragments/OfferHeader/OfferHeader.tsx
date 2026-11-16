import type { Discipline } from '@shared/catalog/types';
import NoveloImage from '@shared/catalog/components/NoveloImage/NoveloImage';
import { disciplineTitle } from '@shared/catalog/utils/catalog';
import { Eyebrow, Title, Wrapper } from './styles';

/** The novelo image and discipline name, kept together (US02). */
const OfferHeader = ({ discipline }: { discipline: Discipline }) => (
  <Wrapper>
    <NoveloImage slug={discipline.slug} size={88} />
    <div>
      <Eyebrow>Novelo</Eyebrow>
      <Title level={1}>{disciplineTitle(discipline)}</Title>
    </div>
  </Wrapper>
);

export default OfferHeader;
