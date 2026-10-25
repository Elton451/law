import { Link } from 'react-router';
import styled from 'styled-components';
import { colors, spacing } from '@shared/theme/tokens';

export const StyledLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: ${spacing.base / 2}px;
  color: ${colors.textSecondary};
  font-size: 13px;

  &:hover {
    color: ${colors.textPrimary};
  }
`;
