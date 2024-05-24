import React from 'react';
import { Table, TableContainer, TableHead, TableBody, TableRow, TableCell, Paper } from '@mui/material';
import { Ranking } from '../types';
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
  rankings: Ranking[];
}
const RankingTable: React.FC<RankingTableProps> = ({ rankings }) => {
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
