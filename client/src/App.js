//rfce

import React from 'react';
import { WeatherProvider } from "./contexts/WeatherContext";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import WeatherCard from "./components/WeatherCard/WeatherCard";
import CityInput from "./components/CityInput/CityInput";




function App() {

  return (
    <Router>

      <WeatherProvider>


        <div className="app">

          <Routes>

            <Route path="/" element={<CityInput />} />

            <Route path="/results" element={<WeatherCard />} />

          </Routes>

        </div>


      </WeatherProvider>
    </Router>
  );
}

export default App
