/** @jsxImportSource @emotion/react */
import styled from '@emotion/styled';
import React, { useState, useEffect } from 'react';
import { Photo } from '../types';
import { Grid, Card, CardContent, Button } from '@mui/material';
import { Title, Body} from '../Styles/Typography';
import { StyledButton } from '../Styles/Button';

interface PhotoProps {
  photos: Photo[];
  title: string;
}

const Photos: React.FC<PhotoProps> = ({ photos, title }) => {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  const handleNextPhoto = (photos: Photo[]) => {
    setCurrentPhotoIndex((prevIndex) => (prevIndex + 1) % photos.length);
  };

  const handlePreviousPhoto = (photos: Photo[]) => {
    setCurrentPhotoIndex((prevIndex) => (prevIndex - 1 + photos.length) % photos.length);
  };

  return (
    <CardContent>
      <Grid item xs={12}>
        <Title small>{title}</Title>
      </Grid>
      <Grid container spacing={2}>
        <Grid item xs={12} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {photos.length > 0 && (
            <>
              <img src={photos[currentPhotoIndex].photo} alt={`Photo ${currentPhotoIndex + 1}`} style={{ maxWidth: '100%', height: 'auto' }} />
              <Body>{photos[currentPhotoIndex].caption}</Body>
            </>
          )}
        </Grid>
        <Grid item xs={6}>
        <StyledButton>

          <Button onClick={() => handlePreviousPhoto(photos)} variant="contained" color="primary" fullWidth>Poprzednie</Button>
          </StyledButton>
      
        </Grid>
        <Grid item xs={6}>
          <StyledButton>
            <Button onClick={() => handleNextPhoto(photos)} variant="contained" color="primary" fullWidth>Następne</Button>
          </StyledButton>
        </Grid>
      </Grid>
    </CardContent>
  );
};

export default Photos;
