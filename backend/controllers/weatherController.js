const axios = require('axios');
const { saveDataToFile, saveDataToDatabase } = require('../utils/fileUtils');
const { calculateLocalTime } = require('../utils/timeUtils');

// Contrôleur pour récupérer et traiter les données météo
const getWeather = async (city) => {
  if (!city) {
    throw new Error('Please enter a city name.');
  }

  const response = await axios.get("http://api.openweathermap.org/data/2.5/weather", {
    params: {
      q: city,
      appid: process.env.OPENWEATHERMAP_API_KEY,
      units: "metric",
    },
  });

  const { name, sys, main, weather, timezone } = response.data;

  const local_time = calculateLocalTime(timezone);

  const weatherData = {
    name,
    country: sys.country,
    local_time,
    temperature: main.temp,
    weather_descriptions: weather.map((w) => w.description),
    weather_icon: weather.map((w) => `https://openweathermap.org/img/wn/${w.icon}.png`),
    timestamp: new Date().toISOString(),
  };

  // Sauvegarder dans le fichier et la base de données
  saveDataToFile("./backend/weatherData.json", weatherData);
  await saveDataToDatabase(weatherData);

  return weatherData;
};

module.exports = { getWeather };
