/** @jsxImportSource @emotion/react */
import styled from "@emotion/styled";
import React from "react";
import {
  Button,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";
import { possible_type, Attraction } from "../types"; // Importujemy interfejs Attraction

interface ListProps {
  attractions: Attraction[];
  type_filter?: possible_type[];
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

const AttractionsList: React.FC<ListProps> = ({ attractions }) => {
  return (
    <StyledList>
      <Title variant="h5">Atrakcje</Title>
      {attractions
        .map((attraction) => (
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
        ))}
    </StyledList>
  );
};

export default AttractionsList;