import styled from "@emotion/styled";
import { InputBase } from "@mui/material";

export const Input = styled(InputBase)`
  margin: 10px 0;
  border: 1px solid #fff;
  border-radius: 4px;
  padding: 8px;
  width: 100%;

  &:focus {
    border-color: blue;
    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.5);
  }
`;