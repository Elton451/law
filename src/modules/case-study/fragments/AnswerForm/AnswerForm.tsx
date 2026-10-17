import { zodResolver } from '@hookform/resolvers/zod';
import { Alert, Button, Form, Modal } from 'antd';
import { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { submitAttempt, type Attempt } from '../../api';
import { useDraftAutosave } from '../../hooks';
import { attemptAnswersSchema, blankFieldLabels, emptyAnswers } from '../../schemas';
import { pieceSections } from '../../sections';
import AnswerField from '../AnswerField/AnswerField';
import AutosaveIndicator from '../AutosaveIndicator/AutosaveIndicator';
import { Actions, Footer } from './styles';

type AnswerFormProps = {
  attempt: Attempt;
  onSubmitted: () => void;
  /** Discards this attempt and opens another case ("Gerar outro teste"). */
  onNewCase: () => Promise<void>;
};

const AnswerForm = ({ attempt, onSubmitted, onNewCase }: AnswerFormProps) => {
  const [modal, modalHolder] = Modal.useModal();
  const [busy, setBusy] = useState<'submitting' | 'newCase' | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { control, handleSubmit } = useForm({
    resolver: zodResolver(attemptAnswersSchema),
    defaultValues: attempt.answers,
  });
  const values = useWatch({ control });
  const autosave = useDraftAutosave(attempt.id, { ...emptyAnswers, ...values });

  const submit = handleSubmit(async (answers) => {
    const blank = blankFieldLabels(answers);
    const confirmed = await modal.confirm({
      title: 'Enviar resposta?',
      content: blank.length
        ? `Estes campos estão em branco: ${blank.join(', ')}. Deseja enviar mesmo assim?`
        : 'Depois de enviar, você verá o gabarito e não poderá mais editar esta resposta.',
      okText: 'Enviar',
      cancelText: 'Continuar escrevendo',
    });
    if (!confirmed) return;

    setBusy('submitting');
    setError(null);
    try {
      await submitAttempt(attempt.id, answers);
      onSubmitted();
    } catch {
      setError('Não foi possível enviar sua resposta. Tente novamente.');
      setBusy(null);
    }
  });

  const requestNewCase = async () => {
    const confirmed = await modal.confirm({
      title: 'Gerar outro teste?',
      content: 'Sua resposta atual será descartada e um novo caso será sorteado.',
      okText: 'Descartar e gerar outro',
      okButtonProps: { danger: true },
      cancelText: 'Cancelar',
    });
    if (!confirmed) return;

    setBusy('newCase');
    setError(null);
    try {
      await onNewCase();
    } catch {
      setError('Não foi possível gerar outro teste. Tente novamente.');
      setBusy(null);
    }
  };

  return (
    <Form layout="vertical" component={false}>
      {modalHolder}
      <form onSubmit={submit} noValidate>
        <AnswerField
          control={control}
          name="identifiedPiece"
          label="Peça cabível"
          placeholder="Ex.: Petição inicial, Mandado de segurança…"
        />
        {pieceSections.map(({ key, label }) => (
          <AnswerField key={key} control={control} name={key} label={label} multiline />
        ))}
        {error && <Alert type="error" showIcon title={error} />}
        <Footer>
          <AutosaveIndicator status={autosave} />
          <Actions>
            <Button
              onClick={() => void requestNewCase()}
              loading={busy === 'newCase'}
              disabled={busy === 'submitting'}
            >
              Gerar outro teste
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={busy === 'submitting'}
              disabled={busy === 'newCase'}
            >
              Enviar
            </Button>
          </Actions>
        </Footer>
      </form>
    </Form>
  );
};

export default AnswerForm;
