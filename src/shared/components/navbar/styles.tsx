import { Flex, Menu } from 'antd';
import { Header } from 'antd/es/layout/layout';
import styled from 'styled-components';
import { colors, spacing } from '@shared/theme/tokens';

export const StyledHeader = styled(Header)`
  position: sticky;
  top: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  gap: ${spacing.lg}px;
  height: auto;
  line-height: normal;
  padding: ${spacing.base}px ${spacing.lg}px;
  background: ${colors.bgBase};
  border-bottom: 1px solid ${colors.border};
`;

export const LogoWrapper = styled.div`
  display: flex;
  flex-direction: column;
  line-height: 1.05;
  font-weight: 700;
  letter-spacing: 0.06em;
  font-size: 15px;
  white-space: nowrap;

  span:first-child {
    color: ${colors.textPrimary};
  }

  span:last-child {
    color: ${colors.primary};
  }
`;

export const NavMenu = styled(Menu)`
  flex: 1;
  min-width: 0;
  justify-content: center;
  background: transparent;
  border-bottom: none;
`;

export const NavActions = styled(Flex)`
  flex-shrink: 0;
`;
