import styled from "@emotion/styled";

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

