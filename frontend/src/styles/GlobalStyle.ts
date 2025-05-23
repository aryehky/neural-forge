import { createGlobalStyle } from 'styled-components';
import { Theme } from '../theme';

const GlobalStyle = createGlobalStyle<{ theme: Theme }>`
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html {
    font-size: 16px;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  body {
    font-family: ${({ theme }) => theme.fonts.body};
    background-color: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.text};
    line-height: 1.5;
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: ${({ theme }) => theme.fonts.heading};
    font-weight: ${({ theme }) => theme.fontWeights.bold};
    line-height: 1.2;
  }

  a {
    color: ${({ theme }) => theme.colors.primary};
    text-decoration: none;
    transition: color ${({ theme }) => theme.transitions.default};

    &:hover {
      color: ${({ theme }) => theme.colors.secondary};
    }
  }

  button {
    font-family: ${({ theme }) => theme.fonts.body};
    cursor: pointer;
    border: none;
    background: none;
    padding: 0;
  }

  input, textarea, select {
    font-family: ${({ theme }) => theme.fonts.body};
    font-size: ${({ theme }) => theme.fontSizes.base};
  }

  img {
    max-width: 100%;
    height: auto;
  }

  /* Scrollbar Styles */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.colors.background};
  }

  ::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.border};
    border-radius: ${({ theme }) => theme.radii.full};

    &:hover {
      background: ${({ theme }) => theme.colors.textSecondary};
    }
  }

  /* Selection Styles */
  ::selection {
    background: ${({ theme }) => theme.colors.primary};
    color: white;
  }

  /* Focus Styles */
  :focus {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }

  /* Remove focus styles for mouse users */
  :focus:not(:focus-visible) {
    outline: none;
  }

  /* Loading States */
  .loading {
    opacity: 0.7;
    pointer-events: none;
  }

  /* Error States */
  .error {
    color: ${({ theme }) => theme.colors.error};
  }

  /* Success States */
  .success {
    color: ${({ theme }) => theme.colors.success};
  }

  /* Warning States */
  .warning {
    color: ${({ theme }) => theme.colors.warning};
  }
`;

export default GlobalStyle; 