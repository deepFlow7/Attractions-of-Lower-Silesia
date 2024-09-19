import styled from "@emotion/styled";
import { sizes, transitions, shadows } from './Themes';

export interface TitleProps {
  small?: boolean;
}

export interface BodyProps {
  gray?: boolean;
  big?: boolean;
  margin?: boolean;
  secondary?: boolean;
  error?: boolean;
  colors: { [key: string]: string | boolean };
}

export const titleMixin = (colors: { [key: string]: string | boolean}) => `
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

export const bodyMixin = (colors: { [key: string]: string | boolean}) => `
  color: ${colors.dark};
  line-height: 1.5;
  font-family: 'Englebert', sans-serif;
  text-decoration: none;
  font-size: ${sizes.fontSize};
`;

export const Title = styled.div<TitleProps & { colors: { [key: string]: string | boolean } }>`
  ${({ colors }) => titleMixin(colors)} 
  font-size: ${props => (props.small ? '2.5rem' : sizes.titleSize)};
`;

export const Body = styled.div<BodyProps>`
  ${({ colors }) => bodyMixin(colors)} 

  margin-left: ${props => (props.margin ? '1rem' : '0')};
  color: ${props => props.gray ? props.colors.gray : props.colors.dark}; 
  color: ${props => props.secondary ? props.colors.secondary : props.colors.dark}; 
  color: ${props => props.error ? 'red' : props.colors.dark}; 

  font-size: ${props => (props.big ? '2rem' : sizes.fontSize)};
`;
