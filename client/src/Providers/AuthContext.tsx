import React, { createContext, useState, useContext } from 'react';
import { User, role } from '../types';
import { useSessionStorage } from '../Hooks/SessionStorage';


interface Context{
    isAuthenticated: boolean,
    login: ()=>void,
    logout: ()=>void,
    user: User|null,
    username: string,
    role: role,
    setRole: (r:role)=>void,
    updateUsername: (s:string)=>void,
    updateUser: (new_user:User|null)=>void
}

const AuthContext = createContext({} as Context);



export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useSessionStorage('authenticated?',false);
  const [user, setUser] = useSessionStorage('user',null);
  const [role, setRole] = useSessionStorage('role',null);
  const [username, updateUsername] = useSessionStorage('username', null);

  

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
    <AuthContext.Provider value={{ isAuthenticated, login, logout, user, username, role, updateUsername, setRole, updateUser } as Context}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
