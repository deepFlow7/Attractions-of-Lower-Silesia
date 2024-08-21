// In ../Styles/TextField.ts
import { TextField } from '@mui/material';
import styled from '@emotion/styled';
import { bodyMixin } from './Typography';

const StyledTextField = styled(TextField)`
width: 95%;

  margin: 0.5rem 2.5%;

  & .MuiInputLabel-root {
    ${bodyMixin};
  }
  & .MuiInputBase-input::placeholder {
    ${bodyMixin};
  }

  & .MuiInputBase-input {
    ${bodyMixin};
  }

`;

export default StyledTextField;
