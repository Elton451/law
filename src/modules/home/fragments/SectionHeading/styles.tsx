import { Typography } from 'antd';
import styled from 'styled-components';
import { colors, spacing } from '@shared/theme/tokens';

export const Wrapper = styled.div`
  max-width: 640px;
  margin: 0 auto ${spacing.lg * 2}px;
  text-align: center;
`;

export const Eyebrow = styled(Typography.Text)`
  display: block;
  color: ${colors.primary};
  text-transform: uppercase;
  letter-spacing: 0.12em;
  font-size: 13px;
  font-weight: 600;
  margin-bottom: ${spacing.base / 2}px;
`;

export const Description = styled(Typography.Paragraph)`
  &&& {
    color: ${colors.textSecondary};
    margin-top: ${spacing.base}px;
    margin-bottom: 0;
  }
`;
