const express = require('express');
const axios = require('axios');
const { saveDataToFile, saveDataToDatabase } = require('../utils/fileUtils');
const { calculateLocalTime } = require('../utils/timeUtils');
const router = express.Router();






// Route "/weather"
router.get("/", async (req, res) => {


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

module.exports = router;
