import { Typography } from 'antd';
import styled from 'styled-components';
import { spacing } from '@shared/theme/tokens';

export const Wrapper = styled.header`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: ${spacing.base}px;
  margin: ${spacing.base}px 0 ${spacing.lg}px;
`;

export const Title = styled(Typography.Title)`
  &&& {
    margin: 0;
    font-size: 28px;
  }
`;
