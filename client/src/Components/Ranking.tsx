import React from 'react';
import { Table, TableContainer, TableHead, TableBody, TableRow, TableCell, Paper } from '@mui/material';
import { Ranking } from '../types';

interface RankingTableProps {
  rankings: Ranking[];
}

const RankingTable: React.FC<RankingTableProps> = ({ rankings }) => {
  return (
    <TableContainer component={Paper}>
      <Table>
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
      </Table>
    </TableContainer>
  );
};

export default RankingTable;
