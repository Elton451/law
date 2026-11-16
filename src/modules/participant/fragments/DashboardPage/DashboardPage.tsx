import { useAuth } from '@shared/auth/hooks/useAuth';
import AppShell from '@shared/components/AppShell/AppShell';
import PageContainer from '@shared/components/PageContainer/PageContainer';
import ChosenNoveloCard from '../ChosenNoveloCard/ChosenNoveloCard';
import { Greeting } from './styles';

const firstName = (name: string | null) => name?.split(' ')[0] ?? '';

/**
 * U01. For now, the account's state: the chosen novelo awaiting purchase. The
 * full dashboard (Petisco Diário, dates, progress) is SB05.
 */
const DashboardPage = () => {
  const auth = useAuth();
  if (auth.status !== 'signedIn') return null;

  return (
    <AppShell>
      <PageContainer>
        <Greeting level={1}>Olá, {firstName(auth.profile?.name ?? null)}</Greeting>
        <ChosenNoveloCard offerId={auth.profile?.offerId ?? null} />
      </PageContainer>
    </AppShell>
  );
};

export default DashboardPage;
