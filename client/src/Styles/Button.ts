/** @jsxImportSource @emotion/react */
import Button, { ButtonProps as MUIButtonProps } from '@mui/material/Button';
import { styled } from '@mui/system';
import { animations, shadows, sizes, transitions } from './Themes';
import { bodyMixin } from './Typography';

export interface ButtonProps extends MUIButtonProps {
  secondary?: boolean;
  hidden?: boolean;
  background?: boolean;
  highlight?: boolean;
  big?: boolean;
  colors: { [key: string]: string | boolean }; // Dodano colors jako props
}

export const ButtonMixin = (colors: { [key: string]: string | boolean }) => `
  text-transform: uppercase;
  text-decoration: none;
  position: relative;
  transition-property: all;
  transition-duration: ${transitions.default};
  ${bodyMixin(colors)}; // Przekazanie colors do bodyMixin

  height: ${sizes.buttonHeight};
  padding: ${sizes.paddingVertical} ${sizes.paddingHorizontal};

  &.btn--primary {
    background-color: ${colors.primary};
  }

  &.btn--secondary {
    background-color: ${colors.secondary};
  }

  &:hover {
    outline: none;
    transform: translateY(-0.2rem);
    box-shadow: ${shadows.default};

    &::after {
      transform: scaleX(1.6) scaleY(1.3);
      opacity: 0;
    }
  }

  &:active {
    outline: none;
    transform: translateY(0);
    box-shadow: ${shadows.active};
  }

  &::after {
    content: '';
    display: inline-block;
    height: 100%;
    width: 100%;
    border-radius: ${sizes.borderRadius};
    position: absolute;
    top: 0;
    left: 0;
    z-index: -1;
    transition-property: all;
    transition-duration: ${transitions.default};
  }

  &.btn--animated {
    animation-name: ${animations.moveInBottom};
    animation-duration: 300ms;
    animation-timing-function: ease-out;
    animation-delay: 750ms;
    animation-fill-mode: forwards;
    animation-fill-mode: backwards;
  }
`;

export const StyledButton = styled(Button) <ButtonProps>`
  ${({ colors }) => ButtonMixin(colors)}; // Przekazanie colors do ButtonMixin
  display: ${props => (props.hidden ? 'none' : 'inline-block')};
  color: ${props => (props.secondary ? props.colors.secondary : props.colors.tertiary)};
  background-color: ${props => (props.highlight ? props.colors.tertiary : props.background ? props.colors.primary : 'transparent')};
  
  &:hover {
    background-color: ${props => (props.background ? props.colors.primary : 'transparent')};
  }
  
  font-size: ${props => (props.big ? '3rem' : sizes.fontSize)};
`;
