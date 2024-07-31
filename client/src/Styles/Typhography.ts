/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { colors, sizes, transitions, shadows, animations, gradients } from './Themes';
import styled from "@emotion/styled";

const typographyStyles = {
  body: {
    fontWeight: 400,
    lineHeight: 1.7,
    color: colors.primary,
  },
  headingPrimary: {
    color: 'transparent',
    textTransform: 'uppercase',
    backfaceVisibility: 'hidden',
    fontSize: '3.5rem',
    backgroundImage: gradients.primaryToSecondary,
    display: 'inline-block',
    WebkitBackgroundClip: 'text',
    backgroundClip: 'text',
    transitionProperty: 'all',
    transitionDuration: transitions.default,
    '&:hover': {
      transform: 'skewY(2deg) skewX(15deg) scale(1.1)',
      textShadow: shadows.default,
    },
  },
  headingSecondary: {
    fontSize: '2rem',
    backgroundImage: gradients.midToSecondary,
    display: 'inline-block',
    backgroundClip: 'text',
    WebkitBackgroundClip: 'text',
    color: 'transparent',
  },  
  
  headingTertiary: {
    fontSize: sizes.fontSize,
    fontWeight: 700,
    textTransform: 'uppercase',
  },
  paragraph: {
    fontSize: sizes.fontSize,
    '&:not(:last-child)': {
      marginBottom: sizes.paddingVertical,
    },
  },
};

export const Title = styled.div`{
  color: 'transparent',
  textTransform: 'uppercase',
  backfaceVisibility: 'hidden',
  fontSize: '3.5rem',
  backgroundImage: gradients.primaryToSecondary,
  display: 'inline-block',
  WebkitBackgroundClip: 'text',
  backgroundClip: 'text',
  transitionProperty: 'all',
  transitionDuration: transitions.default,
  '&:hover': {
    transform: 'skewY(2deg) skewX(15deg) scale(1.1)',
    textShadow: shadows.default,
  },
}`;

export const Description = styled.div`{
  fontSize: sizes.fontSize,
    '&:not(:last-child)': {
      marginBottom: sizes.paddingVertical,
    },
}`;

export default typographyStyles;
