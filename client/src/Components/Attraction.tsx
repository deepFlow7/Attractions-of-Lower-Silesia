import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styled from '@emotion/styled';
import { Grid, Button, Card, CardContent, Typography, Rating } from '@mui/material';
import { Title } from '../Styles/Typography';
import Comments from './Comments';
import Photos from './Photos';
import AttractionInfo from './AttractionInfo';
import { useAuth } from '../Providers/AuthContext';
import api from '../API/api';
import { AttractionWithComments, Comment } from '../types';
import { shadows } from '../Styles/Themes';
import {AttractionContainer } from '../Styles/View';
import { StyledButton } from '../Styles/Button';
import { useColors, ContrastProps } from '../Providers/Colors'; 

export const PhotoContainer = styled.div<ContrastProps>`
  background-color: ${props => props.colors.primary}; 
  box-shadow: ${shadows.default};
  align-self: start;
`;

export const InfoContainer = styled.div`
  box-shadow: ${shadows.default};
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const TileCard = styled(Card)<ContrastProps>`
background-color: ${props => props.colors.primary};
`;


const AttractionView: React.FC = () => {
  const [attractionInfo, setAttractionInfo] = useState<AttractionWithComments | null>(null);
  const [toVisit, setToVisit] = useState(false);
  const [isFavourite, setIsFavourite] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [savedUserRating, setSavedUserRating] = useState(0);
  const { isBlocked, role, isAuthenticated } = useAuth();
  const [refreshKey, setRefreshKey] = useState(1);
  const { attractionId } = useParams();
  const { toggleTheme, colors } = useColors();

  useEffect(() => {
    if (isAuthenticated && role === 'user') {
      api.get(`/api/attractions/${attractionId}/isFavourite`)
        .then(response => {
          setIsFavourite(response.data.favourite);
        })
        .catch(error => {
          console.error('There was an error fetching the data!', error);
        });

      api.get(`/api/attractions/${attractionId}/toVisit`)
        .then(response => {
          setToVisit(response.data.toVisit);
        })
        .catch(error => {
          console.error('There was an error fetching the data!', error);
        });

      api.get(`/api/attractions/${attractionId}/rating`)
        .then(response => {
          setUserRating(response.data.rating);
          setSavedUserRating(response.data.rating);
        })
        .catch(error => {
          console.error('There was an error fetching the data!', error);
        });
    }

    api.get(`/api/attractions/${attractionId}`)
      .then(response => {
        setAttractionInfo(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the data!', error);
      });
  }, [attractionId]);

  const handleFavouriteToggle = async () => {
    try {
      await api.post(`/api/attractions/${attractionId}/changeFavourite`);
      setIsFavourite(prev => !prev);
    } catch (error) {
      console.error('Error updating favourite status:', error);
    }
  };

  const handleToVisitToggle = async () => {
    try {
      await api.post(`/api/attractions/${attractionId}/changeToVisit`);
      setToVisit(prev => !prev);
    } catch (error) {
      console.error('Error updating to visit status:', error);
    }
  };

  const addComment = (newComment: Comment) => {
    setAttractionInfo(prevState => {
      if (!prevState) return null;
      return {
        attraction: prevState.attraction,
        comments: [...prevState.comments, newComment]
      };
    })
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
        await api.post(`/api/attractions/${attractionId}/changeRating`, { newRating });

        await api.get(`/api/attractions/${attractionId}/rating/`)
          .then(response => {
            setAttractionInfo(prevInfo => ({
              ...prevInfo!,
              attraction: {
                ...prevInfo!.attraction,
                rating: response.data.rating
              }
            }));
            setSavedUserRating(newRating);
          })
      } catch (error) {
        console.error('Error updating rating:', error);
        setUserRating(savedUserRating);
      }
    }
  };

  const onApprove = async (commentId: number) => {
    try {
      await api.post(`/api/comments/${commentId}/approve`);
      setAttractionInfo(prevState => {
        if (!prevState) return null;

        const updatedComments = prevState.comments.map(comment =>
          comment.id === commentId
            ? { ...comment, approval_status: 'approve' }
            : comment
        );

        return {
          attraction: prevState.attraction,
          comments: updatedComments
        };
      });
    } catch (error) {
      console.error('Error approving comment:', error);
    }
  };

  const onDisapprove = async (commentId: number) => {
    try {
      await api.post(`/api/comments/${commentId}/disapprove`);
      setAttractionInfo(prevState => {
        if (!prevState) return null;

        const updatedComments = prevState.comments.map(comment =>
          comment.id === commentId
            ? { ...comment, approval_status: 'disapprove' }
            : comment
        );

        return {
          attraction: prevState.attraction,
          comments: updatedComments
        };
      });
    } catch (error) {
      console.error('Error disapproving comment:', error);
    }
  };

  const onApprovalRemove = async (commentId: number) => {
    try {
      await api.post(`/api/comments/${commentId}/removeApproval`);
      setAttractionInfo(prevState => {
        if (!prevState) return null;

        const updatedComments = prevState.comments.map(comment =>
          comment.id === commentId
            ? { ...comment, approval_status: null }
            : comment
        );

        return {
          attraction: prevState.attraction,
          comments: updatedComments
        };
      });
    } catch (error) {
      console.error('Error removing approval:', error);
    }
  };

  if (!attractionInfo) {
    return <div>Loading...</div>;
  }

  const { attraction, comments } = attractionInfo;
  const { name, photos } = attraction;

  return (
    <AttractionContainer colors={colors}>
      <PhotoContainer colors={colors}> 
        <Photos photos={photos} title={name} displayButton={photos.length > 1} />
      </PhotoContainer>
      <InfoContainer>
        {isAuthenticated && role === 'user' && (
          <>
            <StyledButton colors={colors} 
              background={true}

              onClick={handleFavouriteToggle}
            >
              {isFavourite ? 'Ulubione' : 'Dodaj do ulubionych'}
            </StyledButton>
            <StyledButton colors={colors} 
              background={true}
              onClick={handleToVisitToggle}
            >
              {toVisit ? 'Do odwiedzenia' : 'Dodaj na listę do odwiedzenia'}
            </StyledButton>
          </>
        )}
        <AttractionInfo attraction={attraction} />
        {isAuthenticated && role === 'user' && (
          <TileCard colors={colors}>
            <CardContent>
              <Title colors={colors}>
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
        <Comments
          comments={comments}
          attractionId={attraction.id}
          addComment={addComment}
          onApprove={onApprove}
          onDisapprove={onDisapprove}
          onApprovalRemove={onApprovalRemove}
        />
      </InfoContainer>
    </AttractionContainer>
  );
};

export default AttractionView;
