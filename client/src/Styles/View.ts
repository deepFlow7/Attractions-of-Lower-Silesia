import styled from "@emotion/styled";
import { shadows, colors, sizes } from "./Themes";
import { bodyMixin } from "./Typography";

export const ViewContainer = styled.div`
box-sizing: border-box;
  width: calc(100vw + 5px);
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1rem;
  background-color: ${colors.secondary};
  position: absolute;
  left: -5px;
  top: ${sizes.navbarHeight};
  ${bodyMixin}
  padding: 1rem;
  height: calc(100vh - ${sizes.navbarHeight});
  & > * {
    box-shadow: ${shadows.default};
    background-color: ${colors.primary};
  }
`;
