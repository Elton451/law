import { Radio } from 'antd';
import type { OfferDetails } from '@shared/catalog/types';
import DemoTag from '@shared/catalog/components/DemoTag/DemoTag';
import { formatDate } from '@shared/catalog/utils/catalog';
import { Label, Option, Options } from './styles';

type EditionPickerProps = {
  offers: OfferDetails[];
  selectedId: string;
  onSelect: (offer: OfferDetails) => void;
};

/** Which exam edition to prepare for, among those on sale for this discipline. */
const EditionPicker = ({ offers, selectedId, onSelect }: EditionPickerProps) => (
  <fieldset>
    <Label as="legend">Escolha a edição do exame</Label>
    <Radio.Group
      value={selectedId}
      onChange={(event) => {
        const offer = offers.find((item) => item.id === event.target.value);
        if (offer) onSelect(offer);
      }}
    >
      <Options>
        {offers.map((offer) => (
          <Option key={offer.id} value={offer.id}>
            <strong>Exame {offer.edition.number}</strong> · 2ª fase em{' '}
            {formatDate(offer.edition.secondPhaseDate)} {offer.edition.isDemo && <DemoTag />}
          </Option>
        ))}
      </Options>
    </Radio.Group>
  </fieldset>
);

export default EditionPicker;
