import styled from 'styled-components';
import { spacing } from '@shared/theme/tokens';

export const List = styled.ul`
  max-width: 320px;
  margin: 0;
  padding-left: ${spacing.base}px;

  li + li {
    margin-top: ${spacing.base / 2}px;
  }
`;
