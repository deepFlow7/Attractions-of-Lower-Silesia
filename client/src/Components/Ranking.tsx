import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { Table, TableContainer, TableHead, TableBody, TableRow, TableCell} from '@mui/material';

import { ChallengeRanking } from '../types';
import api from '../API/api';
import { useAuth } from '../Providers/AuthContext';
import { Body } from '../Styles/Typography';
import { colors } from '../Styles/Themes';
const StyledTable = styled(Table)`
  && {
    min-width: 300px;
    background-color: transparent; /* Ustawienie przezroczystego tła dla tabeli */
  }
`;

const StyledTableCell = styled(TableCell)`
  && {
    background-color: ${colors.primary}; /* Przezroczyste tło dla komórek */
  }
`;

interface RankingTableProps {
  challengeId: number | null;
}

const RankingTable: React.FC<RankingTableProps> = ({ challengeId }) => {
  const [rankings, setRankings] = useState<ChallengeRanking[] | null>(null);
  const { isAuthenticated, username } = useAuth();

  useEffect(() => {
    if (challengeId) {
      api.get(`/api/challenges/${challengeId}/ranking`)
        .then((response) => {
          setRankings(response.data);
        })
        .catch((error) => {
          console.error('There was an error fetching the data!', error);
        });
    }
  }, [challengeId]);

  if (!rankings) {
    return <div>Loading...</div>;
  }

  return (
    <TableContainer>
      <StyledTable>
        <TableHead>
          <TableRow>
            <StyledTableCell>
              <Body>Username</Body>
            </StyledTableCell>
            <StyledTableCell align="right">
              <Body>Points</Body>
            </StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rankings.map((ranking, index) => (
            <TableRow
              key={index}
              style={{
                backgroundColor:
                  isAuthenticated && ranking.login === username ? 'lightblue' : 'transparent',
              }}
            >
              <StyledTableCell>
                <Body>{ranking.login}</Body>
              </StyledTableCell>
              <StyledTableCell align="right">
                <Body>{ranking.score}</Body>
              </StyledTableCell>
            </TableRow>
          ))}
        </TableBody>
      </StyledTable>
    </TableContainer>
  );
};

export default RankingTable;
