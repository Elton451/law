import { Button, Result } from 'antd';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '@shared/auth/hooks/useAuth';
import { homePathFor } from '@shared/auth/utils/profile';
import FullPageSpinner from '@shared/components/FullPageSpinner/FullPageSpinner';
import { paths } from '@shared/routes';
import { updatePassword } from '../../api/auth';
import type { ResetPasswordValues } from '../../schemas/auth';
import AuthLayout from '../AuthLayout/AuthLayout';
import ResetPasswordForm from '../ResetPasswordForm/ResetPasswordForm';

/**
 * Where the recovery link lands: Supabase signs the person in with a
 * single-use, expiring link. Without that session, the link was invalid.
 */
const ResetPasswordPage = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const [done, setDone] = useState(false);

  const handleSubmit = async (values: ResetPasswordValues) => {
    const error = await updatePassword(values);
    if (!error) setDone(true);
    return error;
  };

  if (auth.status === 'loading') return <FullPageSpinner />;

  const renderContent = () => {
    if (done && auth.status === 'signedIn') {
      return (
        <Result
          status="success"
          title="Senha alterada"
          subTitle="Por segurança, encerramos as sessões nos seus outros dispositivos."
          extra={
            <Button type="primary" onClick={() => navigate(homePathFor(auth.profile))}>
              Continuar
            </Button>
          }
        />
      );
    }
    if (auth.status === 'signedOut') {
      return (
        <Result
          status="warning"
          title="Link inválido ou expirado"
          subTitle="Peça um novo link para redefinir sua senha."
          extra={
            <Button type="primary" onClick={() => navigate(paths.recoverPassword)}>
              Pedir novo link
            </Button>
          }
        />
      );
    }
    return <ResetPasswordForm onSubmit={handleSubmit} />;
  };

  return (
    <AuthLayout title="Redefinir senha" subtitle="Escolha uma nova senha para sua conta.">
      {renderContent()}
    </AuthLayout>
  );
};

export default ResetPasswordPage;
