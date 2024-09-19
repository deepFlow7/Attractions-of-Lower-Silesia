import { TextField } from '@mui/material';
import styled from '@emotion/styled';
import { bodyMixin } from './Typography';

export interface TextProps {
  slim?: boolean;
  colors: { [key: string]: string | boolean };
}

const StyledTextField = styled(TextField) <TextProps>`
  width: 95%;
  margin: 0.7rem 2.5%;

  & .MuiInputLabel-root {
    ${({ colors }) => bodyMixin(colors)}; 
  }

  & .MuiInputBase-input {
    ${({ colors }) => bodyMixin(colors)}; 
    height: ${(props) => (props.slim ? '2rem' : 'auto')}; 
    padding: ${(props) => (props.slim ? '0.25rem' : 'auto')}; 
    padding-left: 1rem;
  }
  
  & .MuiFormHelperText-root {
    margin-top: 0.25rem; 
    font-size: 0.75rem;
    position: absolute; 
    bottom: -1.25rem;
  }

  & .MuiInputBase-input::placeholder {
    ${({ colors }) => bodyMixin(colors)}; 
  }

  & .MuiOutlinedInput-root {
    border-radius: 1rem; 
    & fieldset {
    }
    &.Mui-focused fieldset {
      border-color:  ${props => props.colors.tertiary};
    }
  }
`;

export const InputContainer = styled.div`
  & > * {
    width: 100%;
    margin: 0 0;
  }
`;

export default StyledTextField;
