import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as api from '../../services/api';
import { WeatherData, ForecastData, AirQualityData } from '../../types/weather';

export enum WebSocketConnectionStatus {
  CONNECTED = 'connected',
  DISCONNECTED = 'disconnected',
  CONNECTING = 'connecting',
  ERROR = 'error',
}

interface WeatherState {
  weatherData: WeatherData[];
  forecastData: ForecastData | null;
  airQualityData: AirQualityData | null;
  savedLocations: string[];
  selectedLocation: string | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  connectionStatus: WebSocketConnectionStatus;
  clientId: string | null;
}

export const initialState: WeatherState = {
  weatherData: [],
  forecastData: null,
  airQualityData: null,
  savedLocations: [],
  selectedLocation: null,
  status: 'idle',
  error: null,
  connectionStatus: WebSocketConnectionStatus.DISCONNECTED,
  clientId: null,
};

export const fetchLocations = createAsyncThunk(
  'weather/fetchLocations',
  async (_, { rejectWithValue }) => {
    try {
      const locations = await api.getLocations();
      return locations.map((loc) => `${loc.lat}:${loc.lon}`);
    } catch (error) {
      return rejectWithValue('Failed to fetch locations');
    }
  }
);

export const fetchWeatherForLocation = createAsyncThunk(
  'weather/fetchWeatherForLocation',
  async (location: string, { rejectWithValue }) => {
    try {
      const [lat, lon] = location.split(':').map(Number);
      const data = await api.fetchWeatherData(lat, lon);
      return data;
    } catch (error) {
      return rejectWithValue('Failed to fetch weather data');
    }
  }
);

export const fetchAllWeatherData = createAsyncThunk(
  'weather/fetchAllWeatherData',
  async (locations: string[], {}) => {
    const weatherData = await Promise.all(
      locations.map((location) => {
        const [lat, lon] = location.split(':').map(Number);
        return api.fetchWeatherData(lat, lon);
      })
    );
    return weatherData;
  }
);

export const addLocationThunk = createAsyncThunk(
  'weather/addLocation',
  async (location: { lat: number; lon: number }, { rejectWithValue }) => {
    try {
      await api.addLocation(location);
      const weatherData = await api.fetchWeatherData(
        location.lat,
        location.lon
      );
      return { location: `${location.lat}:${location.lon}`, weatherData };
    } catch (error) {
      return rejectWithValue('Failed to add location');
    }
  }
);

export const removeLocationThunk = createAsyncThunk(
  'weather/removeLocation',
  async (location: { lat: number; lon: number }, { rejectWithValue }) => {
    try {
      console.log('Attempting to delete location:', location);
      await api.deleteLocation(location);
      console.log('Location deleted successfully');
      return `${location.lat}:${location.lon}`;
    } catch (error) {
      console.error('Delete location error:', error);
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Failed to remove location');
    }
  }
);

export const fetchLocationDetails = createAsyncThunk(
  'weather/fetchLocationDetails',
  async (location: string, { rejectWithValue }) => {
    try {
      const [lat, lon] = location.split(':').map(Number);
      const [forecast, airQuality] = await Promise.all([
        api.fetchForecastData(lat, lon),
        api.fetchAirQualityData(lat, lon),
      ]);
      return { forecast, airQuality };
    } catch (error) {
      return rejectWithValue('Failed to fetch location details');
    }
  }
);

const weatherSlice = createSlice({
  name: 'weather',
  initialState,
  reducers: {
    setSelectedLocation: (state, action) => {
      state.selectedLocation = action.payload;
    },
    setWeatherData: (state, action) => {
      state.weatherData = action.payload;
    },
    setForecastData: (state, action) => {
      state.forecastData = action.payload;
    },
    setConnectionStatus: (state, action) => {
      state.connectionStatus = action.payload;
    },
    setClientId: (state, action) => {
      state.clientId = action.payload;
    },
    setAirQualityData: (state, action) => {
      state.airQualityData = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLocations.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchLocations.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.savedLocations = action.payload;
      })
      .addCase(fetchLocations.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      .addCase(fetchAllWeatherData.fulfilled, (state, action) => {
        state.weatherData = action.payload;
      })
      .addCase(addLocationThunk.fulfilled, (state, action) => {
        state.savedLocations.push(action.payload.location);
        state.weatherData.push(action.payload.weatherData);
      })
      .addCase(removeLocationThunk.fulfilled, (state, action) => {
        state.savedLocations = state.savedLocations.filter(
          (loc) => loc !== action.payload
        );
        state.weatherData = state.weatherData.filter(
          (data) => `${data.coord.lat}:${data.coord.lon}` !== action.payload
        );
      })
      .addCase(fetchLocationDetails.fulfilled, (state, action) => {
        state.forecastData = action.payload.forecast;
        state.airQualityData = action.payload.airQuality;
      });
  },
});

export const {
  setSelectedLocation,
  setWeatherData,
  setForecastData,
  setConnectionStatus,
  setClientId,
  setAirQualityData,
} = weatherSlice.actions;
export default weatherSlice.reducer;
