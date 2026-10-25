import styled from 'styled-components';
import { colors, spacing } from '@shared/theme/tokens';

export const CaseTitle = styled.span`
  color: ${colors.textPrimary};
  font-weight: 500;

  &:hover {
    color: ${colors.primary};
  }
`;

export const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${spacing.base / 2}px;
`;
