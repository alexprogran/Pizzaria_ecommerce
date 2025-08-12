import React, { createContext, useState, useContext, useEffect } from 'react';
import api from './Api';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('pizza-user');
    const token = localStorage.getItem('pizza-token');
    if (storedUser && token) {
      api.defaults.headers.common['Authorization'] = `Token ${token}`;
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (username, password) => {
    try {
      const response = await api.post('/api/auth/login/', { username, password });
      const token = response.data.token;
      localStorage.setItem('pizza-token', token);
      api.defaults.headers.common['Authorization'] = `Token ${token}`;

      const userProfile = await api.get('/endpoint/profile/');
      const userData = userProfile.data[0]; // considerando que retorna uma lista

      const fullUser = {
        id: userData.user.id,
        username: userData.user.username,
        email: userData.user.email,
        isAdmin: userData.is_admin,
      };
      console.log('Informações do usuário: ', fullUser)

      localStorage.setItem('pizza-user', JSON.stringify(fullUser));

      setUser({ ...fullUser });
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  };

  const register = async (name, email, password) => {
    try {
      await api.post('/endpoint/register/', {
        username: name,
        email,
        password
      });

      return await login(name, password);
    } catch (error) {
      console.error('Register failed:', error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('pizza-user');
    localStorage.removeItem('pizza-token');
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isAdmin: user && user.isAdmin ? user.isAdmin : false,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context || Object.keys(context).length === 0) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
