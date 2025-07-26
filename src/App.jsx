import React, { useEffect, useState } from "react";
import Header from "./components/Header";
import Main from "./components/Main";
import axios from "axios";
import "./index.css";

const App = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [forecastData, setForecastData] = useState([]);
  const [error, setError] = useState(null);

  // Handle both city name and coordinates
  const fetchWeather = async (location) => {
    setLoading(true);
    setError(null);
    try {
      let url;
      
      // Check if location is coordinates or city name
      if (typeof location === 'object') {
        // For current location (coordinates)
        url = `https://api.openweathermap.org/data/2.5/weather?lat=${location.lat}&lon=${location.lon}&appid=${
          import.meta.env.VITE_API_KEY
        }&units=metric`;
      } else {
        // For city name search
        url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${
          import.meta.env.VITE_API_KEY
        }&units=metric`;
      }

      const response = await axios.get(url);
      setWeatherData(response.data);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to fetch weather data");
      setTimeout(() => setError(null), 3000)
      alert(error.response?.data?.message || "City not found!");
      
    } finally {
      setLoading(false);
    }
  };

  const fetchForecast = async (location) => {
    try {
      let url;
      
      if (typeof location === 'object') {
        // For coordinates
        url = `https://api.openweathermap.org/data/2.5/forecast?lat=${location.lat}&lon=${location.lon}&appid=${
          import.meta.env.VITE_API_KEY
        }&units=metric&cnt=5`;
      } else {
        // For city name
        url = `https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${
          import.meta.env.VITE_API_KEY
        }&units=metric&cnt=5`;
      }

      const response = await axios.get(url);
      setForecastData(response.data.list);
    } catch (error) {
      console.error('Forecast Error:', error);
    }
  };

  // Handle current location button click from Header
  const handleLocationSearch = (location) => {
    if (typeof location === 'string') {
      fetchWeather(location); // City name search
    } else {
      fetchWeather(location); // Coordinates search
    }
  };

  // Initial load with default city
  useEffect(() => {
    fetchWeather("Noida");
  }, []);

  // Update forecast when weather data changes
  useEffect(() => {
    if (weatherData) {
      // Use coordinates if available for more accuracy
      if (weatherData.coord) {
        fetchForecast({
          lat: weatherData.coord.lat,
          lon: weatherData.coord.lon
        });
      } else {
        fetchForecast(weatherData.name);
      }
    }
  }, [weatherData]);

  return (
    <div className="app-container">
      <Header onSearch={handleLocationSearch} />

      {error && (
        <div className="error-message" onClick={() => setError(null)}>
          {error}
          <span className="close-btn">x</span>
          </div>
      )}
        {loading ? (
          <div className="loading-spinner">Loading...</div>
        ) : (
          <Main weatherData={weatherData} forecastData={forecastData} />
      )}
    </div>
  );
};

export default App;