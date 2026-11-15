import styled, { css } from 'styled-components';
import { colors, radii, spacing } from '@shared/theme/tokens';

export const Scene = styled.button`
  display: block;
  width: 100%;
  padding: 0;
  background: none;
  border: none;
  color: inherit;
  font: inherit;
  text-align: center;
  cursor: pointer;
  perspective: 1200px;
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;

  &:focus-visible {
    outline: 2px solid ${colors.primary};
    outline-offset: 4px;
    border-radius: ${radii.lg}px;
  }
`;

export const Inner = styled.span<{ $flipped: boolean }>`
  position: relative;
  display: block;
  min-height: 300px;
  transform-style: preserve-3d;
  transition: transform 0.5s ease;

  ${({ $flipped }) =>
    $flipped &&
    css`
      transform: rotateY(180deg);
    `}

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

export const Face = styled.span<{ $back?: boolean }>`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  gap: ${spacing.base}px;
  padding: ${spacing.lg}px;
  overflow-y: auto;
  background: ${colors.bgContainer};
  border: 1px solid ${({ $back }) => ($back ? colors.primary : colors.border)};
  border-radius: ${radii.lg}px;
  backface-visibility: hidden;

  ${({ $back }) =>
    $back &&
    css`
      transform: rotateY(180deg);
    `}
`;

export const Label = styled.span`
  color: ${colors.primary};
  text-transform: uppercase;
  letter-spacing: 0.12em;
  font-size: 12px;
  font-weight: 600;
`;

export const Text = styled.span`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: center;
  color: ${colors.textPrimary};
  font-size: 20px;
  line-height: 1.5;
`;

export const Hint = styled.span`
  color: ${colors.textTertiary};
  font-size: 13px;
`;
