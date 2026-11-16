import { Typography } from 'antd';
import styled from 'styled-components';
import { colors, spacing } from '@shared/theme/tokens';

export const Wrapper = styled.header`
  display: flex;
  align-items: center;
  gap: ${spacing.base}px;
  margin-bottom: ${spacing.lg}px;
`;

export const Eyebrow = styled.span`
  display: block;
  color: ${colors.primaryText};
  text-transform: uppercase;
  letter-spacing: 0.12em;
  font-size: 12px;
  font-weight: 600;
`;

export const Title = styled(Typography.Title)`
  &&& {
    margin: 0;
    font-size: 30px;
  }
`;
