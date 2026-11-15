import styled from 'styled-components';
import { colors, spacing } from '@shared/theme/tokens';

export const Location = styled.p`
  margin: -${spacing.base}px 0 ${spacing.lg}px;
  color: ${colors.textSecondary};
`;

export const Heading = styled.h2`
  margin: ${spacing.lg}px 0 ${spacing.base}px;
  color: ${colors.textPrimary};
  font-size: 20px;
`;
