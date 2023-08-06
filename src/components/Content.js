import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Content.css";
import "./Responsive.css";

const Content = () => {
    const [search, setSearch] = useState("");
    const [weatherData, setWeatherData] = useState(null);
    const [forecastData, setForecastData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [temperatureUnit, setTemperatureUnit] = useState("C");
    const [selectedDayIndex, setSelectedDayIndex] = useState(0);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    // Object to get the day according to date
    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    // Fetch data from API with useEffect 
    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                try {
                    const apiKey = "4a160ac18b724237a49104843230308";
                    const apiUrl = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${latitude},${longitude}&aqi=no`;
                    const response = await axios.get(apiUrl);
                    setWeatherData(response.data);
                    fetchForecastData(latitude, longitude);
                    setLoading(false);
                } catch (error) {
                    console.error("Error fetching data: ", error);
                    setLoading(false);
                }
            },
            (error) => {
                console.error("Error getting geolocation: ", error);
                setLoading(false);
            }
        );
    }, []);

    // To fetch forecast data from API
    const fetchForecastData = async (latitude, longitude) => {
        try {
            const apiKey = "4a160ac18b724237a49104843230308";
            const apiUrl = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${latitude},${longitude}&days=5&aqi=no`;
            const response = await axios.get(apiUrl);
            setForecastData(response.data);
            console.log(response.data);
        } catch (error) {
            console.error("Error fetching forecast data: ", error);
        }
    };

    // Get the value of search field and set to useState setSearch 
    const handleSearchChange = (e) => {
        setSearch(e.target.value);
    };

    // Method for when user press submit button then get the specific location data if available
    const handleSearchSubmit = async (e) => {
        e.preventDefault();
        try {
            const apiKey = "4a160ac18b724237a49104843230308";
            const apiUrl = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${search}&aqi=no`;
            const response = await axios.get(apiUrl);
            setWeatherData(response.data);
            console.log(response.data);
            fetchForecastData(response.data.location.lat, response.data.location.lon);
        } catch (error) {
            console.error("Error fetching weather data: ", error);
        }
    };

    // Set the unit (celsius/fohrenheit) 
    const handleUnitChange = (unit) => {
        setTemperatureUnit(unit);
    };

    // Method to get the temperature according to the unit (celsius/fohrenheit)
    const renderTemperature = (tempC) => {
        if (temperatureUnit === "C") {
            return `${tempC}°C`;
        } else if (temperatureUnit === "F") {
            const tempF = (tempC * 9) / 5 + 32;
            return `${tempF.toFixed(2)}°F`;
        }
        return tempC;
    };

    // Method for when user click next then get the next day forecast data
    const handleNextDay = () => {
        if (selectedDayIndex < 4) {
            setSelectedDayIndex(selectedDayIndex + 1);
        }
    };

    // Method for when user click previous then get the previous day forecast data
    const handlePrevDay = () => {
        if (selectedDayIndex > 0) {
            setSelectedDayIndex(selectedDayIndex - 1);
        }
    };

    // Method for when user login then he get the access of the weather search
    const handleLogin = () => {
        if (username === "demo" && password === "password") {
            setIsLoggedIn(true);
        } else {
            alert("Invalid credentials. Please try again.");
        }
    };

    return (
        <div className="content">
            {!isLoggedIn ? (
                <div className="login-container">
                    <h3>Login to access weather search</h3>
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button onClick={handleLogin}>Login</button>
                </div>
            ) : (
                <div className="container">

                    <div className="switch-temp-button">
                        <button
                            className={`switch-button ${temperatureUnit === "F" ? "switch-button-color-active" : "switch-button-color"}`}
                            onClick={() => handleUnitChange("F")}
                        >
                            F&deg;
                        </button>
                        <button
                            className={`switch-button ${temperatureUnit === "C" ? "switch-button-color-active" : "switch-button-color"} mr-2`}
                            onClick={() => handleUnitChange("C")}
                        >
                            C&deg;
                        </button>
                    </div>

                    <form className="form" onSubmit={handleSearchSubmit}>
                        <input
                            type="text"
                            className="search"
                            placeholder="Enter city name..."
                            value={search}
                            onChange={handleSearchChange}
                        />
                        <button type="submit" className="search-button">
                            Search
                        </button>
                    </form>

                    <div className="title">
                        <h2>{weatherData.location.name} Weather Forecast</h2>
                        <p>{weatherData.location.region}, {weatherData.location.country}</p>
                    </div>
                    <div className="weather-data-container">
                        {loading ? (
                            <p>Loading...</p>
                        ) : weatherData ? (
                            <div>

                                <div className="weather-container">
                                    <div className="left-side-data">
                                        <img src={weatherData.current.condition.icon} alt="" />
                                        <p>{weatherData.current.condition.text}</p>
                                    </div>
                                    <div className="right-side-data">
                                        <p>Wind: {weatherData.current.wind_mph} mph</p>
                                        <p>Precip: {weatherData.current.precip_in} in</p>
                                        <p>Pressure: {weatherData.current.pressure_in} in</p>
                                        <p className="right-side-temperature">{renderTemperature(weatherData.current.temp_c)}</p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <p>No weather data available.</p>
                        )}

                        {forecastData && (
                            <div className="forecast-weather-container">
                                {forecastData.forecast.forecastday.map((day) => (
                                    <div className="forecast-weather-data" key={day.date}>
                                        <p>{daysOfWeek[new Date(day.date).getDay()]}</p>
                                        <img src={day.day.condition.icon} alt={day.day.condition.text} />
                                        <p>{renderTemperature(day.day.avgtemp_c)}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <hr />

                    {forecastData && (
                        <div className="forecast-button-container">
                            <button className="prev-button forecast-button" onClick={handlePrevDay}>
                                Previous Day
                            </button>
                            <button className="next-button forecast-button" onClick={handleNextDay}>
                                Next Day
                            </button>
                        </div>
                    )}

                    {forecastData && (
                        <div>
                            {selectedDayIndex >= 0 && selectedDayIndex < forecastData.forecast.forecastday.length ? (
                                <div className="select-day-container">
                                    <div className="select-day-inner-container">
                                        <div className="select-day-left-data">
                                            <img src={forecastData.forecast.forecastday[selectedDayIndex].day.condition.icon} alt={forecastData.forecast.forecastday[selectedDayIndex].day.condition.text} />
                                            <p>{daysOfWeek[new Date(forecastData.forecast.forecastday[selectedDayIndex].date).getDay()]}</p>
                                        </div>
                                        <div className="select-day-right-data">
                                            <li>Date: {forecastData.forecast.forecastday[selectedDayIndex].date}</li>
                                            <li>Avg Humidity: {forecastData.forecast.forecastday[selectedDayIndex].day.avghumidity}</li>
                                            <li>Max Temp: {renderTemperature(forecastData.forecast.forecastday[selectedDayIndex].day.maxtemp_c)}</li>
                                            <li>Min Temp: {renderTemperature(forecastData.forecast.forecastday[selectedDayIndex].day.mintemp_c)}</li>
                                            <li>Condition: {forecastData.forecast.forecastday[selectedDayIndex].day.condition.text}</li>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <p>No forecast data available.</p>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Content;