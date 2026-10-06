import { Grid, type MenuProps } from 'antd';
import { useState, type ReactNode } from 'react';
import { FaGear, FaRightFromBracket, FaRoute, FaUser } from 'react-icons/fa6';
import { useLocation, useNavigate } from 'react-router';
import { signOut } from '@shared/auth/authService';
import Logo from '@shared/components/Logo/Logo';
import { paths } from '@shared/routes';
import { Content, LogoArea, ShellLayout, SideMenu, Sider } from './styles';

const LOGOUT_KEY = 'logout';

const menuItems: MenuProps['items'] = [
  { key: paths.trails, icon: <FaRoute />, label: 'Trilhas' },
  // Enabled as US-013 (perfil) and US-014 (configurações) land.
  { key: paths.profile, icon: <FaUser />, label: 'Perfil', disabled: true },
  { key: paths.settings, icon: <FaGear />, label: 'Configurações', disabled: true },
  { type: 'divider' },
  { key: LOGOUT_KEY, icon: <FaRightFromBracket />, label: 'Sair' },
];

const selectedKey = (pathname: string) =>
  pathname.startsWith(paths.trails) ? paths.trails : pathname;

/** Signed-in student layout: side menu (collapsible on small screens) + page content. */
const AppShell = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const screens = Grid.useBreakpoint();
  const isSmallScreen = !screens.lg;
  const [collapsed, setCollapsed] = useState(true);

  const handleMenuClick: MenuProps['onClick'] = ({ key }) => {
    if (isSmallScreen) setCollapsed(true);
    if (key === LOGOUT_KEY) {
      void signOut();
      return;
    }
    navigate(key);
  };

  return (
    <ShellLayout>
      <Sider
        breakpoint="lg"
        collapsedWidth={0}
        collapsed={isSmallScreen && collapsed}
        onCollapse={setCollapsed}
        $overlay={isSmallScreen}
      >
        <LogoArea>
          <Logo />
        </LogoArea>
        <SideMenu
          mode="inline"
          items={menuItems}
          selectedKeys={[selectedKey(pathname)]}
          onClick={handleMenuClick}
        />
      </Sider>
      <Content onClick={() => isSmallScreen && setCollapsed(true)}>{children}</Content>
    </ShellLayout>
  );
};

export default AppShell;
