/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';

export const colors = {
  primary: '#9bc400',
  secondary: '#8076a3',
  tertiary: '#f9c5bd',
  mid: '#8E9D52',
  mid1: '#92AA36',
  mid2: '#89906D',
  white: '#fff',
  dark: '#270101ff',
};

export const gradients = {
  primaryToSecondary: `linear-gradient(45deg, ${colors.primary}, ${colors.secondary})`,
  primaryToMid: `linear-gradient(45deg, ${colors.primary}, ${colors.mid})`,
  midToSecondary: `linear-gradient(45deg, ${colors.mid}, ${colors.secondary})`,
  primaryToDark: `linear-gradient(45deg, ${colors.dark}, ${colors.primary})`,
  secondaryToTertiary: `linear-gradient(45deg, ${colors.secondary}, ${colors.tertiary})`,
  primaryToMid1: `linear-gradient(45deg, ${colors.primary}, ${colors.mid1})`,
  mid1ToMid2: `linear-gradient(45deg, ${colors.mid1}, ${colors.mid2})`,
  mid2ToSecondary: `linear-gradient(45deg, ${colors.mid2}, ${colors.secondary})`,
};

export const sizes = {
  borderRadius: '2rem',
  paddingVertical: '0.5rem',
  paddingHorizontal: '1rem',
  fontSize: '1rem',
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
