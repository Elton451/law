import { Typography } from 'antd';
import styled from 'styled-components';
import { colors, radii, spacing } from '@shared/theme/tokens';

export const Card = styled.li`
  padding: ${spacing.lg}px;
  border: 1px solid ${colors.border};
  border-radius: ${radii.lg}px;
  background: ${colors.bgContainer};
`;

export const Header = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: ${spacing.base / 2}px;
  margin-bottom: ${spacing.base}px;
`;

export const Title = styled(Typography.Title)`
  &&& {
    margin: 0;
    font-size: 18px;
  }
`;

export const Dates = styled.dl`
  display: grid;
  grid-template-columns: auto 1fr;
  gap: ${spacing.base / 4}px ${spacing.base}px;
  margin: 0;

  dt {
    color: ${colors.textSecondary};
  }

  dd {
    margin: 0;
    font-weight: 600;
  }
`;

export const Source = styled.p`
  margin: ${spacing.base}px 0 0;
  color: ${colors.textSecondary};
  font-size: 13px;
`;
