import { useParams } from 'react-router';
import AppShell from '@shared/components/AppShell/AppShell';
import BackLink from '@shared/components/BackLink/BackLink';
import TrailHeader from '@shared/components/TrailHeader/TrailHeader';
import { paths } from '@shared/routes';
import TrailLessons from '../TrailLessons/TrailLessons';
import TrailLoader from '../TrailLoader/TrailLoader';
import TrailReviewCard from '../TrailReviewCard/TrailReviewCard';
import { Sections } from './styles';

/** The trail's flashcards: its pending review, then every lesson with cards. */
const FlashcardsAreaPage = () => {
  const { slug = '' } = useParams();

  return (
    <AppShell>
      <BackLink to={paths.trail(slug)}>Voltar para a matéria</BackLink>
      <TrailLoader slug={slug}>
        {(trail) => (
          <>
            <TrailHeader trail={trail} eyebrow="Flashcards" />
            <Sections>
              <TrailReviewCard trail={trail} />
              <TrailLessons trail={trail} />
            </Sections>
          </>
        )}
      </TrailLoader>
    </AppShell>
  );
};

export default FlashcardsAreaPage;
