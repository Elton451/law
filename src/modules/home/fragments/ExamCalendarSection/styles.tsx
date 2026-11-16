import styled from 'styled-components';
import { colors, spacing } from '@shared/theme/tokens';

export const Wrapper = styled.section`
  padding: ${spacing.lg * 3}px ${spacing.base}px;
  background: ${colors.surface};
`;

export const Grid = styled.ul`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: ${spacing.lg}px;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0;
  list-style: none;
`;
