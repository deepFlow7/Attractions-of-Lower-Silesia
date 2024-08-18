import styled from "@emotion/styled";
import { colors, sizes, transitions, shadows } from './Themes';

export interface TitleProps {
  small?: boolean;
}

export interface BodyProps {
  gray?: boolean;
  big?: boolean;
}

export const titleMixin = `
  color: ${colors.secondary};
  font-size: ${sizes.titleSize};
  @media (max-width: 600px) {
    font-size: 2.5rem;
  }
  @media (max-width: 500px) {
    font-size: 2rem;
  }
  @media (max-width: 400px) {
    font-size: 1.5rem;
  }
  font-family: 'Bangers', sans-serif;
  transition: ${transitions.default};
  text-shadow: ${shadows.default};
  margin: 1rem;
`;

export const bodyMixin = `
  color: ${colors.dark};
  font-family: 'Englebert', sans-serif;
  text-decoration: none;
  font-size: ${sizes.fontSize};
`;

export const Title = styled.div<TitleProps>`
  ${titleMixin}
  font-size: ${props => (props.small ? '2.5rem' : sizes.titleSize)};
`;

export const Body = styled.div<BodyProps>`
  ${bodyMixin}
  color: ${props => (props.gray ? colors.gray : colors.dark)};
  font-size: ${props => (props.big ? '2rem' : sizes.fontSize)};
`;
