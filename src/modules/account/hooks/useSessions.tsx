import { message } from 'antd';
import { useState } from 'react';
import { endSession, fetchSessions } from '@shared/auth/sessionService';
import { useAsync } from '@shared/hooks/useAsync';

/** The account's signed-in devices, and ending one of the others. */
export const useSessions = () => {
  const sessions = useAsync(fetchSessions);
  const [messages, messageHolder] = message.useMessage();
  const [endingId, setEndingId] = useState<string | null>(null);

  const end = async (sessionId: string) => {
    setEndingId(sessionId);
    try {
      await endSession(sessionId);
      messages.success('Sessão encerrada.');
      sessions.reload();
    } catch {
      messages.error('Não foi possível encerrar a sessão. Tente novamente.');
    } finally {
      setEndingId(null);
    }
  };

  return { sessions, endingId, end, messageHolder };
};
