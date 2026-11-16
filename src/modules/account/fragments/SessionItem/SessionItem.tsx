import { Button, Popconfirm, Tag } from 'antd';
import type { DeviceSession } from '@shared/auth/types';
import { describeDevice, formatDateTime } from '../../utils/device';
import { Details, Item, Name } from './styles';

type SessionItemProps = {
  session: DeviceSession;
  ending: boolean;
  onEnd: (sessionId: string) => void;
};

const SessionItem = ({ session, ending, onEnd }: SessionItemProps) => (
  <Item>
    <div>
      <Name>
        {describeDevice(session.userAgent)}{' '}
        {session.isCurrent && <Tag color="purple">Este dispositivo</Tag>}
      </Name>
      <Details>
        Login em {formatDateTime(session.createdAt)} · Última atividade em{' '}
        {formatDateTime(session.lastActiveAt)}
      </Details>
    </div>
    {!session.isCurrent && (
      <Popconfirm
        title="Encerrar esta sessão?"
        description="O dispositivo precisará entrar novamente."
        okText="Encerrar"
        cancelText="Cancelar"
        onConfirm={() => onEnd(session.id)}
      >
        <Button loading={ending}>Encerrar</Button>
      </Popconfirm>
    )}
  </Item>
);

export default SessionItem;
