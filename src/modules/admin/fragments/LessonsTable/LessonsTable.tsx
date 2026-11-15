import { Table, type TableProps } from 'antd';
import { Link } from 'react-router';
import { paths } from '@shared/routes';
import type { FlashcardLesson } from '../../api/flashcards';

type LessonsTableProps = { lessons: FlashcardLesson[]; loading: boolean };

const LessonsTable = ({ lessons, loading }: LessonsTableProps) => {
  const trailFilters = [...new Map(lessons.map((l) => [l.trailId, l.trailName])).entries()].map(
    ([value, text]) => ({ value, text }),
  );

  const columns: TableProps<FlashcardLesson>['columns'] = [
    {
      title: 'Lição',
      key: 'title',
      render: (_, lesson) => (
        <Link to={paths.adminLessonFlashcards(lesson.id)}>{lesson.title}</Link>
      ),
    },
    { title: 'Módulo', dataIndex: 'moduleTitle', responsive: ['md'] },
    {
      title: 'Trilha',
      dataIndex: 'trailName',
      filters: trailFilters,
      onFilter: (value, lesson) => lesson.trailId === value,
    },
    { title: 'Cards', dataIndex: 'cardCount', align: 'right' },
  ];

  return (
    <Table
      rowKey="id"
      columns={columns}
      dataSource={lessons}
      loading={loading}
      pagination={{ pageSize: 20, hideOnSinglePage: true }}
      locale={{ emptyText: 'Nenhuma lição cadastrada ainda.' }}
    />
  );
};

export default LessonsTable;
