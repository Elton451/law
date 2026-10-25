import type { AutosaveStatus } from '../../utils/autosave';
import { Status } from './styles';

const messages: Record<AutosaveStatus, string> = {
  idle: '',
  saving: 'Salvando rascunho…',
  saved: 'Rascunho salvo',
  error: 'Não foi possível salvar o rascunho',
};

const AutosaveIndicator = ({ status }: { status: AutosaveStatus }) => (
  <Status aria-live="polite" $error={status === 'error'}>
    {messages[status]}
  </Status>
);

export default AutosaveIndicator;
