import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate checking for existing auth token
    const token = localStorage.getItem('auth_token');
    const userData = localStorage.getItem('user_data');
    
    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
      } catch {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_data');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // 1. Autentica e obtém o token JWT
      const response = await fetch('http://localhost:8000/auth/jwt/create/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        setIsLoading(false);
        return false;
      }

      const data = await response.json();
      const token = data.access;
      localStorage.setItem('auth_token', token);

      // 2. Busca os dados do usuário autenticado
      const userResponse = await fetch('http://localhost:8000/auth/users/me/', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!userResponse.ok) {
        setIsLoading(false);
        return false;
      }

      const userData = await userResponse.json();
      localStorage.setItem('user_data', JSON.stringify(userData));
      setUser(userData);
      setIsLoading(false);
      return true;
    } catch {
      setIsLoading(false);
      return false;
    }
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:8000/auth/users/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({    
          username: name, // ou pode ser name, dependendo do backend    
          email,
          password,
        }),
      });

      if (response.ok) {
        setIsLoading(false);
        navigate('/login'); // Redireciona para /login após registro bem-sucedido
        return true;
      }
    } catch {
      // Trate o erro conforme necessário
    }
    setIsLoading(false);
    return false;
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};