import { Card } from 'antd';
import { useAuth } from '@shared/auth/hooks/useAuth';
import { useRefreshProfile } from '@shared/auth/hooks/useRefreshProfile';
import AppShell from '@shared/components/AppShell/AppShell';
import PageContainer from '@shared/components/PageContainer/PageContainer';
import { updateProfile } from '@shared/profile/api/updateProfile';
import type { AccountProfileValues } from '../../schemas/accountProfile';
import ChosenOfferDetails from '../ChosenOfferDetails/ChosenOfferDetails';
import ProfileForm from '../ProfileForm/ProfileForm';
import SessionsCard from '../SessionsCard/SessionsCard';
import { Stack, Title } from './styles';

/** U10 — profile and signed-in devices (SB03, SB12). Rendered inside RequireAuth. */
const AccountPage = () => {
  const auth = useAuth();
  const refreshProfile = useRefreshProfile();

  if (auth.status !== 'signedIn' || !auth.profile) return null;
  const { profile } = auth;

  const handleSubmit = async (values: AccountProfileValues) => {
    if (!profile.offerId) return 'Escolha o exame e a disciplina antes de salvar.';
    const error = await updateProfile({ ...values, offerId: profile.offerId });
    if (error) return error.message;
    await refreshProfile();
    return undefined;
  };

  return (
    <AppShell>
      <PageContainer>
        <Title level={1}>Minha conta</Title>
        <Stack>
          <Card title="Dados pessoais">
            <ChosenOfferDetails email={auth.email} offerId={profile.offerId} />
            <ProfileForm
              defaultValues={{ name: profile.name ?? '', uf: profile.uf ?? '' }}
              onSubmit={handleSubmit}
            />
          </Card>
          <SessionsCard />
        </Stack>
      </PageContainer>
    </AppShell>
  );
};

export default AccountPage;
