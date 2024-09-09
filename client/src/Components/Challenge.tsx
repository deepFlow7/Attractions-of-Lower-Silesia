/** @jsxImportSource @emotion/react */
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { CardContent } from "@mui/material";

import api from '../API/api';
import Map from "./Map";
import ChallengeAttractionsList from "./ChallengeAttractionsList";
import RankingTable from "./Ranking";
import { useAuth } from "../Providers/AuthContext";
import { Challenge, ChallengeAttraction } from "../types";
import { ViewContainer } from '../Styles/View';
import { MapContainer } from '../Styles/Map';
import { DictionaryContainer } from '../Styles/Dictionary';
import { Title, Body } from '../Styles/Typography';
import { StyledButton } from '../Styles/Button';

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
  const { isAuthenticated, user, role } = useAuth();
  const [takesPart, setTakesPart] = useState<boolean>(false);
  const [visitedAttractions, setVisitedAttractions] = useState<
    { attraction_id: number }[]
  >([]);
  const [loadingAttractions, setLoadingAttractions] = useState<
    { attraction_id: number }[]
  >([]);
  const [refreshKey, setRefreshKey] = useState(0);

  const { id } = useParams();

  const getChallengeData = () => {
    api
      .get(`/api/challenge/${id}`)
      .then((response) => {
        setChallenge(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the data!", error);
      });
  };

  useEffect(() => {
    getChallengeData();
    if (user && role === "user") {
      api
        .get(`/api/takes_part_in_challenge/${id}/`)
        .then((response) => {
          setTakesPart(response.data);
          if (response.data) {
            api
              .get(`/api/challenge/visited_attractions/${id}`)
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
    }
  }, [id, user]);

  if (!challenge) {
    return <div>Loading...</div>;
  }

  const handleParticipation = () => {
    if (!user || role !== "user") return;
    api
      .post(`/api/start_challenge/${challenge.id}/${user.id}`)
      .then(() => {
        setTakesPart(true);
        getChallengeData();
        setRefreshKey((key) => key + 1);
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
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude, accuracy } = position.coords;

        setLoadingAttractions((prev) =>
          prev.filter((a) => a.attraction_id !== attraction.id)
        );

        if (accuracy > 50) {
          alert("Nie możemy pobrać twojej dokładnej lokalizacji.");
          return;
        }

        const distance = haversineDistanceBetweenPoints(
          latitude,
          longitude,
          attraction.coords.x,
          attraction.coords.y
        );

        const roundedDistance = Math.round(distance / 10) * 10;

        if (roundedDistance > 80) {
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
            setRefreshKey((key) => key + 1);
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
      console.log("Failed to get location.");
      return;
    }
  };

  return (
    <ViewContainer>
      <MapContainer four challenge>
        <Title>{challenge.name}</Title>
        <Body margin>{challenge.description}</Body>
        <CardContent>
          <Map
            x={challenge.coords.x}
            y={challenge.coords.y}
            zoom={challenge.zoom}
            attractions={challenge.attractions}
          />
        </CardContent>
      </MapContainer>
      <DictionaryContainer>
        <CardContent>
          <ChallengeAttractionsList
            attractions={challenge.attractions}
            showVisitButtons={isAuthenticated && takesPart}
            onClick={visitAttraction}
            visitedAttractions={visitedAttractions}
            loadingAttractions={loadingAttractions}
          />
        </CardContent>
      </DictionaryContainer>
      <DictionaryContainer second>
        <CardContent>
          <Title>Ranking</Title>
          <RankingTable key={refreshKey} challengeId={id ? parseInt(id) : null} />
          {user && role === "user" && !takesPart && (
            <StyledButton onClick={handleParticipation}>
              Weź udział
            </StyledButton>
          )}
        </CardContent>
      </DictionaryContainer>
    </ViewContainer>
  );
};

export default ChallengeView;
