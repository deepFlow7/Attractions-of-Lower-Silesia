import React, { useEffect, useState } from 'react';
import { Table, TableContainer, TableHead, TableBody, TableRow, TableCell, Paper } from '@mui/material';
import { Ranking } from '../types';
import axios from 'axios';
import styled from '@emotion/styled';

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
}

const RankingTable: React.FC<RankingTableProps> = () => {
  const [rankings, setRankings] = useState<Ranking[]|null>(null);
  useEffect(() => {
      axios.get('/api/rankings')
        .then(response => {
          setRankings(response.data);
        })
        .catch(error => {
          console.error('There was an error fetching the data!', error);
        });
  }, []);
  if(!rankings){return <div>Loading...</div>;}
  return (
    <StyledTableContainer>
      <StyledPaper>
        <TableContainer>
          <StyledTable>
            <TableHead>
              <TableRow>
                <TableCell>User ID</TableCell>
                <TableCell align="right">Points</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rankings.map((ranking, index) => (
                <TableRow key={index}>
                  <TableCell>{ranking.user_id}</TableCell>
                  <TableCell align="right">{ranking.points}</TableCell>
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
