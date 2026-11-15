import styled from 'styled-components';
import { colors, radii, spacing } from '@shared/theme/tokens';

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.base}px;
`;

export const Summary = styled.p`
  margin: 0;
  color: ${colors.textSecondary};
`;

export const Issues = styled.ul`
  display: grid;
  gap: ${spacing.base / 4}px;
  margin: 0;
  padding-left: ${spacing.lg}px;
`;

export const Cards = styled.ol`
  display: grid;
  gap: ${spacing.base / 2}px;
  max-height: 480px;
  margin: 0;
  padding: 0;
  overflow-y: auto;
  list-style: none;
`;

export const CardItem = styled.li`
  display: grid;
  gap: ${spacing.base / 2}px;
  padding: ${spacing.base / 2}px ${spacing.base}px;
  background: ${colors.bgContainer};
  border: 1px solid ${colors.border};
  border-radius: ${radii.md}px;
`;

export const CardMeta = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: ${colors.textTertiary};
  font-size: 12px;
`;

export const Side = styled.div`
  color: ${colors.textPrimary};
`;

export const Back = styled.div`
  padding-top: ${spacing.base / 2}px;
  border-top: 1px dashed ${colors.border};
  color: ${colors.textSecondary};
`;
