import { zodResolver } from '@hookform/resolvers/zod';
import { Alert, Button, Form } from 'antd';
import { useForm, useWatch } from 'react-hook-form';
import type { OfferDetails } from '@shared/catalog/types';
import SelectField from '@shared/components/SelectField/SelectField';
import TextField from '@shared/components/TextField/TextField';
import { UFS } from '@shared/profile/constants/ufs';
import {
  profileFieldsSchema,
  type ProfileFields,
  type ProfileFieldsInput,
} from '@shared/profile/schemas/profileFields';
import type { FormError } from '../../schemas/auth';
import OfferChoiceSummary from '../OfferChoiceSummary/OfferChoiceSummary';
import OfferField from '../OfferField/OfferField';

type CompleteProfileFormProps = {
  offers: OfferDetails[];
  defaultValues: { name: string; uf: string; offerId: string };
  onSubmit: (values: ProfileFields) => Promise<FormError<'name' | 'uf' | 'offerId'> | undefined>;
};

/** The fields Google doesn't provide, plus confirming the full name (SB03). */
const CompleteProfileForm = ({ offers, defaultValues, onSubmit }: CompleteProfileFormProps) => {
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFieldsInput, unknown, ProfileFields>({
    resolver: zodResolver(profileFieldsSchema),
    defaultValues: defaultValues as ProfileFieldsInput,
  });
  const offerId = useWatch({ control, name: 'offerId' });
  const chosenOffer = offers.find((offer) => offer.id === offerId);

  const submit = handleSubmit(async (values) => {
    const error = await onSubmit(values);
    if (error) setError(error.field ?? 'root.server', { message: error.message });
  });

  return (
    <Form layout="vertical" component={false}>
      <form onSubmit={submit} noValidate>
        {errors.root?.server && (
          <Form.Item>
            <Alert type="error" showIcon title={errors.root.server.message} />
          </Form.Item>
        )}
        <OfferField control={control} name="offerId" offers={offers} />
        {chosenOffer && <OfferChoiceSummary offer={chosenOffer} />}
        <TextField
          control={control}
          name="name"
          label="Nome completo (como no documento oficial)"
          autoComplete="name"
        />
        <SelectField
          control={control}
          name="uf"
          label="UF"
          placeholder="Selecione"
          showSearch
          options={UFS}
        />
        <Button type="primary" htmlType="submit" size="large" block loading={isSubmitting}>
          Concluir cadastro
        </Button>
      </form>
    </Form>
  );
};

export default CompleteProfileForm;
