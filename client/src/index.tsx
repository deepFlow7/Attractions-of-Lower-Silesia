import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes, Navigate} from 'react-router-dom';
import Navbar from './Components/Navbar';
import Home from './Components/Home';
import Attraction from "./Components/Attraction";
import ChallengeView from './Components/Challenge';
import Challenges from './Components/Challenges';
import NewAttractionForm from './Components/NewAttractionForm';
import SignUpForm from './Components/SignUpForm';
import LoginForm from './Components/LoginForm';
import NewChallengeForm from './Components/NewChallengeForm';
import { AuthProvider, useAuth } from './Providers/AuthContext';
import {SearchProvider} from './Providers/SearchContext';


const ProtectedRoute = ({ element }: { element: JSX.Element }) => {
  const { isAuthenticated, role } = useAuth();
  return isAuthenticated && role == "admin" ? element : <Navigate to="/" replace />;
};

const root = ReactDOM.createRoot(document.getElementById('root')!);
root!.render(
  <React.StrictMode>
    <AuthProvider>
    <SearchProvider>
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/attraction/:id" element={<Attraction />} />
        <Route path="/challenge/:id" element={<ChallengeView />} />
        <Route path="/challenges" element={<Challenges />} />
        <Route path="/login" element={<LoginForm  />} />
        <Route path="/new_attraction" element={<NewAttractionForm />} />
        <Route path="/new_challenge" element={<ProtectedRoute element={<NewChallengeForm />} />} />
        <Route path="/signup" element={<SignUpForm />} />
      </Routes>
    </BrowserRouter>
    </SearchProvider>
    </AuthProvider>

  </React.StrictMode>
);
