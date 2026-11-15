import { Button, Result, Skeleton } from 'antd';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import AppShell from '@shared/components/AppShell/AppShell';
import BackLink from '@shared/components/BackLink/BackLink';
import LoadError from '@shared/components/LoadError/LoadError';
import { paths } from '@shared/routes';
import { useLessonDeck } from '../../hooks/useLessonDeck';
import SessionHeader from '../SessionHeader/SessionHeader';
import StudySession from '../StudySession/StudySession';

const LessonSession = ({ trailSlug, lessonId }: { trailSlug: string; lessonId: string }) => {
  const navigate = useNavigate();
  const deck = useLessonDeck(lessonId);
  // Bumped by "Estudar de novo": a new key starts the session over.
  const [round, setRound] = useState(0);
  const backToLessons = () => navigate(paths.flashcards(trailSlug));

  if (deck.status === 'loading') return <Skeleton active />;
  if (deck.status === 'error') {
    return <LoadError title="Não foi possível carregar a lição" onRetry={deck.reload} />;
  }
  if (!deck.data) {
    return (
      <Result
        status="404"
        title="Lição não encontrada"
        extra={<Button onClick={backToLessons}>Voltar às lições</Button>}
      />
    );
  }
  if (deck.data.flashcards.length === 0) {
    return (
      <Result
        title="Esta lição ainda não tem flashcards"
        extra={<Button onClick={backToLessons}>Voltar às lições</Button>}
      />
    );
  }

  return (
    <>
      <SessionHeader eyebrow="Flashcards" title={deck.data.title} />
      <StudySession
        key={round}
        cards={deck.data.flashcards}
        summaryActions={
          <>
            <Button size="large" onClick={() => setRound((current) => current + 1)}>
              Estudar de novo
            </Button>
            <Button size="large" type="primary" onClick={backToLessons}>
              Voltar às lições
            </Button>
          </>
        }
      />
    </>
  );
};

const LessonSessionPage = () => {
  const { slug = '', lessonId = '' } = useParams();

  return (
    <AppShell>
      <BackLink to={paths.flashcards(slug)}>Voltar às lições</BackLink>
      <LessonSession trailSlug={slug} lessonId={lessonId} />
    </AppShell>
  );
};

export default LessonSessionPage;
