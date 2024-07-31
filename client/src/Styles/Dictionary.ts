import styled from "@emotion/styled";

export interface DictionaryContainerProps {
    second?: boolean;
  }

export const DictionaryContainer = styled.div<DictionaryContainerProps>`
  width: 23%;
  max-height: 85vh;
  overflow: auto;
  @media (max-width: 1650px) {
    width: ${props => (props.second ? '100%' : '30%')};

    max-height: 70vh;
  }
  @media (max-width: 1000px) {
    width: 48%;

    max-height: 70vh;
  }

  @media (max-width: 660px) {
    width: 100%;
  }
  
`;