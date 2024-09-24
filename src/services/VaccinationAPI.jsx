import { toast } from 'react-toastify';
import api from '../services/Api'

const VaccinationAPI = () => {
    const getAllVaccines = async () => {
        try {
            const token = localStorage.getItem('@sipavAccessToken');

            if (!token) {
                throw new Error('Authorization token not found');
            }

            const response = await api.get(`/vaccine`);

            return response
        } catch (error) {
            toast.error(error.response.data);

            throw error;
        }
    }

    async function createVaccine(data) {
        try {
            const token = localStorage.getItem('@sipavAccessToken');

            if (!token) {
                throw new Error('Authorization token not found');
            }

            await api.post('vaccine/', data);

            return
        } catch (error) {
            toast.error(error.response.data);
            throw error;
        }
    };

    const getAllVaccinations = async (userId, vaccineId) => {
        try {
            const token = localStorage.getItem('@sipavAccessToken');

            if (!token) {
                throw new Error('Authorization token not found');
            }

            const response = await api.get(`/vaccination/${userId}/${vaccineId}`);

            return response;
        } catch (error) {
            toast.error(error.response.data);

            throw error;
        }
    };

    async function createVaccination(data) {
        data.date = new Date(data.date).toISOString();
        try {
            const token = localStorage.getItem('@sipavAccessToken');

            if (!token) {
                throw new Error('Authorization token not found');
            }

            await api.post('vaccination/', data);


            return
        } catch (error) {
            toast.error(error.response.data);
            throw error;
        }
    };

    async function deleteVaccination(id) {
        try {
            const token = localStorage.getItem('@sipavAccessToken');

            if (!token) {
                throw new Error('Authorization token not found');
            }

            await api.delete(`/vaccination/${id}`);

            return
        } catch (error) {
            toast.error(error.response.data);

            throw error;
        }
    };

    const getVaccinationDistribution = async (diseaseId = null) => {
        try {
            const token = localStorage.getItem('@sipavAccessToken');

            if (!token) {
                throw new Error('Authorization token not found');
            }

            var response;

            if(diseaseId){
                response = await api.get(`/vaccination/distribution`, {
                    params: { diseaseId }
                });
            } else {
                response = await api.get(`/vaccination/distribution`)
            }

            return response.data;
        } catch (error) {
            toast.error(error.response.data);
            throw error;
        }
    };

    const getMonthlyVaccinationDistribution = async (diseaseId = null) => {
        try {
            const token = localStorage.getItem('@sipavAccessToken');

            if (!token) {
                throw new Error('Authorization token not found');
            }

            var response;

            if(diseaseId){
                response = await api.get(`/vaccination/monthly-distribution`, {
                    params: { diseaseId }
                });
            } else {
                response = await api.get(`/vaccination/monthly-distribution`)
            }

            return response.data;
        } catch (error) {
            toast.error(error.response.data);
            throw error;
        }
    };

    return {
        getAllVaccinations,
        createVaccine,
        createVaccination, 
        deleteVaccination, 
        getAllVaccines,
        getVaccinationDistribution,
        getMonthlyVaccinationDistribution
    }
}

export default VaccinationAPI