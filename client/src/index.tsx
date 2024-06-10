import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes} from 'react-router-dom';
import Navbar from './Components/Navbar';
import Home from './Components/Home';
import Attraction from "./Components/Attraction";
import ChallengeView from './Components/Challenge';
import Challenges from './Components/Challenges';
import NewAttractionForm from './Components/NewAttractionForm';
import Ranking from './Components/Ranking';
import SignUpForm from './Components/SignUpForm';
import LoginForm from './Components/LoginForm';
import axios from 'axios';
import { AuthProvider } from './Components/AuthContext';





const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider>
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/attraction/:id" element={<Attraction />} />
        <Route path="/challenge/:id" element={<ChallengeView />} />
        <Route path="/challenges" element={<Challenges completedChallenges={[]}/>} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/new_attraction" element={<NewAttractionForm onSubmit={{}} />} />
        <Route path="/ranking" element={<Ranking />} />
        <Route path="/signup" element={<SignUpForm onRegister={{}} />} />
      </Routes>
    </BrowserRouter>
    </AuthProvider>

  </React.StrictMode>
);
