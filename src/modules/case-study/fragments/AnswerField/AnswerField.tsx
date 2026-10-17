import { Form, Input } from 'antd';
import { useId } from 'react';
import { useController, type Control } from 'react-hook-form';
import type { AttemptAnswers } from '../../schemas';

type AnswerFieldProps = {
  control: Control<AttemptAnswers>;
  name: keyof AttemptAnswers;
  label: string;
  placeholder?: string;
  multiline?: boolean;
};

const AnswerField = ({ control, name, label, placeholder, multiline }: AnswerFieldProps) => {
  const id = useId();
  const { field, fieldState } = useController({ control, name });

  return (
    <Form.Item
      label={label}
      htmlFor={id}
      validateStatus={fieldState.error ? 'error' : undefined}
      help={fieldState.error?.message}
    >
      {multiline ? (
        <Input.TextArea {...field} id={id} placeholder={placeholder} autoSize={{ minRows: 4 }} />
      ) : (
        <Input {...field} id={id} placeholder={placeholder} />
      )}
    </Form.Item>
  );
};

export default AnswerField;
