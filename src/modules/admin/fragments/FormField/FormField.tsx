import { Form } from 'antd';
import { useId, type ReactElement } from 'react';
import {
  useController,
  type Control,
  type ControllerRenderProps,
  type FieldPath,
  type FieldValues,
} from 'react-hook-form';

type FormFieldProps<
  Values extends FieldValues,
  Name extends FieldPath<Values>,
  // What the resolver outputs, when it transforms the values (e.g. Markdown → cards).
  Output extends FieldValues = Values,
> = {
  control: Control<Values, unknown, Output>;
  name: Name;
  label: string;
  required?: boolean;
  extra?: string;
  /** The input, wired to the field. `id` links it to the label. */
  children: (field: ControllerRenderProps<Values, Name>, id: string) => ReactElement;
};

/** A labelled form field bound to react-hook-form, showing its validation error. */
const FormField = <
  Values extends FieldValues,
  Name extends FieldPath<Values>,
  Output extends FieldValues = Values,
>({
  control,
  name,
  label,
  required,
  extra,
  children,
}: FormFieldProps<Values, Name, Output>) => {
  const id = useId();
  const { field, fieldState } = useController({ control, name });

  return (
    <Form.Item
      label={label}
      htmlFor={id}
      required={required}
      extra={extra}
      validateStatus={fieldState.error ? 'error' : undefined}
      help={fieldState.error?.message}
    >
      {children(field, id)}
    </Form.Item>
  );
};

export default FormField;
