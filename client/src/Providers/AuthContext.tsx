import React, { createContext, useContext, ReactNode, useEffect, useState } from 'react';

import api from '../API/api';
import { User, Role } from '../types';

interface Context {
  isAuthenticated: boolean;
  isBlocked: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  user: User | null;
  username: string;
  role: Role;
  setRole: (r: Role) => void;
  updateUsername: (s: string) => void;
  updateUser: (newUser: User | null) => void;
  toggleTheme: () => void;
  colors: Object;
}

const AuthContext = createContext({} as Context);

const initial_colors = {
  is_contrast: false,
  primary: '#e9cbb0',
  secondary: '#4d6e6d',
  tertiary: '#B45834',
  white: '#fff',
  dark: '#2a2b2a',
  gray: '#949494',
  light_gray: '#d7c8cb',
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isBlocked, setIsBlocked] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<Role | null>(null);
  const [username, updateUsername] = useState<string | null>(null);
  const [colors, setColors] = useState(initial_colors);

  const fetchSession = async () => {
    try {
      const response = await api.get('/api/user/profile');
      if (response.data.authenticated) {
        setIsAuthenticated(true);
        setIsBlocked(response.data.blocked);
        setUser(response.data.user);
        updateUsername(response.data.username);
        setRole(response.data.role);
      } else {
        setIsAuthenticated(false);
        setUser(null);
        updateUsername('');
        setRole(null);
      }
    } catch (error) {
      console.error('Failed to fetch session', error);
    }
  };

  useEffect(() => {
    fetchSession();
  }, []);


  const updateUser = (newUser: User | null) => {
    setUser(newUser);
  }

  const login = async (username: string, password: string) => {
    try {
      const response = await api.post('/api/user/login', { login: username, password });
      if (response.data.authenticated) {
        setIsAuthenticated(true);
        await fetchSession();
      }
      else {
        throw response.data.error;
      }
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await api.get('/api/user/logout');
      setIsAuthenticated(false);
      setUser(null);
      updateUsername('');
      setRole(null);
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  const setContrastTheme = () => {
    let contrastColors = initial_colors;
    contrastColors.primary = 'fff';
    contrastColors.secondary = '000';
    contrastColors.is_contrast = true;
    setColors(contrastColors);
  }

  const toggleTheme = () => {
    if (colors.is_contrast)
      setColors(initial_colors);
    else
      setContrastTheme();
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isBlocked,
        login,
        logout,
        user,
        username,
        role,
        updateUsername,
        setRole,
        updateUser,
        toggleTheme,
        colors
      } as Context}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
