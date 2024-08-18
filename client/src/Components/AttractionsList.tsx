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
import { possible_type, Attraction } from "../types"; // Importujemy interfejs Attraction
import { Title, Body } from '../Styles/Typography';
import { bodyMixin } from "../Styles/Typography";

interface ListProps {
  attractions: Attraction[];
  type_filter?: possible_type[];
}

const StyledList = styled(List)`
  border-radius: 8px;
  padding: 16px;
`;

const StyledListItem = styled(ListItem)`
  &:hover {
    background-color: #d0d0d0;
  }
`;

const StyledListItemText = styled(ListItemText)`
  .MuiListItemText-primary {
    ${bodyMixin}
  }
`;

const AttractionsList: React.FC<ListProps> = ({ attractions }) => {
  return (
    <StyledList>
      <Title>Atrakcje</Title>
      {attractions.map((attraction) => (
        <Button
          component={Link}
          to={"/attraction/" + attraction.id}
          color="inherit"
          key={attraction.id}
        >
          <StyledListItem>
            <StyledListItemText primary={attraction.name} />
          </StyledListItem>
        </Button>
      ))}
    </StyledList>
  );
};

export default AttractionsList;
