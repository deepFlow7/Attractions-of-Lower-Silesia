/** @jsxImportSource @emotion/react */
import styled from "@emotion/styled";

export const MapContainer = styled.div`
  max-height: 100vh;
  width: 58%;
  overflow: hidden;

  @media (max-width: 1200px) {
    max-height: 70vh;

    width: 68%;
  }
  @media (max-width: 760px) {
    width: 100%;
    overflow: hidden;
  }
`;