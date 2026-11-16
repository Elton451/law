import { Typography } from 'antd';
import styled from 'styled-components';
import { colors, radii, spacing, typography } from '@shared/theme/tokens';

export const Wrapper = styled.section`
  padding: ${spacing.lg * 3}px ${spacing.base}px;
  max-width: 1200px;
  margin: 0 auto;
`;

export const Steps = styled.ol`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: ${spacing.lg}px;
  margin: 0;
  padding: 0;
  list-style: none;
`;

export const Step = styled.li`
  padding: ${spacing.lg}px;
  border: 1px solid ${colors.border};
  border-radius: ${radii.lg}px;
  background: ${colors.bgContainer};
`;

export const Number = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  margin-bottom: ${spacing.base}px;
  border-radius: ${radii.pill}px;
  background: ${colors.surface};
  color: ${colors.textPrimary};
  font-family: ${typography.fontFamilyHeading};
  font-weight: 700;
`;

export const StepTitle = styled(Typography.Title)`
  &&& {
    font-size: 18px;
    margin-bottom: ${spacing.base / 2}px;
  }
`;

export const StepText = styled(Typography.Paragraph)`
  &&& {
    margin: 0;
    color: ${colors.textSecondary};
  }
`;
