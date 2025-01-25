import React, { useState } from "react";
import { useWeatherContext } from "../../contexts/WeatherContext";
import './CityInput.css';

const CityInput = () => {
  const { city, setCity, suggestions, setSuggestions, handleCityInputChange, fetchWeatherData } = useWeatherContext();
  const [inputValue, setInputValue] = useState(city);
  const [selectedSuggestion, setSelectedSuggestion] = useState(null);

  const handleInputChange = (value) => {
    setInputValue(value);
    setSelectedSuggestion(null); // Réinitialise la suggestion sélectionnée
    handleCityInputChange(value); // Appel à l'auto-complétion
  };

  const handleSuggestionClick = (suggestion) => {
    const displayValue = `${suggestion.name}, ${suggestion.country}`;
    setInputValue(displayValue); // Met à jour le champ de saisie avec la ville et le pays
    setSelectedSuggestion(suggestion);
    setCity(suggestion.name); // Met à jour le contexte avec la ville sélectionnée
    setSuggestions([]); // Ferme la liste de suggestions
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedSuggestion) {
      fetchWeatherData(selectedSuggestion.name);
    } else if (inputValue) {
      fetchWeatherData(inputValue);
    }
  };

  return (
    <div className="city-input-card">
      <h1>What's the weather in :</h1>
      <form onSubmit={handleSubmit} className="city-form">
        <input
          type="text"
          placeholder="Enter city name"
          value={inputValue}
          onChange={(e) => handleInputChange(e.target.value)}
          className="city-input"
        />
        <button type="submit" className="city-button"><i className="bi bi-search"></i></button>
      </form>
      {suggestions.length > 0 && (
        <ul className="ul-suggestions">
          {suggestions.map((suggestion, index) => (
            <li key={index} onClick={() => handleSuggestionClick(suggestion)}>
              {suggestion.name}, {suggestion.country}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CityInput;