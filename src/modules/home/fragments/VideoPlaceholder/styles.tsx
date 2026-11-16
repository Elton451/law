import styled from 'styled-components';
import { colors, radii, spacing } from '@shared/theme/tokens';

export const Frame = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${spacing.base / 2}px;
  width: 100%;
  max-width: 720px;
  aspect-ratio: 16 / 9;
  margin-top: ${spacing.lg * 2}px;
  border: 1px dashed ${colors.border};
  border-radius: ${radii.lg}px;
  background: ${colors.surface};
  color: ${colors.textSecondary};

  svg {
    font-size: 32px;
  }
`;

export const Caption = styled.span`
  font-weight: 600;
`;
