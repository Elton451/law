import { Flex, Typography } from 'antd';
import LogoutButton from '@shared/components/LogoutButton/LogoutButton';
import PageContainer from '@shared/components/PageContainer/PageContainer';

// Placeholder until US-021 (painel administrativo) is built.
const Admin = () => (
  <PageContainer>
    <Flex justify="space-between" align="center">
      <Typography.Title level={2}>Painel administrativo</Typography.Title>
      <LogoutButton />
    </Flex>
  </PageContainer>
);

export default Admin;
