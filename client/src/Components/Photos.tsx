/** @jsxImportSource @emotion/react */
import React, { useState } from 'react';
import { Grid, CardContent } from '@mui/material';
import { Photo } from '../types';
import { Title, Body } from '../Styles/Typography';
import { StyledButton } from '../Styles/Button';
import styled from '@emotion/styled';
import { useColors, ContrastProps } from '../Providers/Colors'; 

interface PhotoProps {
  photos: Photo[];
  title: string;
  displayButton: boolean;
}
interface ButtonContainerProps {
  display: boolean;
}
const ButtonContainer = styled.div<ButtonContainerProps>`
  display: ${props => (props.display ? 'inline-block' : 'none')};
  
`;
const Photos: React.FC<PhotoProps> = ({ photos, title, displayButton = true }) => {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  const handleNextPhoto = () => {
    setCurrentPhotoIndex((prevIndex) => (prevIndex + 1) % photos.length);
  };

  const handlePreviousPhoto = () => {
    setCurrentPhotoIndex((prevIndex) => (prevIndex - 1 + photos.length) % photos.length);
  };
  const { toggleTheme, colors } = useColors();


  return (
    <CardContent>
      <Grid item xs={12}>
        <Title  colors={colors}small>{title}</Title>
      </Grid>
      <Grid container spacing={2}>
        <Grid item xs={12} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {photos.length > 0 && (
            <>
              <img
                src={photos[currentPhotoIndex].photo}
                alt={`Photo ${currentPhotoIndex + 1}`}
                style={{ maxWidth: '100%', height: 'auto' }}
              />
              <Body colors={colors}>{photos[currentPhotoIndex].caption}</Body>
            </>
          )}
        </Grid>
        <ButtonContainer display={displayButton}>
            <StyledButton colors={colors} onClick={handlePreviousPhoto} >
              Poprzednie
            </StyledButton>
            <StyledButton colors={colors}  onClick={handleNextPhoto}>
              Następne
            </StyledButton>
        </ButtonContainer>
      </Grid>
    </CardContent>
  );
};

export default Photos;
