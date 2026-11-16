import { Button } from 'antd';
import { Link, useLocation, useNavigate } from 'react-router';
import { useAuth } from '@shared/auth/hooks/useAuth';
import { homePathFor } from '@shared/auth/utils/profile';
import Logo from '@shared/components/Logo/Logo';
import { paths } from '@shared/routes';
import { NavActions, NavMenu, StyledHeader } from './styles';

type Section = Parameters<typeof paths.homeSection>[0];

// SB01: Como funciona, Novelos, Calendário and Entrar.
const navItems: { key: Section; label: string }[] = [
  { key: 'como-funciona', label: 'Como funciona' },
  { key: 'novelos', label: 'Novelos' },
  { key: 'calendario', label: 'Calendário' },
];

/** Public site header, on the landing page and the offer pages. */
const Navbar = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const auth = useAuth();

  const goToSection = (section: Section) => {
    if (pathname === paths.home) {
      document.getElementById(section)?.scrollIntoView({ behavior: 'smooth' });
      window.history.replaceState(null, '', `#${section}`);
    } else {
      navigate(paths.homeSection(section));
    }
  };

  return (
    <StyledHeader>
      <Link to={paths.home} aria-label="Novelo Jurídico — página inicial">
        <Logo />
      </Link>

      <NavMenu
        mode="horizontal"
        items={navItems}
        selectable={false}
        onClick={({ key }) => goToSection(key as Section)}
      />

      <NavActions align="center" gap="small">
        {auth.status === 'signedIn' ? (
          <Button type="primary" onClick={() => navigate(homePathFor(auth.profile))}>
            Minha área
          </Button>
        ) : (
          <Button onClick={() => navigate(paths.login)}>Entrar</Button>
        )}
      </NavActions>
    </StyledHeader>
  );
};

export default Navbar;
