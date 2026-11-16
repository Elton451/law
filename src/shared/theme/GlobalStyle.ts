import { createGlobalStyle } from 'styled-components';
import { colors, typography } from './tokens';

export const GlobalStyle = createGlobalStyle`
  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  html,
  body,
  #root {
    height: 100%;
  }

  html {
    scroll-behavior: smooth;
  }

  section[id] {
    scroll-margin-top: 88px;
  }

  body {
    margin: 0;
    background-color: ${colors.bgLayout};
    color: ${colors.textPrimary};
    font-family: ${typography.fontFamily};
    font-size: ${typography.fontSize}px;
  }

  h1,
  h2,
  h3,
  h4 {
    font-family: ${typography.fontFamilyHeading};
  }

  :focus-visible {
    outline: 2px solid ${colors.accent};
    outline-offset: 2px;
  }

  a {
    color: ${colors.accent};

    &:hover {
      color: ${colors.accentSoft};
    }
  }
`;

export default GlobalStyle;
