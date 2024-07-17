import React, { useState } from 'react';
import { Grid, Card, Typography, CardContent, List, ListItem, ListItemText, TextField, Button } from '@mui/material';
/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { Comment } from '../types';
import api from '../API/api';
import { useAuth } from '../Providers/AuthContext';

interface CommentsProps {
  comments: Comment[];
  attraction_id: Number;
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

const Comments: React.FC<CommentsProps> = ({ comments, attraction_id }) => {
  const { user } = useAuth();
  const [newComment, setNewComment] = useState('');

  const handleCommentChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
    setNewComment(event.target.value);
  };

  const handleAddComment = async () => {
    if (newComment.trim() === '') return;

    const commentData = {
      author: user?.name || 'Anonymous',
      content: newComment,
      votes: 0,
      attraction: attraction_id, 
      parent: null
    };

    try {
      const response = await api.post('/api/addComment', commentData);
      if (response.data.success) {
        console.log('New comment added successfully:', response.data);
        setNewComment('');
      }
    } catch (error) {
      console.error('Error adding new comment:', error);
    }
  };

  return (
    <div>
      <TileCard>
        <CardContent>
          <Typography variant="h5" gutterBottom>Komentarze</Typography>
          <List>
            {comments.map(comment => (
               <ListItem key={comment.id}>
               <ListItemText
                 primary={comment.content}
                 secondary={
                    comment.parent ? (
                      <>
                        Autor: {comment.author}, 
                        Głosy: {comment.votes}, 
                        Odpowiedz na: {comment.parent}
                      </>
                    ) : (
                      <>
                        Autor: {comment.author}, 
                        Głosy: {comment.votes}
                      </>
                    )
                  }
               />
             </ListItem>
            ))}
          </List>
        </CardContent>
      </TileCard>

      <TileCard>
        <CardContent>
          <Title variant="h5" gutterBottom>Dodaj komentarz</Title>
          <TextField
            label="Treść komentarza"
            multiline
            rows={4}
            value={newComment}
            onChange={handleCommentChange}
            fullWidth
          />
          <Button variant="contained" color="primary" onClick={handleAddComment} fullWidth>
            Dodaj
          </Button>
        </CardContent>
      </TileCard>
    </div>
  );
};

export default Comments;
