import styled from "@emotion/styled";
import { shadows, colors, sizes } from "./Themes";
import { bodyMixin} from "./Typography";

export const ViewContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1rem;
  background-color: ${colors.secondary};
  position: absolute;
  padding: 1rem;
  left: -5px;
  top: ${sizes.navbarHeight};
  ${bodyMixin}
  
  & > * {
    box-shadow: ${shadows.default};
    background-color: ${colors.primary};
  }
`;
