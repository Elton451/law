import { zodResolver } from '@hookform/resolvers/zod';
import { Alert, Button, Form, Input } from 'antd';
import { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import {
  emptyFlashcardForm,
  flashcardFormSchema,
  type FlashcardFormValues,
} from '../../schemas/flashcardForm';
import CardPreview from '../CardPreview/CardPreview';
import FormField from '../FormField/FormField';
import { Actions, Columns } from './styles';

const sideText = { minRows: 3, maxRows: 12 };
const MARKDOWN_HINT = 'Aceita Markdown: **negrito**, listas, > citações.';

type FlashcardFormProps = {
  initialValues?: FlashcardFormValues;
  submitLabel: string;
  onSubmit: (values: FlashcardFormValues) => Promise<void>;
  /** Clears the form after saving, ready for the next card (US-023). */
  resetAfterSubmit?: boolean;
  onCancel?: () => void;
};

const FlashcardForm = ({
  initialValues = emptyFlashcardForm,
  submitLabel,
  onSubmit,
  resetAfterSubmit,
  onCancel,
}: FlashcardFormProps) => {
  const [submitting, setSubmitting] = useState(false);
  const [failed, setFailed] = useState(false);
  const { control, handleSubmit, reset, setFocus } = useForm({
    resolver: zodResolver(flashcardFormSchema),
    defaultValues: initialValues,
  });
  const [front, back] = useWatch({ control, name: ['front', 'back'] });

  const submit = handleSubmit(async (values) => {
    setSubmitting(true);
    setFailed(false);
    try {
      await onSubmit(values);
      if (resetAfterSubmit) {
        // Before reset: it unregisters the fields until they render again. The focus
        // itself runs on the next tick, once the form is cleared.
        setFocus('front');
        reset(emptyFlashcardForm);
      }
    } catch {
      setFailed(true);
    } finally {
      setSubmitting(false);
    }
  });

  return (
    <Columns>
      <Form layout="vertical" component={false}>
        <form onSubmit={submit} noValidate>
          <FormField control={control} name="front" label="Frente" required extra={MARKDOWN_HINT}>
            {(field, id) => <Input.TextArea {...field} id={id} autoSize={sideText} />}
          </FormField>
          <FormField control={control} name="back" label="Verso" required>
            {(field, id) => <Input.TextArea {...field} id={id} autoSize={sideText} />}
          </FormField>
          {failed && (
            <Alert type="error" showIcon title="Não foi possível salvar o card. Tente novamente." />
          )}
          <Actions>
            {onCancel && (
              <Button onClick={onCancel} disabled={submitting}>
                Cancelar
              </Button>
            )}
            <Button type="primary" htmlType="submit" loading={submitting}>
              {submitLabel}
            </Button>
          </Actions>
        </form>
      </Form>
      <CardPreview card={{ front, back }} />
    </Columns>
  );
};

export default FlashcardForm;
