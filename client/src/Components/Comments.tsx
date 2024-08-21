import React, { useState } from 'react';
import { CardContent, List, ListItem, TextField, Button } from '@mui/material';
/** @jsxImportSource @emotion/react */
import { Title, Body } from '../Styles/Typography';
import { Comment } from '../types';
import api from '../API/api';
import { useAuth } from '../Providers/AuthContext';

interface CommentsProps {
  comments: Comment[];
  attraction_id: number;
  addComment: (new_comment: Comment) => void;
}

const Comments: React.FC<CommentsProps> = ({ comments, attraction_id, addComment }) => {
  const { user, isAuthenticated, isBlocked, role } = useAuth();
  const [newComment, setNewComment] = useState('');

  const handleCommentChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
    setNewComment(event.target.value);
  };

  const handleAddComment = async () => {
    if (isBlocked) {
      alert("Twoje konto jest zablokowane, nie możesz dodawać komentarzy.")
      return;
    }

    if (newComment.trim() === '') return;

    const commentData = {
      author: user!.id,
      content: newComment,
      votes: 0,
      attraction: attraction_id, 
      parent: null
    };

    try {
      const response = await api.post('/api/addComment', commentData);
      if (response.data.success) {
        addComment({...commentData, id:response.data.id});
        console.log('New comment added successfully:', response.data);
        setNewComment('');
      }
    } catch (error) {
      console.error('Error adding new comment:', error);
    }
  };

  return (
    <div>
      <CardContent>
        <Title small>Komentarze</Title>
        <List>
          {comments.map(comment => (
            <ListItem key={comment.id}>
              <div>
                <Body>{comment.content}</Body>
                <Body gray>
                  {comment.parent ? (
                    <>
                      Autor: {comment.author}, Głosy: {comment.votes}, Odpowiedz na: {comment.parent}
                    </>
                  ) : (
                    <>
                      Autor: {comment.author}, Głosy: {comment.votes}
                    </>
                  )}
                </Body>
              </div>
            </ListItem>
          ))}
        </List>
      </CardContent>

      {isAuthenticated && role === "user" && (
        <CardContent>
          <Title small>Dodaj komentarz</Title>
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
      )}
    </div>
  );
};

export default Comments;
