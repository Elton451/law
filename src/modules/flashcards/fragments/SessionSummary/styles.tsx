import styled from 'styled-components';
import { colors, radii, spacing } from '@shared/theme/tokens';

export const Wrapper = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${spacing.lg}px;
  padding: ${spacing.lg * 2}px ${spacing.lg}px;
  background: ${colors.bgContainer};
  border: 1px solid ${colors.border};
  border-radius: ${radii.lg}px;
  text-align: center;
`;

export const Title = styled.h2`
  margin: 0;
  color: ${colors.textPrimary};
  font-size: 24px;
`;

export const Stats = styled.dl`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${spacing.base}px;
  width: 100%;
  max-width: 320px;
  margin: 0;
`;

export const Stat = styled.div`
  display: flex;
  flex-direction: column-reverse;
  padding: ${spacing.base}px;
  background: ${colors.bgElevated};
  border-radius: ${radii.md}px;
`;

export const StatLabel = styled.dt`
  color: ${colors.textSecondary};
  font-size: 13px;
`;

export const StatValue = styled.dd<{ $color: string }>`
  margin: 0;
  color: ${({ $color }) => $color};
  font-size: 32px;
  font-weight: 700;
`;

export const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: ${spacing.base}px;
`;
