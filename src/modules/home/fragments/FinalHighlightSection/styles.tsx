import { Typography } from 'antd';
import styled from 'styled-components';
import { colors, spacing } from '@shared/theme/tokens';

export const Wrapper = styled.section`
  background: ${colors.bgContainer};
  border-top: 1px solid ${colors.borderSecondary};
  border-bottom: 1px solid ${colors.borderSecondary};
  padding: ${spacing.lg * 3}px ${spacing.lg}px;
  text-align: center;
`;

export const Sparkle = styled.div`
  color: ${colors.primary};
  font-size: 18px;
  margin-bottom: ${spacing.base}px;
`;

export const Heading = styled.div`
  max-width: 640px;
  margin: 0 auto;

  h2:first-child {
    margin-bottom: 0;
  }

  h2:last-child {
    color: ${colors.primary};
  }
`;

export const Description = styled(Typography.Paragraph)`
  &&& {
    max-width: 520px;
    margin: ${spacing.lg}px auto 0;
    color: ${colors.textSecondary};
  }
`;
