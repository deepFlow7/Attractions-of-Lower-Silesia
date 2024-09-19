/** @jsxImportSource @emotion/react */
import styled from '@emotion/styled';
import { CardContent, List, ListItem } from '@mui/material';
import React from 'react';
import { ContrastProps, useColors } from '../Providers/Colors'; // Importuj useColors
import { shadows } from '../Styles/Themes';
import { Body, Title } from '../Styles/Typography';
import { Attraction } from '../types';

interface AttractionInfoProps {
  attraction: Attraction;
}

const Info = styled.div<ContrastProps>`
  display: grid;
  gap: 1rem;
  & > * {
    background-color: ${props => props.colors.primary};
    box-shadow: ${shadows.default};
  }
`;

const AttractionInfo: React.FC<AttractionInfoProps> = ({ attraction }) => {
  const { colors } = useColors(); // Pobierz colors z kontekstu

  const { type, subtype, description, interactivity, timeItTakes, rating } = attraction;

  return (
    <Info colors={colors}>
      <CardContent>
        <Title colors={colors} small>Opis</Title>
        <Body colors={colors} >{description}</Body>
      </CardContent>
      <CardContent>
        <Title colors={colors} small>Typy i Podtypy</Title>
        <Body colors={colors} >Typ: {type}</Body>
        <Body colors={colors} >Podtyp: {subtype}</Body>
      </CardContent>
      <CardContent>
        <Title colors={colors} small>Statystyki</Title>
        <List>
          <ListItem>
            <Body colors={colors} >Interaktywność: {interactivity}/10</Body>
          </ListItem>
          <ListItem>
            <Body colors={colors} >Czas zwiedzania: {timeItTakes} minut</Body>
          </ListItem>
          <ListItem>
            <Body colors={colors} >Ocena: {rating ? rating.toFixed(1) : 'Brak oceny'}</Body>
          </ListItem>
        </List>
      </CardContent>
    </Info>
  );
};

export default AttractionInfo;
