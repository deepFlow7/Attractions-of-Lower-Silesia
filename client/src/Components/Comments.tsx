/** @jsxImportSource @emotion/react */
import React, { useState } from "react";
import { CardContent, List, ListItem, TextField, Button } from "@mui/material";
import { Comment } from "../types";
import api from "../API/api";
import { useAuth } from "../Providers/AuthContext";
import { Title, Body } from "../Styles/Typography";
import styled from "@emotion/styled";
import { colors, shadows } from "../Styles/Themes";
import { StyledButton } from "../Styles/Button";
import StyledTextField from "../Styles/TextField";

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

const Comments: React.FC<CommentsProps> = ({
  comments,
  attractionId,
  addComment,
  onApprove,
  onDisapprove,
  onApprovalRemove,
}) => {
  const { user, isAuthenticated, isBlocked, role } = useAuth();
  const [newComment, setNewComment] = useState("");

  const handleCommentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewComment(event.target.value);
  };

  const handleAddComment = async () => {
    if (isBlocked) {
      alert("Twoje konto jest zablokowane, nie możesz dodawać komentarzy.");
      return;
    }

    if (newComment.trim() === "") return;

    const commentData = {
      author: user!.id,
      content: newComment,
      attraction: attractionId,
    };

    try {
      const response = await api.post("/api/addComment", commentData);
      if (response.data.success) {
        addComment({ ...commentData, id: response.data.id, vote_sum: 0 });
        console.log("New comment added successfully:", response.data);
        setNewComment("");
      }
    } catch (error) {
      console.error("Error adding new comment:", error);
    }
  };

  const handleApprove = async (comment: Comment) => {
    if (comment.approval_status === "approve") {
      onApprovalRemove(comment.id);
    } else {
      onApprove(comment.id);
    }
  };

  const handleDispprove = async (comment: Comment) => {
    if (comment.approval_status === "disapprove") {
      onApprovalRemove(comment.id);
    } else {
      onDisapprove(comment.id);
    }
  };

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
                {isAuthenticated && role == "user" && (
                  <div>
                    <button
                      style={{
                        backgroundColor:
                         'transparent',
                         border: "none"
                      }}
                      onClick={() => handleApprove(comment)}
                      aria-label="Approve"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill={comment.approval_status === "approve"
                          ? colors.tertiary
                          :colors.dark}
                        width="1.5rem"
                        height="1.5rem"
                        viewBox="0 0 24 24"
                      >
                        <path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-1.91l-.01-.01L23 10z" />
                      </svg>
                    </button>
                    <button
                    style={{
                      backgroundColor:
                       'transparent',
                       border: "none"
                    }}
                      onClick={() => handleDispprove(comment)}
                      aria-label="Disapprove"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill={comment.approval_status === "disapprove"
                          ? colors.tertiary
                          :colors.dark}
                        width="1.5rem"
                        height="1.5rem"
                        viewBox="0 0 24 24"
                        transform="rotate(0)matrix(-1, 0, 0, -1, 0, 0)"
                      >
                        <g id="SVGRepo_bgCarrier" stroke-width="0" />
                        <g
                          id="SVGRepo_tracerCarrier"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                        <g id="SVGRepo_iconCarrier">
                          <path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-1.91l-.01-.01L23 10z" />
                        </g>
                      </svg>
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
          <StyledButton onClick={handleAddComment}>Dodaj</StyledButton>
        </CardContent>
      )}
    </Container>
  );
};

export default Comments;
