/** @jsxImportSource @emotion/react */
import styled from "@emotion/styled";
import React from "react";
import {
  Button,
  List,
  ListItem,
  ListItemText,
  Typography,
  Grid,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { possible_type, Attraction, ChallengeAttraction } from "../types"; // Importujemy interfejs Attraction
import { Link } from "react-router-dom";

interface ListProps {
  attractions: (Attraction | ChallengeAttraction)[];
  type_filter?: possible_type[];
  onClick?: () => void;
  showVisitButtons?: boolean;
}

const StyledList = styled(List)`
  border-radius: 8px;
  padding: 16px;
`;

const StyledListItem = styled(ListItem)`
  &:nth-of-type(odd) {
  }
  &:hover {
    background-color: #d0d0d0;
  }
`;

const Title = styled(Typography)`
  font-weight: bold;
`;

const Container = styled(Grid)`
`;

const VisitButton = styled(Button)`
  && {
    background-color: #42a5f5;
    color: white;
    border-radius: 4px;
    margin-left: 16px;
    &:hover {
      background-color: #1976d2;
    }
  }
`;


const AttractionsList: React.FC<ListProps> = ({ attractions, type_filter, onClick, showVisitButtons }) => {
  return (
    <StyledList>
      <Title variant="h5">Lista Atrakcji</Title>
      <Container>
      {attractions
        .filter((attraction) => true)
        .map((attraction) => (
          <Grid item xs={12} key={attraction.id}>
          <Button
            component={Link}
            to={"/attraction/" + attraction.id}
            color="inherit"
            key={attraction.id}
          >
            <StyledListItem key={attraction.id}>
              <ListItemText primary={attraction.name} />
            </StyledListItem>
          </Button>
           {showVisitButtons && (
            <VisitButton
              onClick={onClick}>
              Odwiedź
            </VisitButton>
          )}
          </Grid>
        ))}
    </Container>
    </StyledList>
  );
};

export default AttractionsList;
