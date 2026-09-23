import { Typography } from 'antd';
import styled, { keyframes } from 'styled-components';
import { colors, spacing } from '@shared/theme/tokens';

export const Wrapper = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 80vh;
  text-align: center;
  padding: ${spacing.lg * 3}px ${spacing.lg}px;
`;

export const Slogan = styled(Typography.Text)`
  display: block;
  color: ${colors.primary};
  text-transform: uppercase;
  letter-spacing: 0.16em;
  font-size: 13px;
  font-weight: 600;
  margin-bottom: ${spacing.base}px;
`;

export const Title = styled(Typography.Title)`
  &&& {
    max-width: 760px;
    margin-bottom: ${spacing.lg}px;
  }
`;

const bounce = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(6px); }
`;

export const ScrollIndicator = styled.span`
  display: block;
  margin-top: ${spacing.lg * 2}px;
  color: ${colors.textTertiary};
  font-size: 13px;
  animation: ${bounce} 2s ease-in-out infinite;
`;
