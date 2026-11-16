import { Typography } from 'antd';
import styled from 'styled-components';
import { colors, spacing } from '@shared/theme/tokens';

export const Wrapper = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: ${spacing.lg * 3}px ${spacing.base}px ${spacing.lg * 2}px;
`;

export const Slogan = styled(Typography.Text)`
  display: block;
  color: ${colors.primaryText};
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

export const Lead = styled(Typography.Paragraph)`
  &&& {
    max-width: 620px;
    margin-bottom: ${spacing.lg}px;
    color: ${colors.textSecondary};
    font-size: 16px;
  }
`;
