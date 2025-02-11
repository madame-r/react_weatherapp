import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:4000', // L'URL de ton backend Express
  withCredentials: true,  // Permet d'envoyer les cookies avec chaque requête
});

// Intercepteur de requêtes pour loguer les requêtes envoyées
axiosInstance.interceptors.request.use(
  config => {
    console.log('Starting Request', config);
    return config;
  },
  error => Promise.reject(error)
);

// Intercepteur de réponses pour loguer les réponses reçues
axiosInstance.interceptors.response.use(
  response => {
    console.log('Response:', response);
    return response;
  },
  error => {
    if (error.response && error.response.status === 401) {
      console.error('User not authenticated or session expired:', error);
      // Logique pour gérer les erreurs 401
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;