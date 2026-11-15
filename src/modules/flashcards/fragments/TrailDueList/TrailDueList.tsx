import { paths } from '@shared/routes';
import { colors, trailColors } from '@shared/theme/tokens';
import type { TrailDueCount } from '../../api/flashcards';
import { cardsLabel } from '../../utils/cardsLabel';
import { Count, Dot, List, Name, Row, RowLink } from './styles';

/** Due cards per trail; trails with any link to their own review session (US-010). */
const TrailDueList = ({ counts }: { counts: TrailDueCount[] }) => (
  <List aria-label="Pendentes por trilha">
    {counts.map((trail) => {
      const content = (
        <>
          <Dot $color={trailColors[trail.slug] ?? colors.primary} aria-hidden />
          <Name>{trail.name}</Name>
          <Count $muted={trail.dueCount === 0}>{cardsLabel(trail.dueCount)}</Count>
        </>
      );
      return (
        <li key={trail.id}>
          {trail.dueCount > 0 ? (
            <RowLink to={paths.trailReview(trail.slug)}>{content}</RowLink>
          ) : (
            <Row>{content}</Row>
          )}
        </li>
      );
    })}
  </List>
);

export default TrailDueList;
