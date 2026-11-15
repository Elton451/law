import styled from 'styled-components';
import { spacing, typography } from '@shared/theme/tokens';

export const Columns = styled.div`
  display: grid;
  gap: ${spacing.lg}px;

  @media (min-width: 992px) {
    grid-template-columns: 1fr 1fr;
    align-items: start;
  }
`;

export const Editor = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.base}px;

  textarea {
    font-family: ${typography.fontFamilyCode};
    font-size: 13px;
  }
`;

export const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
`;
