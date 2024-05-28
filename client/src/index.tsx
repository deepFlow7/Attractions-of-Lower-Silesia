import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes} from 'react-router-dom';
import './index.css';
import Navbar from './Components/Navbar';
import Home from './Components/Home';
import Attraction from "./Components/Attraction";
import ChallengeView from './Components/Challenge';
import Challenges from './Components/Challenges';
import NewAttractionForm from './Components/NewAttractionForm';
import Ranking from './Components/Ranking';
import SignUpForm from './Components/SignUpForm';
import LoginForm from './Components/LoginForm';


const data = {
  attractions: [
    {
      id: 0,
      name: "Fantastic attraction",
      coords: { x: 51.1079, y: 17.0385 },
      type: "Type1",
      subtype: "Subtype1",
      interactivity: 20,
      time_it_takes: 1,
      rating: 5,
      description: "Detailed description of the attraction.",
      photos: [
        {
          id: 0,
          attraction_id: 0,
          photo: "https://kurkawodna.org/wp-content/uploads/2018/05/common-moorhen-2355937_1920.jpg",
          caption: "kokoszka",
        },
        {
          id: 1,
          attraction_id: 0,
          photo: "https://tukanmedia.pl/wp-content/uploads/2023/07/top-kos.png",
          caption: "kos",
        }
      ],
    }
  ],
  challenges: [
    {
      id: 0,
      name: "Great challenge",
      description: "Greatest challenge of them all",
      points: 100,
      attractions: [],
    },
    {
      id: 1,
      name: "Great challenge1",
      description: "Greatest challenge of them all",
      points: 100,
      attractions: [],
    },
    {
      id: 2,
      name: "Great challenge2",
      description: "Greatest challenge of them all",
      points: 100,
      attractions: [],
    },
    {
      id: 3,
      name: "Great challenge3",
      description: "Greatest challenge of them all",
      points: 100,
      attractions: [],
    }
  ],
  username: "Joe",
  ranking: [
    {
      user_id: 0,
      points: 0,
    },
  ]
};



const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/attraction/:id" element={<Attraction />} />
        <Route path="/challenge/:id" element={<ChallengeView />} />
        <Route path="/challenges" element={<Challenges  completedChallenges={data.challenges} />} />
        <Route path="/login" element={<LoginForm onLogin={{}} />} />
        <Route path="/new_attraction" element={<NewAttractionForm onSubmit={{}} />} />
        <Route path="/ranking" element={<Ranking rankings={data.ranking} />} />
        <Route path="/signup" element={<SignUpForm onRegister={{}} />} />
      </Routes>
    </BrowserRouter>

  </React.StrictMode>
);
