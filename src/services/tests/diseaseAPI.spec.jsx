import { toast } from 'react-toastify';
import api from '../Api';
import DiseaseAPI from '../DiseaseApi.jsx';

// Mocking dependencies
jest.mock('../Api');
jest.mock('react-toastify', () => ({
  toast: {
    error: jest.fn(),
  },
}));

describe('DiseaseAPI', () => {
  afterEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  describe('getAllDiseases', () => {
    test('should fetch all diseases successfully', async () => {
      const mockDiseases = [{ id: 1, name: 'Disease 1' }];
      api.get.mockResolvedValue({ data: mockDiseases });

      const { getAllDiseases } = DiseaseAPI();

      localStorage.setItem('@sipavAccessToken', 'test-token');

      const result = await getAllDiseases();

      expect(api.get).toHaveBeenCalledWith(`/disease`);
      expect(result.data).toEqual(mockDiseases);
    });

    test('should handle error if token is not found', async () => {
      const { getAllDiseases } = DiseaseAPI();

      await expect(getAllDiseases()).rejects.toThrow('Authorization token not found');
      expect(toast.error).toHaveBeenCalled();
    });
  });

  describe('getDiseaseAndVaccine', () => {
    test('should fetch disease and vaccine data successfully', async () => {
      const mockData = { disease: { id: 1, name: 'Disease 1' }, vaccine: { id: 1, name: 'Vaccine 1' } };
      const diseaseId = 1;
      const userId = 1;
      api.get.mockResolvedValue({ data: mockData });

      const { getDiseaseAndVaccine } = DiseaseAPI();

      localStorage.setItem('@sipavAccessToken', 'test-token');

      const result = await getDiseaseAndVaccine(diseaseId, userId);

      expect(api.get).toHaveBeenCalledWith(`/disease/${diseaseId}/user=${userId}`);
      expect(result.data).toEqual(mockData);
    });

    test('should handle error if token is not found', async () => {
      const { getDiseaseAndVaccine } = DiseaseAPI();

      const diseaseId = 1;
      const userId = 1;

      await expect(getDiseaseAndVaccine(diseaseId, userId)).rejects.toThrow('Authorization token not found');
      expect(toast.error).toHaveBeenCalled();
    });
  });
});
