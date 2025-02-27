//rfce

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { UserProvider } from './contexts/UserContext';
import { WeatherProvider } from "./contexts/WeatherContext";
import CityInput from "./components/CityInput/CityInput";
import WeatherCard from "./components/WeatherCard/WeatherCard";
import NavTop from './components/NavTop/NavTop';
import RegisterForm from "./components/RegisterForm/RegisterForm";
import LoginForm from "./components/LoginForm/LoginForm";
import './App.css';



function App() {

  return (
    <Router>

      <UserProvider>



        <WeatherProvider>


          <div className="app">


            <NavTop />

            <Routes>

              <Route path="/" element={<CityInput />} />
              <Route path="/results" element={<WeatherCard />} />

              <Route path="/register" element={<RegisterForm />} />
              <Route path="/login" element={<LoginForm />} />

            </Routes>

          </div>


        </WeatherProvider>


      </UserProvider>


    </Router>
  );
}

export default App
