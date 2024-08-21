/** @jsxImportSource @emotion/react */
import styled from "@emotion/styled";
import React from "react";
import {
  Button,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { Link } from "react-router-dom";
import { Challenge } from "../types";
import { Title } from "../Styles/Typography";
import { bodyMixin } from '../Styles/Typography'; // Importowanie bodyMixin

interface ListProps {
  challenges: Challenge[];
}

// Stylowany komponent List
const StyledList = styled(List)`
  border-radius: 8px;
  padding: 16px;
`;

// Stylowany komponent ListItem
const StyledListItem = styled(ListItem)`
  &:hover {
    background-color: #d0d0d0;
  }
`;

// Stylowany komponent ListItemText
const StyledListItemText = styled(ListItemText)`
  .MuiListItemText-primary {
    ${bodyMixin}
  }
`;

const ChallengesList: React.FC<ListProps> = ({ challenges }) => {
  return (
    <StyledList>
      <Title>
        Wyzwania
      </Title>
      {challenges.map(challenge => (
        <Button key={challenge.id} component={Link} to={`/challenge/${challenge.id}`} color="inherit">
          <StyledListItem>
            <StyledListItemText primary={challenge.name} />
          </StyledListItem>
        </Button>
      ))}
    </StyledList>
  );
};

export default ChallengesList;
