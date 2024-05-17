/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import React from 'react';
import { List, ListItem, ListItemText, Typography } from '@mui/material';
import { Attraction } from '../types'; // Importujemy interfejs Attraction

interface ListProps {
  items: Attraction[]; // Zmiana typu listy na Attraction[]
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

const AttractionsList: React.FC<ListProps> = ({ items }) => {
  return (
    <StyledList>
      <Title variant="h5">Lista Atrakcji</Title>
      {items.map((attraction, index) => (
        <StyledListItem key={index}>
          <ListItemText primary={attraction.name} />
        </StyledListItem>
      ))}
    </StyledList>
  );
};

export default AttractionsList;
