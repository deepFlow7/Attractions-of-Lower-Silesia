import styled from "@emotion/styled";

export interface ListContainerProps {
  three?: boolean;
  four?: boolean;
}

export const ListContainer = styled.div<ListContainerProps>`
  width: 15%;
  max-height: 85vh;
  overflow: auto;
  @media (max-width: 1650px) {
    width: ${props => (props.four ? '48%' : '15%')};
    max-height: ${props => (props.four ? '70vh' : '100vh')};

  }
  @media (max-width: 1200px) {
    width: ${props => (props.four ? '48%' : '100%')};
    max-height: 70vh;
  }
  @media (max-width: 760px) {
    width: 48%;
  }
  @media (max-width: 660px) {
    width: ${props => (props.four ? '30%' : '48%')};
  }
  @media (max-width: 550px) {
    width: ${props => (props.four ? '100%' : '48%')};
  }
  @media (max-width: 500px) {
    width: 100%;
  }
`;

export const ChallengesContainer = styled.div`
  width: 49%;
  @media (max-width: 850px) {
    width: 100%
  }
`;
