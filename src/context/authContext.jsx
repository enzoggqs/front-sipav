import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/Api';
import PathRoutes from '../routes/PathRoutes';
import { toast } from 'react-toastify';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userType, setUserType] = useState(0);

  useEffect(() => {
    // Verificar se o usuário está autenticado ao carregar o componente
    setIsAuthenticated(localStorage.getItem('@sipavAccessToken') !== null);
    const user = JSON.parse(localStorage.getItem('@sipavUser'));
    console.log(user)
    if (user) {
      setUserType(user.type);
    }
  }, []);

  const signIn = async (email, password, navigate) => {
    try {
      const { data } = await api.post('login/', {
        email,
        password,
      });

      const { token } = data;

      localStorage.setItem('@sipavAccessToken', token);
      localStorage.setItem('@sipavUser', JSON.stringify({
        id: data.userExists.id,
        email: data.userExists.email,
        name: data.userExists.name,
        cpf: data.userExists.cpf,
        phoneNumber: data.userExists.phoneNumber,
        dependents: data.userExists.dependents,
        type: data.userExists.type,
      }));

      api.defaults.headers.authorization = `Token ${token}`;
      
      console.log(data.userExists.type)
      setIsAuthenticated(true);
      setUserType(data.userExists.type);
      
      navigate(PathRoutes.HOME, {
        replace: true,
      });
    } catch (error) {
      toast.error(error?.response?.data);
      throw error;
    }
  };

  const register = async (data, navigate) => {
    try {
      await api.post('user/', {
        ...data,
        isResponsible: true,
      });

      signIn(data.email, data.password, navigate)
    } catch (error) {
      toast.error(error.response.data);
      throw error;
    }
  };

  const update = async (data) => {
    try {
      await api.put(`user/${data.id}`, {
        ...data,
      });

      localStorage.setItem('@sipavUser', JSON.stringify({
        id: data.id,
        email: data.email,
        name: data.name,
        cpf: data.cpf,
        phoneNumber: data.phoneNumber,
        type: data.userExists.type,
      }));
    } catch (error) {
      toast.error(error.response.data);
      throw error;
    }
  }

  const signOut = () => {
    api.defaults.headers.authorization = '';
    localStorage.removeItem('@sipavAccessToken');
    localStorage.removeItem('@sipavUser');
    setIsAuthenticated(false);
    window.location.href = PathRoutes.LOGIN;
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, signIn, register, update, signOut, userType }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
