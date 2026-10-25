import { Card } from 'antd';
import styled from 'styled-components';
import { spacing } from '@shared/theme/tokens';

export const Section = styled(Card)`
  margin: ${spacing.base}px 0;
`;

export const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${spacing.base / 2}px;
  margin-top: ${spacing.base}px;
`;
