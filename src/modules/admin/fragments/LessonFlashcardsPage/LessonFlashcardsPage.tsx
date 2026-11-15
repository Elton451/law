import { Result, Skeleton } from 'antd';
import { useParams } from 'react-router';
import BackLink from '@shared/components/BackLink/BackLink';
import LoadError from '@shared/components/LoadError/LoadError';
import { paths } from '@shared/routes';
import type { LessonDetail } from '../../api/flashcards';
import { useLesson } from '../../hooks/useLesson';
import { useLessonFlashcards } from '../../hooks/useLessonFlashcards';
import AdminShell from '../AdminShell/AdminShell';
import FlashcardComposer from '../FlashcardComposer/FlashcardComposer';
import LessonCardList from '../LessonCardList/LessonCardList';
import PageHeader from '../PageHeader/PageHeader';
import { Heading, Location } from './styles';

/** Kept apart from the composer, so reloading the list never resets what's being typed. */
const LessonCards = ({ cards }: { cards: ReturnType<typeof useLessonFlashcards> }) => {
  if (cards.status === 'loading') return <Skeleton active />;
  if (cards.status === 'error') {
    return <LoadError title="Não foi possível carregar os cards" onRetry={cards.reload} />;
  }
  return (
    <>
      <Heading>Cards da lição ({cards.data.length})</Heading>
      <LessonCardList cards={cards.data} onChanged={cards.reload} />
    </>
  );
};

const LessonEditor = ({ lesson }: { lesson: LessonDetail }) => {
  const cards = useLessonFlashcards(lesson.id);

  return (
    <>
      <PageHeader title={lesson.title} />
      <Location>
        {lesson.trailName} · {lesson.moduleTitle}
      </Location>
      <FlashcardComposer lessonId={lesson.id} onAdded={cards.reload} />
      <LessonCards cards={cards} />
    </>
  );
};

const LessonContent = ({ lessonId }: { lessonId: string }) => {
  const lesson = useLesson(lessonId);

  if (lesson.status === 'loading') return <Skeleton active />;
  if (lesson.status === 'error') {
    return <LoadError title="Não foi possível carregar a lição" onRetry={lesson.reload} />;
  }
  if (!lesson.data) return <Result status="404" title="Lição não encontrada" />;

  return <LessonEditor lesson={lesson.data} />;
};

/** Manages one lesson's flashcards: add, preview, edit and delete (US-023). */
const LessonFlashcardsPage = () => {
  const { lessonId = '' } = useParams();

  return (
    <AdminShell>
      <BackLink to={paths.adminFlashcards}>Voltar para as lições</BackLink>
      <LessonContent lessonId={lessonId} />
    </AdminShell>
  );
};

export default LessonFlashcardsPage;
