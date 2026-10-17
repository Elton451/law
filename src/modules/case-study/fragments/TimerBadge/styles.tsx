import styled from 'styled-components';
import { colors, radii, spacing, typography } from '@shared/theme/tokens';

export const Badge = styled.div<{ $overtime: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: ${spacing.base / 2}px;
  padding: ${spacing.base / 4}px ${spacing.base}px;
  border-radius: ${radii.pill}px;
  border: 1px solid ${({ $overtime }) => ($overtime ? colors.error : colors.border)};
  background: ${colors.bgElevated};
  color: ${({ $overtime }) => ($overtime ? colors.error : colors.textPrimary)};
  font-family: ${typography.fontFamilyCode};
  font-size: 16px;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
`;
