import { useState } from 'react';
import { Link } from 'react-router';
import { takeRevokedSessionNotice } from '@shared/auth/utils/revokedNotice';
import { paths } from '@shared/routes';
import { signIn, signInWithGoogle } from '../../api/auth';
import AuthLayout from '../AuthLayout/AuthLayout';
import AuthNotice from '../AuthNotice/AuthNotice';
import GoogleButton from '../GoogleButton/GoogleButton';
import LoginForm from '../LoginForm/LoginForm';
import OrDivider from '../OrDivider/OrDivider';
import { ForgotPassword } from './styles';

// A02. On success, RedirectIfAuthenticated (wrapping this route) takes the user in.
const LoginPage = () => {
  // Read once: the flag is cleared as it's read.
  const [revoked] = useState(takeRevokedSessionNotice);

  return (
    <AuthLayout
      title="Entrar"
      subtitle="Bem-vindo de volta."
      footer={
        <>
          Ainda não tem conta? <Link to={paths.signUp}>Cadastre-se</Link>
        </>
      }
    >
      {revoked && (
        <AuthNotice
          type="warning"
          title="Sua sessão foi encerrada porque houve acesso em outro dispositivo."
        />
      )}
      <GoogleButton onClick={() => signInWithGoogle()} />
      <OrDivider />
      <LoginForm onSubmit={signIn} />
      <ForgotPassword>
        <Link to={paths.recoverPassword}>Esqueci minha senha</Link>
      </ForgotPassword>
    </AuthLayout>
  );
};

export default LoginPage;
