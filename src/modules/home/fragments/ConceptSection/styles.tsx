import { Card } from 'antd';
import styled from 'styled-components';
import { colors, spacing } from '@shared/theme/tokens';

export const Wrapper = styled.section`
  padding: ${spacing.lg * 3}px ${spacing.lg}px;
  max-width: 1200px;
  margin: 0 auto;
`;

export const Legend = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: ${spacing.lg}px;
  margin-bottom: ${spacing.lg * 2}px;
`;

export const LegendItem = styled.div`
  text-align: center;
  min-width: 140px;
`;

export const LegendStatus = styled.div`
  font-weight: 600;
  color: ${colors.primary};
  font-size: 13px;
`;

export const LegendDescription = styled.div`
  color: ${colors.textTertiary};
  font-size: 12px;
  margin-top: 2px;
`;

export const NoveloGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: ${spacing.base}px;
`;

export const NoveloCard = styled(Card)`
  text-align: center;

  .ant-card-body {
    padding: ${spacing.base}px;
  }
`;

export const NoveloArea = styled.div`
  font-weight: 600;
  color: ${colors.textPrimary};
  margin-bottom: ${spacing.base}px;
`;
