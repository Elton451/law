import { useState } from 'react';
import { Link } from 'react-router';
import { paths } from '@shared/routes';
import { signUp } from '../../api';
import type { SignUpValues } from '../../schemas';
import AuthLayout from '../AuthLayout/AuthLayout';
import ConfirmEmailNotice from '../ConfirmEmailNotice/ConfirmEmailNotice';
import SignUpForm from '../SignUpForm/SignUpForm';

// On success with a session, RedirectIfAuthenticated (wrapping this route) takes the user in.
const SignUpPage = () => {
  const [pendingEmail, setPendingEmail] = useState<string | null>(null);

  const handleSubmit = async (values: SignUpValues) => {
    const result = await signUp(values);
    if (!result.ok) return result.error;
    if (result.needsEmailConfirmation) setPendingEmail(values.email);
    return undefined;
  };

  return (
    <AuthLayout
      title="Crie sua conta"
      subtitle="Comece a desenrolar o Direito no seu ritmo."
      footer={
        <>
          Já tem uma conta? <Link to={paths.login}>Entrar</Link>
        </>
      }
    >
      {pendingEmail ? (
        <ConfirmEmailNotice email={pendingEmail} />
      ) : (
        <SignUpForm onSubmit={handleSubmit} />
      )}
    </AuthLayout>
  );
};

export default SignUpPage;
