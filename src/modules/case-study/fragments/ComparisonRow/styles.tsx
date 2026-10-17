import styled from 'styled-components';
import { colors, radii, spacing } from '@shared/theme/tokens';

export const Row = styled.section`
  & + & {
    margin-top: ${spacing.lg}px;
  }
`;

export const Heading = styled.h3`
  margin: 0 0 ${spacing.base / 2}px;
  color: ${colors.textPrimary};
  font-size: 16px;
`;

export const Cells = styled.div`
  display: grid;
  gap: ${spacing.base / 2}px;

  @media (min-width: 992px) {
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    gap: ${spacing.base}px;
  }
`;

export const Cell = styled.div<{ $student?: boolean }>`
  padding: ${spacing.base}px;
  background: ${colors.bgContainer};
  border: 1px solid ${colors.border};
  border-left: 3px solid ${({ $student }) => ($student ? colors.accent : colors.primary)};
  border-radius: ${radii.md}px;
`;

export const CellLabel = styled.span`
  display: block;
  margin-bottom: ${spacing.base / 4}px;
  color: ${colors.textTertiary};
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-size: 11px;
  font-weight: 600;
`;

export const Text = styled.p<{ $muted?: boolean }>`
  margin: 0;
  color: ${({ $muted }) => ($muted ? colors.textTertiary : colors.textPrimary)};
  font-style: ${({ $muted }) => ($muted ? 'italic' : 'normal')};
  line-height: 1.6;
  white-space: pre-wrap;
`;
