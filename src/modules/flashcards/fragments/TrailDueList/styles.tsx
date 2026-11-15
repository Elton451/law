import { Link } from 'react-router';
import styled, { css } from 'styled-components';
import { colors, radii, spacing } from '@shared/theme/tokens';

export const List = styled.ul`
  display: grid;
  gap: ${spacing.base / 2}px;
  margin: 0;
  padding: 0;
  list-style: none;
`;

const row = css`
  display: flex;
  align-items: center;
  gap: ${spacing.base}px;
  padding: ${spacing.base}px;
  background: ${colors.bgContainer};
  border: 1px solid ${colors.border};
  border-radius: ${radii.md}px;
`;

export const RowLink = styled(Link)`
  ${row}
  transition: background 0.2s;

  &:hover {
    background: ${colors.bgElevated};
  }

  &:focus-visible {
    outline: 2px solid ${colors.primary};
    outline-offset: 2px;
  }
`;

export const Row = styled.div`
  ${row}
`;

export const Dot = styled.span<{ $color: string }>`
  flex-shrink: 0;
  width: 12px;
  height: 12px;
  background: ${({ $color }) => $color};
  border-radius: ${radii.pill}px;
`;

export const Name = styled.span`
  flex: 1;
  color: ${colors.textPrimary};
  font-weight: 600;
`;

export const Count = styled.span<{ $muted: boolean }>`
  color: ${({ $muted }) => ($muted ? colors.textTertiary : colors.primary)};
  font-variant-numeric: tabular-nums;
`;
