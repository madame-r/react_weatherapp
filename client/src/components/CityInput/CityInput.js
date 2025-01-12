
import React from "react";
import { useWeatherContext } from "../../contexts/WeatherContext";


const CityInput = () => {
  const { city, suggestions, handleCityInputChange, handleSuggestionSelect, fetchWeatherData } = useWeatherContext();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (city) {
      fetchWeatherData(city);
    }
  };

  return (
    <div>
    <h1>What's the weather in :</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter city name"
          value={city}
          onChange={(e) => handleCityInputChange(e.target.value)}
        />
        <button type="submit">Get Weather</button>
      </form>

      
      {suggestions.length > 0 && (
        <ul>
          {suggestions.map((suggestion, index) => (
            <li key={index} onClick={() => handleSuggestionSelect(suggestion)}>
              {suggestion.name}, {suggestion.country}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CityInput;
