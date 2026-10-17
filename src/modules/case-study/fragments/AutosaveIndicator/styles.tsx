import styled from 'styled-components';
import { colors } from '@shared/theme/tokens';

export const Status = styled.span<{ $error: boolean }>`
  color: ${({ $error }) => ($error ? colors.error : colors.textTertiary)};
  font-size: 13px;
`;
