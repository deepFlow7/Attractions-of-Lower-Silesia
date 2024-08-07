import React, { createContext, useContext, ReactNode, useEffect } from 'react';
import { User, role } from '../types';
import { useSessionStorage } from '../Hooks/SessionStorage';
import api from '../API/api';
import { AssistantDirection } from '@mui/icons-material';


interface Context{
    isAuthenticated: boolean,
    login: (username:string,password:string)=>void,
    logout: ()=>void,
    user: User|null,
    username: string,
    role: role,
    setRole: (r:role)=>void,
    updateUsername: (s:string)=>void,
    updateUser: (new_user:User|null)=>void
}

const AuthContext = createContext({} as Context);



export const AuthProvider = ({ children } : {children : ReactNode}) => {
    const [isAuthenticated, setIsAuthenticated] = useSessionStorage('authenticated?',false);
    const [user, setUser] = useSessionStorage('user',null);
    const [role, setRole] = useSessionStorage('role',null);
    const [username, updateUsername] = useSessionStorage('username', null);

    const fetchSession = async () => {
        try {
            const response = await api.get('/profile');
            if (response.data.authenticated) {
                setIsAuthenticated(true);
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
    

    const updateUser=(new_user:User|null)=>{
        setUser(new_user);
    }

    const login = async (username:string,password:string) => {
        try {
            const response = await api.post('/login',{login:username,password});
            if (response.data.authenticated) {
                setIsAuthenticated(true);
                fetchSession();
            }
        } catch (error) {
            console.error('Login failed', error);
        }
    };

    const logout = async () => {
        try {
            await api.get('/logout');
            setIsAuthenticated(false);
            setUser(null);
            updateUsername('');
            setRole(null);
        } catch (error) {
            console.error('Logout failed', error);
        }
    };


    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout, user, username, role, updateUsername, setRole, updateUser } as Context}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
