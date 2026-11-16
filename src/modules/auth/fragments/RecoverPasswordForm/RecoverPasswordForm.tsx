import { zodResolver } from '@hookform/resolvers/zod';
import { Alert, Button, Form } from 'antd';
import { useForm } from 'react-hook-form';
import TextField from '@shared/components/TextField/TextField';
import {
  recoverPasswordSchema,
  type FormError,
  type RecoverPasswordValues,
} from '../../schemas/auth';

type RecoverPasswordFormProps = {
  onSubmit: (values: RecoverPasswordValues) => Promise<FormError<'email'> | undefined>;
};

const RecoverPasswordForm = ({ onSubmit }: RecoverPasswordFormProps) => {
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(recoverPasswordSchema), defaultValues: { email: '' } });

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
        <TextField
          control={control}
          name="email"
          label="E-mail"
          type="email"
          autoComplete="email"
        />
        <Button type="primary" htmlType="submit" size="large" block loading={isSubmitting}>
          Enviar link de recuperação
        </Button>
      </form>
    </Form>
  );
};

export default RecoverPasswordForm;
