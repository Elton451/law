import { Typography } from 'antd';
import { GiYarn } from 'react-icons/gi';
import styled from 'styled-components';
import { colors, spacing } from '@shared/theme/tokens';

export const Wrapper = styled.header`
  display: flex;
  align-items: center;
  gap: ${spacing.base}px;
  margin: ${spacing.base}px 0 ${spacing.lg}px;
`;

export const YarnIcon = styled(GiYarn)<{ $color: string }>`
  flex-shrink: 0;
  font-size: 48px;
  color: ${({ $color }) => $color};
`;

export const Eyebrow = styled.span`
  display: block;
  color: ${colors.primary};
  text-transform: uppercase;
  letter-spacing: 0.12em;
  font-size: 12px;
  font-weight: 600;
`;

export const Name = styled(Typography.Title)`
  &&& {
    margin: 0;
    font-size: 28px;
  }
`;
