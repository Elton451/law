import { Button, Descriptions } from 'antd';
import { Link, useLocation, useNavigate } from 'react-router';
import { useAuth } from '@shared/auth/hooks/useAuth';
import type { OfferDetails } from '@shared/catalog/types';
import {
  accessEndDate,
  disciplineTitle,
  formatDate,
  formatPrice,
} from '@shared/catalog/utils/catalog';
import { OFFER_PARAM, paths } from '@shared/routes';
import { Actions, Card, Note, Price, Restriction } from './styles';

/**
 * Discipline, exam, price (from the server, in cents), dates and the rules,
 * before any charge (US03). Payment arrives with the purchase flow (SB04).
 */
const OfferSummary = ({ offer }: { offer: OfferDetails }) => {
  const auth = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const title = disciplineTitle(offer.discipline);

  return (
    <Card title="Resumo" aria-live="polite">
      <Price>{formatPrice(offer.priceCents)}</Price>
      <Descriptions
        column={1}
        size="small"
        items={[
          { key: 'discipline', label: 'Disciplina', children: title },
          { key: 'exam', label: 'Exame', children: `${offer.edition.number}º Exame de Ordem` },
          {
            key: 'phase',
            label: '2ª fase',
            children: formatDate(offer.edition.secondPhaseDate),
          },
          {
            key: 'access',
            label: 'Acesso até',
            children: `${formatDate(accessEndDate(offer.edition))} (dia seguinte à prova)`,
          },
        ]}
      />
      <Restriction
        type="info"
        showIcon
        title="Uma disciplina por exame"
        description={`Ao comprar ${title} para o Exame ${offer.edition.number}, não será possível comprar outra disciplina para o mesmo exame.`}
      />
      <Actions>
        {auth.status === 'signedIn' ? (
          <>
            <Button type="primary" size="large" block disabled>
              Continuar para o pagamento
            </Button>
            <Note>O pagamento ainda não está disponível neste protótipo.</Note>
          </>
        ) : (
          <>
            <Button
              type="primary"
              size="large"
              block
              onClick={() => navigate(`${paths.signUp}?${OFFER_PARAM}=${offer.id}`)}
            >
              Criar conta e continuar
            </Button>
            <Note>
              Já tem conta?{' '}
              <Link to={paths.login} state={{ from: location.pathname }}>
                Entrar
              </Link>
            </Note>
          </>
        )}
      </Actions>
    </Card>
  );
};

export default OfferSummary;
