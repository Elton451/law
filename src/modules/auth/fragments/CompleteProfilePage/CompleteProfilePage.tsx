import { Skeleton } from 'antd';
import { Navigate, useNavigate } from 'react-router';
import { useAuth } from '@shared/auth/hooks/useAuth';
import { useRefreshProfile } from '@shared/auth/hooks/useRefreshProfile';
import { homePathFor, isProfileComplete } from '@shared/auth/utils/profile';
import { useCatalog } from '@shared/catalog/hooks/useCatalog';
import { openOffers } from '@shared/catalog/utils/catalog';
import LoadError from '@shared/components/LoadError/LoadError';
import { updateProfile } from '@shared/profile/api/updateProfile';
import type { ProfileFields } from '@shared/profile/schemas/profileFields';
import { paths } from '@shared/routes';
import { useOfferParam } from '../../hooks/useOfferParam';
import AuthLayout from '../AuthLayout/AuthLayout';
import AuthNotice from '../AuthNotice/AuthNotice';
import CompleteProfileForm from '../CompleteProfileForm/CompleteProfileForm';

/**
 * After "Continuar com Google" (and for any account missing a sign-up field):
 * asks for UF, exam and discipline and confirms the full name. Never guesses
 * the UF from the network address (SB03). Rendered inside RequireAuth.
 */
const CompleteProfilePage = () => {
  const auth = useAuth();
  const refreshProfile = useRefreshProfile();
  const navigate = useNavigate();
  const catalog = useCatalog();
  const offerParam = useOfferParam();

  if (auth.status !== 'signedIn') return null;
  const { profile } = auth;
  if (isProfileComplete(profile)) return <Navigate to={homePathFor(profile)} replace />;

  const handleSubmit = async (values: ProfileFields) => {
    const error = await updateProfile(values);
    if (error) return error;
    await refreshProfile();
    navigate(paths.dashboard, { replace: true });
    return undefined;
  };

  const renderContent = () => {
    if (catalog.status === 'loading') return <Skeleton active paragraph={{ rows: 6 }} />;
    if (catalog.status === 'error') {
      return <LoadError title="Não foi possível carregar as turmas." onRetry={catalog.reload} />;
    }
    const offers = openOffers(catalog.data);
    const wanted = offerParam ?? profile?.offerId ?? undefined;
    const preselected = offers.find((offer) => offer.id === wanted);

    return (
      <>
        {wanted && !preselected && (
          <AuthNotice
            type="warning"
            title="A turma escolhida não está mais disponível. Escolha outra abaixo."
          />
        )}
        <CompleteProfileForm
          offers={offers}
          defaultValues={{
            name: profile?.name ?? '',
            uf: profile?.uf ?? '',
            offerId: preselected?.id ?? '',
          }}
          onSubmit={handleSubmit}
        />
      </>
    );
  };

  return (
    <AuthLayout
      title="Complete seu cadastro"
      subtitle="Faltam alguns dados para continuar. Confira seu nome completo como no documento oficial."
    >
      {renderContent()}
    </AuthLayout>
  );
};

export default CompleteProfilePage;
