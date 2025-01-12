
import React from "react";
import { useWeatherContext } from "../../contexts/WeatherContext";
import './CityInput.css';


const CityInput = () => {
  const { city, suggestions, handleCityInputChange, handleSuggestionSelect, fetchWeatherData } = useWeatherContext();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (city) {
      fetchWeatherData(city);
    }
  };

  return (
    <div className="city-input-card">

      <h1>What's the weather in :</h1>


      <form onSubmit={handleSubmit} className="city-form">
        <input
          type="text"
          placeholder="Enter city name"
          value={city}
          onChange={(e) => handleCityInputChange(e.target.value)}
          className="city-input"
        />
        <button type="submit" className="city-button"><i className="bi bi-search"></i></button>
      </form>


      {suggestions.length > 0 && (
        <ul className="ul-suggestions">
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
