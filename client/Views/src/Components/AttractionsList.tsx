import React from 'react';
import { List, ListItem, ListItemText } from '@mui/material';
import { Attraction } from '../types'; // Importujemy interfejs Attraction

interface ListProps {
  items: Attraction[]; // Zmiana typu listy na Attraction[]
}

const AttractionsList: React.FC<ListProps> = ({ items }) => {
  return (
    <List>
      Lista Atrakcji
      {items.map((attraction, index) => (
        <ListItem key={index}>
          {/* Wyświetlamy nazwę atrakcji */}
          <ListItemText primary={attraction.name} />
        </ListItem>
      ))}
    </List>
  );
};

export default AttractionsList;
