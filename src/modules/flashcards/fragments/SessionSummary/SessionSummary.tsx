import type { ReactNode } from 'react';
import { colors } from '@shared/theme/tokens';
import { Actions, Stat, StatLabel, Stats, StatValue, Title, Wrapper } from './styles';

type SessionSummaryProps = { correct: number; wrong: number; actions: ReactNode };

// XP earned joins the summary with US-011.
const SessionSummary = ({ correct, wrong, actions }: SessionSummaryProps) => (
  <Wrapper aria-label="Resumo da sessão">
    <Title>Sessão concluída!</Title>
    <Stats>
      <Stat>
        <StatLabel>Acertos</StatLabel>
        <StatValue $color={colors.success}>{correct}</StatValue>
      </Stat>
      <Stat>
        <StatLabel>Erros</StatLabel>
        <StatValue $color={colors.error}>{wrong}</StatValue>
      </Stat>
    </Stats>
    <Actions>{actions}</Actions>
  </Wrapper>
);

export default SessionSummary;
