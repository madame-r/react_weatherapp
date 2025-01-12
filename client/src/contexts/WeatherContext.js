import React, { createContext, useContext, useState } from "react";
import axios from "axios";


const WeatherContext = createContext();

export const useWeatherContext = () => {
  return useContext(WeatherContext);
}


export const WeatherProvider = ({ children }) => {

  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [suggestions, setSuggestions] = useState([]);
  const [city, setCity] = useState("");


  const fetchWeatherData = async (city) => {

    setLoading(true);
    setError(null);


    try {

      const response = await axios.get(`http://localhost:4000/weatherstack?city=${city}`);
      setWeatherData(response.data.data);

    } catch (error) {

      console.error("Error fetching weather data:", error);
      setError("Unable to fetch weather data.");

    } finally {

      setLoading(false);

    }

  };



  const handleCityInputChange = async (value) => {
    setCity(value);

    if (value.length >= 3) {
      try {
        const response = await axios.get(`http://localhost:4000/weatherstack/autocomplete?city=${value}`);
        setSuggestions(response.data.data || []);
      } catch (error) {
        console.error("Error fetching suggestions:", error);
        setSuggestions([]);
      }
    } else {
      setSuggestions([]);
    }
  };



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
      }}
    >
      {children}
    </WeatherContext.Provider>
  );



};



