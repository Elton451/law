import { colors, trailColors } from '@shared/theme/tokens';
import { Yarn } from './styles';

type NoveloImageProps = { slug: string; size?: number };

/**
 * The discipline's novelo. Placeholder drawing in the discipline color until the
 * seven novelo images are added; always shown next to the discipline name.
 */
const NoveloImage = ({ slug, size = 72 }: NoveloImageProps) => (
  <Yarn $color={trailColors[slug] ?? colors.accent} $size={size} aria-hidden />
);

export default NoveloImage;
