import styled from "@emotion/styled";
import { InputBase } from "@mui/material";
import { bodyMixin } from "./Typography";
export interface InputProps {
  slim?: boolean;
};
export const Input = styled(InputBase) <InputProps>`
  & .MuiInputBase-input {
    ${bodyMixin};
    height: ${(props) => (props.slim ? '2rem' : 'auto')}; 
    padding: ${(props) => (props.slim ? '0.25rem' : '0.5rem')};
  }
  
  
  & .MuiInputBase-adornedStart {
    margin-right: 0.5rem;
  }
`;
