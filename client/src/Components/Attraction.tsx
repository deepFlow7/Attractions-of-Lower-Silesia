import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styled from '@emotion/styled';
import { Grid, Button, Card, CardContent, Typography, Rating } from '@mui/material';

import Comments from './Comments';
import Photos from './Photos';
import AttractionInfo from './AttractionInfo';
import { useAuth } from '../Providers/AuthContext';
import api from '../API/api';
import { AttractionWithComments, Comment } from '../types';
import { colors, shadows } from '../Styles/Themes';
import { ViewContainer } from '../Styles/View';

export const PhotoContainer = styled.div`
  width: 60vw;
  background-color: ${colors.primary};
  box-shadow: ${shadows.default};
  @media (max-width: 920px) {
    width: 100%;
  }
`;

export const InfoContainer = styled.div`
  width: 37vw;
  background-color: ${colors.primary};
  box-shadow: ${shadows.default};
  display: flex;
  flex-direction: column;
  gap: 1rem;
  @media (max-width: 1630px) {
    width: 31%;
  }
  @media (max-width: 920px) {
    width: 100%;
  }
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

const AttractionView: React.FC = () => {
  const [attractionInfo, setAttractionInfo] = useState<AttractionWithComments | null>(null);
  const [toVisit, setToVisit] = useState(false);
  const [isFavourite, setIsFavourite] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [savedUserRating, setSavedUserRating] = useState(0);
  const { user, isBlocked, role, isAuthenticated } = useAuth();
  const [refreshKey, setRefreshKey] = useState(1);
  const { id } = useParams();

  useEffect(() => {
    if (isAuthenticated && role === 'user') {
      api.get(`/api/attraction/is_favourite/${id}/${user!.id}`)
        .then(response => {
          setIsFavourite(response.data.favourite);
        })
        .catch(error => {
          console.error('There was an error fetching the data!', error);
        });

      api.get(`/api/attraction/is_to_visit/${id}/${user!.id}`)
        .then(response => {
          setToVisit(response.data.to_visit);
        })
        .catch(error => {
          console.error('There was an error fetching the data!', error);
        });

      api.get(`/api/attraction/rating/${id}/${user!.id}`)
        .then(response => {
          setUserRating(response.data.rating);
          setSavedUserRating(response.data.rating);
        })
        .catch(error => {
          console.error('There was an error fetching the data!', error);
        });
    }

    api.get(`/api/attraction/${id}`)
      .then(response => {
        setAttractionInfo(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the data!', error);
      });
  }, [id]);

  const handleFavouriteToggle = async () => {
    try {
      await api.post('/api/changeFavourites', { userId: user?.id, attractionId: id });
      setIsFavourite(prev => !prev);
    } catch (error) {
      console.error('Error updating favourite status:', error);
    }
  };

  const handleToVisitToggle = async () => {
    try {
      await api.post('/api/changeWantsToVisit', { userId: user?.id, attractionId: id });
      setToVisit(prev => !prev);
    } catch (error) {
      console.error('Error updating to_visit status:', error);
    }
  };

  const addComment = (newComment: Comment) => {
    setAttractionInfo(prevState => {
      if (!prevState) return null;

      return {
        attraction: prevState.attraction,
        comments: [...prevState.comments, newComment]
      };
    });
  };

  const handleAddRating = async (newRating: number | null) => {
    if (isBlocked) {
      alert('Twoje konto jest zablokowane, nie możesz wystawiać ani zmieniać ocen.');
      setUserRating(savedUserRating);
      setRefreshKey(prev => prev + 1);
      return;
    }
    if (newRating) {
      try {
        setUserRating(newRating);
        await api.post('/api/changeRating', { userId: user?.id, attractionId: id, rating: newRating });

        const response = await api.get(`/api/attraction/rating/${id}`);
        setAttractionInfo(prevInfo => ({
          ...prevInfo!,
          attraction: {
            ...prevInfo!.attraction,
            rating: response.data.rating
          }
        }));
        setSavedUserRating(newRating);
      } catch (error) {
        console.error('Error updating rating:', error);
        setUserRating(savedUserRating);
      }
    }
  };

  if (!attractionInfo) {
    return <div>Loading...</div>;
  }

  const { attraction, comments } = attractionInfo;
  const { name, photos } = attraction;

  return (
    <ViewContainer>
      <PhotoContainer>
        <Photos photos={photos} title={name} displayButton={photos.length > 1}/>
      </PhotoContainer>
      <InfoContainer>
        {isAuthenticated && role === 'user' && (
          <>
            <Button
              variant="contained"
              sx={{
                bgcolor: isFavourite ? primaryColor : defaultColor,
                marginTop: '10px',
                marginBottom: '10px',
              }}
              onClick={handleFavouriteToggle}
            >
              {isFavourite ? 'Ulubione' : 'Dodaj do ulubionych'}
            </Button>
            <Button
              variant="contained"
              sx={{
                bgcolor: toVisit ? primaryColor : defaultColor,
                marginTop: '10px',
                marginBottom: '10px',
              }}
              onClick={handleToVisitToggle}
            >
              {toVisit ? 'Do odwiedzenia' : 'Dodaj na listę do odwiedzenia'}
            </Button>
          </>
        )}
        <AttractionInfo attraction={attraction} />
        {isAuthenticated && role === 'user' && (
          <TileCard>
            <CardContent>
              <Title variant="h5" gutterBottom>
                Twoja ocena
              </Title>
              <Rating
                key={refreshKey}
                name="user-rating"
                value={userRating}
                onChange={(event, newValue) => handleAddRating(newValue)}
                max={10}
              />
            </CardContent>
          </TileCard>
        )}
        <Grid item xs={12}>
          <Comments comments={comments} attractionId={attraction.id} addComment={addComment} />
        </Grid>
      </InfoContainer>
    </ViewContainer>
  );
};

export default AttractionView;
