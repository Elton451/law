import styled from 'styled-components';
import { colors, spacing } from '@shared/theme/tokens';

export const Wrapper = styled.header`
  max-width: 640px;
  margin: ${spacing.base}px auto ${spacing.lg}px;
`;

export const Eyebrow = styled.span`
  display: block;
  color: ${colors.primary};
  text-transform: uppercase;
  letter-spacing: 0.12em;
  font-size: 12px;
  font-weight: 600;
`;

export const Title = styled.h1`
  margin: 0;
  color: ${colors.textPrimary};
  font-size: 24px;
`;
