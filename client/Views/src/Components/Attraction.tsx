import React from 'react';
import { Grid, Typography, Card, CardContent, List, ListItem, ListItemText } from '@mui/material';
import { Attraction, Comment } from '../types';

interface AttractionViewProps {
  attraction: Attraction;
  comments: Comment[];
}

const AttractionView: React.FC<AttractionViewProps> = ({ attraction, comments }) => {
  const { name, photos, type, subtype, description, interactivity, time_it_takes, rating } = attraction;

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h4" gutterBottom>{name}</Typography>
      </Grid>
      
      <Grid item xs={12}>
        <Typography variant="h5" gutterBottom>Zdjęcia</Typography>
        <Grid container spacing={2}>
          {photos.map((photo, index) => (
            <Grid item key={index}>
              <img src={photo.photo} alt={`Photo ${index + 1}`} style={{ maxWidth: '100%', height: 'auto' }} />
              <Typography variant="caption">{photo.caption}</Typography>
            </Grid>
          ))}
        </Grid>
      </Grid>

      <Grid item xs={12}>
        <Typography variant="h5" gutterBottom>Typy i Podtypy</Typography>
        <Typography variant="body1">Typ: {type}</Typography>
        <Typography variant="body1">Podtyp: {subtype}</Typography>
      </Grid>

      <Grid item xs={12}>
        <Typography variant="h5" gutterBottom>Opis</Typography>
        <Typography variant="body1">{description}</Typography>
      </Grid>

      <Grid item xs={12}>
        <Typography variant="h5" gutterBottom>Statystyki</Typography>
        <Card>
          <CardContent>
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
        </Card>
      </Grid>

      <Grid item xs={12}>
        <Typography variant="h5" gutterBottom>Komentarze</Typography>
        <List>
          {comments.map(comment => (
            <ListItem key={comment.id}>
              <ListItemText primary={comment.content} secondary={`Autor: ${comment.author}`} />
            </ListItem>
          ))}
        </List>
      </Grid>
    </Grid>
  );
};

export default AttractionView;
