/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import React, { useState, useEffect } from 'react';
import { Photo } from '../types';
import { Grid, Typography, Card, CardContent, List, ListItem, ListItemText, Button } from '@mui/material';


interface PhotoProps {
  photos: Photo[];
  title: string;
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

const Photos: React.FC<PhotoProps> = ({ photos, title}) => {
    const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
 
    const handleNextPhoto = (photos: Photo[]) => {
      setCurrentPhotoIndex((prevIndex) => (prevIndex + 1) % photos.length);
    };
  
    const handlePreviousPhoto = (photos: Photo[]) => {
      setCurrentPhotoIndex((prevIndex) => (prevIndex - 1 + photos.length) % photos.length);
    };

  return (
    <TileCard>
    <CardContent>
      <Grid item xs={12}>
        <Title variant="h4" gutterBottom>{title}</Title>
      </Grid>
      <Grid container spacing={2}>
        <Grid item xs={12} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
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
  );
};

export default Photos;
