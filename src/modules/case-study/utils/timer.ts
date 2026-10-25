const pad = (value: number) => String(value).padStart(2, '0');

/** 754 → "12:34"; 3754 → "1:02:34". */
export const formatDuration = (totalSeconds: number) => {
  const seconds = Math.max(0, Math.floor(totalSeconds));
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const rest = seconds % 60;
  return hours > 0 ? `${hours}:${pad(minutes)}:${pad(rest)}` : `${pad(minutes)}:${pad(rest)}`;
};

/** 60 → "1h"; 90 → "1h30"; 45 → "45 min". */
export const formatTimeLimit = (minutes: number) => {
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  if (hours === 0) return `${rest} min`;
  return rest === 0 ? `${hours}h` : `${hours}h${pad(rest)}`;
};

const elapsedSeconds = (startedAt: Date, until: Date) =>
  Math.floor((until.getTime() - startedAt.getTime()) / 1000);

/** Countdown while there's time left, then the overtime as "+mm:ss" (US-018). */
export const countdown = (startedAt: Date, timeLimitMinutes: number, now: Date) => {
  const remaining = timeLimitMinutes * 60 - elapsedSeconds(startedAt, now);
  return remaining >= 0
    ? { overtime: false, label: formatDuration(remaining) }
    : { overtime: true, label: `+${formatDuration(-remaining)}` };
};

/** Time spent on a submitted attempt and whether it fit in the limit (US-019). */
export const attemptDuration = (startedAt: Date, submittedAt: Date, timeLimitMinutes: number) => {
  const elapsed = elapsedSeconds(startedAt, submittedAt);
  return { label: formatDuration(elapsed), withinLimit: elapsed <= timeLimitMinutes * 60 };
};
