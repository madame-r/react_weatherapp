const express = require("express");
const axios = require("axios");
const router = express.Router();

router.get("/", async (req, res) => {
  const city = req.query.city;

  if (!city) {
    return res.status(400).json({ error: "Please enter a city name" });
  }

  try {
    console.log(`Fetching autocomplete data for city: ${city}`);
    const response = await axios.get("https://api.openweathermap.org/data/2.5/find", {
      params: {
        q: city,
        appid: process.env.OPENWEATHERMAP_API_KEY,
        type: 'like',
        cnt: 5,
        units: 'metric',
      },
    });

    console.log('Autocomplete data response:', response.data);  // Vérifie la réponse de l'API

    if (!response.data.list || response.data.list.length === 0) {
      return res.status(500).json({ error: "No cities found for the given search." });
    }

    const cities = response.data.list.map(item => ({
      name: item.name,
      country: item.sys.country,
      id: item.id,
    }));

    res.json({ data: cities });
  } catch (error) {
    console.error("Error fetching autocomplete data:", error.message);
    console.error("Full error details:", error);  // Logs plus détaillés pour diagnostiquer le problème
    res.status(500).json({ error: "Failed to fetch autocomplete data." });
  }
});

module.exports = router;
