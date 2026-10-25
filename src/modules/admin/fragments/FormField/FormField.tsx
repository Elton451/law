import { Form } from 'antd';
import { useId, type ReactElement } from 'react';
import {
  useController,
  type Control,
  type ControllerRenderProps,
  type FieldPath,
} from 'react-hook-form';
import type { CaseFormValues } from '../../schemas/caseForm';

type FormFieldProps<Name extends FieldPath<CaseFormValues>> = {
  control: Control<CaseFormValues>;
  name: Name;
  label: string;
  required?: boolean;
  extra?: string;
  /** The input, wired to the field. `id` links it to the label. */
  children: (field: ControllerRenderProps<CaseFormValues, Name>, id: string) => ReactElement;
};

/** A labelled form field bound to react-hook-form, showing its validation error. */
const FormField = <Name extends FieldPath<CaseFormValues>>({
  control,
  name,
  label,
  required,
  extra,
  children,
}: FormFieldProps<Name>) => {
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
