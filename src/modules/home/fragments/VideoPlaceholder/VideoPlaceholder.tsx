import { FaVideo } from 'react-icons/fa6';
import { Caption, Frame } from './styles';

/**
 * Where the explainer video goes. It doesn't exist yet, so this is labeled as
 * in preparation, with no misleading play button and no autoplay (SB01).
 */
const VideoPlaceholder = () => (
  <Frame role="img" aria-label="Vídeo explicativo em preparação">
    <FaVideo aria-hidden />
    <Caption>Vídeo explicativo em preparação</Caption>
  </Frame>
);

export default VideoPlaceholder;
