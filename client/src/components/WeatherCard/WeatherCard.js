import React from 'react';
import { useWeatherContext } from "../../contexts/WeatherContext";
import { Link } from 'react-router-dom';
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

        <div className="main-results">



            <div className='back-home'><Link to="/">Back to Home</Link></div>



            <div className='weather-card'>
                <h2>{weatherData?.name || "Unknown location"} ({weatherData?.country || "Unknown country"})</h2>

                <p>{weatherData?.local_time ? formatLocalTime(weatherData.local_time) : "Unknown time"}</p>

                <div className='temperature-weather-icon'>
                <p className='temperature'>{weatherData?.temperature ? Math.round(weatherData.temperature) : "--"} °C</p>

                    <div className='weather-icon'>
                        {weatherData.weather_icon ? (
                            <img src={weatherData.weather_icon} alt="weather icon" />
                        ) : (
                            <p>No weather icon available</p>
                        )}
                    </div>

                </div>



                <p>{weatherData?.weather_descriptions || "No description available"}</p>

            </div>
        </div>

    )
}

export default WeatherCard
