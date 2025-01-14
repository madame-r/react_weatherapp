
// Fonction pour calculer l'heure locale d'une ville
const calculateLocalTime = (timezone) => {
    const utcDate = new Date();
    const timezoneOffset = timezone * 1000; // Le timezone est en secondes, il faut le convertir en millisecondes
    const localDate = new Date(utcDate.getTime() + timezoneOffset);
    return localDate.toISOString();
  };
  
  module.exports = { calculateLocalTime };
  