/** @jsxImportSource @emotion/react */
import styled from '@emotion/styled';
import { colors, gradients, shadows, transitions } from './Themes';

export const StyledCard = styled.div`
  -moz-perspective: 50rem;
  perspective: 50rem;
  position: relative;
  height: 30rem;
  width: 100%; /* Dodaj szerokość, aby karta miała odpowiednią wielkość */

  &:hover > div {
    transform: rotateY(180deg);
  }
`;

export const InnerCard = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  transition: transform 2s;
  transform-style: preserve-3d;
`;

// Wspólny styl dla stron karty
export const CardSide = styled.div`
  height: 100%;
  position: absolute;
  width: 100%;
  backface-visibility: hidden;
  border-radius: 0.5rem;
  overflow: hidden;
  box-shadow: 0.1rem 1.5rem 1rem #ccc;
`;

// Strona przednia karty
export const CardFront = styled(CardSide)`
    color: white;
`;

// Strona tylna karty
export const CardBack = styled(CardSide)`
  background-color: ${colors.secondary};
  transform: rotateY(-180deg);
`;

// Strona tylna karty z gradientem 1
export const CardBack2 = styled(CardBack)`
  background-image: ${gradients.primaryToMid};
`;
export const CardBack1 = styled(CardBack)`
background-image: ${gradients.midToSecondary};
`;

export const CardPicture = styled.div`
    position: absolute;
    width: 100%;
    height: 35%;
    background-size: cover;
    background-image: ${gradients.midToSecondary}, url('/obrazki/pheasants.jpg');
    background-blend-mode: screen;
    clip-path: polygon(0 0, 100% 0, 100% 85%, 0 100%);
`;

export const CardHeading = styled.div`
    position: absolute;
    top: 5rem;
    right: 1rem;
    font-size: 2.8rem;
    text-transform: uppercase;
    font-weight: 300;
`;
export const CardDetails = styled.div`
  color: ${colors.dark};
  position: absolute;
    top: 12rem;
`;
export const HighlightSpan = styled.span`
    background-image: ${gradients.primaryToSecondary};

    padding: 0.2rem 0.4rem;
    border-radius: 0.3rem;
`;
