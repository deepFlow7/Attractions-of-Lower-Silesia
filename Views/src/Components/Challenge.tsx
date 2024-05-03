import React from 'react';
import Map from './Map';
import AttractionsList from './AttractionsList';
import RankingTable from './Ranking';

const Challenge: React.FC = () => {
  // Przykładowe dane atrakcji
  const attractions = ['Atrakcja 1', 'Atrakcja 2', 'Atrakcja 3'];

  // Przykładowe dane rankingów
  const rankings = [
    { user_id: 1, points: 100 },
    { user_id: 2, points: 90 },
    { user_id: 3, points: 80 },
    { user_id: 4, points: 70 },
    { user_id: 5, points: 60 }
  ];

  return (
    <div>
      {/* Komponent Map */}
      <Map/>

      {/* Komponent AttractionsList */}
      <AttractionsList items={attractions} />

      {/* Komponent RankingTable */}
      <RankingTable rankings={rankings} />
    </div>
  );
};

export default Challenge;
