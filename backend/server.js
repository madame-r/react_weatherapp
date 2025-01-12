require('dotenv').config();

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const fs = require("fs");
const mysql2 = require("mysql2");
const axios = require("axios");

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
  port: process.env.DB_PORT,
});

// Vérification de la connexion
connection.connect((err) => {
  if (err) {
    console.error("MySQL database connection error: ", err.stack);
    return;
  }
  console.log("Connected to MySQL database.");
});

// Fonction pour sauvegarder les données dans un fichier JSON
const saveDataToFile = (filePath, newData) => {
  let existingData = [];
  if (fs.existsSync(filePath)) {
    try {
      const fileContent = fs.readFileSync(filePath, "utf8");
      existingData = JSON.parse(fileContent);
    } catch (error) {
      console.error("Error reading file:", error);
      throw new Error("Error reading existing data.");
    }
  }

  // Ajouter les nouvelles données
  existingData.push(newData);

  // Sauvegarder dans le fichier JSON
  try {
    fs.writeFileSync(filePath, JSON.stringify(existingData, null, 2), "utf8");
    console.log("Data successfully saved in:", filePath);
  } catch (error) {
    console.error("Error saving data:", error);
    throw new Error("Error saving data.");
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
      weather_descriptions.join(", "),
      weather_icon[0], // Première icône seulement
    ];

    connection.execute(query, values, (err, results) => {
      if (err) {
        console.error("Error when inserting into the database:", err);
        reject(err);
      } else {
        console.log("Data saved to database successfully.");
        resolve(results);
      }
    });
  });
};

// Fonction pour calculer l'heure locale d'une ville
const calculateLocalTime = (timezone) => {
  const utcDate = new Date();
  const timezoneOffset = timezone * 1000; // timezone est en secondes, il faut le convertir en millisecondes
  const localDate = new Date(utcDate.getTime() + timezoneOffset);
  return localDate.toISOString();
};

// Route "/weather"
app.get("/weather", async (req, res) => {
  const city = req.query.city;

  if (!city) {
    return res.status(400).json({ error: "Please enter a city name." });
  }

  try {
    const response = await axios.get("http://api.openweathermap.org/data/2.5/weather", {
      params: {
        q: city,
        appid: process.env.OPENWEATHERMAP_API_KEY,
        units: "metric",
      }
    });

    if (response.data) {
      const { name, sys, main, weather, timezone } = response.data;

      const local_time = calculateLocalTime(timezone);

      const weatherData = {
        name,
        country: sys.country,
        local_time,
        temperature: main.temp,
        weather_descriptions: weather.map(w => w.description),
        weather_icon: weather.map(w => `https://openweathermap.org/img/wn/${w.icon}.png`),
        timestamp: new Date().toISOString(),
      };

      // Sauvegarder dans le fichier JSON et la base de données
      saveDataToFile("./backend/weatherData.json", weatherData);

      await saveDataToDatabase(weatherData);
      res.json({ message: "Weather data saved.", data: weatherData });

    } else {
      return res.status(400).json({ error: "City not found." });
    }
  } catch (error) {
    console.error("Error fetching weather data:", error.message);
    res.status(500).json({ error: "Unable to fetch weather data from OpenWeatherMap." });
  }
});

// Route "/autocomplete"
app.get("/autocomplete", async (req, res) => {
  const city = req.query.city;

  if (!city) {
    return res.status(400).json({ error: "Please enter a city name" });
  }

  try {
    const response = await axios.get("https://api.openweathermap.org/data/2.5/find", {
      params: {
        q: city,
        appid: process.env.OPENWEATHERMAP_API_KEY,
        type: 'like',
        count: 5,
        units: 'metric',
      },
    });

    if (!response.data.list) {
      return res.status(500).json({ error: "Error fetching autocomplete data." });
    }

    const cities = response.data.list.map(item => ({
      name: item.name,
      country: item.sys.country,
      id: item.id,
    }));

    res.json({ data: cities });
  } catch (error) {
    console.error("Error fetching autocomplete data:", error.message);
    res.status(500).json({ error: "Failed to fetch autocomplete data." });
  }
});

// Lancer le serveur
app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
