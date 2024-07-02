import React, { useState, useEffect } from "react";
import { Typography, Button } from "@mui/material";
import UsersList from "./UserList";
import AttractionsList from "./AttractionsList";
import styled from "@emotion/styled";

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
`;

const StyledTypography = styled(Typography)`
  margin-bottom: 20px;
`;

const StyledButton = styled(Button)`
  && {
    margin-right: 10px;
    margin-top: 10px;
  }
`;

const AdminView: React.FC = () => {
  const [attractions, setAttractions] = useState<any[]>([]); // State to store attractions

  useEffect(() => {
    // Function to fetch attractions from an API
    const fetchAttractions = async () => {
      try {
        const response = await fetch("/api/attractions"); // Replace with your API endpoint
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json(); // Parse JSON data
        setAttractions(data); // Set attractions in state
      } catch (error) {
        console.error("Error fetching attractions:", error);
      }
    };

    fetchAttractions(); // Call fetch function when component mounts
  }, []); // Empty dependency array ensures useEffect runs once

  // Example users data
  const users: string[] = [
    "Jan Kowalski",
    "Anna Nowak",
    "Adam Nowakowski",
    "Ewa Wiśniewska"
  ];

  // Function to handle adding an attraction
  const handleAddAttraction = () => {
    // Implement logic to add attraction
    console.log("Adding attraction...");
  };

  // Function to handle adding a challenge
  const handleAddChallenge = () => {
    // Implement logic to add challenge
    console.log("Adding challenge...");
  };

  return (
    <Container>
      <StyledTypography variant="h4" gutterBottom>
        Panel administratora
      </StyledTypography>

      {/* Add Attraction Button */}
      <StyledButton
        variant="contained"
        color="primary"
        onClick={handleAddAttraction}
      >
        Dodaj atrakcję
      </StyledButton>

      {/* Add Challenge Button */}
      <StyledButton
        variant="contained"
        color="primary"
        onClick={handleAddChallenge}
      >
        Dodaj wyzwanie
      </StyledButton>

      <UsersList users={users} />

      {/* Render AttractionsList with fetched data */}
      <AttractionsList attractions={attractions} />
    </Container>
  );
};

export default AdminView;
