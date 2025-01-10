require('dotenv').config()

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const fs = require("fs");
const mysql2 = require("mysql2");



const app = express();
app.use(cors());
app.use(bodyParser.json());

const port = 4000;

// Configuration de la connexion MySQL
const connection = mysql2.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port:process.env.DB_PORT,
});



// Vérification de la connexion
connection.connect((err) => {
  if (err) {
    console.error("Erreur de connexion à la base de données MySQL : ", err.stack);
    return;
  }
  console.log("Connecté à la base de données MySQL.");
});





// Fonction pour récupérer l'adresse IP d'une requête
const getClientIp = (req) => {
  const forwarded = req.headers["x-forwarded-for"];
  const ip = forwarded ? forwarded.split(",")[0] : req.socket.remoteAddress;
  return ip;
};




 

// Fonction pour sauvegarder les données dans un fichier JSON
const saveDataToFile = (filePath, newData) => {
  // Lire les données existantes
  let existingData = [];
  if (fs.existsSync(filePath)) {
    try {
      const fileContent = fs.readFileSync(filePath, "utf8");
      existingData = JSON.parse(fileContent);
    } catch (error) {
      console.error("Erreur lors de la lecture du fichier :", error);
      throw new Error("Erreur lors de la lecture des données existantes.");
    }
  }

  // Ajouter les nouvelles données
  existingData.push(newData);

  // Sauvegarder dans le fichier JSON
  try {
    fs.writeFileSync(filePath, JSON.stringify(existingData, null, 2), "utf8");
    console.log("Données sauvegardées avec succès dans :", filePath);
  } catch (error) {
    console.error("Erreur lors de l'enregistrement des données :", error);
    throw new Error("Erreur lors de l'enregistrement des données.");
  }
};







// Fonction pour enregistrer les données dans MySQL
const saveDataToDatabase = (apiWeatherData) => {
  return new Promise((resolve, reject) => {
    const { timestamp, location, temperature, condition, cloudCoverage, humidity, windSpeed, windDirection } = apiWeatherData;

    // Utilisation des variables directement dans la requête SQL
    const query = `
      INSERT INTO api_weather_data (location, temperature, condition_weather, cloud_coverage, humidity, wind_speed, wind_direction, time_stamp)
      VALUES ('${location}', ${temperature}, '${condition}', ${cloudCoverage}, ${humidity}, ${windSpeed}, '${windDirection}', '${timestamp}');
    `;

    connection.execute(query, (err, results) => {
      if (err) {
        console.error("Erreur lors de l'insertion dans la base de données :", err);
        reject(err);
      } else {
        console.log("Données enregistrées dans la base de données avec succès.");
        resolve(results);
      }
    });
  });
};







// Route POST pour les données météo
app.post("/apiWeather", (req, res) => {
  const { weatherData } = req.body;

  if (!weatherData || !weatherData.location || !weatherData.current) {
    return res.status(400).json({ error: "Données météo invalides." });
  }

  // Extraire les informations supplémentaires
  const apiWeatherData = {
    timestamp: new Date().toISOString(),
    location: weatherData.location.name,
    temperature: weatherData.current.temp_c,
    condition: weatherData.current.condition.text,
    cloudCoverage: weatherData.current.cloud, // Couverture nuageuse
    humidity: weatherData.current.humidity,  // Humidité
    windSpeed: weatherData.current.wind_kph, // Vitesse du vent
    windDirection: weatherData.current.wind_dir, // Direction du vent
  };


 // Log de l'adresse IP
 const ipAddress = getClientIp(req);
 console.log(`Requête reçue de l'IP : ${ipAddress}`);
 


  // Sauvegarder dans le fichier JSON
  try {
    saveDataToFile("./backend/apiWeatherData.json", apiWeatherData);

    // Sauvegarder dans la base de données MySQL
    saveDataToDatabase(apiWeatherData)
      .then(() => {
        res.json({ message: "Données météo sauvegardées.", data: apiWeatherData });
      })
      .catch((error) => {
        res.status(500).json({ error: "Erreur lors de l'enregistrement dans la base de données." });
      });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



// Route POST pour les données de géolocalisation
app.post('/apiGeo', (req, res) => {

  const { latitude, longitude } = req.body;  // Extraire directement latitude et longitude

  if (!latitude || !longitude) {  // Vérification si les coordonnées sont présentes
    return res.status(400).json({ error: "Données de localisation invalides." });
  }

  const apiGeoData = {
    timestamp: new Date().toISOString(), 
    latitude: latitude,
    longitude: longitude,
  };

  // Sauvegarder dans le fichier JSON
  try {
    saveDataToFile("./backend/apiGeoData.json", apiGeoData);
    res.json({ message: "Données de géolocalisation sauvegardées avec succès.", data: apiGeoData });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }

});







// Route POST pour récupérer des données depuis la BDD sans filtre
app.post("/alldata", (req, res) => {

  // Requête SQL pour récupérer toutes les données
  const query = 'SELECT * FROM api_weather_data';

  connection.execute(query, (err, results) => {
    if (err) {
      console.error("Erreur lors de la récupération des données depuis la base de données :", err);
      return res.status(500).json({ error: "Erreur lors de la récupération des données." });
    }

    // Envoyer les résultats au front-end
    res.json({
      message: "Données récupérées avec succès.",
      data: results  // `results` contient toutes les données récupérées de la base de données
    });
  });
});






// Lancer le serveur
app.listen(port, () => {
  console.log(`Serveur en écoute sur http://localhost:${port}`);
});
