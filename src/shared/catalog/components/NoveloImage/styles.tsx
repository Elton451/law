import { GiYarn } from 'react-icons/gi';
import styled from 'styled-components';
import { colors } from '@shared/theme/tokens';

export const Yarn = styled(GiYarn)<{ $color: string; $size: number }>`
  flex-shrink: 0;
  font-size: ${({ $size }) => $size}px;
  color: ${({ $color }) => $color};
  /* Light novelos (Tributário) need an edge on white surfaces. */
  filter: drop-shadow(0 0 1px ${colors.textTertiary});
`;
