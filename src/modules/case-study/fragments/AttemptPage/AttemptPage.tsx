import { Button, Result } from 'antd';
import { useNavigate, useParams } from 'react-router';
import AppShell from '@shared/components/AppShell/AppShell';
import FullPageSpinner from '@shared/components/FullPageSpinner/FullPageSpinner';
import { paths } from '@shared/routes';
import { isSubmitted } from '../../api/caseStudy';
import { useAttempt } from '../../hooks/useAttempt';
import CorrectionView from '../CorrectionView/CorrectionView';
import ResolutionView from '../ResolutionView/ResolutionView';

const AttemptContent = ({ trailSlug, attemptId }: { trailSlug: string; attemptId: string }) => {
  const navigate = useNavigate();
  const attempt = useAttempt(attemptId);

  if (attempt.status === 'loading') return <FullPageSpinner />;

  if (attempt.status === 'error') {
    return (
      <Result
        status="error"
        title="Não foi possível carregar o caso"
        extra={
          <Button type="primary" onClick={attempt.reload}>
            Tentar novamente
          </Button>
        }
      />
    );
  }

  if (!attempt.data) {
    return (
      <Result
        status="404"
        title="Tentativa não encontrada"
        extra={
          <Button onClick={() => navigate(paths.caseStudy(trailSlug))}>
            Voltar ao estudo de caso
          </Button>
        }
      />
    );
  }

  // Keyed by id so moving to another attempt starts from a fresh form.
  return isSubmitted(attempt.data) ? (
    <CorrectionView key={attempt.data.id} attempt={attempt.data} trailSlug={trailSlug} />
  ) : (
    <ResolutionView
      key={attempt.data.id}
      attempt={attempt.data}
      trailSlug={trailSlug}
      onSubmitted={attempt.reload}
    />
  );
};

const AttemptPage = () => {
  const { slug = '', attemptId = '' } = useParams();

  return (
    <AppShell>
      <AttemptContent trailSlug={slug} attemptId={attemptId} />
    </AppShell>
  );
};

export default AttemptPage;
