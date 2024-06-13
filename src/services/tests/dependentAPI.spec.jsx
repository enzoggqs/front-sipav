import { renderHook } from '@testing-library/react';
import { toast } from 'react-toastify';
import api from '../Api';
import DependentAPI from '../DependentAPI.jsx';

// Mocking dependencies
jest.mock('../Api');
jest.mock('react-toastify', () => ({
  toast: {
    error: jest.fn(),
  },
}));

describe('DependentAPI', () => {
  afterEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  describe('getAllDependents', () => {
    test('should fetch all dependents successfully', async () => {
      const mockDependents = [{ id: 1, name: 'Dependent 1' }];
      api.get.mockResolvedValue({ data: mockDependents });

      const { getAllDependents } = DependentAPI();
      
      const userId = 1;
      localStorage.setItem('@sipavAccessToken', 'test-token');
      
      const result = await getAllDependents(userId);
      
      expect(api.get).toHaveBeenCalledWith(`/user/${userId}`);
      expect(result.data).toEqual(mockDependents);
    });

    test('should handle error if token is not found', async () => {
        const { getAllDependents } = DependentAPI();
        
        const userId = 1;
        
        await expect(getAllDependents(userId)).rejects.toThrow('Authorization token not found');
        expect(toast.error).toHaveBeenCalled();
      });
  });

  describe('createDependent', () => {
    test('should create a dependent successfully', async () => {
      api.post.mockResolvedValue({});

      const { createDependent } = DependentAPI();

      const dependentData = { name: 'New Dependent', birthdate: '2022-10-10' };
      localStorage.setItem('@sipavAccessToken', 'test-token');

      await createDependent(dependentData);

      expect(api.post).toHaveBeenCalledWith('user/', { ...dependentData, birthdate: new Date(dependentData.birthdate) });
    });

    test('should handle error if token is not found', async () => {
        const { createDependent } = DependentAPI();
  
        const dependentData = { name: 'New Dependent', birthdate: '2022-10-10' };
  
        await expect(createDependent(dependentData)).rejects.toThrow('Authorization token not found');
        expect(toast.error).toHaveBeenCalled();
    });
  });

  describe('updateDependent', () => {
    test('should update a dependent successfully', async () => {
      api.put.mockResolvedValue({});

      const { updateDependent } = DependentAPI();

      const dependentData = { name: 'Updated Dependent', birthdate: '2022-10-10' };
      const id = 1;
      localStorage.setItem('@sipavAccessToken', 'test-token');

      await updateDependent(dependentData, id);

      expect(api.put).toHaveBeenCalledWith(`/user/${id}`, { ...dependentData, birthdate: new Date(dependentData.birthdate) });
    });

    test('should handle error if token is not found', async () => {
        const { updateDependent } = DependentAPI();
  
        const dependentData = { name: 'Updated Dependent', birthdate: '2022-10-10' };
        const id = 1;
  
        await expect(updateDependent(dependentData, id)).rejects.toThrow('Authorization token not found');
        expect(toast.error).toHaveBeenCalled();
      });
  });

  describe('deleteDependent', () => {
    test('should delete a dependent successfully', async () => {
      api.delete.mockResolvedValue({});

      const { deleteDependent } = DependentAPI();

      const id = 1;
      localStorage.setItem('@sipavAccessToken', 'test-token');

      await deleteDependent(id);

      expect(api.delete).toHaveBeenCalledWith(`/user/${id}`);
    });

    test('should handle error if token is not found', async () => {
      const { deleteDependent } = DependentAPI();

      const id = 1;

      await expect(deleteDependent(id)).rejects.toThrow('Authorization token not found');
      expect(toast.error).toHaveBeenCalled();
    });
  });
});
