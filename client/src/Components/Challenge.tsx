import React, { useState, useEffect } from "react";
import api from '../API/api';
import { useParams } from "react-router-dom";
/** @jsxImportSource @emotion/react */
import styled from "@emotion/styled";
import { Card, CardContent, Grid, Typography, Button } from "@mui/material";
import Map from "./Map";
import ChallengeAttractionsList from "./ChallengeAttractionsList";
import RankingTable from "./Ranking";
import { Challenge, ChallengeAttraction } from "../types";
import { useAuth } from "../Providers/AuthContext";
import { ViewContainer } from '../Styles/View';
import { MapContainer } from '../Styles/Map';
import { DictionaryContainer } from '../Styles/Dictionary';
import {Title, Body} from '../Styles/Typography';
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
    if (user && role == "user") {
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
    if (!user || role != "user") return;
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
          <RankingTable key={refreshKey} challenge_id={id ? parseInt(id) : null} />
          {user && role == "user" && !takesPart && (
            <StyledButton
          
              onClick={handleParticipation}
            >
              Weź udział
            </StyledButton>
          )}
        </CardContent>
    </DictionaryContainer>
  </ViewContainer>
  );
};

export default ChallengeView;
