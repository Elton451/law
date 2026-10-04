import { Flex, Typography } from 'antd';
import { useAuth } from '@shared/auth/useAuth';
import LogoutButton from '@shared/components/LogoutButton/LogoutButton';
import PageContainer from '@shared/components/PageContainer/PageContainer';

// Placeholder until US-006 (listagem de trilhas) is built.
const Trails = () => {
  const auth = useAuth();
  const name = auth.status === 'signedIn' ? auth.profile?.name : undefined;

  return (
    <PageContainer>
      <Flex justify="space-between" align="center">
        <Typography.Title level={2}>{name ? `Olá, ${name}` : 'Trilhas'}</Typography.Title>
        <LogoutButton />
      </Flex>
    </PageContainer>
  );
};

export default Trails;
