import React from 'react';
import { Grid, Card, Typography, CardContent, List, ListItem, ListItemText } from '@mui/material';
/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { Comment } from '../types';

interface CommentsProps {
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

const Comments: React.FC<CommentsProps> = ({ comments }) => {
  return (
    <TileCard>
                <CardContent>
                  <Typography variant="h5" gutterBottom>Komentarze</Typography>
                  <List>
                    {comments.map(comment => (
                      <ListItem key={comment.id}>
                        <ListItemText primary={comment.content} secondary={`Autor: ${comment.author}`} />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </TileCard>
  );
};

export default Comments;
