const fs = require('fs');
const connection = require('../config/database'); // On récupère la connexion MySQL



// Fonction pour enregistrer les données dans MySQL
const saveDataToDatabase = (weatherData) => {
  return new Promise((resolve, reject) => {
    const { name, country, local_time, temperature, weather_descriptions, weather_icon } = weatherData;

    const query = `
      INSERT INTO weather_data (name, country, local_time, temperature, weather_descriptions, weather_icon)
      VALUES (?, ?, ?, ?, ?, ?);
    `;

    const values = [
      name,
      country,
      local_time,
      temperature,
      weather_descriptions.join(', '),
      weather_icon[0], // Première icône seulement
    ];

    connection.execute(query, values, (err, results) => {
      if (err) {
        console.error('Error when inserting into the database:', err);
        reject(err);
      } else {
        console.log('Data saved to database successfully.');
        resolve(results);
      }
    });
  });
};

module.exports = { saveDataToDatabase };
