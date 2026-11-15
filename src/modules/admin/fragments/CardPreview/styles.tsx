import styled from 'styled-components';
import { colors, spacing } from '@shared/theme/tokens';

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.base / 2}px;
`;

export const Caption = styled.span`
  color: ${colors.textTertiary};
  font-size: 12px;
`;
