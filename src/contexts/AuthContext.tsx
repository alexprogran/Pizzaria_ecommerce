import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

interface AuthContextType {
  user: User | null;
  token: string | null;
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
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Configurar o interceptor do axios
  useEffect(() => {
    const interceptor = axios.interceptors.request.use(
      config => {
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      error => {
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.request.eject(interceptor);
    };
  }, [token]);

  useEffect(() => {
    // Verificar token existente
    const storedToken = localStorage.getItem('token');
    const userData = localStorage.getItem('user_data');
    
    console.log('Token armazenado:', storedToken); // Debug
    console.log('Dados do usuário armazenados:', userData); // Debug
    
    if (storedToken && userData) {
      try {
        setToken(storedToken);
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        console.log('Usuário recuperado:', parsedUser); // Debug
      } catch (error) {
        console.error('Erro ao recuperar dados:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user_data');
        setToken(null);
        setUser(null);
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // 1. Autentica e obtém o token JWT
      const response = await axios.post('http://localhost:8000/auth/jwt/create/', {
        email,
        password,
      });

      console.log('Resposta do login:', response.data); // Debug

      if (response.data.access) {
        const accessToken = response.data.access;
        localStorage.setItem('token', accessToken);
        setToken(accessToken);

        // 2. Busca os dados do usuário autenticado
        const userResponse = await axios.get('http://localhost:8000/auth/users/me/', {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        });

        console.log('Dados do usuário:', userResponse.data); // Debug

        const userData = userResponse.data;
        localStorage.setItem('user_data', JSON.stringify(userData));
        setUser(userData);
        setIsLoading(false);
        return true;
      }
    } catch (error) {
      console.error('Erro no login:', error);
      setIsLoading(false);
    }
    return false;
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const response = await axios.post('http://localhost:8000/auth/users/', {
        username: name,
        email,
        password,
      });

      if (response.status === 201) {
        setIsLoading(false);
        navigate('/login');
        return true;
      }
    } catch (error) {
      console.error('Erro no registro:', error);
    }
    setIsLoading(false);
    return false;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user_data');
    setToken(null);
    setUser(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};