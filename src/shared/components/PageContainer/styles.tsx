import styled from 'styled-components';
import { colors, spacing } from '@shared/theme/tokens';

export const Wrapper = styled.main`
  min-height: 100vh;
  padding: ${spacing.lg}px ${spacing.base}px;
  background: ${colors.bgLayout};
`;
