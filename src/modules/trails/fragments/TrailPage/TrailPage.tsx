import { Button, Result } from 'antd';
import { useNavigate, useParams } from 'react-router';
import AppShell from '@shared/components/AppShell/AppShell';
import { paths } from '@shared/routes';

// Placeholder until US-007 (página da matéria) is built.
const TrailPage = () => {
  const navigate = useNavigate();
  const { slug = '' } = useParams();

  return (
    <AppShell>
      <Result
        title="Em breve"
        subTitle="Os módulos e lições desta matéria ainda estão sendo preparados. O estudo de caso já está disponível."
        extra={[
          <Button key="case" type="primary" onClick={() => navigate(paths.caseStudy(slug))}>
            Estudo de caso
          </Button>,
          <Button key="back" onClick={() => navigate(paths.trails)}>
            Voltar para as trilhas
          </Button>,
        ]}
      />
    </AppShell>
  );
};

export default TrailPage;
