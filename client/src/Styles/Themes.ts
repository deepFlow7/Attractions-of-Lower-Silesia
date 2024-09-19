/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';

export const sizes = {
  borderRadius: '2rem',
  paddingVertical: '0.5rem',
  paddingHorizontal: '1rem',
  fontSize: '1.3rem',
  titleSize: '3rem',
  navbarHeight: '5rem',
  buttonHeight: '5rem',
  buttonHeightPadded: '6rem',

};

export const transitions = {
  default: '200ms',
};

export const shadows = {
  default: '0 1rem 2rem rgba(0, 0, 0, 0.2)',
  active: '0 0.5rem 1rem rgba(0, 0, 0, 0.2)',
};

export const animations = {
  moveInBottom: `
    0% {
      opacity: 0;
      transform: translateY(3rem);
    }
    100% {
      opacity: 1;
      transform: translateY(0);
    }`
};
