import styled from 'styled-components';
import { spacing } from '@shared/theme/tokens';

export const Wrapper = styled.section`
  padding: ${spacing.lg * 3}px ${spacing.base}px;
  max-width: 1200px;
  margin: 0 auto;
`;

export const Grid = styled.ul`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${spacing.lg}px;
  margin: 0;
  padding: 0;
  list-style: none;
`;
