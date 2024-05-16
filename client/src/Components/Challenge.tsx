import React from 'react';
import Map from './Map';
import AttractionsList from './AttractionsList';
import RankingTable from './Ranking';
import { Challenge, Ranking } from '../types';

const ChallengeView: React.FC<{ rankings: Ranking[]; challenge: Challenge }> = ({ rankings, challenge }) => {
  return (
    <div>
      <AttractionsList items={challenge.attractions} />
      <RankingTable rankings={rankings} />
    </div>
  );
};

export default ChallengeView;
