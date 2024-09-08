import React from 'react';
/** @jsxImportSource @emotion/react */
import styled from '@emotion/styled';
import { Card, CardContent, List, ListItemText, ListItem } from '@mui/material';
import { Attraction } from '../types';
import { colors, shadows } from '../Styles/Themes';
import { Title, Body } from '../Styles/Typography';

interface AttractionInfoProps {
  attraction: Attraction;
}

export const Info = styled.div`
  display: grid;
  gap: 1rem;
  background-color: ${colors.dark};
  & > * {
    background-color: ${colors.primary};
    box-shadow: ${shadows.default};
  }
`;

const AttractionInfo: React.FC<AttractionInfoProps> = ({ attraction }) => {
  const { type, subtype, description, interactivity, time_it_takes, rating } = attraction;
  return (
    <Info>
      <CardContent>
        <Title small>Opis</Title>
        <Body>{description}</Body>
      </CardContent>
      <CardContent>
        <Title small>Typy i Podtypy</Title>
        <Body>Typ: {type}</Body>
        <Body>Podtyp: {subtype}</Body>
      </CardContent>
      <CardContent>
        <Title small>Statystyki</Title>
        <List>
          <ListItem>
            <Body>{`Interaktywność: ${interactivity}/10`} </Body>
          </ListItem>
          <ListItem>
            <Body>{`Czas zwiedzania: ${time_it_takes} minut`} </Body>
          </ListItem>
          <ListItem>
            <Body>{`Ocena: ${rating ? rating.toFixed(1) : 'Brak oceny'}`} </Body>
          </ListItem>
        </List>
      </CardContent>
    </Info>
  );
};

export default AttractionInfo;
