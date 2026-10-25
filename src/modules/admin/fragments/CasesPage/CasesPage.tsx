import { Button } from 'antd';
import { FaPlus } from 'react-icons/fa6';
import { useLocation, useNavigate } from 'react-router';
import { paths } from '@shared/routes';
import { useCaseFilters } from '../../hooks/useCaseFilters';
import { useCases } from '../../hooks/useCases';
import { useTrails } from '../../hooks/useTrails';
import AdminShell from '../AdminShell/AdminShell';
import CaseFilters from '../CaseFilters/CaseFilters';
import CasesTable from '../CasesTable/CasesTable';
import LoadError from '../LoadError/LoadError';
import PageHeader from '../PageHeader/PageHeader';
import { useCaseActions } from '../../hooks/useCaseActions';

const CasesContent = () => {
  const { filters, setFilters } = useCaseFilters();
  const trails = useTrails();
  const cases = useCases(filters);
  const actions = useCaseActions(cases.reload);

  if (cases.status === 'error') {
    return <LoadError title="Não foi possível carregar os casos" onRetry={cases.reload} />;
  }

  return (
    <>
      {actions.holders}
      <CaseFilters
        trails={trails.status === 'success' ? trails.data : []}
        filters={filters}
        onChange={setFilters}
      />
      <CasesTable
        cases={cases.status === 'success' ? cases.data : []}
        loading={cases.status === 'loading'}
        busyId={actions.busyId}
        onToggleActive={(caseStudy) => void actions.toggleActive(caseStudy)}
        onDelete={(caseStudy) => void actions.remove(caseStudy)}
      />
    </>
  );
};

/** Admin list of concrete cases, filterable by trail and origin (US-024). */
const CasesPage = () => {
  const navigate = useNavigate();
  const { search } = useLocation();

  return (
    <AdminShell>
      <PageHeader
        title="Casos concretos"
        extra={
          <Button
            type="primary"
            icon={<FaPlus />}
            onClick={() => navigate(paths.adminNewCase, { state: { listSearch: search } })}
          >
            Novo caso
          </Button>
        }
      />
      <CasesContent />
    </AdminShell>
  );
};

export default CasesPage;
