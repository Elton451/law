import { zodResolver } from '@hookform/resolvers/zod';
import { Alert, Button, Form } from 'antd';
import { useForm } from 'react-hook-form';
import SelectField from '@shared/components/SelectField/SelectField';
import TextField from '@shared/components/TextField/TextField';
import { UFS } from '@shared/profile/constants/ufs';
import {
  accountProfileSchema,
  type AccountProfileInput,
  type AccountProfileValues,
} from '../../schemas/accountProfile';

type ProfileFormProps = {
  defaultValues: { name: string; uf: string };
  /** Resolves to an error message, or undefined when saved. */
  onSubmit: (values: AccountProfileValues) => Promise<string | undefined>;
};

const ProfileForm = ({ defaultValues, onSubmit }: ProfileFormProps) => {
  const {
    control,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting, isDirty, isSubmitSuccessful },
  } = useForm<AccountProfileInput, unknown, AccountProfileValues>({
    resolver: zodResolver(accountProfileSchema),
    defaultValues: defaultValues as AccountProfileInput,
  });

  const submit = handleSubmit(async (values) => {
    const error = await onSubmit(values);
    if (error) setError('root.server', { message: error });
    else reset(values, { keepIsSubmitSuccessful: true });
  });

  return (
    <Form layout="vertical" component={false}>
      <form onSubmit={submit} noValidate>
        {errors.root?.server && (
          <Form.Item>
            <Alert type="error" showIcon title={errors.root.server.message} />
          </Form.Item>
        )}
        {isSubmitSuccessful && !isDirty && !errors.root && (
          <Form.Item>
            <Alert type="success" showIcon title="Dados salvos." role="status" />
          </Form.Item>
        )}
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
        <Button type="primary" htmlType="submit" loading={isSubmitting} disabled={!isDirty}>
          Salvar
        </Button>
      </form>
    </Form>
  );
};

export default ProfileForm;
