// In ../Styles/TextField.ts
import { TextField } from '@mui/material';
import styled from '@emotion/styled';
import { bodyMixin } from './Typography';

export interface TextProps {
  slim? : boolean;

}

const StyledTextField = styled(TextField)<TextProps>`
  width: 95%;
  margin: 0.7rem 2.5%;

  & .MuiInputLabel-root {
    ${bodyMixin};
  }

  & .MuiInputBase-input {
    ${bodyMixin};
    height: ${(props) => (props.slim ? '2rem' : 'auto')}; /* Warunkowa wysokość */
    padding: ${(props) => (props.slim ? '0.25rem' : 'auto')}; /* Zmniejszenie paddingu dla slim */
    padding-left: 1rem;
  }
  & .MuiFormHelperText-root {
    margin-top: 0.25rem; /* Zmniejszenie marginesu dla tekstu pomocy */
    font-size: 0.75rem; /* Opcjonalnie: Zmniejszenie rozmiaru czcionki */
    position: absolute; /* Zapobiega rozciąganiu kontenera przez tekst błędu */
    bottom: -1.25rem; /* Pozycjonowanie tekstu błędu poniżej pola */
  }
  & .MuiInputBase-input::placeholder {
    ${bodyMixin};
  }
  & .MuiOutlinedInput-root {
    border-radius: 1rem; /* Zaokrąglenie ramki */
  } 
`;

export const InputContainer = styled.div`
  & > * {
  width: 100%;
    margin: 0 0;
  }
`

export default StyledTextField;
