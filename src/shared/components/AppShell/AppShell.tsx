import { Grid, type MenuProps } from 'antd';
import { useState, type ReactNode } from 'react';
import { FaGear, FaRightFromBracket, FaRoute, FaUser } from 'react-icons/fa6';
import { useLocation, useNavigate } from 'react-router';
import { signOut } from '@shared/auth/authService';
import Logo from '@shared/components/Logo/Logo';
import { paths } from '@shared/routes';
import { Content, LogoArea, ShellLayout, SideMenu, Sider } from './styles';

const LOGOUT_KEY = 'logout';

type MenuItems = NonNullable<MenuProps['items']>;

const studentMenuItems: MenuItems = [
  { key: paths.trails, icon: <FaRoute />, label: 'Trilhas' },
  // Enabled as US-013 (perfil) and US-014 (configurações) land.
  { key: paths.profile, icon: <FaUser />, label: 'Perfil', disabled: true },
  { key: paths.settings, icon: <FaGear />, label: 'Configurações', disabled: true },
];

const logoutItems: MenuItems = [
  { type: 'divider' },
  { key: LOGOUT_KEY, icon: <FaRightFromBracket />, label: 'Sair' },
];

/** The menu item a pathname belongs to: the item whose key (a path) it starts with. */
const selectedKey = (items: MenuItems, pathname: string) =>
  items
    .map((item) => (item && 'key' in item ? String(item.key) : ''))
    .filter((key) => key && pathname.startsWith(key))
    .sort((a, b) => b.length - a.length)[0] ?? pathname;

type AppShellProps = {
  children: ReactNode;
  /** Navigation items, keyed by path. Defaults to the student menu; "Sair" is always added. */
  menuItems?: MenuItems;
};

/** Signed-in layout: side menu (collapsible on small screens) + page content. */
const AppShell = ({ children, menuItems = studentMenuItems }: AppShellProps) => {
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
          items={[...menuItems, ...logoutItems]}
          selectedKeys={[selectedKey(menuItems, pathname)]}
          onClick={handleMenuClick}
        />
      </Sider>
      <Content onClick={() => isSmallScreen && setCollapsed(true)}>{children}</Content>
    </ShellLayout>
  );
};

export default AppShell;
