import { colors, trailColors } from '@shared/theme/tokens';
import type { Trail } from '../../api';
import { Eyebrow, Name, Wrapper, YarnIcon } from './styles';

const TrailHeader = ({ trail, eyebrow }: { trail: Trail; eyebrow: string }) => (
  <Wrapper>
    <YarnIcon $color={trailColors[trail.slug] ?? colors.primary} aria-hidden />
    <div>
      <Eyebrow>{eyebrow}</Eyebrow>
      <Name level={1}>{trail.name}</Name>
    </div>
  </Wrapper>
);

export default TrailHeader;
