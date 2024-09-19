/** @jsxImportSource @emotion/react */
import styled from "@emotion/styled";

export interface MapContainerProps {
  three?: boolean;
  four?: boolean;
  challenge?: boolean;
}

export interface DropListContainerProps {
  three?: boolean;
  four?: boolean;
}

export const DropListContainer = styled.div<DropListContainerProps>`
  width: 15%;
  max-height: 85vh;
  overflow: auto;
  @media (max-width: 1650px) {
    width: 30%;
    max-height: 70vh;
  }
  @media (max-width: 660px) {
    width:30%;
  }
  @media (max-width: 550px) {
    width:48%;
  }
  @media (max-width: 500px) {
    width: 100%;
  }
`;



export const MapContainer = styled.div<MapContainerProps>`
  display: flex;
  flex-direction: column;
  height: 85vh;
  width: ${props => (props.four ? '47%' : '58%')};
  overflow: hidden;
  @media (max-width: 1650px) {
    width: ${props => (props.four ? '68%' : '58%')};
    height: ${props => (props.four ? '70vh' : '85vh')};
  }
  @media (max-width: 1200px) {
    max-height: 70vh;
    width: 68%;
  }
  @media (max-width: 1000px) {
    width: ${props => (props.challenge ? '100%' : '68%')};
  }

  @media (max-width: 850px) {
    width: 67%;
  }

  @media (max-width: 760px) {
    width: ${props => (props.four ? '67%' : '100%')};
  }
  @media (max-width: 660px) {
    width:100%;
  }
`;