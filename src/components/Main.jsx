import { WiSunrise, WiSunset } from "react-icons/wi";
import { LuEye } from "react-icons/lu";
import { SlCalender } from "react-icons/sl";
import { FaRegClock } from "react-icons/fa";

const Main = ({ weatherData, forecastData }) => {
  if (!weatherData) return <div>Loading...</div>;

  // Extract required Data
  const {
    name: city,
    sys: { country },
    main: { temp, feels_like, humidity, pressure },
    weather: [weather],
    wind: { speed: windSpeed },
    sys: { sunrise, sunset },
    visibility,
    dt,
    timezone,
  } = weatherData;

  // Time formatting with timezone offset
  const formatTime = (timestamp) => {
    const date = new Date((timestamp + timezone) * 1000);
    return date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'UTC'
    });
  };

  // Date formatting with timezone
  const formatDate = (timestamp) => {
    const date = new Date((timestamp + timezone) * 1000);
    return date.toLocaleDateString([], {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      timeZone: 'UTC'
    });
  };

  // Get time with timezone offset
  const getLocalTime = (timestamp) => {
    return new Date((timestamp + timezone) * 1000);
  };

  // Improved daily forecast grouping with timezone
  const getDailyForecasts = () => {
    const dailyForecasts = [];
    const seenDays = new Set();
    
    forecastData.forEach((forecast) => {
      const date = getLocalTime(forecast.dt);
      const dayKey = date.toLocaleDateString('en', { 
        weekday: 'short',
        timeZone: 'UTC'
      });
      
      if (!seenDays.has(dayKey)) {
        dailyForecasts.push(forecast);
        seenDays.add(dayKey);
      }
    });

    return dailyForecasts.slice(0, 5);
  };

  return (
    <div>
      <main>
        {/* Area Part Start */}
        <div className="main">
          <div className="areaPart">
            <div className="areaLeftPart">
              <h1>{city}, {country}</h1> {/* Dynamic country code */}
              <span>{formatDate(dt)}</span>
              <span>at {formatTime(dt)}</span>
            </div>
            <div className="areaRightPart">
              <img
                src={`https://openweathermap.org/img/wn/${weather.icon}.png`}
                alt={weather.description}
                className="cloudOn"
              />
              <div>
                <h1>
                  {Math.round(temp)}
                  <span>&#8451;</span>
                </h1>
                <span>{weather.description}</span>
              </div>
            </div>
          </div>
          <div className="areaPartBoxes">
            <div className="feelsLikeBox box">
              <span>Feels Like</span>
              <h2>{feels_like ? Math.round(feels_like) : "--"}°C</h2>
            </div>
            <div className="humidityLikeBox box">
              <span>Humidity</span>
              <h2>{humidity}%</h2>
            </div>
            <div className="windLikeBox box">
              <span>Wind</span>
              <h2>{windSpeed} m/s</h2>
            </div>
            <div className="pressureLikeBox box">
              <span>Pressure</span>
              <h2>{pressure} hPa</h2>
            </div>
          </div>
        </div>

        {/* Sunrise & Sunset with timezone */}
        <div className="secondMain">
          <div className="twoBoxes">
            <div className="leftBox">
              <h4 className="heading">
                <WiSunrise className="headingIcon" />
                Sunrise & Sunset
              </h4>
              <div className="sunriseBoxes">
                <div className="sunriseBox">
                  <WiSunrise className="boxIcon" />
                  <span>Sunrise</span>
                  <b>{formatTime(sunrise)}</b>
                </div>
                <div className="sunriseBox">
                  <WiSunset className="boxIcon" />
                  <span>Sunset</span>
                  <b>{formatTime(sunset)}</b>
                </div>
              </div>
            </div>

            <div className="leftBox">
              <h4 className="heading">
                <LuEye className="headingIcon" />
                Visibility
              </h4>
              <div className="sunriseBoxes">
                <div className="sunriseBox">
                  <LuEye className="boxIcon" />
                  <span>Visibility</span>
                  <b>{(visibility / 1000).toFixed(1)} km</b>
                </div>
                <div className="sunriseBox">
                  <WiSunset className="boxIcon" />
                  <span>UV Index</span>
                  <b>6 (High)</b>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 5-Day Forecast with timezone */}
        <div className="forcastPart">
          <div className="forecastHeading">
            <SlCalender className="calenderIcon" />
            <h4>5 Day Forecast</h4>
          </div>
          <div className="forecastDays">
            {getDailyForecasts().map((day, index) => {
              const date = getLocalTime(day.dt);
              return (
                <div key={index} className="forecastDay">
                  <span>
                    {date.toLocaleDateString("en", {
                      weekday: "short",
                      timeZone: 'UTC'
                    })}
                  </span>
                  <img
                    src={`https://openweathermap.org/img/wn/${day.weather[0].icon}.png`}
                    alt={day.weather[0].description}
                    width="40"
                  />
                  <span>{Math.round(day.main.temp)}°C</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Hourly Forecast with timezone */}
        <div className="hourlyForcastPart">
          <div className="forecastHeading">
            <FaRegClock className="calenderIcon" />
            <h4>Hourly Forecast</h4>
          </div>
          <div className="HourlyforecastTime">
            {forecastData.slice(0, 8).map((hour, index) => {
              const date = getLocalTime(hour.dt);
              const hourString = date.toLocaleTimeString([], {
                hour: 'numeric',
                hour12: true,
                timeZone: 'UTC'
              });
              return (
                <div key={index} className="hourlyForecastTime">
                  <span>
                    {index === 0 ? "Now" : hourString.replace(/\s/g, "")}
                  </span>
                  <img
                    src={`https://openweathermap.org/img/wn/${hour.weather[0].icon}.png`}
                    alt={hour.weather[0].description}
                    className="forecastIcons"
                  />
                  <span>{Math.round(hour.main.temp)}°C</span>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Main;