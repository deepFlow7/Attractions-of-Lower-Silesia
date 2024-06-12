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

const AddAttractionButton = styled(Button)`
  && {
    background-color: #42a5f5;
    color: white;
    border-radius: 4px;
    margin-top: 16px;
    &:hover {
      background-color: #1976d2;
    }
  }
`;

const AttractionsList: React.FC<ListProps> = ({ attractions, type_filter }) => {
  return (
    <StyledList>
      <Title variant="h5">Lista Atrakcji</Title>
      {attractions
        .filter((attraction) => true)
        .map((attraction) => (
          <Button
            component={Link}
            to={"/attraction/" + attraction.id}
            color="inherit"
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
