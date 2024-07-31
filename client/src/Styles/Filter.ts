import styled from "@emotion/styled";

export interface FilterContainerProps {
  three?: boolean;
  four?: boolean;
}

export const FilterContainer = styled.div<FilterContainerProps>`
  width: ${props => (props.four ? '15%' : '20%')};
  max-height: 85vh;
  overflow: auto;
  @media (max-width: 1650px) {
    width: ${props => (props.four ? '48%' : '15%')};
    max-height: ${props => (props.four ? '70vh' : '85vh')};

  }
  @media (max-width: 1200px) {
    width: ${props => (props.four ? '48%' : '30%')};

    max-height: 70vh;
  }

  @media (max-width: 760px) {
    width: 49%;
  }
  @media (max-width: 660px) {
    width: ${props => (props.four ? '30%' : '49%')};
  }
  @media (max-width: 550px) {
    width: 48%;
  }
  @media (max-width: 500px) {
    width: 100%;
  }
`;

