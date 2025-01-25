import React from 'react';
import { useWeatherContext } from "../../contexts/WeatherContext";
import './WeatherCard.css'




const WeatherCard = () => {

    const { loading, error, weatherData, formatLocalTime } = useWeatherContext();



    if (loading) {

        return <div><p>Loading...</p></div>;

    }

    if (error) {
        return <div><p>{error}</p></div>;
    }


    if (!weatherData) {
        return <div><p>No weather data available</p></div>;
    }




    return (

        <main className="main-results">




            <div className='weather-card'>
                <h2>{weatherData?.name || "Unknown location"} ({weatherData?.country || "Unknown country"})</h2>

                <p>{weatherData?.local_time ? formatLocalTime(weatherData.local_time) : "Unknown time"}</p>

                <div className='temperature-weather-icon'>
                    <p className='weather-temperature'>{weatherData?.temperature ? Math.round(weatherData.temperature) : "--"} °C</p>

                    <p className='weather-description'>{weatherData?.weather_descriptions || "No description available"}</p>

                    <div className='weather-icon'>
                        {weatherData.weather_icon ? (
                            <img src={weatherData.weather_icon} alt="weather icon" />
                        ) : (
                            <p>No weather icon available</p>
                        )}
                    </div>

                </div>





            </div>
        </main>

    )
}

export default WeatherCard
