const express = require("express");
const axios = require("axios");
const router = express.Router();

router.get("/", async (req, res) => {
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

module.exports = router;
