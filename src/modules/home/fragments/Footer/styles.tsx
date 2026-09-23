import styled from 'styled-components';
import { colors, spacing } from '@shared/theme/tokens';

export const Wrapper = styled.footer`
  border-top: 1px solid ${colors.borderSecondary};
  padding: ${spacing.lg}px;
  text-align: center;
`;

export const Brand = styled.div`
  font-weight: 700;
  letter-spacing: 0.08em;
  color: ${colors.textPrimary};
`;

export const Slogan = styled.div`
  color: ${colors.textTertiary};
  font-size: 13px;
  margin-top: 4px;
`;

export const Copyright = styled.div`
  color: ${colors.textQuaternary};
  font-size: 12px;
  margin-top: ${spacing.base}px;
`;
