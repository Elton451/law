import { Typography } from 'antd';
import styled from 'styled-components';
import { colors, spacing } from '@shared/theme/tokens';

export const Wrapper = styled.section`
  padding: ${spacing.lg * 3}px ${spacing.lg}px;
  text-align: center;
`;

export const Icon = styled.div`
  font-size: 40px;
  margin-bottom: ${spacing.base}px;
`;

export const Description = styled(Typography.Paragraph)`
  &&& {
    max-width: 520px;
    margin: ${spacing.base}px auto ${spacing.lg}px;
    color: ${colors.textSecondary};
  }
`;

export const Actions = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: ${spacing.base}px;
`;
