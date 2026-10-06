import { Button, Result } from 'antd';
import { useNavigate } from 'react-router';
import AppShell from '@shared/components/AppShell/AppShell';
import { paths } from '@shared/routes';

// Placeholder until US-007 (página da matéria) is built.
const TrailPage = () => {
  const navigate = useNavigate();

  return (
    <AppShell>
      <Result
        title="Em breve"
        subTitle="A página desta matéria ainda está sendo preparada."
        extra={<Button onClick={() => navigate(paths.trails)}>Voltar para as trilhas</Button>}
      />
    </AppShell>
  );
};

export default TrailPage;
