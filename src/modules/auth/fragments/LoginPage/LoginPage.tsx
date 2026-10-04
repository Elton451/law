import { Link } from 'react-router';
import { paths } from '@shared/routes';
import { signIn } from '../../api';
import AuthLayout from '../AuthLayout/AuthLayout';
import LoginForm from '../LoginForm/LoginForm';

// On success, RedirectIfAuthenticated (wrapping this route) takes the user in.
const LoginPage = () => (
  <AuthLayout
    title="Entrar"
    subtitle="Bem-vindo de volta."
    footer={
      <>
        Ainda não tem conta? <Link to={paths.signUp}>Cadastre-se</Link>
      </>
    }
  >
    <LoginForm onSubmit={signIn} />
  </AuthLayout>
);

export default LoginPage;
