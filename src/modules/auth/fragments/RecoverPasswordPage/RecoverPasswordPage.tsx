import { Result } from 'antd';
import { useState } from 'react';
import { Link } from 'react-router';
import { paths } from '@shared/routes';
import { requestPasswordReset } from '../../api/auth';
import type { RecoverPasswordValues } from '../../schemas/auth';
import AuthLayout from '../AuthLayout/AuthLayout';
import RecoverPasswordForm from '../RecoverPasswordForm/RecoverPasswordForm';

// A03. The confirmation is the same whether or not the e-mail has an account (US06).
const RecoverPasswordPage = () => {
  const [sent, setSent] = useState(false);

  const handleSubmit = async (values: RecoverPasswordValues) => {
    const error = await requestPasswordReset(values);
    if (!error) setSent(true);
    return error;
  };

  return (
    <AuthLayout
      title="Recuperar senha"
      subtitle="Informe o e-mail da sua conta para receber um link de redefinição."
      footer={<Link to={paths.login}>Voltar para o login</Link>}
    >
      {sent ? (
        <Result
          status="success"
          title="Verifique seu e-mail"
          subTitle="Se houver uma conta com esse e-mail, enviamos um link para redefinir a senha. O link expira e só pode ser usado uma vez."
        />
      ) : (
        <RecoverPasswordForm onSubmit={handleSubmit} />
      )}
    </AuthLayout>
  );
};

export default RecoverPasswordPage;
