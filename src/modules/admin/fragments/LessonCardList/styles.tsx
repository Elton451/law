import styled from 'styled-components';
import { colors, radii, spacing } from '@shared/theme/tokens';

export const List = styled.ol`
  display: grid;
  gap: ${spacing.base / 2}px;
  margin: 0;
  padding: 0;
  list-style: none;
`;

export const Item = styled.li`
  display: grid;
  grid-template-columns: auto 1fr;
  gap: ${spacing.base}px;
  padding: ${spacing.base}px;
  background: ${colors.bgContainer};
  border: 1px solid ${colors.border};
  border-radius: ${radii.md}px;

  @media (min-width: 768px) {
    grid-template-columns: auto 1fr 1fr auto;
    align-items: start;
  }
`;

export const Number = styled.span`
  color: ${colors.textTertiary};
  font-variant-numeric: tabular-nums;
`;

export const Front = styled.div`
  color: ${colors.textPrimary};
`;

export const Back = styled.div`
  grid-column: 2;
  color: ${colors.textSecondary};

  @media (min-width: 768px) {
    grid-column: auto;
  }
`;

export const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  grid-column: 2;
  gap: ${spacing.base / 2}px;

  @media (min-width: 768px) {
    grid-column: auto;
  }
`;
