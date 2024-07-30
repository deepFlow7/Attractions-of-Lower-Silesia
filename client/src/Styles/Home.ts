/** @jsxImportSource @emotion/react */
import styled from "@emotion/styled";
import { Card, InputBase } from "@mui/material";

export const HomeContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  padding: 15px;
`;

export const MapContainer = styled.div`
    max-height: 70vh;
    min-width: 300px;
    width: 50vw;
  @media (max-width: 1200px) {
    width: 60vw;
    overflow: hidden;
  } 
  @media (max-width: 640px) {
    width: 100vh;
    overflow: hidden;
  }
`;

export const FilterContainer = styled.div`
  max-height: 70vh;
  overflow: auto;
  width:20vw;
  @media (max-width: 1200px) {
    width: 30vw;
  } 
  @media (max-width: 640px) {
    width: 100vw;
  } 
`;

export const ListContainer = styled.div`
  width: 20vw;
  max-height: 70vh;
  overflow: auto;
  @media (max-width: 1200px) {
    width: 100vw;
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
