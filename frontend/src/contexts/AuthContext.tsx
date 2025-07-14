import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';

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

  // Verificar se o token está válido
  const checkTokenValidity = async (token: string) => {
    try {
      await api.get('/auth/users/me/', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return true;
    } catch (error) {
      console.error('Token inválido ou expirado');
      return false;
    }
  };

  useEffect(() => {
    const loadUserData = async () => {
      const storedToken = localStorage.getItem('token');
      const userData = localStorage.getItem('user_data');
      
      if (storedToken && userData) {
        try {
          // Verifica se o token ainda é válido
          const isValid = await checkTokenValidity(storedToken);
          
          if (isValid) {
            setToken(storedToken);
            const parsedUser = JSON.parse(userData);
            setUser(parsedUser);
            console.log('Usuário recuperado:', parsedUser);
          } else {
            // Token inválido ou expirado
            console.log('Token expirado, fazendo logout');
            logout();
          }
        } catch (error) {
          console.error('Erro ao recuperar dados:', error);
          logout();
        }
      }
      setIsLoading(false);
    };

    loadUserData();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // 1. Autentica e obtém o token JWT
      const response = await api.post('/auth/jwt/create/', {
        email,
        password,
      });

      if (response.data.access) {
        const accessToken = response.data.access;
        localStorage.setItem('token', accessToken);
        setToken(accessToken);

        // 2. Busca os dados do usuário autenticado
        const userResponse = await api.get('/auth/users/me/', {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        });

        const userData = userResponse.data;
        localStorage.setItem('user_data', JSON.stringify(userData));
        setUser(userData);
        setIsLoading(false);
        return true;
      }
      throw new Error('Falha na autenticação');
    } catch (error) {
      console.error('Erro no login:', error);
      setIsLoading(false);
      throw error; // Propaga o erro para o componente Login
    }
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const response = await api.post('/auth/users/', {
        username: name,
        email,
        password,
      });

      if (response.status === 201) {
        // toast.success('Cadastro realizado com sucesso! Faça login para continuar.'); // Removed toast
        setIsLoading(false);
        navigate('/login');
        return true;
      }
    } catch (error: any) {
      console.error('Erro no registro:', error);
      const errorMessage = error.response?.data?.detail || 'Erro ao fazer cadastro. Tente novamente.';
      // toast.error(errorMessage); // Removed toast
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