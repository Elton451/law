import styled from 'styled-components';
import { spacing } from '@shared/theme/tokens';

export const Columns = styled.div`
  display: grid;
  gap: ${spacing.base}px;

  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
  }
`;
