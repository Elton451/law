import styled from 'styled-components';
import { spacing } from '@shared/theme/tokens';

export const Main = styled.main`
  width: 100%;
  max-width: 1120px;
  min-height: calc(100vh - 80px);
  margin: 0 auto;
  padding: ${spacing.lg}px ${spacing.base}px ${spacing.lg * 3}px;
`;
