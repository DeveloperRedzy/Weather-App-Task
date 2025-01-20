import axios from 'axios';

const WEATHER_API_URL = 'http://localhost:3000';
const OPENWEATHER_API_URL = 'https://api.openweathermap.org/data/2.5';
const OPENWEATHER_API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

interface Location {
  lat: number;
  lon: number;
}

interface LoginResponse {
  token: string;
}

const weatherApi = axios.create({
  baseURL: WEATHER_API_URL,
});

weatherApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('weatherToken');
  if (token) {
    config.headers.Authentication = token;
  }
  return config;
});

const openWeatherApi = axios.create({
  baseURL: OPENWEATHER_API_URL,
});

export const login = async (): Promise<string> => {
  const response = await weatherApi.post<LoginResponse>('/login');
  const token = response.data.token;
  localStorage.setItem('weatherToken', token);
  return token;
};

export const getLocations = async (): Promise<Location[]> => {
  const response = await weatherApi.get<Location[]>('/locations');
  return response.data;
};

export const addLocation = async (location: Location): Promise<void> => {
  console.log('API: Adding location:', location);
  await weatherApi.post('/locations', {
    lat: location.lat,
    lon: location.lon,
  });
};

export const deleteLocation = async (location: Location): Promise<void> => {
  try {
    console.log('API: Deleting location:', location);
    const response = await weatherApi.delete('/locations', {
      data: {
        lat: location.lat,
        lon: location.lon,
      },
    });
    console.log('API: Delete response:', response);
  } catch (error) {
    console.error('API: Delete error:', error);
    if (axios.isAxiosError(error)) {
      throw new Error(
        `Failed to delete location: ${error.response?.data?.message || error.message}`
      );
    }
    throw error;
  }
};

export const fetchWeatherData = async (lat: number, lon: number) => {
  const response = await openWeatherApi.get('/weather', {
    params: {
      lat,
      lon,
      units: 'metric',
      appid: OPENWEATHER_API_KEY,
    },
  });
  return response.data;
};

export const fetchForecastData = async (lat: number, lon: number) => {
  const response = await openWeatherApi.get('/forecast', {
    params: {
      lat,
      lon,
      units: 'metric',
      appid: OPENWEATHER_API_KEY,
    },
  });
  return response.data;
};

export const fetchAirQualityData = async (lat: number, lon: number) => {
  const response = await openWeatherApi.get('/air_pollution', {
    params: {
      lat,
      lon,
      appid: OPENWEATHER_API_KEY,
    },
  });
  return response.data;
};

export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem('weatherToken');
};

export const logout = (): void => {
  localStorage.removeItem('weatherToken');
};
