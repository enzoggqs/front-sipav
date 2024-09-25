import { toast } from 'react-toastify';
import api from './Api'

const DiseaseAPI = () => {
    const getAllDiseases = async (userId) => {
        try {
            const token = localStorage.getItem('@sipavAccessToken');

            if (!token) {
                throw new Error('Authorization token not found');
            }

            const response = await api.get(`/disease`);

            return response;
        } catch (error) {
            toast.error(error.response?.data);
            throw error;
        }
    };

    const createDisease = async (data) => {
        try {
            const token = localStorage.getItem('@sipavAccessToken');

            if (!token) {
                throw new Error('Authorization token not found');
            }

            await api.post('disease/', data);

            return;
        } catch (error) {
            toast.error(error.response?.data);
            throw error;
        }
    };

    const editDisease = async (id, data) => {
        try {
            const token = localStorage.getItem('@sipavAccessToken');

            if (!token) {
                throw new Error('Authorization token not found');
            }

            await api.put(`disease/${id}`, data);

            return;
        } catch (error) {
            toast.error(error.response?.data);
            throw error;
        }
    };

    const getDiseaseAndVaccine = async (id, userId) => {
        try {
            const token = localStorage.getItem('@sipavAccessToken');

            if (!token) {
                throw new Error('Authorization token not found');
            }

            const response = await api.get(`/disease/${id}/user=${userId}`);

            return response;
        }
        catch (error) {
            toast.error(error.response?.data);
            throw error;
        }

    }

    const getDiseaseVaccinationPercentage = async (id, userType) => {
        try {
            const token = localStorage.getItem('@sipavAccessToken');

            if (!token) {
                throw new Error('Authorization token not found');
            }

            if(userType !== "ADMIN") {
                throw new Error('User not permited');
            }

            const response = await api.get(`/disease/vaccination-percentage/${id}`);

            return response;
        }
        catch (error) {
            toast.error(error.response?.data);
            throw error;
        }
    }

    const getDiseaseById = async (id) => {
        try {
            const token = localStorage.getItem('@sipavAccessToken');

            if (!token) {
                throw new Error('Authorization token not found');
            }

            const response = await api.get(`/disease/${id}`);

            return response;
        }
        catch (error) {
            toast.error(error.response?.data);
            throw error;
        }
    }

    return { 
        getAllDiseases, 
        getDiseaseAndVaccine, 
        getDiseaseVaccinationPercentage, 
        createDisease,
        getDiseaseById,
        editDisease
    }
}

export default DiseaseAPI