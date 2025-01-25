const connection = require('../config/database');

// Insérer les données météo dans la base de données
const saveWeatherDataToDatabase = (weatherData) => {
  const { name, country, local_time, temperature, weather_descriptions, weather_icon, timestamp } = weatherData;
  
  console.log("Saving weather data:", weatherData); // Log pour vérifier les données à insérer

  return new Promise((resolve, reject) => {
    const query = `
      INSERT INTO weather_data (name, country, local_time, temperature, weather_descriptions, weather_icon, timestamp)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [
      name,
      country,
      local_time,
      temperature,
      JSON.stringify(weather_descriptions),  // Convertir le tableau en chaîne JSON
      weather_icon.join(','),  // Convertir le tableau d'icônes en chaîne séparée par des virgules
      timestamp
    ];

    connection.query(query, values, (err, results) => {
      if (err) {
        console.error("Error inserting weather data:", err); // Log d'erreur
        reject(err);
      } else {
        console.log("Weather data saved successfully:", results); // Log pour vérifier l'insertion
        resolve(results);
      }
    });
  });
};


// Récupérer les données météo de la base de données
const getWeatherData = () => {
  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM weather_data ORDER BY timestamp DESC LIMIT 10';  // Exemple : récupérer les 10 dernières entrées

    connection.query(query, (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
};

module.exports = { saveWeatherDataToDatabase, getWeatherData };
