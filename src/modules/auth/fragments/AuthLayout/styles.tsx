import { Card as AntCard, Typography } from 'antd';
import styled from 'styled-components';
import { colors, spacing } from '@shared/theme/tokens';

export const Page = styled.main`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: ${spacing.lg}px ${spacing.base}px;
  background: ${colors.bgLayout};
`;

export const Card = styled(AntCard)`
  width: 100%;
  max-width: 420px;
`;

export const LogoLink = styled.a`
  display: inline-block;
  margin-bottom: ${spacing.lg}px;
`;

export const Title = styled(Typography.Title)`
  &&& {
    font-size: 24px;
    margin-bottom: ${spacing.base / 2}px;
  }
`;

export const Subtitle = styled(Typography.Paragraph)`
  &&& {
    color: ${colors.textSecondary};
    margin-bottom: ${spacing.lg}px;
  }
`;

export const Footer = styled.p`
  margin: ${spacing.lg}px 0 0;
  text-align: center;
  color: ${colors.textSecondary};
`;
