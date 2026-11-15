import styled from 'styled-components';
import { colors, radii, spacing } from '@shared/theme/tokens';

export const Card = styled.section`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: ${spacing.base}px;
  padding: ${spacing.lg}px;
  background: ${colors.bgContainer};
  border: 1px solid ${colors.border};
  border-radius: ${radii.lg}px;
`;

export const Eyebrow = styled.span`
  display: block;
  color: ${colors.primary};
  text-transform: uppercase;
  letter-spacing: 0.12em;
  font-size: 12px;
  font-weight: 600;
`;

export const Title = styled.h2`
  margin: 0;
  color: ${colors.textPrimary};
  font-size: 20px;
`;

export const Count = styled.p`
  margin: 0;
  color: ${colors.textSecondary};
`;
