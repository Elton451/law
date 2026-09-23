import { Typography } from 'antd';
import styled from 'styled-components';
import { colors, radii, spacing } from '@shared/theme/tokens';

export const Wrapper = styled.section`
  background: ${colors.bgContainer};
  border-top: 1px solid ${colors.borderSecondary};
  border-bottom: 1px solid ${colors.borderSecondary};
  padding: ${spacing.lg * 3}px ${spacing.lg}px;
`;

export const Inner = styled.div`
  max-width: 640px;
  margin: 0 auto;
  text-align: center;
`;

export const Sparkle = styled.div`
  color: ${colors.primary};
  font-size: 18px;
  margin-bottom: ${spacing.base}px;
`;

export const MascotName = styled.div`
  display: inline-flex;
  align-items: center;
  gap: ${spacing.base / 2}px;
  background: ${colors.bgElevated};
  border: 1px solid ${colors.border};
  border-radius: ${radii.pill}px;
  padding: 6px ${spacing.base}px;
  margin: ${spacing.base}px 0;
  font-weight: 600;
  color: ${colors.textPrimary};
`;

export const MascotBreed = styled.span`
  color: ${colors.textTertiary};
  font-weight: 400;
`;

export const Description = styled(Typography.Paragraph)`
  &&& {
    color: ${colors.textSecondary};
  }
`;

export const Phrase = styled(Typography.Paragraph)`
  &&& {
    color: ${colors.textPrimary};
    font-style: italic;
    margin-top: ${spacing.lg}px;
    margin-bottom: 0;
  }
`;
