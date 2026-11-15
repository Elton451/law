import styled from 'styled-components';
import { colors, spacing } from '@shared/theme/tokens';

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.lg}px;
  max-width: 640px;
  margin: 0 auto;
`;

export const ProgressRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing.base}px;
`;

export const Counter = styled.span`
  flex-shrink: 0;
  color: ${colors.textSecondary};
  font-variant-numeric: tabular-nums;
`;

export const Answers = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${spacing.base}px;
`;
