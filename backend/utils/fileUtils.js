const fs = require('fs');
const connection = require('../config/database'); // On récupère la connexion MySQL


// Fonction pour sauvegarder les données dans un fichier JSON
const saveDataToFile = (filePath, newData) => {
  let existingData = [];
  if (fs.existsSync(filePath)) {
    try {
      const fileContent = fs.readFileSync(filePath, 'utf8');
      existingData = JSON.parse(fileContent);
    } catch (error) {
      console.error('Error reading file:', error);
      throw new Error('Error reading existing data.');
    }
  }

  // Ajouter les nouvelles données
  existingData.push(newData);

  // Sauvegarder dans le fichier JSON
  try {
    fs.writeFileSync(filePath, JSON.stringify(existingData, null, 2), 'utf8');
    console.log('Data successfully saved in:', filePath);
  } catch (error) {
    console.error('Error saving data:', error);
    throw new Error('Error saving data.');
  }
};

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

module.exports = { saveDataToFile, saveDataToDatabase };
