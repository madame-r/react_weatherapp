const express = require('express');
const { getWeather } = require('../controllers/weatherController');
const router = express.Router();

// Route "/weather"
router.get("/", async (req, res) => {
  const city = req.query.city;

  try {
    const weatherData = await getWeather(city);
    res.json({ message: "Weather data retrieved successfully.", data: weatherData });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
