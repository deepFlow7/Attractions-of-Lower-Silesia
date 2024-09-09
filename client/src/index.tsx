import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import StyledNavbar from './Components/Navbar';
import Home from './Components/Home';
import Attraction from "./Components/Attraction";
import ChallengeView from './Components/Challenge';
import Challenges from './Components/Challenges';
import NewAttractionForm from './Components/NewAttractionForm';
import SignUpForm from './Components/SignUpForm';
import LoginForm from './Components/LoginForm';
import NewChallengeForm from './Components/NewChallengeForm';
import { AuthProvider, useAuth } from './Providers/AuthContext';
import RoutePlanner from './Components/RoutePlanner';
import AdminView from './Components/AdminView';

const ProtectedRoute = ({ element }: { element: JSX.Element }) => {
  const { isAuthenticated, role } = useAuth();
  return isAuthenticated && role === "admin" ? element : <Navigate to="/" replace />;
};

const ProtectedRouteForUnblocked = ({ element }: { element: JSX.Element }) => {
  const { isAuthenticated, isBlocked } = useAuth();
  return isAuthenticated && !isBlocked ? element : <Navigate to="/" replace />;
};

const RootRedirect = () => {
  const { isAuthenticated, role } = useAuth();
  return isAuthenticated && role === "admin" ? <AdminView /> : <Home />;
};

const root = ReactDOM.createRoot(document.getElementById('root')!);
root!.render(
  <>
    <AuthProvider>
      <BrowserRouter>
        <StyledNavbar />
        <Routes>
          <Route path="/" element={<RootRedirect />} />
          <Route path="/attraction/:id" element={<Attraction />} />
          <Route path="/challenge/:id" element={<ChallengeView />} />
          <Route path="/challenges" element={<Challenges />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/new_attraction" element={<ProtectedRouteForUnblocked element={<NewAttractionForm />} />} />
          <Route path="/new_challenge" element={<ProtectedRoute element={<NewChallengeForm />} />} />
          <Route path="/signup" element={<SignUpForm />} />
          <Route path="/route_planner" element={<RoutePlanner />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>

  </>
);
