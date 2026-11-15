import { Tag } from 'antd';
import { paths } from '@shared/routes';
import type { FlashcardModule } from '../../api/flashcards';
import { cardsLabel } from '../../utils/cardsLabel';
import { lessonStatus, type LessonStatus } from '../../utils/lessonStatus';
import { LessonLink, LessonMeta, Lessons, LessonTitle, Modules, ModuleTitle } from './styles';

const statusTags: Record<LessonStatus, { label: string; color?: string }> = {
  new: { label: 'Não iniciada' },
  inProgress: { label: 'Em andamento', color: 'warning' },
  studied: { label: 'Estudada', color: 'success' },
};

type LessonListProps = { trailSlug: string; modules: FlashcardModule[] };

const LessonList = ({ trailSlug, modules }: LessonListProps) => (
  <Modules>
    {modules.map((module) => (
      <section key={module.id} aria-labelledby={`module-${module.id}`}>
        <ModuleTitle id={`module-${module.id}`}>{module.title}</ModuleTitle>
        <Lessons>
          {module.lessons.map((lesson) => {
            const tag = statusTags[lessonStatus(lesson.studiedCount, lesson.cardCount)];
            return (
              <li key={lesson.id}>
                <LessonLink to={paths.lessonFlashcards(trailSlug, lesson.id)}>
                  <span>
                    <LessonTitle>{lesson.title}</LessonTitle>
                    <LessonMeta>
                      {cardsLabel(lesson.cardCount)} · {lesson.studiedCount}/{lesson.cardCount}{' '}
                      estudados
                    </LessonMeta>
                  </span>
                  <Tag color={tag.color}>{tag.label}</Tag>
                </LessonLink>
              </li>
            );
          })}
        </Lessons>
      </section>
    ))}
  </Modules>
);

export default LessonList;
