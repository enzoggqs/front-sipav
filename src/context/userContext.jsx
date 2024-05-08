import React, {createContext, useState} from 'react'

export const UserContext = createContext();

export const UserProvider = ({children}) => {
    const [user, setUser] = useState({
        email: "",
        name: "",
        cpf: "",
        birthdate: "",
        telegram: "",
        phoneNumber: "",
    })

    return (
        <UserContext.Provider value={{user, setUser}}>
            {children}
        </UserContext.Provider>
    )
}

export default UserContext