import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Grid, Button } from '@mui/material';
import { Attraction, Comment } from '../types';
import Comments from './Comments';
import Photos from './Photos';
import AttractionInfo from './AttractionInfo';
import styled from '@emotion/styled';
import { useAuth } from '../Providers/AuthContext';
import api from '../API/api';
import { colors, sizes, shadows } from '../Styles/Themes';
import { ViewContainer } from '../Styles/View';
interface AttractionWithComments {
  attraction: Attraction;
  comments: Comment[];
}

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


const primaryColor = '#757575';
const defaultColor = '#1976d2';

const AttractionView = () => {
  const [attr_info, setAttractionInfo] = useState<AttractionWithComments | null>(null);
  const [to_visit, setToVisit] = useState(false);
  const [favourite, setFavourite] = useState(false);
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

  if (!attr_info) {
    return <div>Loading...</div>;
  }

  const { attraction, comments } = attr_info;
  const { name, photos, type, subtype, description, interactivity, time_it_takes, rating } = attraction;

  return (
    <ViewContainer>
          <PhotoContainer>
          <Photos photos={photos} title={name} />
        </PhotoContainer>
          <InfoContainer>
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
            <div>
              <Comments comments={comments} attraction_id={attraction.id} addComment={addComment}/>
            </div>
          </InfoContainer>
    </ViewContainer>
  );
};

export default AttractionView;
