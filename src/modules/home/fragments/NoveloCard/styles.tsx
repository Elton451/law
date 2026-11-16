import { Typography } from 'antd';
import styled from 'styled-components';
import { colors, radii, spacing } from '@shared/theme/tokens';

export const Card = styled.li`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${spacing.base}px;
  padding: ${spacing.lg}px;
  border: 1px solid ${colors.border};
  border-radius: ${radii.lg}px;
  background: ${colors.bgContainer};
  text-align: center;
`;

export const Name = styled(Typography.Title)`
  &&& {
    margin: 0;
    font-size: 18px;
  }
`;
