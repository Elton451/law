import { Button, Card, Skeleton, Tag } from 'antd';
import { useNavigate } from 'react-router';
import NoveloImage from '@shared/catalog/components/NoveloImage/NoveloImage';
import { useCatalog } from '@shared/catalog/hooks/useCatalog';
import { disciplineTitle, findOffer, formatDate } from '@shared/catalog/utils/catalog';
import LoadError from '@shared/components/LoadError/LoadError';
import { paths } from '@shared/routes';
import { Body, Heading, Info, Text } from './styles';

/**
 * The novelo chosen at sign-up, still without access: access starts only after
 * a confirmed payment (US05), which arrives with the purchase flow (SB04).
 */
const ChosenNoveloCard = ({ offerId }: { offerId: string | null }) => {
  const catalog = useCatalog();
  const navigate = useNavigate();

  if (catalog.status === 'loading') return <Skeleton active />;
  if (catalog.status === 'error') {
    return <LoadError title="Não foi possível carregar seu novelo." onRetry={catalog.reload} />;
  }

  const offer = findOffer(catalog.data, offerId);
  if (!offer) {
    return (
      <Card>
        <Text>Escolha um novelo para começar.</Text>
        <Button type="primary" onClick={() => navigate(paths.homeSection('novelos'))}>
          Ver novelos
        </Button>
      </Card>
    );
  }

  return (
    <Card>
      <Body>
        <NoveloImage slug={offer.discipline.slug} size={72} />
        <Info>
          <Heading level={2}>{disciplineTitle(offer.discipline)}</Heading>
          <Text>
            {offer.edition.number}º Exame de Ordem · 2ª fase em{' '}
            {formatDate(offer.edition.secondPhaseDate)}
          </Text>
          <Tag color="gold">Aguardando compra</Tag>
          <Text>Seu acesso ao material começa após a confirmação do pagamento.</Text>
          <Button
            type="primary"
            onClick={() => navigate(paths.offer(offer.discipline.slug, offer.edition.number))}
          >
            Ver resumo da compra
          </Button>
        </Info>
      </Body>
    </Card>
  );
};

export default ChosenNoveloCard;
