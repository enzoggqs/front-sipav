import { renderHook, act } from '@testing-library/react';
import useAuth from '../useAuth.jsx';
import api from '../Api';
import { toast } from 'react-toastify';
import PathRoutes from '../../routes/PathRoutes';
import { BrowserRouter as Router } from 'react-router-dom';

// Mocking dependencies
jest.mock('../Api');
jest.mock('react-toastify', () => ({
  toast: {
    error: jest.fn(),
  },
}));

// Mocking navigate function
const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('useAuth hook', () => {
  afterEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  test('should set isAuthenticated to true if token exists in localStorage', () => {
    localStorage.setItem('@sipavAccessToken', 'test-token');
    
    const { result } = renderHook(() => useAuth());
    
    expect(result.current.isAuthenticated).toBe(true);
  });

  test('signIn should authenticate user and store token and user info', async () => {
    const userData = {
      id: 1,
      email: 'test@mail.com',
      name: 'Test User',
      cpf: '12345678900',
      phoneNumber: '1234567890',
      dependents: [],
    };

    api.post.mockResolvedValue({
      data: {
        token: 'test-token',
        userExists: userData,
      },
    });

    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.signIn('test@mail.com', 'password', mockNavigate);
    });

    expect(api.post).toHaveBeenCalledWith('login/', {
      email: 'test@mail.com',
      password: 'password',
    });
    expect(localStorage.getItem('@sipavAccessToken')).toBe('test-token');
    expect(localStorage.getItem('@sipavUser')).toBe(JSON.stringify(userData));
    expect(result.current.isAuthenticated).toBe(true);
    expect(mockNavigate).toHaveBeenCalledWith(PathRoutes.HOME, { replace: true });
  });

  test('update should update user info in localStorage', async () => {
    const userData = {
      id: 1,
      email: 'updated@mail.com',
      name: 'Updated User',
      cpf: '12345678900',
      phoneNumber: '1234567890',
    };

    api.put.mockResolvedValue({ data: {} });

    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.update(userData);
    });

    expect(api.put).toHaveBeenCalledWith('user/1', userData);
    expect(localStorage.getItem('@sipavUser')).toBe(JSON.stringify(userData));
  });
});
