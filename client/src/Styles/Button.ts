/** @jsxImportSource @emotion/react */
import { styled } from '@mui/system';
import Button from '@mui/material/Button';
import { colors, sizes, transitions, shadows, animations, gradients } from './Themes';
import { bodyMixin } from './Typography';

export interface ButtonProps {
  secondary?: boolean;
}

export const StyledButton = styled(Button)<ButtonProps>`
  text-transform: uppercase;
  text-decoration: none;
  display: inline-block;
  border-radius: ${sizes.borderRadius};
  position: relative;
  font-size: ${sizes.fontSize};
  border: none;
  transition-property: all;
  transition-duration: ${transitions.default};
  margin-top: 10px;
  margin-bottom: 10px;
  ${bodyMixin};
  color: ${props => (props.secondary ? colors.secondary : colors.dark)};


  padding: ${sizes.paddingVertical} ${sizes.paddingHorizontal};

  &.btn--primary {
    background-color: ${colors.primary};
  }

  &.btn--secondary {
    background-color: ${colors.secondary};
  }

  &.btn--gradient {
    background: ${gradients.primaryToSecondary}
  }

  &.btn--midToSecondary {
    background: ${gradients.primaryToSecondary};
  }
  &.btn--primaryToMid {
    background: ${gradients.primaryToSecondary};
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
