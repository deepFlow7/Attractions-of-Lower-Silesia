import React from 'react';
/** @jsxImportSource @emotion/react */
import styled from '@emotion/styled';
import { Typography, Card, CardContent, List, ListItemText, ListItem } from '@mui/material';
import { Attraction } from '../types';

interface AttractionInfoProps {
  attraction: Attraction;
}


const TileCard = styled(Card)`
  margin: 1%;
  margin-top: 5%;
`;

const AttractionInfo: React.FC<AttractionInfoProps> = ({ attraction }) => {
const { type, subtype, description, interactivity, time_it_takes, rating } = attraction;


  return ( <>
    <TileCard>
    <CardContent>
      <Typography variant="h5" gutterBottom>Opis</Typography>
      <Typography variant="body1">{description}</Typography>
    </CardContent>
  </TileCard>
  <TileCard>
    <CardContent>
      <Typography variant="h5" gutterBottom>Typy i Podtypy</Typography>
      <Typography variant="body1">Typ: {type}</Typography>
      <Typography variant="body1">Podtyp: {subtype}</Typography>
    </CardContent>
  </TileCard>
  <TileCard>
    <CardContent>
      <Typography variant="h5" gutterBottom>Statystyki</Typography>
      <List>
        <ListItem>
          <ListItemText primary={`Interaktywność: ${interactivity}/10`} />
        </ListItem>
        <ListItem>
          <ListItemText primary={`Czas zwiedzania: ${time_it_takes} minut`} />
        </ListItem>
        <ListItem>
          <ListItemText primary={`Ocena: ${rating ? rating.toFixed(1) : 'Brak oceny'}`} />
        </ListItem>
      </List>
    </CardContent>
  </TileCard>
  </>
  );
};

export default AttractionInfo;
