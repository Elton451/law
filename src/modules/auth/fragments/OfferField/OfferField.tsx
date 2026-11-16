import type { Control, FieldValues, Path } from 'react-hook-form';
import type { OfferDetails } from '@shared/catalog/types';
import { disciplineTitle } from '@shared/catalog/utils/catalog';
import SelectField from '@shared/components/SelectField/SelectField';

type OfferFieldProps<TValues extends FieldValues> = {
  control: Control<TValues>;
  name: Path<TValues>;
  offers: OfferDetails[];
};

const offerLabel = (offer: OfferDetails) =>
  `${disciplineTitle(offer.discipline)} · Exame ${offer.edition.number}`;

/** Exam and discipline, as one choice among the offers on sale (RN05). */
const OfferField = <TValues extends FieldValues>({
  control,
  name,
  offers,
}: OfferFieldProps<TValues>) => (
  <SelectField
    control={control}
    name={name}
    label="Exame e disciplina"
    placeholder={offers.length ? 'Escolha seu novelo' : 'Sem turma disponível'}
    disabled={!offers.length}
    showSearch
    options={offers.map((offer) => ({ value: offer.id, label: offerLabel(offer) }))}
  />
);

export default OfferField;
