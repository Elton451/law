import { zodResolver } from '@hookform/resolvers/zod';
import { Alert, Button, Form, Input } from 'antd';
import { useMemo, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { flashcardImportSchema, type FlashcardFormValues } from '../../schemas/flashcardForm';
import { hasErrors, parseFlashcardMarkdown } from '../../utils/parseFlashcardMarkdown';
import FormField from '../FormField/FormField';
import MarkdownSyntaxHelp from '../MarkdownSyntaxHelp/MarkdownSyntaxHelp';
import ParsedCardsPreview from '../ParsedCardsPreview/ParsedCardsPreview';
import { Actions, Columns, Editor } from './styles';

const PLACEHOLDER = `Cole aqui a nota do Obsidian. Exemplo:

Prazo prescricional geral::10 anos

Quais são as excludentes de ilicitude?
?
- Estado de necessidade
- Legítima defesa`;

type MarkdownImportProps = { onImport: (cards: FlashcardFormValues[]) => Promise<void> };

/** Adds many cards at once from Obsidian Spaced Repetition Markdown (US-023). */
const MarkdownImport = ({ onImport }: MarkdownImportProps) => {
  const [submitting, setSubmitting] = useState(false);
  const [failed, setFailed] = useState(false);
  const { control, handleSubmit, reset } = useForm({
    resolver: zodResolver(flashcardImportSchema),
    defaultValues: { markdown: '' },
  });
  const markdown = useWatch({ control, name: 'markdown' });
  // Only for the preview: what gets saved is the resolver's validated output.
  const preview = useMemo(() => parseFlashcardMarkdown(markdown), [markdown]);

  const submit = handleSubmit(async ({ cards }) => {
    setSubmitting(true);
    setFailed(false);
    try {
      await onImport(cards);
      reset({ markdown: '' });
    } catch {
      setFailed(true);
    } finally {
      setSubmitting(false);
    }
  });

  const count = preview.cards.length;

  return (
    <Columns>
      <Editor>
        <MarkdownSyntaxHelp />
        <Form layout="vertical" component={false}>
          <form onSubmit={submit} noValidate>
            <FormField control={control} name="markdown" label="Markdown">
              {(field, id) => (
                <Input.TextArea
                  {...field}
                  id={id}
                  placeholder={PLACEHOLDER}
                  autoSize={{ minRows: 12, maxRows: 30 }}
                  spellCheck={false}
                />
              )}
            </FormField>
            {failed && (
              <Alert
                type="error"
                showIcon
                title="Não foi possível importar os cards. Nenhum foi adicionado; tente novamente."
              />
            )}
            <Actions>
              <Button
                type="primary"
                htmlType="submit"
                loading={submitting}
                disabled={count === 0 || hasErrors(preview)}
              >
                {count === 1 ? 'Adicionar 1 card' : `Adicionar ${count} cards`}
              </Button>
            </Actions>
          </form>
        </Form>
      </Editor>
      <ParsedCardsPreview result={preview} />
    </Columns>
  );
};

export default MarkdownImport;
