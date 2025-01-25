import React, { createContext, useContext, useState } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';

const WeatherContext = createContext();

export const useWeatherContext = () => {
  return useContext(WeatherContext);
};

export const WeatherProvider = ({ children }) => {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [suggestions, setSuggestions] = useState([]);
  const [city, setCity] = useState("");

  const navigate = useNavigate();

  // Fonction pour formater l'heure locale
  const formatLocalTime = (isoString) => {
    const date = new Date(isoString);
    const hours = date.getUTCHours();
    const minutes = date.getUTCMinutes();
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  // Fonction pour récupérer les données météo
  const fetchWeatherData = async (city) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(`http://localhost:4000/weather?city=${city}`);
      setWeatherData(response.data.data); 
      navigate('/results');
    } catch (error) {
      console.error("Error fetching weather data:", error);
      setError("Unable to fetch weather data.");
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour gérer l'entrée de la ville et récupérer les suggestions
  const handleCityInputChange = async (value) => {
    setCity(value);

    if (value.length >= 3) {
      try {
        const response = await axios.get(`http://localhost:4000/autocomplete?city=${value}`);
        console.log('Autocomplete suggestions:', response.data);  // Log des suggestions retournées

        // Vérifie si des résultats ont été retournés
        if (response.data.data && response.data.data.length > 0) {
          setSuggestions(response.data.data);
        } else {
          // Aucun résultat trouvé
          setSuggestions([]);
          setError("No city found for the given search.");
        }
      } catch (error) {
        console.error("Error fetching suggestions:", error);
        setSuggestions([]);
        setError("Failed to fetch city suggestions.");
      }
    } else {
      setSuggestions([]);
      setError(null); // Réinitialise l'erreur si la longueur de la ville est inférieure à 3
    }
  };

  // Fonction pour sélectionner une suggestion de ville et récupérer ses données météo
  const handleSuggestionSelect = (suggestion) => {
    setCity(suggestion.name);
    setSuggestions([]);
    fetchWeatherData(suggestion.name);
  };

  return (
    <WeatherContext.Provider
      value={{
        weatherData,
        loading,
        error,
        fetchWeatherData,
        city,
        setCity,
        suggestions,
        handleCityInputChange,
        handleSuggestionSelect,
        formatLocalTime,
      }}
    >
      {children}
    </WeatherContext.Provider>
  );
};