import { Typography } from 'antd';
import styled from 'styled-components';
import { colors, spacing } from '@shared/theme/tokens';

export const Title = styled(Typography.Title)`
  &&& {
    margin-bottom: ${spacing.base / 2}px;
  }
`;

export const Subtitle = styled.p`
  margin: 0 0 ${spacing.lg}px;
  color: ${colors.textSecondary};
`;

export const Sections = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.lg}px;
  max-width: 720px;
`;
