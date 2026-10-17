import { FaClock } from 'react-icons/fa6';
import { Badge } from './styles';

type TimerBadgeProps = { label: string; overtime: boolean };

const TimerBadge = ({ label, overtime }: TimerBadgeProps) => (
  <Badge
    role="timer"
    $overtime={overtime}
    aria-label={overtime ? `Tempo excedido: ${label}` : `Tempo restante: ${label}`}
  >
    <FaClock aria-hidden />
    {label}
  </Badge>
);

export default TimerBadge;
