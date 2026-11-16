import { Grid, type MenuProps } from 'antd';
import { useState, type ReactNode } from 'react';
import {
  FaBook,
  FaClockRotateLeft,
  FaFilePen,
  FaHouse,
  FaLayerGroup,
  FaListCheck,
  FaNoteSticky,
  FaRightFromBracket,
  FaRoute,
  FaUser,
} from 'react-icons/fa6';
import { useLocation, useNavigate } from 'react-router';
import { signOut } from '@shared/auth/authService';
import Logo from '@shared/components/Logo/Logo';
import { paths } from '@shared/routes';
import { Content, LogoArea, ShellLayout, SideMenu, Sider, SoonTag } from './styles';

const LOGOUT_KEY = 'logout';

type MenuItems = NonNullable<MenuProps['items']>;

/** A menu entry for a screen of a later stage (docs/plano-e-decisoes.md). */
const soon = (key: string, icon: ReactNode, label: string) => ({
  key,
  icon,
  disabled: true,
  label: (
    <>
      {label} <SoonTag>Em breve</SoonTag>
    </>
  ),
});

// docs/README.md → Menu lateral. Histórico and Caderno have their own entries so
// they stay reachable after access expires.
const studentMenuItems: MenuItems = [
  { key: paths.dashboard, icon: <FaHouse />, label: 'Dashboard' },
  soon(paths.materials, <FaBook />, 'Material de apoio'),
  soon(paths.pieces, <FaFilePen />, 'Treinamento de peças'),
  soon(paths.questions, <FaListCheck />, 'Treinamento de questões'),
  soon(paths.history, <FaClockRotateLeft />, 'Histórico'),
  soon(paths.notebook, <FaNoteSticky />, 'Caderno de erros'),
  {
    type: 'group',
    label: 'Trilhas e flashcards',
    children: [
      { key: paths.trails, icon: <FaRoute />, label: 'Trilhas' },
      { key: paths.review, icon: <FaLayerGroup />, label: 'Revisão' },
    ],
  },
  { type: 'divider' },
  { key: paths.account, icon: <FaUser />, label: 'Minha conta' },
];

const logoutItems: MenuItems = [
  { type: 'divider' },
  { key: LOGOUT_KEY, icon: <FaRightFromBracket />, label: 'Sair' },
];

const itemKeys = (items: MenuItems): string[] =>
  items.flatMap((item) => {
    if (!item) return [];
    if ('children' in item && item.children) return itemKeys(item.children);
    return 'key' in item && item.key ? [String(item.key)] : [];
  });

/** The menu item a pathname belongs to: the item whose key (a path) it starts with. */
const selectedKey = (items: MenuItems, pathname: string) =>
  itemKeys(items)
    .filter((key) => pathname.startsWith(key))
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
