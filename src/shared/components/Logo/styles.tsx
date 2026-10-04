import styled from 'styled-components';
import { colors } from '@shared/theme/tokens';

export const Wrapper = styled.div`
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
