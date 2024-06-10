/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Grid, Typography, Card, CardContent, List, ListItem, ListItemText, Button } from '@mui/material';
import { Attraction, Comment, Photo } from '../types';

interface AttractionViewProps {
  attraction: Attraction;
  comments: Comment[];
}

const TileCard = styled(Card)`
  margin: 1%;
  margin-top: 5%;
`;

const Title = styled(Typography)`
  text-align: center;
`;

const Container = styled.div`
  margin: 1.5% 1.5%;
`;

const AttractionView: React.FC = () => {
  const [attr_info, setAttractionInfo] = useState<AttractionViewProps | null>(null);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  const { id } = useParams();

  const handleNextPhoto = (photos: Photo[]) => {
    setCurrentPhotoIndex((prevIndex) => (prevIndex + 1) % photos.length);
  };

  const handlePreviousPhoto = (photos: Photo[]) => {
    setCurrentPhotoIndex((prevIndex) => (prevIndex - 1 + photos.length) % photos.length);
  };

  useEffect(() => {
    axios.get('/api/attraction/' + id)
      .then(response => {
        setAttractionInfo(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the data!', error);
      });
  }, []);

  if (!attr_info) {
    return <div>Loading...</div>;
  }
  const { attraction, comments } = attr_info;

  const { name, photos, type, subtype, description, interactivity, time_it_takes, rating } = attraction;




  return (
    <Container>
      <Grid container spacing={2}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={8}>
            <TileCard>
              <CardContent>
                <Grid item xs={12}>
                  <Title variant="h4" gutterBottom>{name}</Title>
                </Grid>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <img src={photos[currentPhotoIndex].photo} alt={`Photo ${currentPhotoIndex + 1}`} style={{ maxWidth: '100%', height: 'auto' }} />
                    <Typography variant="caption">{photos[currentPhotoIndex].caption}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Button onClick={() => handlePreviousPhoto(photos)} variant="contained" color="primary" fullWidth>Poprzednie</Button>
                  </Grid>
                  <Grid item xs={6}>
                    <Button onClick={() => handleNextPhoto(photos)} variant="contained" color="primary" fullWidth>Następne</Button>
                  </Grid>
                </Grid>
              </CardContent>
            </TileCard>
          </Grid>

      

          <Grid item xs={12} md={4}>
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
            <Grid item xs={12}>
              <TileCard>
                <CardContent>
                  <Typography variant="h5" gutterBottom>Komentarze</Typography>
                  <List>
                    {comments.map(comment => (
                      <ListItem key={comment.id}>
                        <ListItemText primary={comment.content} secondary={`Autor: ${comment.author}`} />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </TileCard>
            </Grid>
          </Grid>
        </Grid>

        {/* Komentarze */}

      </Grid>
    </Container>
  );
};

export default AttractionView;
