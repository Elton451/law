import { Alert } from 'antd';
import { useState } from 'react';
import { paths } from '@shared/routes';
import type { Attempt } from '../../api';
import { useCountdown, useRestartAttempt } from '../../hooks';
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
  const restart = useRestartAttempt(trailSlug);
  // On small screens only one pane shows at a time; both stay mounted so typing is never lost.
  const [activePane, setActivePane] = useState<PaneKey>('case');

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
          <AnswerForm
            attempt={attempt}
            onSubmitted={onSubmitted}
            onNewCase={() => restart(attempt.id)}
          />
        </Pane>
      </Columns>
    </>
  );
};

export default ResolutionView;
