import React from 'react';
import ReactDOM from 'react-dom/client';
import {createBrowserRouter, RouterProvider} from 'react-router-dom';
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


//Tu pobrać dane z serwera tj. atrakcje i wyzwania
const data={
  attractions:[
    {
      id:0,
      name:"Fantastic attraction",
      coords: { x: 51.1079, y: 17.0385},
      type: "Type1",
      subtype: "Subtype1",
      interactivity: 20,
      time_it_takes: 1,
      rating: 5,
      description: "Fajna taka, nie za nudna",
      photos: [
        {
          id: 0,
          attraction_id: 0,
          photo: "",
          caption: "",
        },
      ],
    }
  ],
  challenges:[
    {
      id:0,
      name:"Great challenge",
      description:"Greatest challenge of them all",
      points:100,
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

}

const router=createBrowserRouter([
      {
        path: "/",
        element: <Home attractions={data.attractions} filterOptions={[]} />,
      },
      {
        path: "/attraction/:id",
        element: <Attraction attraction={data.attractions[0]} comments={[]}/>
      },
      {
        path: "/challenge/:id",    // For now only id=0, in teh future we will use :id value
        element: <ChallengeView challenge={data.challenges[0]} rankings={data.ranking}/>
      },
      {
        path: "/challenges",
        element: <Challenges allChallenges={data.challenges} completedChallenges={data.challenges}/>
      },
      {
        path: "/login",
        element: <LoginForm onLogin={{}}/>
      },
      {
        path: "/new_attraction",
        element: <NewAttractionForm onSubmit={{}}/>
      },
      {
        path: "/ranking",
        element: <Ranking rankings={data.ranking}/>
      },
      {
        path: "/signup",
        element: <SignUpForm onRegister={{}}/>
      },
    ]
)

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Navbar />
    <RouterProvider router={router} />
  </React.StrictMode>
);