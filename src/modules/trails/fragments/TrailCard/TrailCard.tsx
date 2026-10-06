import { Progress } from 'antd';
import { paths } from '@shared/routes';
import { colors, trailColors } from '@shared/theme/tokens';
import type { Trail } from '../../api';
import { progressPercent } from '../../progress';
import { CardLink, Name, ProgressLabel, YarnIcon } from './styles';

const TrailCard = ({ trail }: { trail: Trail }) => {
  const percent = progressPercent(trail.completedLessons, trail.totalLessons);
  const color = trailColors[trail.slug] ?? colors.primary;

  return (
    <CardLink to={paths.trail(trail.slug)} $color={color}>
      <Progress
        type="circle"
        percent={percent}
        size={88}
        strokeColor={color}
        railColor={colors.borderSecondary}
        format={() => <YarnIcon $color={color} aria-hidden />}
        aria-hidden
      />
      <Name>{trail.name}</Name>
      <ProgressLabel>{percent}% desenrolado</ProgressLabel>
    </CardLink>
  );
};

export default TrailCard;
