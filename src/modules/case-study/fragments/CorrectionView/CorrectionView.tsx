import { Alert, Button, Modal, Tag } from 'antd';
import { useState } from 'react';
import BackLink from '@shared/components/BackLink/BackLink';
import { paths } from '@shared/routes';
import { caseEditedSinceSubmission, type AnswerKey, type SubmittedAttempt } from '../../api';
import { useStartAttempt } from '../../hooks';
import { answerFields } from '../../sections';
import { attemptDuration, formatTimeLimit } from '../../timer';
import CaseStatement from '../CaseStatement/CaseStatement';
import ComparisonRow from '../ComparisonRow/ComparisonRow';
import { Actions, Summary, Title } from './styles';

type AnswerFieldKey = (typeof answerFields)[number]['key'];

const expectedAnswer = (answerKey: AnswerKey, key: AnswerFieldKey) =>
  key === 'identifiedPiece' ? answerKey.piece : answerKey[key];

type CorrectionViewProps = { attempt: SubmittedAttempt; trailSlug: string };

/** The student's piece next to the answer key, section by section (US-019). */
const CorrectionView = ({ attempt, trailSlug }: CorrectionViewProps) => {
  const [caseOpen, setCaseOpen] = useState(false);
  const { start, state: startState } = useStartAttempt(trailSlug);
  const { answerKey } = attempt;
  const duration = attemptDuration(
    attempt.startedAt,
    attempt.submittedAt,
    attempt.timeLimitMinutes,
  );

  return (
    <>
      <BackLink to={paths.caseStudy(trailSlug)}>Estudo de caso</BackLink>
      <Title level={1}>Respostas do caso concreto</Title>
      <Summary>
        <Tag color={duration.withinLimit ? 'success' : 'error'}>
          {duration.withinLimit ? 'Dentro do tempo' : 'Fora do tempo'}
        </Tag>
        Tempo gasto: {duration.label} de {formatTimeLimit(attempt.timeLimitMinutes)}
      </Summary>
      <Actions>
        <Button onClick={() => setCaseOpen(true)}>Rever caso concreto</Button>
        <Button
          type="primary"
          loading={startState === 'starting'}
          onClick={() =>
            void start(attempt.caseStudy.trailId, { excludeCaseId: attempt.caseStudy.id })
          }
        >
          Gerar outro teste
        </Button>
      </Actions>
      {caseEditedSinceSubmission(attempt) && (
        <Alert
          type="warning"
          showIcon
          title="Este caso foi editado depois que você enviou sua resposta."
          description="O enunciado e o gabarito abaixo são a versão atual e podem não corresponder ao caso que você resolveu."
        />
      )}
      {startState === 'error' && (
        <Alert
          type="error"
          showIcon
          title="Não foi possível sortear outro caso. Tente novamente."
        />
      )}

      {answerKey ? (
        answerFields.map(({ key, label }) => (
          <ComparisonRow
            key={key}
            label={label}
            expected={expectedAnswer(answerKey, key)}
            given={attempt.answers[key]}
          />
        ))
      ) : (
        <Alert type="warning" showIcon title="O gabarito deste caso não está disponível." />
      )}

      <Modal
        open={caseOpen}
        onCancel={() => setCaseOpen(false)}
        footer={null}
        width={720}
        title="Caso concreto"
      >
        <CaseStatement caseStudy={attempt.caseStudy} />
      </Modal>
    </>
  );
};

export default CorrectionView;
