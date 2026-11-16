import { Layout } from 'antd';
import type { ReactNode } from 'react';
import Navbar from '@shared/components/navbar/Navbar';
import { Main } from './styles';

/** Public pages other than the landing (offer page): site header + centered content. */
const PublicLayout = ({ children }: { children: ReactNode }) => (
  <Layout>
    <Navbar />
    <Main>{children}</Main>
  </Layout>
);

export default PublicLayout;
