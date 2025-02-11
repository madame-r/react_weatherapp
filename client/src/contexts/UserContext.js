import React, { createContext, useContext, useState, useEffect } from 'react';
import axiosInstance from '../config/axiosConfig';  // N'oublie pas d'importer ta config Axios

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Vérification si l'utilisateur est connecté
  useEffect(() => {
    const checkUserStatus = async () => {
      try {
        // On vérifie l'état de l'utilisateur en envoyant une requête à '/users/me'
        const response = await axiosInstance.get('/users/me');  // Cette route doit renvoyer les infos de l'utilisateur

        console.log('User data:', response.data); // 🔍 Ajout d’un log pour voir la réponse

        setUser(response.data);  // Si l'utilisateur est authentifié, on met à jour l'état
      } catch (error) {
        if (error.response && error.response.status === 401) {
          console.log('User not authenticated or session expired');
        } else {
          console.error('Error checking user status:', error);
        }
        setUser(null);  // Si l'utilisateur n'est pas authentifié, on laisse l'état à null
      } finally {
        setLoading(false); // Termine le chargement après la vérification
      }
    };

    checkUserStatus();
  }, []);

  // Fonction de connexion
  const loginUser = async (email, password) => {
    try {
      const response = await axiosInstance.post('/users/login', { email, password });

      if (response.status === 200) {
        setUser(response.data.user);  // Enregistre les informations de l'utilisateur dans le state
      } else {
        throw new Error('Login failed');
      }

    } catch (error) {
      console.error('Error logging in:', error);
    }
  };

  // Fonction de déconnexion
  const logoutUser = () => {
    // Supprimer le cookie en le définissant avec une date d'expiration passée
    document.cookie = 'authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    setUser(null);  // On réinitialise l'état user
  };

  return (
    <UserContext.Provider value={{ user, loginUser, logoutUser, loading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  return useContext(UserContext);
};