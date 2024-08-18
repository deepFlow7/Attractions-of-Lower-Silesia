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
import { Challenge } from "../types"; // Importujemy interfejs Attraction
import { Title } from "../Styles/Typography";
interface ListProps {
  challenges: Challenge[];
}

const StyledList = styled(List)`
  border-radius: 8px;
  padding: 16px;
`;



const ChallengesList: React.FC<ListProps> = ({ challenges }) => {
  return (
    <StyledList>
      <Title>
        Wyzwania
      </Title>
        <List>
          {challenges.map(challenge => (
              <Button key={challenge.id+1} component={Link} to={'/challenge/'+challenge.id} color="inherit">
                  <ListItem key={challenge.id+1}>
                      <ListItemText primary={challenge.name} />
                  </ListItem>
              </Button>
          ))}
        </List>
    </StyledList>
  );
};

export default ChallengesList;