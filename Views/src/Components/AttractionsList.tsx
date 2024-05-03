import React from 'react';
import { List, ListItem, ListItemText } from '@mui/material';

interface ListProps {
  items: string[];
}

const AttractionsList: React.FC<ListProps> = ({ items }) => {
  return (
    <List>
      {items.map((item, index) => (
        <ListItem key={index}>
          <ListItemText primary={item} />
        </ListItem>
      ))}
    </List>
  );
};

export default AttractionsList;
