import { createContext, useContext, FC, ReactNode } from 'react';
import { useAppSelector } from '../store/hooks';
import { WeatherData, ForecastData, AirQualityData } from '../types/weather';

interface WeatherContextType {
  weatherData: WeatherData[];
  forecastData: ForecastData | null;
  airQualityData: AirQualityData | null;
  savedLocations: string[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
}

const WeatherContext = createContext<WeatherContextType | undefined>(undefined);

export const WeatherProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const weatherData = useAppSelector((state) => state.weather.weatherData);
  const forecastData = useAppSelector((state) => state.weather.forecastData);
  const airQualityData = useAppSelector(
    (state) => state.weather.airQualityData
  );
  const savedLocations = useAppSelector(
    (state) => state.weather.savedLocations
  );
  const status = useAppSelector((state) => state.weather.status);

  return (
    <WeatherContext.Provider
      value={{
        weatherData,
        forecastData,
        airQualityData,
        savedLocations,
        status,
      }}
    >
      {children}
    </WeatherContext.Provider>
  );
};

export const useWeather = () => {
  const context = useContext(WeatherContext);
  if (context === undefined) {
    throw new Error('useWeather must be used within a WeatherProvider');
  }
  return context;
};
