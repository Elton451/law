import { Typography } from 'antd';
import styled from 'styled-components';
import { spacing } from '@shared/theme/tokens';

export const Greeting = styled(Typography.Title)`
  &&& {
    font-size: 28px;
    margin-bottom: ${spacing.lg}px;
  }
`;
