import styled from 'styled-components';
import { colors, radii, spacing, typography } from '@shared/theme/tokens';

export const Prose = styled.div`
  overflow-wrap: anywhere;

  > :first-child {
    margin-top: 0;
  }

  > :last-child {
    margin-bottom: 0;
  }

  p,
  ul,
  ol,
  blockquote,
  pre,
  table {
    margin: 0 0 ${spacing.base / 2}px;
  }

  ul,
  ol {
    padding-left: ${spacing.lg}px;
    text-align: left;
  }

  strong {
    color: ${colors.primary};
  }

  blockquote {
    padding-left: ${spacing.base / 2}px;
    border-left: 3px solid ${colors.border};
    color: ${colors.textSecondary};
  }

  code {
    padding: 0 4px;
    background: ${colors.bgElevated};
    border-radius: ${radii.sm}px;
    font-family: ${typography.fontFamilyCode};
    font-size: 0.9em;
  }

  pre {
    padding: ${spacing.base / 2}px;
    overflow-x: auto;
    background: ${colors.bgElevated};
    border-radius: ${radii.sm}px;
    text-align: left;

    code {
      padding: 0;
    }
  }

  table {
    border-collapse: collapse;
  }

  th,
  td {
    padding: 4px ${spacing.base / 2}px;
    border: 1px solid ${colors.border};
  }
`;
