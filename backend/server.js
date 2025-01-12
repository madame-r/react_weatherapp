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
const saveDataToDatabase = (weatherstackData) => {
  return new Promise((resolve, reject) => {
    const { name, country, localtime, temperature, weather_descriptions, weather_icons } = weatherstackData;

    const query = `
      INSERT INTO weather_data (name, country, local_time, temperature, weather_descriptions, weather_icon)
      VALUES (?, ?, ?, ?, ?, ?);
    `;

    const values = [
      name,
      country,
      localtime,
      temperature,
      weather_descriptions.join(", "),
      weather_icons[0], // Première icône seulement
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





/* WEATHER STACK START */
app.get("/weatherstack", async (req, res) => {
  const city = req.query.city;

  if (!city) {
    return res.status(400).json({ error: "Please enter a city name." });
  }

  try {
    const response = await axios.get('http://api.weatherstack.com/current', {
      params: {
        access_key: process.env.WEATHERSTACK_API_KEY,
        query: city
      },
    });

    if (response.data.error) {
      return res.status(400).json({ error: "Impossible to fetch weather data from this city." });
    }

    const { location, current } = response.data;

    if (!location || !current) {
      return res.status(400).json({ error: "Invalid response from Weatherstack API." });
    }

    const weatherstackData = {
      name: location.name,
      country: location.country,
      localtime: location.localtime,
      temperature: current.temperature,
      weather_descriptions: current.weather_descriptions,
      weather_icons: current.weather_icons,
      timestamp: new Date().toISOString() // Le timestamp est ici
    };

    // Sauvegarder dans le fichier JSON et la base de données
    saveDataToFile("./backend/weatherstackData.json", weatherstackData);

    // Sauvegarder dans la base de données
    saveDataToDatabase(weatherstackData)
      .then(() => {
        res.json({ message: "Weather data saved.", data: weatherstackData });
      })
      .catch((error) => {
        res.status(500).json({ error: "Error saving to database." });
      });

  } catch (error) {
    console.error("Error fetching weather data:", error.message);
    res.status(500).json({ error: "Unable to connect to the Weatherstack API. Please try again later." });
  }
});

/* WEATHER STACK END */



/* AUTOCOMPLETE START */

app.get("/weatherstack/autocomplete", async (req, res) => {

  const city = req.query.city;

  if (!city) {

    return res.status(400).json({ error: "Please enter a city name" });

  }

  try {

    console.log("Received autocomplete request for city:", city);

    const response = await axios.get("http://api.weatherstack.com/autocomplete", {
      params: {
        access_key: process.env.WEATHERSTACK_API_KEY,
        query: city,
      },
    });

    if (response.data.error) {

      console.error("WeatherStack API error:", response.data.error);
      return res.status(500).json({ error: response.data.error.info });

    }

    console.log("Autocomplete suggestions received:", response.data.location);
    res.json({ data: response.data.location || [] });

  } catch (error) {

    console.error("Error fetching autocomplete data:", error.message);
    res.status(500).json({ error: "Failed to fetch autocomplete data." });

  }



})



/* AUTOCOMPLETE END */



// Lancer le serveur
app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
