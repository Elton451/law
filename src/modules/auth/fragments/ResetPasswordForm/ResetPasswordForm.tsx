import { zodResolver } from '@hookform/resolvers/zod';
import { Alert, Button, Form } from 'antd';
import { useForm } from 'react-hook-form';
import TextField from '@shared/components/TextField/TextField';
import {
  PASSWORD_MIN_LENGTH,
  resetPasswordSchema,
  type FormError,
  type ResetPasswordValues,
} from '../../schemas/auth';

type ResetPasswordFormProps = {
  onSubmit: (
    values: ResetPasswordValues,
  ) => Promise<FormError<'password' | 'confirmPassword'> | undefined>;
};

const ResetPasswordForm = ({ onSubmit }: ResetPasswordFormProps) => {
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: '', confirmPassword: '' },
  });

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
          name="password"
          label={`Nova senha (mínimo de ${PASSWORD_MIN_LENGTH} caracteres)`}
          type="password"
          autoComplete="new-password"
        />
        <TextField
          control={control}
          name="confirmPassword"
          label="Confirmar nova senha"
          type="password"
          autoComplete="new-password"
        />
        <Button type="primary" htmlType="submit" size="large" block loading={isSubmitting}>
          Salvar nova senha
        </Button>
      </form>
    </Form>
  );
};

export default ResetPasswordForm;
