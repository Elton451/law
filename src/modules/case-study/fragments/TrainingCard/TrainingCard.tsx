import { Alert, Button, Popover } from 'antd';
import { FaCircleInfo } from 'react-icons/fa6';
import type { Trail } from '../../api';
import { useStartAttempt } from '../../hooks';
import { DEFAULT_TIME_LIMIT_MINUTES } from '../../timer';
import OptionCard from '../OptionCard/OptionCard';
import TrainingRules from '../TrainingRules/TrainingRules';

const TrainingCard = ({ trail }: { trail: Trail }) => {
  const { start, state } = useStartAttempt(trail.slug);

  return (
    <OptionCard
      eyebrow="Treinamento"
      title="Identificação das peças"
      description="Receba um caso concreto, identifique a peça cabível e redija-a dentro do tempo de prova."
      aside={
        <Popover
          title="Regras do treino"
          content={<TrainingRules timeLimitMinutes={DEFAULT_TIME_LIMIT_MINUTES} />}
          trigger={['hover', 'click']}
        >
          <Button
            type="text"
            shape="circle"
            icon={<FaCircleInfo />}
            aria-label="Regras do treino"
          />
        </Popover>
      }
    >
      {state === 'noCases' && (
        <Alert type="info" showIcon title="Ainda não há casos concretos para esta matéria." />
      )}
      {state === 'error' && (
        <Alert type="error" showIcon title="Não foi possível iniciar o treino. Tente novamente." />
      )}
      <Button
        type="primary"
        size="large"
        block
        loading={state === 'starting'}
        onClick={() => void start(trail.id)}
      >
        Iniciar treino
      </Button>
    </OptionCard>
  );
};

export default TrainingCard;
