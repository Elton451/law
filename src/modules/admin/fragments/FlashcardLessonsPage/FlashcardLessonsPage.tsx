import LoadError from '@shared/components/LoadError/LoadError';
import { useFlashcardLessons } from '../../hooks/useFlashcardLessons';
import AdminShell from '../AdminShell/AdminShell';
import LessonsTable from '../LessonsTable/LessonsTable';
import PageHeader from '../PageHeader/PageHeader';

const LessonsContent = () => {
  const lessons = useFlashcardLessons();

  if (lessons.status === 'error') {
    return <LoadError title="Não foi possível carregar as lições" onRetry={lessons.reload} />;
  }

  return (
    <LessonsTable
      lessons={lessons.status === 'success' ? lessons.data : []}
      loading={lessons.status === 'loading'}
    />
  );
};

/** Admin entry to flashcards: pick the lesson whose cards to manage (US-023). */
const FlashcardLessonsPage = () => (
  <AdminShell>
    <PageHeader title="Flashcards" />
    <LessonsContent />
  </AdminShell>
);

export default FlashcardLessonsPage;
