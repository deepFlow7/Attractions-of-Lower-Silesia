import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes} from 'react-router-dom';
import Navbar from './Components/Navbar';
import Home from './Components/Home';
import Attraction from "./Components/Attraction";
import ChallengeView from './Components/Challenge';
import Challenges from './Components/Challenges';
import NewAttractionForm from './Components/NewAttractionForm';
import SignUpForm from './Components/SignUpForm';
import LoginForm from './Components/LoginForm';
import NewChallengeForm from './Components/NewChallengeForm';
import { AuthProvider } from './Components/AuthContext';


const root = ReactDOM.createRoot(document.getElementById('root')!);

root!.render(
  <React.StrictMode>
    <AuthProvider>
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/attraction/:id" element={<Attraction />} />
        <Route path="/challenge/:id" element={<ChallengeView />} />
        <Route path="/challenges" element={<Challenges completedChallenges={[]} />} />
        <Route path="/login" element={<LoginForm  />} />
        <Route path="/new_attraction" element={<NewAttractionForm />} />
        {/* tylko dla admina */}
        <Route path="/new_challenge" element={<NewChallengeForm />} /> 
        <Route path="/signup" element={<SignUpForm />} />
      </Routes>
    </BrowserRouter>
    </AuthProvider>

  </React.StrictMode>
);
