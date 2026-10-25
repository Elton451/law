import { zodResolver } from '@hookform/resolvers/zod';
import { Alert, Button, Form } from 'antd';
import { useForm } from 'react-hook-form';
import { loginSchema, type FormError, type LoginValues } from '../../schemas/auth';
import TextField from '../TextField/TextField';

type LoginFormProps = {
  onSubmit: (values: LoginValues) => Promise<FormError | undefined>;
};

const LoginForm = ({ onSubmit }: LoginFormProps) => {
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
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
          name="email"
          label="E-mail"
          type="email"
          autoComplete="email"
        />
        <TextField
          control={control}
          name="password"
          label="Senha"
          type="password"
          autoComplete="current-password"
        />
        <Button type="primary" htmlType="submit" size="large" block loading={isSubmitting}>
          Entrar
        </Button>
      </form>
    </Form>
  );
};

export default LoginForm;
