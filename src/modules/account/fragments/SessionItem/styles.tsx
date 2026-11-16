import styled from 'styled-components';
import { colors, spacing } from '@shared/theme/tokens';

export const Item = styled.li`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: ${spacing.base}px;
  padding: ${spacing.base}px 0;

  & + & {
    border-top: 1px solid ${colors.borderSecondary};
  }
`;

export const Name = styled.p`
  margin: 0;
  font-weight: 600;
`;

export const Details = styled.p`
  margin: ${spacing.base / 4}px 0 0;
  color: ${colors.textSecondary};
  font-size: 13px;
`;
