import styled from 'styled-components';
import { spacing } from '@shared/theme/tokens';

export const Footer = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: ${spacing.base}px;
  margin-top: ${spacing.base}px;
`;

export const Actions = styled.div`
  display: flex;
  gap: ${spacing.base / 2}px;
  margin-left: auto;
`;
