import { formatTimeLimit } from '../../utils/timer';
import { List } from './styles';

const TrainingRules = ({ timeLimitMinutes }: { timeLimitMinutes: number }) => (
  <List>
    <li>Você recebe um caso concreto da matéria, priorizando os que ainda não fez.</li>
    <li>
      Tempo de prova: <strong>{formatTimeLimit(timeLimitMinutes)}</strong>. O cronômetro começa
      assim que o caso abre.
    </li>
    <li>Se o tempo acabar, você pode continuar e enviar; o tempo excedente fica registrado.</li>
    <li>Seu rascunho é salvo automaticamente.</li>
    <li>Depois de enviar, você compara sua peça com o gabarito, seção por seção.</li>
  </List>
);

export default TrainingRules;
