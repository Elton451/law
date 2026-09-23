import { Button } from 'antd';
import { LogoWrapper, NavActions, NavMenu, StyledHeader } from './styles';

const navItems = [
  { key: 'o-que-e', label: 'O que é' },
  { key: 'os-novelos', label: 'Os Novelos' },
  { key: 'conquistas', label: 'Conquistas' },
];

const scrollToSection = (sectionId: string) => {
  document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
};

const Navbar = () => {
  return (
    <StyledHeader>
      <LogoWrapper>
        <span>NOVELO</span>
        <span>JURÍDICO</span>
      </LogoWrapper>

      <NavMenu
        mode="horizontal"
        items={navItems}
        selectable={false}
        onClick={({ key }) => scrollToSection(key)}
      />

      <NavActions align="center" gap="small">
        <Button type="text">Entrar</Button>
        <Button type="primary">Começar</Button>
      </NavActions>
    </StyledHeader>
  );
};

export default Navbar;
