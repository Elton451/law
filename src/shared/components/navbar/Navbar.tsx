import { Button } from 'antd';
import { useNavigate } from 'react-router';
import Logo from '@shared/components/Logo/Logo';
import { paths } from '@shared/routes';
import { NavActions, NavMenu, StyledHeader } from './styles';

const navItems = [
  { key: 'o-que-e', label: 'O que é' },
  { key: 'os-novelos', label: 'Os Novelos' },
  { key: 'conquistas', label: 'Conquistas' },
];

const scrollToSection = (sectionId: string) => {
  document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
};

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <StyledHeader>
      <Logo />

      <NavMenu
        mode="horizontal"
        items={navItems}
        selectable={false}
        onClick={({ key }) => scrollToSection(key)}
      />

      <NavActions align="center" gap="small">
        <Button type="text" onClick={() => navigate(paths.login)}>
          Entrar
        </Button>
        <Button type="primary" onClick={() => navigate(paths.signUp)}>
          Começar
        </Button>
      </NavActions>
    </StyledHeader>
  );
};

export default Navbar;
