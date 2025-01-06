import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export enum WebSocketConnectionStatus {
  DISCONNECTED = "disconnected",
  CONNECTING = "connecting",
  CONNECTED = "connected",
  ERROR = "error",
}

interface WeatherData {
  coord: {
    lat: number;
    lon: number;
  };
  weather: Array<{
    id: number;
    main: string;
    description: string;
    icon: string;
  }>;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
  };
  wind: {
    speed: number;
    deg: number;
  };
  sys: {
    sunrise: number;
    sunset: number;
  };
  name: string;
  id: number;
}

export interface ForecastData {
  list: Array<{
    dt: number;
    main: {
      temp: number;
      feels_like: number;
      temp_min: number;
      temp_max: number;
      pressure: number;
      humidity: number;
    };
    weather: Array<{
      id: number;
      main: string;
      description: string;
      icon: string;
    }>;
    wind: {
      speed: number;
      deg: number;
    };
  }>;
}

export interface AirQualityData {
  list: Array<{
    main: {
      aqi: number; // 1 = Good, 2 = Fair, 3 = Moderate, 4 = Poor, 5 = Very Poor
    };
    components: {
      co: number; // Carbon monoxide (μg/m3)
      no: number; // Nitrogen monoxide (μg/m3)
      no2: number; // Nitrogen dioxide (μg/m3)
      o3: number; // Ozone (μg/m3)
      so2: number; // Sulphur dioxide (μg/m3)
      pm2_5: number; // Fine particles (μg/m3)
      pm10: number; // Coarse particles (μg/m3)
      nh3: number; // Ammonia (μg/m3)
    };
  }>;
}

interface WeatherState {
  weatherData: WeatherData[];
  forecastData: ForecastData | null;
  airQualityData: AirQualityData | null;
  savedLocations: string[];
  selectedLocation: string | null;
  connectionStatus: WebSocketConnectionStatus;
  clientId: string | null;
  error: string | null;
}

export const initialState: WeatherState = {
  weatherData: [],
  forecastData: null,
  airQualityData: null,
  savedLocations: [],
  selectedLocation: null,
  connectionStatus: WebSocketConnectionStatus.DISCONNECTED,
  clientId: null,
  error: null,
};

const weatherSlice = createSlice({
  name: "weather",
  initialState,
  reducers: {
    setWeatherData: (state, action: PayloadAction<WeatherData[]>) => {
      state.weatherData = action.payload;
    },
    setForecastData: (state, action: PayloadAction<ForecastData>) => {
      state.forecastData = action.payload;
    },
    addLocation: (state, action: PayloadAction<string>) => {
      if (!state.savedLocations.includes(action.payload)) {
        state.savedLocations.push(action.payload);
      }
    },
    removeLocation: (state, action: PayloadAction<string>) => {
      state.savedLocations = state.savedLocations.filter(
        (location) => location !== action.payload,
      );
    },
    setSelectedLocation: (state, action: PayloadAction<string | null>) => {
      state.selectedLocation = action.payload;
    },
    setConnectionStatus: (
      state,
      action: PayloadAction<WebSocketConnectionStatus>,
    ) => {
      state.connectionStatus = action.payload;
    },
    setClientId: (state, action: PayloadAction<string>) => {
      state.clientId = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setAirQualityData: (state, action: PayloadAction<AirQualityData>) => {
      state.airQualityData = action.payload;
    },
  },
});

export const {
  setWeatherData,
  setForecastData,
  setAirQualityData,
  addLocation,
  removeLocation,
  setSelectedLocation,
  setConnectionStatus,
  setClientId,
  setError,
} = weatherSlice.actions;

export default weatherSlice.reducer;
