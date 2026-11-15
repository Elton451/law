import { Alert, Button, Progress } from 'antd';
import type { ReactNode } from 'react';
import { FaCheck, FaXmark } from 'react-icons/fa6';
import FlipCard from '@shared/components/FlipCard/FlipCard';
import { colors } from '@shared/theme/tokens';
import type { Flashcard } from '../../api/flashcards';
import { useStudySession } from '../../hooks/useStudySession';
import SessionSummary from '../SessionSummary/SessionSummary';
import { Answers, Counter, ProgressRow, Wrapper } from './styles';

type StudySessionProps = {
  cards: Flashcard[];
  /** Buttons shown under the summary once every card is answered. */
  summaryActions: ReactNode;
};

/** Front/back session with self-assessment (US-009), shared by lessons and reviews (US-010). */
const StudySession = ({ cards, summaryActions }: StudySessionProps) => {
  const session = useStudySession(cards);

  if (session.finished || !session.card) {
    return (
      <Wrapper>
        <SessionSummary correct={session.correct} wrong={session.wrong} actions={summaryActions} />
      </Wrapper>
    );
  }

  const saving = session.saveState === 'saving';

  return (
    <Wrapper>
      <ProgressRow>
        <Progress
          percent={((session.position - 1) / session.total) * 100}
          showInfo={false}
          strokeColor={colors.primary}
          railColor={colors.borderSecondary}
          aria-hidden
        />
        <Counter aria-label={`Card ${session.position} de ${session.total}`}>
          {session.position}/{session.total}
        </Counter>
      </ProgressRow>

      {/* Keyed so the next card arrives face up, without turning back first. */}
      <FlipCard
        key={session.card.id}
        card={session.card}
        flipped={session.flipped}
        onFlip={session.flip}
      />

      {session.saveState === 'error' && (
        <Alert
          type="error"
          showIcon
          title="Não foi possível salvar sua resposta. Tente novamente."
        />
      )}

      <Answers>
        <Button
          size="large"
          danger
          icon={<FaXmark />}
          disabled={!session.flipped || saving}
          onClick={() => void session.answer(false)}
        >
          Errei
        </Button>
        <Button
          size="large"
          type="primary"
          icon={<FaCheck />}
          disabled={!session.flipped || saving}
          onClick={() => void session.answer(true)}
        >
          Acertei
        </Button>
      </Answers>
    </Wrapper>
  );
};

export default StudySession;
