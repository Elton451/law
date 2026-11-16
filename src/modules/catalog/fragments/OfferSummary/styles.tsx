import { Alert, Card as AntCard } from 'antd';
import styled from 'styled-components';
import { colors, spacing, typography } from '@shared/theme/tokens';

export const Card = styled(AntCard)`
  @media (min-width: 992px) {
    position: sticky;
    top: ${spacing.lg * 4}px;
  }
`;

export const Price = styled.p`
  margin: 0 0 ${spacing.base}px;
  font-family: ${typography.fontFamilyHeading};
  font-size: 32px;
  font-weight: 700;
  color: ${colors.textPrimary};
`;

export const Restriction = styled(Alert)`
  margin-top: ${spacing.base}px;
`;

export const Actions = styled.div`
  margin-top: ${spacing.lg}px;
`;

export const Note = styled.p`
  margin: ${spacing.base / 2}px 0 0;
  text-align: center;
  color: ${colors.textSecondary};
`;
