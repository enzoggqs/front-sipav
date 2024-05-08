import api from './Api'

const DependentAPI = () => {
    const getAllDependents = async (userId) => {
        try {
            const token = localStorage.getItem('@sipavAccessToken');

            if (!token) {
                throw new Error('Authorization token not found');
            }

            const response = await api.get(`/user/${userId}`);
    
            console.log(response)
            // const responseData = await response.json();
    
            return response;
        } catch (error) {
            console.error('Failed to fetch dependents:', error.message);
            throw error;
        }
    };
    
    async function createDependent (data) {
        data.birthdate = new Date(data.birthdate)
        try {
            const token = localStorage.getItem('@sipavAccessToken');

            if (!token) {
                throw new Error('Authorization token not found');
            }
            
            await api.post('user/', data);

            return
        } catch (error) {
            console.error('Create dependent error:', error.message);
            throw error;
        }
    };

    async function updateDependent (data, id) {
        data.birthdate = new Date(data.birthdate)
        console.log(data)
        try {
            const token = localStorage.getItem('@sipavAccessToken');

            if (!token) {
                throw new Error('Authorization token not found');
            }
            
            await api.put(`/user/${id}`, data);
        
            return
        } catch (error) {
            console.error('Create dependent error:', error.message);
            throw error;
        }
    };

    async function deleteDependent (id) {
        console.log(id)
        try {
            const token = localStorage.getItem('@sipavAccessToken');

            if (!token) {
                throw new Error('Authorization token not found');
            }    
    
            await api.delete(`/user/${id}`);

            return
        } catch (error) {
            console.error('Delete dependent error:', error.message);
            throw error;
        }
    };

    return { getAllDependents, createDependent, updateDependent, deleteDependent }
}

export default DependentAPI