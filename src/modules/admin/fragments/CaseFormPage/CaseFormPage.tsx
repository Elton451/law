import { Result, Skeleton } from 'antd';
import { useNavigate, useParams } from 'react-router';
import BackLink from '@shared/components/BackLink/BackLink';
import { saveCase, type CaseDetail, type Trail } from '../../api';
import { useCase, useListPath, useTrails } from '../../hooks';
import { emptyCaseForm, type CaseFormValues } from '../../schemas';
import AdminShell from '../AdminShell/AdminShell';
import CaseForm from '../CaseForm/CaseForm';
import LoadError from '../LoadError/LoadError';
import PageHeader from '../PageHeader/PageHeader';

type EditorProps = { trails: Trail[]; caseStudy: CaseDetail | null };

/** Saves the case and goes back to the list. */
const CaseEditor = ({ trails, caseStudy }: EditorProps) => {
  const navigate = useNavigate();
  const listPath = useListPath();

  const save = async (values: CaseFormValues) => {
    await saveCase(caseStudy?.id ?? null, values);
    navigate(listPath);
  };

  return (
    <CaseForm
      trails={trails}
      initialValues={caseStudy?.values ?? emptyCaseForm}
      attemptCount={caseStudy?.attemptCount ?? 0}
      cancelTo={listPath}
      onSubmit={save}
    />
  );
};

const EditCase = ({ caseId, trails }: { caseId: string; trails: Trail[] }) => {
  const caseStudy = useCase(caseId);

  if (caseStudy.status === 'loading') return <Skeleton active />;
  if (caseStudy.status === 'error') {
    return <LoadError title="Não foi possível carregar o caso" onRetry={caseStudy.reload} />;
  }
  if (!caseStudy.data) return <Result status="404" title="Caso não encontrado" />;

  return <CaseEditor trails={trails} caseStudy={caseStudy.data} />;
};

const FormContent = ({ caseId }: { caseId?: string }) => {
  const trails = useTrails();

  if (trails.status === 'loading') return <Skeleton active />;
  if (trails.status === 'error') {
    return <LoadError title="Não foi possível carregar as trilhas" onRetry={trails.reload} />;
  }

  return caseId ? (
    <EditCase caseId={caseId} trails={trails.data} />
  ) : (
    <CaseEditor trails={trails.data} caseStudy={null} />
  );
};

/** Creates a concrete case (no `:caseId`) or edits one, with its answer key (US-024). */
const CaseFormPage = () => {
  const { caseId } = useParams();

  return (
    <AdminShell>
      <BackLink to={useListPath()}>Voltar para os casos</BackLink>
      <PageHeader title={caseId ? 'Editar caso concreto' : 'Novo caso concreto'} />
      <FormContent caseId={caseId} />
    </AdminShell>
  );
};

export default CaseFormPage;
