/** @jsxImportSource @emotion/react */
import styled from "@emotion/styled";
import { Card, InputBase } from "@mui/material";

export const HomeContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  padding: 15px;
  @media (max-width: 1200px) {
    max-height: 70vh;
  }
`;

export const MapContainer = styled.div`
  max-height: 100vh;
  width: 60%;
  @media (max-width: 1200px) {
    max-height: 70vh;

    width: 70%;
  }
  @media (max-width: 760px) {
    width: 100%;
    overflow: hidden;
  }
`;

export const FilterContainer = styled.div`
  width: 20%;
  max-height: 85vh;
  overflow: auto;
  @media (max-width: 1200px) {
    width: 30%;
    max-height: 70vh;
  }

  @media (max-width: 760px) {
    width: 50%;
  }
  @media (max-width: 500px) {
    width: 100%;
  }
`;

export const ListContainer = styled.div`
  width: 20%;
  max-height: 85vh;
  overflow: auto;
  @media (max-width: 1200px) {
    width: 100%;
    max-height: 70vh;
  }
  @media (max-width: 760px) {
    width: 50%;
  }
  @media (max-width: 500px) {
    width: 100%;
  }
`;

export const TileCard = styled(Card)`
  margin: 1%;
`;

export const StyledInputBase = styled(InputBase)`
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
