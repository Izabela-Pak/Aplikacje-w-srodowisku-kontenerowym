import React, { createContext, useContext, useState, useEffect } from 'react';
import { userServices } from '../services/auth.api';
import type { ReactNode } from "react";

interface AuthContextType {
    isAuthenticated: boolean;
    isLoading: boolean;
    userRole: string | null;
    userEmail: string | null;
    isRegistered: boolean;
    login: () => Promise<void>;
    logout: () => void;
    register: () => void;
    verified: () => void;
}

//Do przechowywania globalnego stanu autoryzacji
const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}


export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [userRole, setUserRole] = useState<string | null>(null);
    const [userEmail, setUserEmail] = useState<string | null>(null);
    const [isRegistered, setIsRegistered] = useState<boolean>(false);

    const register = () => setIsRegistered(true);
    const verified = () => setIsRegistered(false);
    
    useEffect(() => {
        //Sprawdzenie poprawności tokena przy starcie
        async function CheckAuth() {
            try{
                const response = await userServices.validate();
                const data = response.data;

                setIsAuthenticated(true);
                setUserEmail(data.username);
                setUserRole(data.role)
            }catch{
                setIsAuthenticated(false);
                setUserEmail(null);
                setUserRole(null);
            }finally{
                setIsLoading(false);
            }
        }
        CheckAuth();
    }, []);

    //lokalnie ustawia stan zalogowania
    const login = async (): Promise<void> => {
        setIsAuthenticated(true);
        setUserRole('USER');
    }

    //Usuwa stan zalogowania i czyści token z lokalnej pamięci
    const logout = (): void => {
        setIsAuthenticated(false);
        setUserEmail(null);
        setUserRole(null);
        localStorage.removeItem("token");
    }

    //value zawiera wszystkie dane i funkcje dla dzieci komponentów
    //Dzięki temu w całym React możesz zrobić np.: const { isAuthenticated, userRole } = useAuth();
    return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, userEmail, userRole, login, logout, isRegistered, register, verified }}>
      {children}
    </AuthContext.Provider>
  );

}

//Prosty hook, żeby pobierać kontekst w każdym komponencie.
export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if(!context) throw new Error('useAuth musi być wewnątrz AuthProvider');
    return context;
};

