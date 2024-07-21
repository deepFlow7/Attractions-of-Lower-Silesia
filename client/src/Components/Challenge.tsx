import React, { useState, useEffect } from "react";
import api from '../API/api';
import { useParams } from "react-router-dom";
/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { Card, CardContent, Grid, Typography, Button } from "@mui/material";
import Map from "./Map";
import ChallengeAttractionsList from "./ChallengeAttractionsList";
import RankingTable from "./Ranking";
import { Challenge, ChallengeAttraction, Attraction } from "../types";
import { useAuth } from "../Providers/AuthContext";

const Container = styled.div`
  padding: 20px;
`;

const Section = styled(Card)`
  margin-bottom: 20px;
`;
const Title = styled(Typography)`
  text-align: center;
  font-weight: bold;
  margin-bottom: 16px;
  margin-top: 16px;
`;

const Description = styled(Typography)`
  text-align: center;
  margin-bottom: 20px;
  font-size: 1.2rem;
`;

function haversineDistanceBetweenPoints(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
) {
  const R = 6371e3;
  const p1 = (lat1 * Math.PI) / 180;
  const p2 = (lat2 * Math.PI) / 180;
  const deltaLon = lon2 - lon1;
  const deltaLambda = (deltaLon * Math.PI) / 180;
  const d =
    Math.acos(
      Math.sin(p1) * Math.sin(p2) +
        Math.cos(p1) * Math.cos(p2) * Math.cos(deltaLambda)
    ) * R;
  return d;
}

const ChallengeView: React.FC = () => {
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const { isAuthenticated, user } = useAuth();
  const [takesPart, setTakesPart] = useState<boolean>(false);
  const [visitedAttractions, setVisitedAttractions] = useState<
    { attraction_id: number }[]
  >([]);
  const [loadingAttractions, setLoadingAttractions] = useState<
    { attraction_id: number }[]
  >([]);
  const [refreshKey, setRefreshKey] = useState(0);

  const { id } = useParams();

  const get_challenge_data = () => {
    api
      .get("/api/challenge/" + id)
      .then((response) => {
        setChallenge(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the data!", error);
      });
  };

  useEffect(() => {
    get_challenge_data();
    if (user) {
      api
        .get(`/api/takes_part_in_challenge/${id}/${user.id}`)
        .then((response) => {
          setTakesPart(response.data);
          if (response.data) {
            api
              .get(`/api/challenge/visited_attractions/${id}/${user.id}`)
              .then((response) => {
                setVisitedAttractions(response.data);
              })
              .catch((error) => {
                console.error("There was an error fetching the data:", error);
              });
          }
        })
        .catch((error) => {
          console.error("There was an error fetching the data!", error);
        });
    } else console.log("nie zalogowoano");
  }, [id, user]);

  if (!challenge) {
    return <div>Loading...</div>;
  }

  const handleParticipation = () => {
    if (!user) return;
    api
      .post("/api/start_challenge/" + challenge.id + "/" + user.id)
      .then((response) => {
        setTakesPart(true);
        get_challenge_data();
        setRefreshKey(key => key + 1);
      })
      .catch((error) => {
        console.error("There was an error starting the challenge:", error);
      });
    api
      .get(`/api/challenge/visited_attractions/${id}/${user.id}`)
      .then((response) => {
        setVisitedAttractions(response.data);
      })
      .catch((error) => {
        console.error("There was an error:", error);
      });
  };

  const visitAttraction = (attraction: ChallengeAttraction) => {
    if (!user) return;

    setLoadingAttractions((prev) => [
      ...prev,
      { attraction_id: attraction.id },
    ]);

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(function (position) {

        const x = position.coords.latitude;
        const y = position.coords.longitude;
        const accuracy = position.coords.accuracy;

        setLoadingAttractions((prev) =>
          prev.filter((a) => a.attraction_id !== attraction.id)
        );

        if (accuracy > 50) {
          alert("Nie możemy pobrać twojej dokładnej lokalizacji.");
          return;
        }

        var distance = haversineDistanceBetweenPoints(
          x,
          y,
          attraction.coords.x,
          attraction.coords.y
        );

        distance = Math.round(distance / 10) * 10;

        if (distance > 80) {
          alert("Nie jesteś na miejscu, obiekt znajduje się " + distance + "m od twojej obecnej lokalizacji.");
          return;
        }

        api
          .post(
            `/api/visit_challenge_attraction/${challenge.id}/${attraction.id}/${user.id}`
          )
          .then(() => {
            setVisitedAttractions((prev) => [
              ...prev,
              { attraction_id: attraction.id },
            ]);
            setRefreshKey(key => key + 1);
          })
          .catch((error) => {
            console.error("There was an error visiting attraction:", error);
          });
      });
    } else {
      setLoadingAttractions((prev) =>
        prev.filter((a) => a.attraction_id !== attraction.id)
      );
      alert("Lokalizacja jest wyłączona lub nieobsługiwana przez tę przeglądarkę.");
      console.log("Nie udało się pobrać lokalizacji.");
      return;
    }
  };

  return (
    <Container>
      <Section>
        <Title variant="h4">{challenge.name}</Title>
        <Description variant="h6">{challenge.description}</Description>
      </Section>
      <Grid container spacing={3}>
        <Grid item xs={12} md={5}>
          <Section>
            <CardContent>
              <Map
                x={challenge.coords.x}
                y={challenge.coords.y}
                zoom={challenge.zoom}
                attractions={challenge.attractions}
              />
            </CardContent>
          </Section>
        </Grid>
        <Grid item xs={12} md={4}>
          <Section>
            <CardContent>
              <ChallengeAttractionsList
                attractions={challenge.attractions}
                showVisitButtons={isAuthenticated && takesPart}
                onClick={visitAttraction}
                visitedAttractions={visitedAttractions}
                loadingAttractions={loadingAttractions}
              />
            </CardContent>
          </Section>
        </Grid>
        <Grid item xs={12} md={3}>
          <Section>
            <CardContent>
              <Title variant="h5">Ranking</Title>
              <RankingTable key={refreshKey} challenge_id={id ? parseInt(id) : null} />
              {user && !takesPart && (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleParticipation}
                >
                  Weź udział
                </Button>
              )}
            </CardContent>
          </Section>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ChallengeView;
