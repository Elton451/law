import { countdown } from '../utils/timer';
import { useNow } from './useNow';

export const useCountdown = (startedAt: Date, timeLimitMinutes: number) =>
  countdown(startedAt, timeLimitMinutes, useNow());
