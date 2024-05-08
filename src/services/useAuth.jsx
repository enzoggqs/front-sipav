import { useState, useEffect, useContext } from 'react';
import api from './Api';
import PathRoutes from '../routes/PathRoutes';

const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Verificar se o usuário está autenticado ao carregar o componente
    setIsAuthenticated(localStorage.getItem('@sipavAccessToken') !== null);
  }, []);

  const signIn = async (email, password, navigate) => {
    try {
      const { data } = await api.post('login/', {
        email,
        password,
      });

      const { token } = data;

      console.log(data)
      localStorage.setItem('@sipavAccessToken', token);
      localStorage.setItem('@sipavUser', JSON.stringify({
        id: data.userExists.id,
        email: data.userExists.email,
        name: data.userExists.name,
        cpf: data.userExists.cpf,
        telegram: data.userExists.telegram,
        phoneNumber: data.userExists.phoneNumber,
        dependents: data.userExists.dependents,
      }));
      
      api.defaults.headers.authorization = `Token ${token}`;

      const userLogged = {
        email: data.userExists.email,
        name: data.userExists.name,
        cpf: data.userExists.cpf,
        telegram: data.userExists.telegram,
        phoneNumber: data.userExists.phoneNumber,
      }
      
      setIsAuthenticated(true);
      
      navigate(PathRoutes.HOME, {
        replace: true,
      });
    } catch (error) {
      throw error;
    }
  };

  const register = async (data, navigate) => {
    try {
      await api.post('user/', {
        ...data,
        isResponsible: true,
      });

      const { token } = data;

      localStorage.setItem('@sipavAccessToken', token);
      localStorage.setItem('@sipavUser', JSON.stringify({
        id: data.userExists.id,
        email: data.userExists.email,
        name: data.userExists.name,
        cpf: data.userExists.cpf,
        telegram: data.userExists.telegram,
        phoneNumber: data.userExists.phoneNumber,
        dependents: data.userExists.dependents,
      }));
      api.defaults.headers.authorization = `Token ${token}`;

      navigate(PathRoutes.HOME, {
        replace: true,
      });

      setIsAuthenticated(true);
    } catch (error) {
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
        telegram: data.telegram,
        phoneNumber: data.phoneNumber,
      }));
    } catch (error) {
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

  return {
    isAuthenticated,
    signIn,
    register,
    update,
    signOut,
  };
};

export default useAuth;