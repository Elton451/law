import styled from 'styled-components';
import { spacing } from '@shared/theme/tokens';

export const Wrapper = styled.div`
  display: grid;
  gap: ${spacing.base / 2}px;
  margin-bottom: ${spacing.base}px;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 240px);
  }
`;
