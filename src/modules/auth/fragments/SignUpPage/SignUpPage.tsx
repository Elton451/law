import { Alert, Skeleton } from 'antd';
import { useState } from 'react';
import { Link } from 'react-router';
import { useCatalog } from '@shared/catalog/hooks/useCatalog';
import { openOffers } from '@shared/catalog/utils/catalog';
import LoadError from '@shared/components/LoadError/LoadError';
import { paths } from '@shared/routes';
import { signInWithGoogle, signUp } from '../../api/auth';
import { useOfferParam } from '../../hooks/useOfferParam';
import type { SignUpValues } from '../../schemas/auth';
import AuthLayout from '../AuthLayout/AuthLayout';
import ConfirmEmailNotice from '../ConfirmEmailNotice/ConfirmEmailNotice';
import GoogleButton from '../GoogleButton/GoogleButton';
import OrDivider from '../OrDivider/OrDivider';
import SignUpForm from '../SignUpForm/SignUpForm';

// A01. On success with a session, RedirectIfAuthenticated (wrapping this route) takes the user in.
const SignUpPage = () => {
  const [pendingEmail, setPendingEmail] = useState<string | null>(null);
  const catalog = useCatalog();
  const offerParam = useOfferParam();

  const handleSubmit = async (values: SignUpValues) => {
    const result = await signUp(values);
    if (!result.ok) return result.error;
    if (result.needsEmailConfirmation) setPendingEmail(values.email);
    return undefined;
  };

  const renderContent = () => {
    if (pendingEmail) return <ConfirmEmailNotice email={pendingEmail} />;
    if (catalog.status === 'loading') return <Skeleton active paragraph={{ rows: 8 }} />;
    if (catalog.status === 'error') {
      return <LoadError title="Não foi possível carregar as turmas." onRetry={catalog.reload} />;
    }

    const offers = openOffers(catalog.data);
    const preselected = offers.find((offer) => offer.id === offerParam);

    return (
      <>
        {offerParam && !preselected && (
          <Alert
            type="warning"
            showIcon
            title="A turma escolhida não está mais disponível. Escolha outra abaixo."
          />
        )}
        <GoogleButton onClick={() => signInWithGoogle(preselected?.id)} />
        <OrDivider />
        <SignUpForm offers={offers} defaultOfferId={preselected?.id} onSubmit={handleSubmit} />
      </>
    );
  };

  return (
    <AuthLayout
      title="Crie sua conta"
      subtitle="Escolha seu novelo e prepare-se para a segunda fase."
      footer={
        <>
          Já tem uma conta? <Link to={paths.login}>Entrar</Link>
        </>
      }
    >
      {renderContent()}
    </AuthLayout>
  );
};

export default SignUpPage;
