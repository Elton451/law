import { Button, Modal } from 'antd';
import { useLocation, useNavigate } from 'react-router';
import { formatTimeLimit } from '../../utils/timer';

const isJustStarted = (state: unknown) =>
  !!state && typeof state === 'object' && 'justStarted' in state && state.justStarted === true;

/** "Sua peça começou!" shown once when a new attempt opens (US-018). */
const StartNotice = ({ timeLimitMinutes }: { timeLimitMinutes: number }) => {
  const location = useLocation();
  const navigate = useNavigate();

  // Clearing the history state keeps the notice from coming back on reload.
  const close = () => navigate(location.pathname, { replace: true, state: null });

  return (
    <Modal
      open={isJustStarted(location.state)}
      title="Sua peça começou!"
      onCancel={close}
      footer={
        <Button type="primary" onClick={close}>
          Começar
        </Button>
      }
    >
      Você tem {formatTimeLimit(timeLimitMinutes)}. Leia o caso, identifique a peça cabível e redija
      cada seção. O cronômetro já está correndo.
    </Modal>
  );
};

export default StartNotice;
