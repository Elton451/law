import { Descriptions, Skeleton } from 'antd';
import { useCatalog } from '@shared/catalog/hooks/useCatalog';
import { disciplineTitle, findOffer, formatDate } from '@shared/catalog/utils/catalog';

type ChosenOfferDetailsProps = { email: string | null; offerId: string | null };

/** E-mail, exam and discipline: shown, not edited here (U10). */
const ChosenOfferDetails = ({ email, offerId }: ChosenOfferDetailsProps) => {
  const catalog = useCatalog();

  if (catalog.status === 'loading') return <Skeleton active paragraph={{ rows: 2 }} />;
  const offer = catalog.status === 'success' ? findOffer(catalog.data, offerId) : undefined;
  const unavailable = catalog.status === 'error' ? 'Não foi possível carregar' : 'Indisponível';

  return (
    <Descriptions
      column={1}
      size="small"
      items={[
        { key: 'email', label: 'E-mail', children: email ?? '—' },
        {
          key: 'discipline',
          label: 'Disciplina',
          children: offer ? disciplineTitle(offer.discipline) : unavailable,
        },
        {
          key: 'exam',
          label: 'Exame',
          children: offer
            ? `${offer.edition.number}º Exame de Ordem (2ª fase em ${formatDate(offer.edition.secondPhaseDate)})`
            : unavailable,
        },
      ]}
    />
  );
};

export default ChosenOfferDetails;
