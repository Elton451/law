import { GiYarn } from 'react-icons/gi';
import { Link } from 'react-router';
import styled from 'styled-components';
import { colors, radii, spacing } from '@shared/theme/tokens';

export const CardLink = styled(Link)<{ $color: string }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${spacing.base / 2}px;
  padding: ${spacing.lg}px ${spacing.base}px;
  background: ${colors.bgContainer};
  border: 1px solid ${colors.border};
  border-top: 3px solid ${({ $color }) => $color};
  border-radius: ${radii.lg}px;
  text-align: center;
  transition:
    background 0.2s,
    transform 0.2s;

  &:hover {
    background: ${colors.bgElevated};
    transform: translateY(-2px);
  }

  &:focus-visible {
    outline: 2px solid ${colors.primary};
    outline-offset: 2px;
  }
`;

export const YarnIcon = styled(GiYarn)<{ $color: string }>`
  font-size: 36px;
  color: ${({ $color }) => $color};
`;

export const Name = styled.span`
  margin-top: ${spacing.base / 2}px;
  color: ${colors.textPrimary};
  font-weight: 600;
  font-size: 16px;
`;

export const ProgressLabel = styled.span`
  color: ${colors.textSecondary};
  font-size: 13px;
`;
