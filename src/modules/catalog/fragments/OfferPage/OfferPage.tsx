import { Breadcrumb, Result, Skeleton } from 'antd';
import { Link, Navigate, useNavigate, useParams } from 'react-router';
import { useCatalog } from '@shared/catalog/hooks/useCatalog';
import type { Catalog } from '@shared/catalog/types';
import { disciplineTitle, openOffers } from '@shared/catalog/utils/catalog';
import LoadError from '@shared/components/LoadError/LoadError';
import PublicLayout from '@shared/components/PublicLayout/PublicLayout';
import { paths } from '@shared/routes';
import { selectOffer } from '../../utils/selectOffer';
import EditionPicker from '../EditionPicker/EditionPicker';
import IncludedList from '../IncludedList/IncludedList';
import NoOpenOffer from '../NoOpenOffer/NoOpenOffer';
import OfferHeader from '../OfferHeader/OfferHeader';
import OfferSummary from '../OfferSummary/OfferSummary';
import { Aside, Columns, Main, Section, SectionTitle } from './styles';

type OfferContentProps = { catalog: Catalog; disciplineSlug: string; exam?: string };

const OfferContent = ({ catalog, disciplineSlug, exam }: OfferContentProps) => {
  const navigate = useNavigate();
  const discipline = catalog.disciplines.find((item) => item.slug === disciplineSlug);

  if (!discipline) {
    return (
      <Result
        status="404"
        title="Novelo não encontrado"
        extra={<Link to={paths.homeSection('novelos')}>Ver os novelos</Link>}
      />
    );
  }

  const offers = openOffers(catalog, discipline.slug);
  const selected = selectOffer(offers, exam);

  // The URL always holds a valid choice, so refreshing keeps it (US03).
  if (offers.length && !selected) {
    return <Navigate to={paths.offer(discipline.slug, offers[0].edition.number)} replace />;
  }

  return (
    <>
      <Breadcrumb
        items={[
          { title: <Link to={paths.homeSection('novelos')}>Novelos</Link> },
          { title: disciplineTitle(discipline) },
        ]}
      />
      <OfferHeader discipline={discipline} />
      {selected ? (
        <Columns>
          <Main>
            <Section>
              <EditionPicker
                offers={offers}
                selectedId={selected.id}
                onSelect={(offer) =>
                  navigate(paths.offer(discipline.slug, offer.edition.number), { replace: true })
                }
              />
            </Section>
            <Section>
              <SectionTitle level={2}>O que está incluído</SectionTitle>
              <IncludedList />
            </Section>
          </Main>
          <Aside>
            <OfferSummary offer={selected} />
          </Aside>
        </Columns>
      ) : (
        <NoOpenOffer />
      )}
    </>
  );
};

/** P02 — the offer of a discipline for an exam edition (SB02). */
const OfferPage = () => {
  const { disciplina = '', exame } = useParams();
  const catalog = useCatalog();

  return (
    <PublicLayout>
      {catalog.status === 'loading' && <Skeleton active paragraph={{ rows: 10 }} />}
      {catalog.status === 'error' && (
        <LoadError title="Não foi possível carregar a oferta." onRetry={catalog.reload} />
      )}
      {catalog.status === 'success' && (
        <OfferContent catalog={catalog.data} disciplineSlug={disciplina} exam={exame} />
      )}
    </PublicLayout>
  );
};

export default OfferPage;
