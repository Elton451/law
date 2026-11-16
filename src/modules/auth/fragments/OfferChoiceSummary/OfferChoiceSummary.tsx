import { Alert } from 'antd';
import type { OfferDetails } from '@shared/catalog/types';
import { disciplineTitle } from '@shared/catalog/utils/catalog';
import { Wrapper } from './styles';

/** "Você está escolhendo Direito Civil para o Exame 41" (SB02 → Microtextos). */
const OfferChoiceSummary = ({ offer }: { offer: OfferDetails }) => (
  <Wrapper>
    <Alert
      type="info"
      showIcon
      title={`Você está escolhendo ${disciplineTitle(offer.discipline)} para o Exame ${offer.edition.number}.`}
      description="Criar a conta não libera o material: o acesso começa após a confirmação do pagamento."
    />
  </Wrapper>
);

export default OfferChoiceSummary;
