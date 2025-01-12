import React from 'react';
import { useWeatherContext } from "../../contexts/WeatherContext";
import { Link } from 'react-router-dom';





const WeatherCard = () => {

    const { loading, error, weatherData } = useWeatherContext();



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



            <div><Link to="/">Back to Home</Link></div>



            <div>
                <h2>{weatherData?.name || "Unknown location"} ({weatherData?.country || "Unknown country"})</h2>
                <p>Local Time: {weatherData?.localtime || "Unknown time"}</p>
                <p>Temperature: {weatherData?.temperature || "--"} °C</p>
                <p>Description: {weatherData?.weather_descriptions || "No description available"}</p>
                <div>
                    {weatherData.weather_icons ? (
                        <img src={weatherData.weather_icons} alt="weather icon" />
                    ) : (
                        <p>No weather icon available</p>
                    )}
                </div>
            </div>
        </div>

    )
}

export default WeatherCard
