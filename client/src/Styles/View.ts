import styled from "@emotion/styled";
import { shadows } from "./Themes";

export const ViewContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  padding: 1rem;
  gap: 1rem;
  & > * {
    box-shadow: ${shadows.default};
  }
`;
