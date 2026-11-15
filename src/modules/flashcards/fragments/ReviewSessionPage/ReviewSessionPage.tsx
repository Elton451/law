import { useParams } from 'react-router';
import AppShell from '@shared/components/AppShell/AppShell';
import BackLink from '@shared/components/BackLink/BackLink';
import { paths } from '@shared/routes';
import ReviewDeck from '../ReviewDeck/ReviewDeck';
import TrailLoader from '../TrailLoader/TrailLoader';

/** Reviews the due cards of the trail in the URL, or of every trail when there's none. */
const ReviewSessionPage = () => {
  const { slug } = useParams();

  if (!slug) {
    return (
      <AppShell>
        <BackLink to={paths.review}>Voltar para a revisão</BackLink>
        <ReviewDeck trailId={null} title="Todas as trilhas" backTo={paths.review} />
      </AppShell>
    );
  }

  return (
    <AppShell>
      <BackLink to={paths.flashcards(slug)}>Voltar aos flashcards</BackLink>
      <TrailLoader slug={slug}>
        {(trail) => (
          <ReviewDeck trailId={trail.id} title={trail.name} backTo={paths.flashcards(slug)} />
        )}
      </TrailLoader>
    </AppShell>
  );
};

export default ReviewSessionPage;
