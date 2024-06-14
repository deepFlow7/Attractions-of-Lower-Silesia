import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { User } from '../types';

interface Context{
    isAuthenticated: boolean,
    login: ()=>void,
    logout: ()=>void,
    user: User|null,
    updateUser: (new_user:User|null)=>void
}

const AuthContext = createContext({} as Context);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User|null>(null);
  useEffect(()=>{
    axios.get('/api/profile').then(response=>{
            setUser(response.data as User);
            setIsAuthenticated(true);
        }).catch(error =>{
        console.error("Błąd sprawdzania zalogowania:",error);});
    }
  ,[])

  const updateUser=(new_user:User|null)=>{
    setUser(new_user);
  }

  const login = () => {
    setIsAuthenticated(true);
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, user, updateUser } as Context}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
