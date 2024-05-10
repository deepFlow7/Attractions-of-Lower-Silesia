import React from 'react';
import ReactDOM from 'react-dom/client';
import {createBrowserRouter, RouterProvider} from 'react-router-dom';
import './index.css';
import Navbar from './Components/Navbar/Navbar.tsx';
import Home from './Components/Home.tsx';
import Attraction from "./Components/Attraction.tsx";

const router=createBrowserRouter([
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/attraction/:id",
        element: <Attraction />
      }
    ]
)

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Navbar />
    <RouterProvider router={router} />
  </React.StrictMode>
);