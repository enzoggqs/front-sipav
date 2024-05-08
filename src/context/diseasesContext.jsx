import React, {createContext, useEffect, useState} from 'react'
import DiseaseAPI from '../services/DiseaseApi';

export const DiseasesContext = createContext();

export const DiseasesProvider = ({children}) => {
    const [diseases, setDiseases] = useState([])

    const { getAllDiseases } = DiseaseAPI();

    useEffect(() => {
        const fetchDiseases = async () => {
        try {
            const diseasesData = await getAllDiseases();

            setDiseases(diseasesData);
        } catch (error) {
            console.error('Failed to fetch diseases:', error.message);
        }
        };
    
        fetchDiseases();
    
    }, []);

    return (
        <DiseasesContext.Provider value={{diseases}}>
            {children}
        </DiseasesContext.Provider>
    )
}

export default DiseasesContext