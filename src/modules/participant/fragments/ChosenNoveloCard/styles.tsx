import { Typography } from 'antd';
import styled from 'styled-components';
import { colors, spacing } from '@shared/theme/tokens';

export const Body = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${spacing.lg}px;
  align-items: flex-start;
`;

export const Info = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: ${spacing.base / 2}px;
  min-width: 0;
`;

export const Heading = styled(Typography.Title)`
  &&& {
    margin: 0;
    font-size: 22px;
  }
`;

export const Text = styled.p`
  margin: 0;
  color: ${colors.textSecondary};
`;
