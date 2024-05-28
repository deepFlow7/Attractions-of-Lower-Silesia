import React,{useState,useEffect} from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Map from './Map';
import AttractionsList from './AttractionsList';
import RankingTable from './Ranking';
import { Challenge } from '../types';


const ChallengeView: React.FC = () => {
    
        const [challenge, setChallenge] = useState<Challenge|null>(null);

        const {id} = useParams();
      
        useEffect(() => {
          axios.get('/api/challenge/'+id)
            .then(response => {
              setChallenge(response.data);
            })
            .catch(error => {
              console.error('There was an error fetching the data!', error);
            });
        }, []);
      
    if(!challenge){return <div>Loading...</div>;}
    return (
    <div>
      <AttractionsList attractions={challenge.attractions} />
      <RankingTable  />
    </div>
  );
};

export default ChallengeView;
