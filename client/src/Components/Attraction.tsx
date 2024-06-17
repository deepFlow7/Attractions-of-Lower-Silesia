/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Grid, Typography, Card, CardContent, List, ListItem, ListItemText, Button } from '@mui/material';
import { Attraction, Comment, Photo } from '../types';
import Comments from './Comments';
import Photos from './Photos';
import AttractionInfo from './AttractionInfo';

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

  const { id } = useParams();


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
          <Photos 
            photos={photos} title={name}>
          </Photos>
          </Grid>
          <Grid item xs={12} md={4}>
            <AttractionInfo
            attraction={attraction}>
            </AttractionInfo>
            <Grid item xs={12}>
              <Comments 
              comments={comments}>
              </Comments>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AttractionView;
