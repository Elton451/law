import { Button, Table, Tag, Tooltip, type TableProps } from 'antd';
import { Link, useLocation } from 'react-router';
import { originLabel } from '@shared/case-studies/origin';
import { paths } from '@shared/routes';
import type { CaseSummary } from '../../api';
import { Actions, CaseTitle } from './styles';

type CasesTableProps = {
  cases: CaseSummary[];
  loading: boolean;
  /** The case an action is running on; its buttons show it. */
  busyId: string | null;
  onToggleActive: (caseStudy: CaseSummary) => void;
  onDelete: (caseStudy: CaseSummary) => void;
};

const CasesTable = ({ cases, loading, busyId, onToggleActive, onDelete }: CasesTableProps) => {
  // Lets the form come back to the list with the same filters.
  const { search } = useLocation();

  const columns: TableProps<CaseSummary>['columns'] = [
    {
      title: 'Título',
      key: 'title',
      render: (_, caseStudy) => (
        <Link to={paths.adminCase(caseStudy.id)} state={{ listSearch: search }}>
          <CaseTitle>{caseStudy.title}</CaseTitle>
        </Link>
      ),
    },
    { title: 'Trilha', dataIndex: 'trailName', responsive: ['md'] },
    {
      title: 'Origem',
      key: 'origin',
      responsive: ['md'],
      render: (_, caseStudy) => originLabel(caseStudy),
    },
    {
      title: 'Status',
      key: 'status',
      render: (_, { isActive }) =>
        isActive ? <Tag color="success">Ativo</Tag> : <Tag>Inativo</Tag>,
    },
    { title: 'Tentativas', dataIndex: 'attemptCount', align: 'right', responsive: ['lg'] },
    {
      title: 'Ações',
      key: 'actions',
      render: (_, caseStudy) => {
        const busy = busyId === caseStudy.id;
        const hasAttempts = caseStudy.attemptCount > 0;
        return (
          <Actions>
            <Button size="small" onClick={() => onToggleActive(caseStudy)} disabled={busy}>
              {caseStudy.isActive ? 'Desativar' : 'Ativar'}
            </Button>
            <Tooltip
              title={hasAttempts ? 'Casos com tentativas não podem ser excluídos.' : undefined}
            >
              <Button
                size="small"
                danger
                onClick={() => onDelete(caseStudy)}
                disabled={busy || hasAttempts}
              >
                Excluir
              </Button>
            </Tooltip>
          </Actions>
        );
      },
    },
  ];

  return (
    <Table
      rowKey="id"
      columns={columns}
      dataSource={cases}
      loading={loading}
      pagination={{ pageSize: 20, hideOnSinglePage: true }}
      locale={{ emptyText: 'Nenhum caso concreto encontrado.' }}
    />
  );
};

export default CasesTable;
