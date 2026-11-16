import { Card, Skeleton, Typography } from 'antd';
import LoadError from '@shared/components/LoadError/LoadError';
import { useSessions } from '../../hooks/useSessions';
import SessionItem from '../SessionItem/SessionItem';
import { List } from './styles';

/** Signed-in devices, at most two at a time (US26). */
const SessionsCard = () => {
  const { sessions, endingId, end, messageHolder } = useSessions();

  return (
    <Card title="Sessões">
      {messageHolder}
      <Typography.Paragraph type="secondary">
        Você pode usar até dois dispositivos ao mesmo tempo. Um terceiro acesso encerra a sessão com
        o login mais antigo.
      </Typography.Paragraph>
      {sessions.status === 'loading' && <Skeleton active />}
      {sessions.status === 'error' && (
        <LoadError title="Não foi possível carregar as sessões." onRetry={sessions.reload} />
      )}
      {sessions.status === 'success' && (
        <List>
          {sessions.data.map((session) => (
            <SessionItem
              key={session.id}
              session={session}
              ending={endingId === session.id}
              onEnd={end}
            />
          ))}
        </List>
      )}
    </Card>
  );
};

export default SessionsCard;
