import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { Table, TableContainer, TableHead, TableBody, TableRow, TableCell} from '@mui/material';
import { useColors, ContrastProps } from '../Providers/Colors'; 
import { ChallengeRanking } from '../types';
import api from '../API/api';
import { useAuth } from '../Providers/AuthContext';
import { Body } from '../Styles/Typography';

const StyledTable = styled(Table)`
  && {
    min-width: 300px;
    background-color: transparent; 
  }
`;

const StyledTableCell = styled(TableCell)<ContrastProps>`
  && {
    background-color: ${props => props.colors.primary}; 
  }
`;

interface RankingTableProps {
  challengeId: number | null;
}

const RankingTable: React.FC<RankingTableProps> = ({ challengeId }) => {
  const [rankings, setRankings] = useState<ChallengeRanking[] | null>(null);
  const { isAuthenticated, username } = useAuth();
  const { toggleTheme, colors } = useColors();

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
            <StyledTableCell colors={colors}>
              <Body colors={colors}>Username</Body>
            </StyledTableCell>
            <StyledTableCell align="right" colors={colors}>
              <Body colors={colors}>Points</Body>
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
              <StyledTableCell colors={colors}>
                <Body colors={colors}>{ranking.login}</Body>
              </StyledTableCell>
              <StyledTableCell  colors={colors} align="right" >
                <Body colors={colors}>{ranking.score}</Body>
              </StyledTableCell>
            </TableRow>
          ))}
        </TableBody>
      </StyledTable>
    </TableContainer>
  );
};

export default RankingTable;
