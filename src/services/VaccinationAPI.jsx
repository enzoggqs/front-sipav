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

            console.log(response)

            return response
        } catch (error) {
            toast.error(error.response.data);

            throw error;
        }
    }

    const getAllVaccinations = async (userId, vaccineId) => {
        try {
            const token = localStorage.getItem('@sipavAccessToken');

            if (!token) {
                throw new Error('Authorization token not found');
            }

            const response = await api.get(`/vaccination/${userId}/${vaccineId}`);

            console.log(response)
            // const responseData = await response.json();

            return response;
        } catch (error) {
            toast.error(error.response.data);

            throw error;
        }
    };

    async function createVaccination(data) {
        console.log(data)

        data.date = new Date(data.date).toISOString();
        console.log(data)
        try {
            const token = localStorage.getItem('@sipavAccessToken');

            if (!token) {
                throw new Error('Authorization token not found');
            }

            console.log('passou aq')
            await api.post('vaccination/', data);


            return
        } catch (error) {
            toast.error(error.response.data);
            throw error;
        }
    };

    async function deleteVaccination(id) {
        console.log(id)
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

    return { getAllVaccinations, createVaccination, deleteVaccination, getAllVaccines }
}

export default VaccinationAPI