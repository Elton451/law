import { Typography } from 'antd';
import styled from 'styled-components';
import { colors, spacing } from '@shared/theme/tokens';

export const Title = styled(Typography.Title)`
  &&& {
    font-size: 28px;
    margin-bottom: ${spacing.base / 2}px;
  }
`;

export const Subtitle = styled(Typography.Paragraph)`
  &&& {
    color: ${colors.textSecondary};
    margin-bottom: ${spacing.lg}px;
  }
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: ${spacing.base}px;

  .ant-skeleton-node,
  .ant-skeleton-node > * {
    width: 100% !important;
    height: 190px !important;
  }
`;
