import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Grid, Typography, Card, Button } from '@mui/material';
import { Attraction, Comment } from '../types';
import Comments from './Comments';
import Photos from './Photos';
import AttractionInfo from './AttractionInfo';
import styled from '@emotion/styled';
import { useAuth } from '../Providers/AuthContext';

interface AttractionViewProps {
  attraction: Attraction;
  comments: Comment[];
  is_visited: boolean;
  is_favourite: boolean;
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

const primaryColor = '#757575';
const defaultColor = '#1976d2';

const AttractionView: React.FC<AttractionViewProps> = ({ is_visited, is_favourite }) => {
  const [attr_info, setAttractionInfo] = useState<AttractionViewProps | null>(null);
  const [visited, setVisited] = useState(is_visited);
  const [favourite, setFavourite] = useState(is_favourite);
  const { user } = useAuth();
  const { id } = useParams();

  useEffect(() => {
    axios.get('/api/attraction/' + id)
      .then(response => {
        setAttractionInfo(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the data!', error);
      });
  }, [id]);

  const handleFavouriteToggle = async () => {
    try {
      await axios.post(`/api/changeFavourites`, { userId: user?.id, attractionId: id });
      setFavourite(!favourite);
    } catch (error) {
      console.error('Error updating favourite status:', error);
    }
  };

  const handleVisitedToggle = async () => {
    try {
      await axios.post(`/api/changeWantsToVisit`, { userId: user?.id, attractionId: id });
      setVisited(!visited);
    } catch (error) {
      console.error('Error updating visited status:', error);
    }
  };

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
            <Photos photos={photos} title={name} />
          </Grid>
          <Grid item xs={12} md={4}>
            <Button
              variant="contained"
              sx={{
                bgcolor: favourite ? primaryColor : defaultColor,
                marginTop: '10px',
                marginBottom: '10px',
              }}
              onClick={handleFavouriteToggle}
            >
              {favourite ? 'Ulubione' : 'Dodaj do ulubionych'}
            </Button>
            <Button
              variant="contained"
              sx={{
                bgcolor: visited ? primaryColor : defaultColor,
                marginTop: '10px',
                marginBottom: '10px',
              }}
              onClick={handleVisitedToggle}
            >
              {visited ? 'Odwiedzone' : 'Dodaj do odwiedzonych'}
            </Button>
            <AttractionInfo attraction={attraction} />
            <Grid item xs={12}>
              <Comments comments={comments} attraction_id={attraction.id} />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AttractionView;
