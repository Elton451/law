import { Link } from 'react-router';
import styled from 'styled-components';
import { colors, radii, spacing } from '@shared/theme/tokens';

export const Modules = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.lg}px;
`;

export const ModuleTitle = styled.h2`
  margin: 0 0 ${spacing.base}px;
  color: ${colors.textPrimary};
  font-size: 18px;
`;

export const Lessons = styled.ul`
  display: grid;
  gap: ${spacing.base / 2}px;
  margin: 0;
  padding: 0;
  list-style: none;
`;

export const LessonLink = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${spacing.base}px;
  padding: ${spacing.base}px;
  background: ${colors.bgContainer};
  border: 1px solid ${colors.border};
  border-radius: ${radii.md}px;
  transition: background 0.2s;

  &:hover {
    background: ${colors.bgElevated};
  }

  &:focus-visible {
    outline: 2px solid ${colors.primary};
    outline-offset: 2px;
  }
`;

export const LessonTitle = styled.span`
  display: block;
  color: ${colors.textPrimary};
  font-weight: 600;
`;

export const LessonMeta = styled.span`
  display: block;
  color: ${colors.textSecondary};
  font-size: 13px;
`;
