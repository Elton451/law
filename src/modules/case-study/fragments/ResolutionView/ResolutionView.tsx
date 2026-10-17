import { Alert } from 'antd';
import { useState } from 'react';
import { paths } from '@shared/routes';
import { discardAttempt, type Attempt } from '../../api';
import { useCountdown, useStartAttempt } from '../../hooks';
import AnswerForm from '../AnswerForm/AnswerForm';
import BackLink from '../BackLink/BackLink';
import CaseStatement from '../CaseStatement/CaseStatement';
import StartNotice from '../StartNotice/StartNotice';
import TimerBadge from '../TimerBadge/TimerBadge';
import { Columns, Pane, PaneSwitch, TopBar } from './styles';

type PaneKey = 'case' | 'answer';

const paneOptions = [
  { label: 'Caso', value: 'case' },
  { label: 'Sua peça', value: 'answer' },
];

type ResolutionViewProps = {
  attempt: Attempt;
  trailSlug: string;
  onSubmitted: () => void;
};

/** Reading the case and writing the piece against the clock (US-017, US-018). */
const ResolutionView = ({ attempt, trailSlug, onSubmitted }: ResolutionViewProps) => {
  const timer = useCountdown(attempt.startedAt, attempt.timeLimitMinutes);
  const { start, state: startState } = useStartAttempt(trailSlug);
  // On small screens only one pane shows at a time; both stay mounted so typing is never lost.
  const [activePane, setActivePane] = useState<PaneKey>('case');

  const handleNewCase = async () => {
    await discardAttempt(attempt.id);
    await start(attempt.caseStudy.trailId, {
      excludeCaseId: attempt.caseStudy.id,
      replace: true,
    });
  };

  return (
    <>
      <StartNotice timeLimitMinutes={attempt.timeLimitMinutes} />
      <TopBar>
        <BackLink to={paths.caseStudy(trailSlug)}>Estudo de caso</BackLink>
        <TimerBadge {...timer} />
      </TopBar>
      {timer.overtime && (
        <Alert
          type="error"
          showIcon
          title="O tempo acabou!"
          description="Você pode continuar escrevendo e enviar normalmente, mas tente concluir a próxima peça dentro do tempo."
        />
      )}
      {startState === 'error' && (
        <Alert
          type="error"
          showIcon
          title="Não foi possível sortear outro caso. Volte e tente de novo."
        />
      )}
      <PaneSwitch
        block
        options={paneOptions}
        value={activePane}
        onChange={(value) => setActivePane(value as PaneKey)}
      />
      <Columns>
        <Pane $active={activePane === 'case'}>
          <CaseStatement caseStudy={attempt.caseStudy} />
        </Pane>
        <Pane $active={activePane === 'answer'}>
          <AnswerForm attempt={attempt} onSubmitted={onSubmitted} onNewCase={handleNewCase} />
        </Pane>
      </Columns>
    </>
  );
};

export default ResolutionView;
