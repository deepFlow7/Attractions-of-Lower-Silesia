/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';

export const colors = {
  primary: '#e9cbb0',
  secondary: '#4d6e6d',
  tertiary: '#d3d69b',
  white: '#fff',
  dark: '#2a2b2a',
  gray: '#949494',
  light_gray: '#d7c8cb',
};

export const gradients = {
  primaryToSecondary: `linear-gradient(45deg, ${colors.primary}, ${colors.secondary})`,
 };

export const sizes = {
  borderRadius: '2rem',
  paddingVertical: '0.5rem',
  paddingHorizontal: '1rem',
  fontSize: '1.3rem',
  titleSize: '3rem',
  navbarHeight: '5rem',
  buttonHeight: '5rem',
};

export const transitions = {
  default: '200ms',
};

export const shadows = {
  default: '0 1rem 2rem rgba(0, 0, 0, 0.2)',
  active: '0 0.5rem 1rem rgba(0, 0, 0, 0.2)',
};

export const animations = {
  moveInBottom: css`
    0% {
      opacity: 0;
      transform: translateY(3rem);
    }
    100% {
      opacity: 1;
      transform: translateY(0);
    }
  `,
};
