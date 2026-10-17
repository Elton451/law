import { Typography } from 'antd';
import styled from 'styled-components';
import { colors, spacing } from '@shared/theme/tokens';

export const Wrapper = styled.article`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: ${spacing.base / 2}px;
`;

export const Title = styled(Typography.Title)`
  &&& {
    margin: 0;
    font-size: 20px;
  }
`;

export const Statement = styled.p`
  margin: 0;
  color: ${colors.textPrimary};
  line-height: 1.7;
  font-size: 15px;
  white-space: pre-wrap;
`;
