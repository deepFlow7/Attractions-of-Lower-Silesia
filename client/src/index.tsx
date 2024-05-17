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
      description: "    Brak wyraźnego dymorfizmu płciowego. Wierzch ciała i skrzydła oliwkowobrązowawe. Głowa, szyja, pierś i boki łupkowoszare. Brzuch białawy, zaś pokrywy podogonowe białe. Czerwony dziób zakończony żółto. Nogi długie barwy żółtozielonej, z bardzo długimi palcami, na bokach których znajdują się wąskie fałdy skóry (bez błon pławnych, które są u łysek). Na czole naga rogowa blaszka koloru czerwonego. Na boku ciała widoczny biały pas biegnący równolegle do dolnego brzegu skrzydeł. Młode brązowe z zielonkawą blaszką, ale bez czerwonej tarczki na czole i dwubarwnego dzioba. Pisklęta czarne z czerwoną plamą wokół dzioba i prześwitującą między piórami niebieską skórą wokół oczu. Płynąc po wodzie, kokoszka jest wysoko wynurzona nad wodę i kiwa równomiernie ogonem i głową. Blisko spokrewniony modrzyk jest cały lśniąconiebieski. Ma długi i gruby czerwony dziób i podobnie czerwoną tarczkę na czole. Kokoszka jest znacznie mniejsza od łyski i od niej smuklejsza. Poszczególne podgatunki nieco różnią się między sobą. Podgatunki Starego Świata mają blaszkę na czole w kształcie eliptycznym, najszerszą w części środkowej o zaokrąglonym szczycie. Podgatunki Nowego Świata (wyodrębnione w gatunek „kokoszka amerykańska”) mają niemal kwadratową blaszkę najszerszą na szczycie. G. c. meridionalis i G. c. orientalis są mniejsze o stalowoszarych pokrywach skrzydłowych oraz bez oliwkowego odcienia wierzchu ciała. G. c. pyrrhorrhoa ma pokrywę podogonową barwy cielistej. G. c. guami jest ciemniejszy[7].",
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
  challenges:[
    {
      id:0,
      name:"Great challenge",
      description:"Greatest challenge of them all",
      points:100,
      attractions: [],
    },
    {
      id:0,
      name:"Great challenge1",
      description:"Greatest challenge of them all",
      points:100,
      attractions: [],
    },
    {
      id:0,
      name:"Great challenge2",
      description:"Greatest challenge of them all",
      points:100,
      attractions: [],
    },
    {
      id:0,
      name:"Great challenge3",
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
        element: <Home attractions={data.attractions} filterOptions={["ladne", "nieladne", "a"]} />,
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