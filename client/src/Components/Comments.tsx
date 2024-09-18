/** @jsxImportSource @emotion/react */
import React, { useState } from 'react';
import { CardContent, List, ListItem, TextField, Button } from '@mui/material';
import { Comment } from '../types';
import api from '../API/api';
import { useAuth } from '../Providers/AuthContext';
import { Title, Body } from '../Styles/Typography';
import styled from '@emotion/styled';
import { colors, shadows } from '../Styles/Themes';
import { StyledButton } from '../Styles/Button';
import StyledTextField from '../Styles/TextField';

export const Container = styled.div`
  display: flex;
  gap: 1rem;
  flex-direction: column;
  & > * {
    background-color: ${colors.primary};
    box-shadow: ${shadows.default};
  }
`;

interface CommentsProps {
  comments: Comment[];
  attractionId: number;
  addComment: (newComment: Comment) => void;
  onApprove: (commentId: number) => void;
  onDisapprove: (commentId: number) => void;
  onApprovalRemove: (commentId: number) => void;
}

const Comments: React.FC<CommentsProps> = ({ comments, attractionId, addComment, onApprove, onDisapprove, onApprovalRemove }) => {
  const { user, isAuthenticated, isBlocked, role } = useAuth();
  const [newComment, setNewComment] = useState('');

  const handleCommentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewComment(event.target.value);
  };

  const handleAddComment = async () => {
    if (isBlocked) {
      alert("Twoje konto jest zablokowane, nie możesz dodawać komentarzy.");
      return;
    }

    if (newComment.trim() === '') return;

    const commentData = {
      author: user!.id,
      content: newComment,
      attraction: attractionId,
    };

    try {
      const response = await api.post('/api/comments/add', commentData);
      if (response.data.success) {
        addComment({ ...commentData, id: response.data.id, vote_sum: 0 });
        console.log('New comment added successfully:', response.data);
        setNewComment('');
      }
    } catch (error) {
      console.error('Error adding new comment:', error);
    }
  };

  const handleApprove = async (comment : Comment) => {
    if (comment.approval_status === 'approve') {
      onApprovalRemove(comment.id);
    } else {
      onApprove(comment.id);
    }
  }

  const handleDispprove = async (comment : Comment) => {
    if (comment.approval_status === 'disapprove') {
      onApprovalRemove(comment.id);
    } else {
      onDisapprove(comment.id);
    }
  }

  return (
    <Container>
      <div>
        <Title small>Komentarze</Title>
        <List>
          {comments.map((comment) => (
            <ListItem key={comment.id}>
              <div>
                <Body>{comment.content}</Body>
                <Body gray>
                  Autor: {comment.author}, Głosy: {comment.vote_sum}
                </Body>
                {isAuthenticated && role == 'user' && (
                  <div>
                    <button 
                      style={ {backgroundColor: comment.approval_status === 'approve'?  '#4caf50' : '#f0f0f0'}}
                      onClick={() => handleApprove(comment)} 
                      aria-label="Approve"
                    >
                      👍
                    </button>
                    <button 
                      style={ {backgroundColor: comment.approval_status === 'disapprove'?  '#4caf50' : '#f0f0f0'}}
                      onClick={() => handleDispprove(comment)} 
                      aria-label="Disapprove"
                    >
                      👎
                    </button>
                  </div>
              )}
              </div>
            </ListItem>
          ))}
        </List>
        </div>
      {isAuthenticated && role === "user" && (
        <CardContent>
          <Title small>Dodaj komentarz</Title>
          <StyledTextField
            label="Treść komentarza"
            multiline
            rows={4}
            value={newComment}
            onChange={handleCommentChange}
            fullWidth
          />
          <StyledButton  onClick={handleAddComment} >
            Dodaj
          </StyledButton>
        </CardContent>
      )}
    </Container>
  );
};

export default Comments;
