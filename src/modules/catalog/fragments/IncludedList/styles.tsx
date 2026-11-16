import styled from 'styled-components';
import { colors, spacing } from '@shared/theme/tokens';

export const List = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: ${spacing.base / 2}px;
`;

export const Item = styled.li`
  display: flex;
  align-items: baseline;
  gap: ${spacing.base / 2}px;

  svg {
    flex-shrink: 0;
    color: ${colors.success};
  }
`;
