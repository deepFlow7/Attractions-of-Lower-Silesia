import styled from "@emotion/styled";
import { sizes} from "../Styles/Themes";
import { ContrastProps } from '../Providers/Colors'; 

export interface ListContainerProps {
  three?: boolean;
  four?: boolean;
}

export const ListContainer = styled.div<ListContainerProps>`
width: 20%;
max-height: 85vh;
  overflow: auto;
  @media (max-width: 1650px) {
    width: ${props => (props.four ? '48%' : '24%')};
    max-height: ${props => (props.four ? '70vh' : '85vh')};
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
  @media (max-width: 560px) {
    width: ${props => (props.four ? '100%' : '47%')};
  }
  @media (max-width: 500px) {
    width: 100%;
    height: 20rem;
  }
`;

export const ChallengesContainer = styled.div`
  width: 49%;
  @media (max-width: 850px) {
    width: 100%
  }
`;

export const AdminContainer = styled.div<ContrastProps>`
  width: 32%;
  height: calc(98vh - ${sizes.navbarHeight} - ${sizes.buttonHeight} - 2rem);
  overflow: auto;
  background-color: transparent;

  & > * {
    & > * {
  background-color: ${props => props.colors.primary};
  box-shadow: none;
    }
  }
  @media (max-width: 900px) {
    width: 48%;
    height: 70vh;
  }
  @media (max-width: 650px) {
    width: 100%
  }
`;

