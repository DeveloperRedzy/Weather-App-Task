import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { webSocketService } from '../services/websocket';
import {
  addLocation,
  removeLocation,
  setSelectedLocation,
} from '../store/features/weatherSlice';

export const useWeatherWebSocket = () => {
  const dispatch = useAppDispatch();
  const savedLocations = useAppSelector(
    (state) => state.weather.savedLocations
  );
  const selectedLocation = useAppSelector(
    (state) => state.weather.selectedLocation
  );
  const connectionStatus = useAppSelector(
    (state) => state.weather.connectionStatus
  );

  // Connect to WebSocket on mount
  useEffect(() => {
    webSocketService.connect();

    return () => {
      webSocketService.disconnect();
    };
  }, []);

  // Subscribe to saved locations when they change
  useEffect(() => {
    if (savedLocations.length > 0) {
      webSocketService.subscribeToLocations(savedLocations);
    } else {
      webSocketService.clearSubscriptions();
    }
  }, [savedLocations]);

  // Subscribe to selected location for detailed view
  useEffect(() => {
    if (selectedLocation) {
      webSocketService.subscribeToLocation(selectedLocation);
    }
  }, [selectedLocation]);

  const addWeatherLocation = (location: string) => {
    dispatch(addLocation(location));
  };

  const removeWeatherLocation = (location: string) => {
    dispatch(removeLocation(location));
  };

  const selectLocation = (location: string | null) => {
    dispatch(setSelectedLocation(location));
  };

  return {
    addWeatherLocation,
    removeWeatherLocation,
    selectLocation,
    connectionStatus,
    locations: savedLocations,
  };
};
