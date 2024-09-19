import React, { lazy, Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import StyledNavbar from './Components/Navbar';
import { AuthProvider, useAuth } from './Providers/AuthContext';

const paths = ["Home",]
const Home = lazy(() => import('./Components/Home'));
const Attraction = lazy(() => import('./Components/Attraction'));
const ChallengeView = lazy(() => import('./Components/Challenge'));
const Challenges = lazy(() => import('./Components/Challenges'));
const NewAttractionForm = lazy(() => import('./Components/NewAttractionForm'));
const SignUpForm = lazy(() => import('./Components/SignUpForm'));
const LoginForm = lazy(() => import('./Components/LoginForm'));
const NewChallengeForm = lazy(() => import('./Components/NewChallengeForm'));
const RoutePlanner = lazy(() => import('./Components/RoutePlanner'));
const AdminView = lazy(() => import('./Components/AdminView'));

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
root.render(
    <React.StrictMode>
        <AuthProvider>
            <BrowserRouter>
                <StyledNavbar />
                <Suspense fallback={<>loading...</>}>
                    <Routes>
                        <Route path="/" element={<RootRedirect />} />
                        <Route path="/attraction/:attractionId" element={<Attraction />} />
                        <Route path="/challenge/:challengeId" element={<ChallengeView />} />
                        <Route path="/challenges" element={<Challenges />} />
                        <Route path="/login" element={<LoginForm />} />
                        <Route path="/new_attraction" element={<ProtectedRouteForUnblocked element={<NewAttractionForm />} />} />
                        <Route path="/new_challenge" element={<ProtectedRoute element={<NewChallengeForm />} />} />
                        <Route path="/signup" element={<SignUpForm />} />
                        <Route path="/route_planner" element={<RoutePlanner />} />
                    </Routes>
                </Suspense>
            </BrowserRouter>
        </AuthProvider>
    </React.StrictMode>
);
