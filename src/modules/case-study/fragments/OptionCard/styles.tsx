import styled from 'styled-components';
import { colors, radii, spacing } from '@shared/theme/tokens';

export const Card = styled.section<{ $disabled?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: ${spacing.base}px;
  padding: ${spacing.lg}px;
  background: ${colors.bgContainer};
  border: 1px solid ${colors.border};
  border-radius: ${radii.lg}px;
  opacity: ${({ $disabled }) => ($disabled ? 0.6 : 1)};
`;

export const CardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 32px;
`;

export const Eyebrow = styled.span`
  color: ${colors.primary};
  text-transform: uppercase;
  letter-spacing: 0.12em;
  font-size: 12px;
  font-weight: 600;
`;

export const CardTitle = styled.h2`
  margin: 0;
  color: ${colors.textPrimary};
  font-size: 20px;
`;

export const CardText = styled.p`
  flex: 1;
  margin: 0;
  color: ${colors.textSecondary};
`;
