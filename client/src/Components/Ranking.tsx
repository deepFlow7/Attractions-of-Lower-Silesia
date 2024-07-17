import React, { useEffect, useState } from 'react';
import { Table, TableContainer, TableHead, TableBody, TableRow, TableCell, Paper } from '@mui/material';
import { ChallengeRanking } from '../types';
import api from '../API/api';
import styled from '@emotion/styled';
import { useAuth } from '../Providers/AuthContext';

const StyledTableContainer = styled.div`
  max-width: 600px;
  margin: 5% auto;
`;

const StyledPaper = styled(Paper)`
  && {
    width: 100%;
  }
`;

const StyledTable = styled(Table)`
  && {
    min-width: 300px;
  }
`;

interface RankingTableProps {
  challenge_id: number | null;
}

const RankingTable: React.FC<RankingTableProps> = (props : RankingTableProps) => {
  const [rankings, setRankings] = useState<ChallengeRanking[]|null>(null);
  const {isAuthenticated, username} = useAuth();

  useEffect(() => {
      if (props.challenge_id) {
      api.get('/api/ranking/' + props.challenge_id)
        .then(response => {
          setRankings(response.data);
        })
        .catch(error => {
          console.error('There was an error fetching the data!', error);
        });
  }}, []);

  if(!rankings){return <div>Loading...</div>;}
  return (
    <StyledTableContainer>
      <StyledPaper>
        <TableContainer>
          <StyledTable>
            <TableHead>
              <TableRow>
                <TableCell>Username</TableCell>
                <TableCell align="right">Points</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rankings.map((ranking, index) => (
                <TableRow 
                  key={index} 
                  style={{
                    backgroundColor: isAuthenticated && ranking.login === username ? 'lightblue' : 'inherit'
                }}>
                  <TableCell>
                    {ranking.login}
                  </TableCell>
                  <TableCell align="right">{ranking.score}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </StyledTable>
        </TableContainer>
      </StyledPaper>
    </StyledTableContainer>
  );
};

export default RankingTable;
