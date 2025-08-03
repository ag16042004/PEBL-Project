import React, { useState, useEffect } from 'react';
import { Search, MapPin, Eye, Droplets, Wind, Sun, Cloud, CloudRain, CloudSnow, Zap } from 'lucide-react';

const WeatherApp = () => {
  const [weather, setWeather] = useState(null);
  const [city, setCity] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const API_KEY = '687a2d87f7bbd6cb2a1caf1092ced99a';
  const API_URL = 'https://api.openweathermap.org/data/2.5/weather';

  // Get user's location on component mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          fetchWeatherByCoords(position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          console.log('Location access denied, using default city');
          fetchWeather('London');
        }
      );
    } else {
      fetchWeather('London');
    }
  }, []);

  const fetchWeatherByCoords = async (lat, lon) => {
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(
        `${API_URL}?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
      );
      
      if (!response.ok) {
        throw new Error('Weather data not found');
      }
      
      const data = await response.json();
      setWeather(data);
      setCity(data.name);
    } catch (err) {
      setError('Failed to fetch weather data');
    } finally {
      setLoading(false);
    }
  };

  const fetchWeather = async (cityName) => {
    if (!cityName.trim()) return;
    
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(
        `${API_URL}?q=${cityName}&appid=${API_KEY}&units=metric`
      );
      
      if (!response.ok) {
        throw new Error('City not found');
      }
      
      const data = await response.json();
      setWeather(data);
    } catch (err) {
      setError('City not found. Please try again.');
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    fetchWeather(city);
  };

  const getWeatherIcon = (weatherMain, weatherId) => {
    const iconProps = { size: 80, className: "text-white drop-shadow-lg" };
    
    switch (weatherMain.toLowerCase()) {
      case 'clear':
        return <Sun {...iconProps} className="text-yellow-300 drop-shadow-lg" />;
      case 'clouds':
        return <Cloud {...iconProps} />;
      case 'rain':
      case 'drizzle':
        return <CloudRain {...iconProps} className="text-blue-300 drop-shadow-lg" />;
      case 'snow':
        return <CloudSnow {...iconProps} />;
      case 'thunderstorm':
        return <Zap {...iconProps} className="text-yellow-400 drop-shadow-lg" />;
      default:
        return <Sun {...iconProps} />;
    }
  };

  const getBackgroundGradient = (weatherMain) => {
    switch (weatherMain?.toLowerCase()) {
      case 'clear':
        return 'from-blue-400 via-blue-500 to-blue-600';
      case 'clouds':
        return 'from-gray-400 via-gray-500 to-gray-600';
      case 'rain':
      case 'drizzle':
        return 'from-gray-600 via-gray-700 to-gray-800';
      case 'snow':
        return 'from-blue-200 via-blue-300 to-blue-400';
      case 'thunderstorm':
        return 'from-gray-800 via-gray-900 to-black';
      default:
        return 'from-blue-400 via-blue-500 to-blue-600';
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${getBackgroundGradient(weather?.weather[0]?.main)} transition-all duration-1000`}>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-2 drop-shadow-lg">
              Weather App
            </h1>
            <p className="text-white/80 text-lg">
              Check weather conditions worldwide
            </p>
          </div>

          {/* Search Form */}
          <div className="mb-8">
            <div className="relative">
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Enter city name..."
                onKeyPress={(e) => e.key === 'Enter' && handleSubmit(e)}
                className="w-full px-4 py-3 pl-12 rounded-xl bg-white/20 backdrop-blur-md border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all duration-300"
              />
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/70" size={20} />
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 disabled:opacity-50 px-4 py-2 rounded-lg transition-all duration-300 text-white font-medium"
              >
                {loading ? 'Searching...' : 'Search'}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/20 backdrop-blur-md border border-red-300/30 rounded-xl text-white text-center">
              {error}
            </div>
          )}

          {/* Weather Card */}
          {weather && (
            <div className="bg-white/20 backdrop-blur-md rounded-2xl p-6 border border-white/30 shadow-2xl transition-all duration-500 transform hover:scale-[1.02]">
              {/* Location */}
              <div className="flex items-center justify-center mb-6">
                <MapPin className="text-white mr-2" size={20} />
                <h2 className="text-2xl font-bold text-white">
                  {weather.name}, {weather.sys.country}
                </h2>
              </div>

              {/* Main Weather */}
              <div className="text-center mb-6">
                <div className="flex justify-center mb-4">
                  {getWeatherIcon(weather.weather[0].main, weather.weather[0].id)}
                </div>
                <div className="text-6xl font-bold text-white mb-2">
                  {Math.round(weather.main.temp)}°C
                </div>
                <div className="text-xl text-white/90 capitalize mb-2">
                  {weather.weather[0].description}
                </div>
                <div className="text-white/80">
                  Feels like {Math.round(weather.main.feels_like)}°C
                </div>
              </div>

              {/* Weather Details */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-white/10 rounded-xl p-4 text-center">
                  <Droplets className="text-white mx-auto mb-2" size={24} />
                  <div className="text-white/80 text-sm">Humidity</div>
                  <div className="text-white font-bold text-lg">{weather.main.humidity}%</div>
                </div>
                <div className="bg-white/10 rounded-xl p-4 text-center">
                  <Wind className="text-white mx-auto mb-2" size={24} />
                  <div className="text-white/80 text-sm">Wind Speed</div>
                  <div className="text-white font-bold text-lg">{weather.wind.speed} m/s</div>
                </div>
                <div className="bg-white/10 rounded-xl p-4 text-center">
                  <Eye className="text-white mx-auto mb-2" size={24} />
                  <div className="text-white/80 text-sm">Visibility</div>
                  <div className="text-white font-bold text-lg">{(weather.visibility / 1000).toFixed(1)} km</div>
                </div>
                <div className="bg-white/10 rounded-xl p-4 text-center">
                  <div className="text-white mx-auto mb-2 text-xl font-bold">°</div>
                  <div className="text-white/80 text-sm">Pressure</div>
                  <div className="text-white font-bold text-lg">{weather.main.pressure} hPa</div>
                </div>
              </div>

              {/* Sun Times */}
              <div className="flex justify-between text-white/80 text-sm border-t border-white/20 pt-4">
                <div>
                  <span className="block">Sunrise</span>
                  <span className="font-semibold">{formatTime(weather.sys.sunrise)}</span>
                </div>
                <div className="text-right">
                  <span className="block">Sunset</span>
                  <span className="font-semibold">{formatTime(weather.sys.sunset)}</span>
                </div>
              </div>
            </div>
          )}

          {/* Loading State */}
          {loading && !weather && (
            <div className="text-center">
              <div className="bg-white/20 backdrop-blur-md rounded-2xl p-8 border border-white/30">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                <p className="text-white text-lg">Loading weather data...</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WeatherApp;