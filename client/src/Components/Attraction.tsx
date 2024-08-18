import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Grid, Button, Card, CardContent, Typography, Rating } from '@mui/material';
import { Attraction, Comment } from '../types';
import Comments from './Comments';
import Photos from './Photos';
import AttractionInfo from './AttractionInfo';
import styled from '@emotion/styled';
import { useAuth } from '../Providers/AuthContext';
import api from '../API/api';
import { AttractionWithComments } from '../types';

const Container = styled.div`
  margin: 1.5% 1.5%;
`;

const TileCard = styled(Card)`
  margin: 1%;
  margin-top: 5%;
`;

const Title = styled(Typography)`
  text-align: center;
`;

const primaryColor = '#757575';
const defaultColor = '#1976d2';

const AttractionView = () => {
  const [attr_info, setAttractionInfo] = useState<AttractionWithComments | null>(null);
  const [to_visit, setToVisit] = useState(false);
  const [favourite, setFavourite] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const { user, role, isAuthenticated } = useAuth();
  const { id } = useParams();

  useEffect(() => {
    if (isAuthenticated && role == "user"){
      api.get('/api/attraction/is_favourite/' + id + '/' + user!.id)
      .then(response => {
        setFavourite(response.data.favourite);
      })
      .catch(error => {
        console.error('There was an error fetching the data!', error);
      });

      api.get('/api/attraction/is_to_visit/' + id + '/' + user!.id)
      .then(response => {
        setToVisit(response.data.to_visit);
      })
      .catch(error => {
        console.error('There was an error fetching the data!', error);
      });

      api.get('/api/attraction/rating/' + id + '/' + user!.id)
      .then(response => {
        setUserRating(response.data.rating);
      })
      .catch(error => {
        console.error('There was an error fetching the data!', error);
      });
    }

    api.get('/api/attraction/' + id)
    .then(response => {
      setAttractionInfo(response.data);
    })
    .catch(error => {
      console.error('There was an error fetching the data!', error);
    });
  }, [id]);

  const handleFavouriteToggle = async () => {
    try {
      await api.post(`/api/changeFavourites`, { userId: user?.id, attractionId: id });
      setFavourite(!favourite);
    } catch (error) {
      console.error('Error updating favourite status:', error);
    }
  };

  const handleToVisitToggle = async () => {
    try {
      await api.post(`/api/changeWantsToVisit`, { userId: user?.id, attractionId: id });
      setToVisit(!to_visit);
    } catch (error) {
      console.error('Error updating to_visit status:', error);
    }
  };

  const addComment = (new_comment : Comment) => {
    setAttractionInfo((prevState) => {
      if (!prevState) return null;
  
      return {
        attraction: prevState.attraction,
        comments: [...prevState.comments, new_comment]
      };
  })};

  const handleAddRating = async (newRating : number|null) => {
    if (newRating) {
      try {
        setUserRating(newRating);
        await api.post(`/api/changeRating`, { userId: user?.id, attractionId: id, rating: newRating });

        await api.get('/api/attraction/rating/' + id)
        .then(response => {
          setAttractionInfo(prevInfo => ({
            ...prevInfo!, 
            attraction : {
             ...prevInfo!.attraction,
              rating: response.data.rating
            }
          }));
        })
      } catch (error) {
        console.error('Error updating rating:', error);
      }
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
            {isAuthenticated && role == "user" && (
              <>
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
                bgcolor: to_visit ? primaryColor : defaultColor,
                marginTop: '10px',
                marginBottom: '10px',
              }}
              onClick={handleToVisitToggle}
            >
              {to_visit ? 'Do odwiedzenia' : 'Dodaj na listę do odwiedzenia'}
            </Button>
            </>)}
            <AttractionInfo attraction={attraction} />
            {isAuthenticated && role == "user" && (
              <TileCard>
              <CardContent>
                <Title 
                  variant="h5" 
                  gutterBottom>Twoja ocena
                </Title>
                <Rating
                  name="user-rating"
                  value={userRating}
                  onChange={(event, newValue) => handleAddRating(newValue)}
                  max={10} 
                />
              </CardContent>
            </TileCard>
            )}
            <Grid item xs={12} >
              <Comments comments={comments} attraction_id={attraction.id} addComment={addComment}/>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AttractionView;
