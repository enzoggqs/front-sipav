import api from '../services/Api'

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
            console.error('Failed to fetch diseases:', error.message);
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
            console.error('Failed to fetch disease:', error.message);
            throw error;
        }

    }

    return { getAllDiseases, getDiseaseAndVaccine }
}

export default DiseaseAPI