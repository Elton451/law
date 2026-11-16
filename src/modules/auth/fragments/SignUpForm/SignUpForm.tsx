import { zodResolver } from '@hookform/resolvers/zod';
import { Alert, Button, Form } from 'antd';
import { useForm, useWatch } from 'react-hook-form';
import type { OfferDetails } from '@shared/catalog/types';
import SelectField from '@shared/components/SelectField/SelectField';
import TextField from '@shared/components/TextField/TextField';
import { UFS } from '@shared/profile/constants/ufs';
import {
  PASSWORD_MIN_LENGTH,
  signUpSchema,
  type FormError,
  type SignUpInput,
  type SignUpValues,
} from '../../schemas/auth';
import OfferChoiceSummary from '../OfferChoiceSummary/OfferChoiceSummary';
import OfferField from '../OfferField/OfferField';

type SignUpFormProps = {
  /** Offers on sale to choose from. */
  offers: OfferDetails[];
  /** The offer picked on the offer page (P02), when still on sale. */
  defaultOfferId?: string;
  onSubmit: (
    values: SignUpValues,
  ) => Promise<FormError<'email' | 'password' | 'name' | 'uf' | 'offerId'> | undefined>;
};

const SignUpForm = ({ offers, defaultOfferId, onSubmit }: SignUpFormProps) => {
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<SignUpInput, unknown, SignUpValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: '',
      email: '',
      uf: '' as SignUpInput['uf'],
      offerId: defaultOfferId ?? '',
      password: '',
      confirmPassword: '',
    },
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
        <TextField
          control={control}
          name="email"
          label="E-mail"
          type="email"
          autoComplete="email"
        />
        <SelectField
          control={control}
          name="uf"
          label="UF"
          placeholder="Selecione"
          showSearch
          options={UFS}
        />
        <TextField
          control={control}
          name="password"
          label={`Senha (mínimo de ${PASSWORD_MIN_LENGTH} caracteres)`}
          type="password"
          autoComplete="new-password"
        />
        <TextField
          control={control}
          name="confirmPassword"
          label="Confirmar senha"
          type="password"
          autoComplete="new-password"
        />
        <Button type="primary" htmlType="submit" size="large" block loading={isSubmitting}>
          Criar conta
        </Button>
      </form>
    </Form>
  );
};

export default SignUpForm;
