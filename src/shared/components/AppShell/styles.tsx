import { Layout, Menu } from 'antd';
import styled, { css } from 'styled-components';
import { colors, spacing } from '@shared/theme/tokens';

export const ShellLayout = styled(Layout)`
  min-height: 100vh;
`;

export const Sider = styled(Layout.Sider)<{ $overlay: boolean }>`
  border-right: 1px solid ${colors.border};

  ${({ $overlay }) =>
    $overlay &&
    css`
      /* On small screens the open menu floats over the content instead of squeezing it. */
      position: fixed !important;
      inset: 0 auto 0 0;
      z-index: 100;
    `}
`;

export const LogoArea = styled.div`
  padding: ${spacing.lg}px ${spacing.lg}px ${spacing.base}px;
`;

export const SideMenu = styled(Menu)`
  border-inline-end: none !important;
`;

export const Content = styled(Layout.Content)`
  padding: ${spacing.lg}px ${spacing.base}px;

  @media (min-width: 992px) {
    padding: ${spacing.lg * 2}px ${spacing.lg * 2}px;
  }
`;
