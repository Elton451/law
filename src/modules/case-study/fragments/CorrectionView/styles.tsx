import { Typography } from 'antd';
import styled from 'styled-components';
import { colors, spacing } from '@shared/theme/tokens';

export const Title = styled(Typography.Title)`
  &&& {
    margin: ${spacing.base}px 0 ${spacing.base / 2}px;
    font-size: 26px;
  }
`;

export const Summary = styled.p`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: ${spacing.base / 2}px;
  margin: 0 0 ${spacing.base}px;
  color: ${colors.textSecondary};
`;

export const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${spacing.base / 2}px;
  margin-bottom: ${spacing.lg}px;
`;
