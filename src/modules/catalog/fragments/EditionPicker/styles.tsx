import { Radio } from 'antd';
import styled from 'styled-components';
import { colors, radii, spacing } from '@shared/theme/tokens';

export const Label = styled.p`
  margin: 0 0 ${spacing.base / 2}px;
  padding: 0;
  font-weight: 600;
  color: ${colors.textPrimary};
`;

export const Options = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.base / 2}px;
`;

export const Option = styled(Radio)`
  padding: ${spacing.base / 2}px ${spacing.base}px;
  border: 1px solid ${colors.border};
  border-radius: ${radii.md}px;
  background: ${colors.bgContainer};

  &.ant-radio-wrapper-checked {
    border-color: ${colors.accent};
    background: ${colors.bgElevated};
  }
`;
