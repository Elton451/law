import styled from 'styled-components';
import { spacing } from '@shared/theme/tokens';

export const Columns = styled.div`
  display: grid;
  gap: ${spacing.lg}px;

  @media (min-width: 992px) {
    grid-template-columns: 1fr 1fr;
    align-items: start;
  }
`;

export const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${spacing.base / 2}px;
`;
