import type { ReactNode } from 'react';
import { Link } from 'react-router';
import Logo from '@shared/components/Logo/Logo';
import { paths } from '@shared/routes';
import { Card, Footer, LogoLink, Page, Subtitle, Title } from './styles';

type AuthLayoutProps = {
  title: string;
  subtitle?: string;
  footer?: ReactNode;
  children: ReactNode;
};

const AuthLayout = ({ title, subtitle, footer, children }: AuthLayoutProps) => (
  <Page>
    <Card>
      <LogoLink as={Link} to={paths.home} aria-label="Página inicial">
        <Logo />
      </LogoLink>
      <Title level={1}>{title}</Title>
      {subtitle && <Subtitle>{subtitle}</Subtitle>}
      {children}
      {footer && <Footer>{footer}</Footer>}
    </Card>
  </Page>
);

export default AuthLayout;
