import { colors, trailColors } from '@shared/theme/tokens';
import { Eyebrow, Name, Wrapper, YarnIcon } from './styles';

type TrailHeaderProps = { trail: { slug: string; name: string }; eyebrow: string };

/** The trail's yarn and name, under a label for the area of the trail the page is in. */
const TrailHeader = ({ trail, eyebrow }: TrailHeaderProps) => (
  <Wrapper>
    <YarnIcon $color={trailColors[trail.slug] ?? colors.primary} aria-hidden />
    <div>
      <Eyebrow>{eyebrow}</Eyebrow>
      <Name level={1}>{trail.name}</Name>
    </div>
  </Wrapper>
);

export default TrailHeader;
