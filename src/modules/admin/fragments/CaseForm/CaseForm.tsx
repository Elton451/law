import { zodResolver } from '@hookform/resolvers/zod';
import { Alert, Button, Form, Input, Radio, Select, Switch } from 'antd';
import { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { pieceSections } from '@shared/case-studies/constants/pieceSections';
import { CaseHasAttemptsError, type Trail } from '../../api/cases';
import { caseFormSchema, type CaseFormValues } from '../../schemas/caseForm';
import FormField from '../FormField/FormField';
import { Actions, Section } from './styles';

const longText = { minRows: 4, maxRows: 16 };

type CaseFormProps = {
  trails: Trail[];
  initialValues: CaseFormValues;
  /** Attempts already made at this case: its trail is then fixed (US-020). */
  attemptCount: number;
  cancelTo: string;
  onSubmit: (values: CaseFormValues) => Promise<void>;
};

const CaseForm = ({ trails, initialValues, attemptCount, cancelTo, onSubmit }: CaseFormProps) => {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { control, handleSubmit } = useForm({
    resolver: zodResolver(caseFormSchema),
    defaultValues: initialValues,
  });
  const origin = useWatch({ control, name: 'origin' });
  const hasAttempts = attemptCount > 0;

  const submit = handleSubmit(async (values) => {
    setSubmitting(true);
    setError(null);
    try {
      await onSubmit(values);
    } catch (submitError) {
      setError(
        submitError instanceof CaseHasAttemptsError
          ? 'Este caso já tem tentativas de estudantes, então a trilha não pode ser trocada.'
          : 'Não foi possível salvar o caso. Tente novamente.',
      );
      setSubmitting(false);
    }
  });

  return (
    <Form layout="vertical" component={false}>
      <form onSubmit={submit} noValidate>
        {hasAttempts && (
          <Alert
            type="info"
            showIcon
            title={`Este caso já tem ${attemptCount} tentativa(s) de estudantes.`}
            description="Quem já o resolveu verá um aviso de que o caso mudou depois do envio. A trilha não pode ser trocada."
          />
        )}

        <Section title="Caso">
          <FormField control={control} name="trailId" label="Trilha" required>
            {(field, id) => (
              <Select
                {...field}
                id={id}
                placeholder="Escolha a trilha"
                disabled={hasAttempts}
                options={trails.map(({ id: value, name }) => ({ value, label: name }))}
                value={field.value || undefined}
              />
            )}
          </FormField>
          <FormField control={control} name="title" label="Título" required>
            {(field, id) => <Input {...field} id={id} />}
          </FormField>
          <FormField control={control} name="origin" label="Origem" required>
            {(field, id) => (
              <Radio.Group
                {...field}
                id={id}
                optionType="button"
                options={[
                  { value: 'oab', label: 'OAB' },
                  { value: 'autoral', label: 'Autoral' },
                ]}
              />
            )}
          </FormField>
          {origin === 'oab' && (
            <FormField control={control} name="examEdition" label="Exame da OAB" required>
              {(field, id) => <Input {...field} id={id} placeholder="Ex.: XXXV Exame" />}
            </FormField>
          )}
          <FormField control={control} name="statement" label="Enunciado" required>
            {(field, id) => <Input.TextArea {...field} id={id} autoSize={longText} />}
          </FormField>
          <FormField
            control={control}
            name="isActive"
            label="Ativo"
            extra="Casos ativos entram no sorteio dos treinos assim que são salvos."
          >
            {({ value, onChange, ...field }, id) => (
              <Switch {...field} id={id} checked={value} onChange={onChange} />
            )}
          </FormField>
        </Section>

        <Section title="Gabarito">
          <FormField control={control} name="piece" label="Peça cabível" required>
            {(field, id) => (
              <Input {...field} id={id} placeholder="Ex.: Petição inicial, Mandado de segurança…" />
            )}
          </FormField>
          {pieceSections.map(({ key, label }) => (
            <FormField key={key} control={control} name={key} label={label} required>
              {(field, id) => <Input.TextArea {...field} id={id} autoSize={longText} />}
            </FormField>
          ))}
        </Section>

        {error && <Alert type="error" showIcon title={error} />}
        <Actions>
          <Button onClick={() => navigate(cancelTo)} disabled={submitting}>
            Cancelar
          </Button>
          <Button type="primary" htmlType="submit" loading={submitting}>
            Salvar caso
          </Button>
        </Actions>
      </form>
    </Form>
  );
};

export default CaseForm;
