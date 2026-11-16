import { Typography } from 'antd';
import styled from 'styled-components';
import { spacing } from '@shared/theme/tokens';

export const Title = styled(Typography.Title)`
  &&& {
    font-size: 28px;
    margin-bottom: ${spacing.lg}px;
  }
`;

export const Stack = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.lg}px;
`;
