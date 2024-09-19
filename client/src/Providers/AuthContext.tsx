import React, { createContext, useContext, ReactNode, useEffect } from 'react';

import { useSessionStorage } from '../Hooks/SessionStorage';
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
  updateUser: (new_user: User | null) => void;
}

const AuthContext = createContext({} as Context);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useSessionStorage('authenticated?', false);
  const [isBlocked, setIsBlocked] = useSessionStorage('blocked?', false);
  const [user, setUser] = useSessionStorage('user', null);
  const [role, setRole] = useSessionStorage('role', null);
  const [username, updateUsername] = useSessionStorage('username', null);

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


  const updateUser = (new_user: User | null) => {
    setUser(new_user);
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
        updateUser
      } as Context}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
