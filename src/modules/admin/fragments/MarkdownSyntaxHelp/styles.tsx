import styled from 'styled-components';
import { colors, radii, spacing, typography } from '@shared/theme/tokens';

export const Formats = styled.dl`
  display: grid;
  gap: ${spacing.base}px;
  margin: 0;
`;

export const FormatTitle = styled.dt`
  color: ${colors.textPrimary};
  font-weight: 600;
`;

export const FormatBody = styled.dd`
  margin: ${spacing.base / 4}px 0 0;
  color: ${colors.textSecondary};
`;

export const Example = styled.pre`
  margin: 0 0 ${spacing.base / 4}px;
  padding: ${spacing.base / 2}px;
  background: ${colors.bgElevated};
  border-radius: ${radii.sm}px;
  color: ${colors.textPrimary};
  font-family: ${typography.fontFamilyCode};
  font-size: 13px;
  white-space: pre-wrap;
`;

export const Footnote = styled.p`
  margin: ${spacing.base}px 0 0;
  color: ${colors.textTertiary};
  font-size: 13px;
`;
