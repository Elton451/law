import { Card, Typography } from 'antd';
import styled, { css } from 'styled-components';
import { colors, spacing } from '@shared/theme/tokens';

export const Wrapper = styled.section`
  padding: ${spacing.lg * 3}px ${spacing.lg}px;
  max-width: 1200px;
  margin: 0 auto;
`;

export const AchievementGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: ${spacing.lg}px;
`;

export const AchievementCard = styled(Card)<{ $bloqueado: boolean }>`
  text-align: center;

  ${({ $bloqueado }) =>
    $bloqueado &&
    css`
      opacity: 0.5;

      .ant-card-body {
        filter: grayscale(1);
      }
    `}
`;

export const AchievementIcon = styled.div`
  font-size: 32px;
  margin-bottom: ${spacing.base}px;
`;

export const AchievementName = styled(Typography.Title)`
  &&& {
    font-size: 16px;
    margin-bottom: ${spacing.base / 2}px;
  }
`;

export const AchievementCriteria = styled(Typography.Paragraph)`
  &&& {
    color: ${colors.textSecondary};
    margin-bottom: 0;
  }
`;

export const LockedTag = styled.div`
  margin-top: ${spacing.base}px;
  font-size: 12px;
  color: ${colors.textTertiary};
`;
