
import React, { createContext, useContext, useState } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {

    const [user, setUser] = useState(null);


    const loginUser = async (email, password) => {

        try {

            const response = await fetch('http://localhost:4000/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                throw new Error("Login failed");
            }

            const userData = await response.json();
            setUser(userData);


        } catch (error) {

            console.error('Error logging in :', error);

        }

    };







    const logoutUser = () => {
        setUser(null);
    }

    return (

        <UserContext.Provider value={{ user, loginUser, logoutUser }}>
            {children}
        </UserContext.Provider>

    );

}

export const useUser = () => {
    return useContext(UserContext);
}