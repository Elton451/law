import { zodResolver } from '@hookform/resolvers/zod';
import { Alert, Button, Form } from 'antd';
import { useForm } from 'react-hook-form';
import { signUpSchema, type FormError, type SignUpValues } from '../../schemas';
import TextField from '../TextField/TextField';

type SignUpFormProps = {
  onSubmit: (values: SignUpValues) => Promise<FormError | undefined>;
};

const SignUpForm = ({ onSubmit }: SignUpFormProps) => {
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(signUpSchema),
    defaultValues: { name: '', email: '', password: '', confirmPassword: '' },
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
        <TextField control={control} name="name" label="Nome" autoComplete="name" />
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
