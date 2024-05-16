import { useState, useEffect, useContext } from 'react';
import api from './Api';
import PathRoutes from '../routes/PathRoutes';
import { toast } from 'react-toastify';

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
        phoneNumber: data.userExists.phoneNumber,
        dependents: data.userExists.dependents,
      }));
      
      api.defaults.headers.authorization = `Token ${token}`;
      
      setIsAuthenticated(true);
      
      navigate(PathRoutes.HOME, {
        replace: true,
      });
    } catch (error) {
      toast.error(error.response.data);
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

  return {
    isAuthenticated,
    signIn,
    register,
    update,
    signOut,
  };
};

export default useAuth;