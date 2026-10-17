import { Segmented } from 'antd';
import styled from 'styled-components';
import { colors, radii, spacing } from '@shared/theme/tokens';

const DESKTOP = '@media (min-width: 992px)';

export const TopBar = styled.div`
  position: sticky;
  top: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${spacing.base}px;
  margin: -${spacing.base / 2}px 0 ${spacing.base}px;
  padding: ${spacing.base / 2}px 0;
  background: ${colors.bgLayout};
`;

export const PaneSwitch = styled(Segmented)`
  margin: ${spacing.base}px 0;

  ${DESKTOP} {
    display: none;
  }
`;

export const Columns = styled.div`
  ${DESKTOP} {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    gap: ${spacing.lg}px;
    align-items: start;
    margin-top: ${spacing.base}px;
  }
`;

export const Pane = styled.section<{ $active: boolean }>`
  display: ${({ $active }) => ($active ? 'block' : 'none')};
  padding: ${spacing.lg}px ${spacing.base}px;
  background: ${colors.bgContainer};
  border: 1px solid ${colors.border};
  border-radius: ${radii.lg}px;

  ${DESKTOP} {
    display: block;
    padding: ${spacing.lg}px;

    /* The case stays in view while the student scrolls the long form. */
    &:first-child {
      position: sticky;
      top: 72px;
      max-height: calc(100vh - 96px);
      overflow-y: auto;
    }
  }
`;
