import { Form, Input } from 'antd';
import { useId } from 'react';
import { useController, type FieldValues, type UseControllerProps } from 'react-hook-form';

type TextFieldProps<TValues extends FieldValues, TOutput> = UseControllerProps<
  TValues,
  UseControllerProps<TValues>['name'],
  TOutput
> & {
  label: string;
  type?: 'text' | 'email' | 'password';
  autoComplete?: string;
};

const TextField = <TValues extends FieldValues, TOutput>({
  label,
  type = 'text',
  autoComplete,
  ...controllerProps
}: TextFieldProps<TValues, TOutput>) => {
  const id = useId();
  const { field, fieldState } = useController(controllerProps);
  const InputComponent = type === 'password' ? Input.Password : Input;

  return (
    <Form.Item
      label={label}
      htmlFor={id}
      validateStatus={fieldState.error ? 'error' : undefined}
      help={fieldState.error?.message}
    >
      <InputComponent
        {...field}
        id={id}
        type={type === 'password' ? undefined : type}
        autoComplete={autoComplete}
        size="large"
      />
    </Form.Item>
  );
};

export default TextField;
