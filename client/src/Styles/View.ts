import styled from "@emotion/styled";
import { shadows, colors, sizes } from "./Themes";
import { bodyMixin } from "./Typography";
import background from "/backgrounds/attraction.png";
export interface ViewContainerProps {
  buttonOnTop?: boolean;
}

export const ViewContainer = styled.div<ViewContainerProps>`
  box-sizing: border-box;
  width: calc(100vw + 5px);
  width: ${(props) => props.buttonOnTop ? 'calc(100vw + 10px)' : 'calc(100vw + 5px)'};
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1rem;
  background-color: ${colors.secondary};
  position: absolute;
  left: -5px;
  top: ${props => (props.buttonOnTop ? sizes.navbarHeight + sizes.buttonHeightPadded : sizes.navbarHeight)};
  ${bodyMixin}
  padding: 1rem;
  min-height: ${(props) => props.buttonOnTop 
    ? `calc(100vh - ${sizes.navbarHeight} - ${sizes.buttonHeightPadded})` 
    : `calc(100vh - ${sizes.navbarHeight})`};
  & > * {
    background-color: ${colors.primary};
  }
  @media (max-width: 500px) {
    padding-right: 2rem;
  }
`;
export const AttractionContainer = styled.div`
  box-sizing: border-box;
  width: calc(100vw + 5px);
  position: absolute;
  left: -5px;
  top: ${sizes.navbarHeight};
  min-height: calc(100vh - ${sizes.navbarHeight});
  ${bodyMixin}
  padding: 1rem;
  display: grid;
  grid-template-columns: 3fr 2fr;
  gap: 1rem;
  background-image: url(${background});
  background-size: 100% 100%;
  background-position: center;
  background-repeat: no-repeat;
  & > * {
    z-index: 3;
  }
  /* Pseudo-element do dodania koloru */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: ${colors.secondary}; /* Kolor nakładki */
    opacity: 0.8; /* Przezroczystość */
    z-index: 1; /* Nakładka na tło, ale pod zawartością */
    pointer-events: none; /* Blokuje interakcję z nakładką */
  }

  z-index: 2;
  @media (max-width: 1500px){
    grid-template-columns: 2fr 1fr;
  }
  @media (max-width: 900px){
    grid-template-columns: 1fr;
  }
`;
