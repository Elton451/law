import { Card, Typography } from 'antd';
import styled from 'styled-components';
import { colors, spacing } from '@shared/theme/tokens';

export const Wrapper = styled.section`
  padding: ${spacing.lg * 3}px ${spacing.lg}px;
  max-width: 1200px;
  margin: 0 auto;
`;

export const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: ${spacing.lg}px;
`;

export const FeatureCard = styled(Card)`
  height: 100%;
  text-align: center;
  transition: border-color 0.2s ease;

  &:hover {
    border-color: ${colors.primary};
  }
`;

export const FeatureIcon = styled.div`
  font-size: 32px;
  margin-bottom: ${spacing.base}px;
`;

export const FeatureName = styled(Typography.Title)`
  &&& {
    font-size: 16px;
    margin-bottom: ${spacing.base / 2}px;
  }
`;

export const FeatureDescription = styled(Typography.Paragraph)`
  &&& {
    color: ${colors.textSecondary};
    margin-bottom: 0;
  }
`;
