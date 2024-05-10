import React from 'react';
import { Challenge } from '../types'; // Importujemy interfejs Challenge

interface ChallengesProps {
  allChallenges: Challenge[];
  completedChallenges: Challenge[];
}

const Challenges: React.FC<ChallengesProps> = ({ allChallenges, completedChallenges }) => {
  return (
    <div>
      <div>
        <h2>Wszystkie wyzwania</h2>
        <ul>
          {allChallenges.map(challenge => (
            <li key={challenge.id}>{challenge.name}</li>
          ))}
        </ul>
      </div>
      <div>
        <h2>Ukończone wyzwania</h2>
        <ul>
          {completedChallenges.map(challenge => (
            <li key={challenge.id}>{challenge.name}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Challenges;
