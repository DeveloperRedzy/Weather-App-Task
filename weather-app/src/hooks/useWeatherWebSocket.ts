import { useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { webSocketService } from '../services/websocket';
import {
  addLocationThunk,
  removeLocationThunk,
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

  const isConnected = useRef(false);

  useEffect(() => {
    if (!isConnected.current) {
      webSocketService.connect();
      isConnected.current = true;
    }

    return () => {
      webSocketService.disconnect();
      isConnected.current = false;
    };
  }, []);

  useEffect(() => {
    if (savedLocations.length > 0 && connectionStatus === 'connected') {
      webSocketService.subscribeToLocations(savedLocations);
    } else if (connectionStatus === 'connected') {
      webSocketService.clearSubscriptions();
    }
  }, [savedLocations, connectionStatus]);

  useEffect(() => {
    if (selectedLocation && connectionStatus === 'connected') {
      webSocketService.subscribeToLocation(selectedLocation);
    }
  }, [selectedLocation, connectionStatus]);

  const addWeatherLocation = (location: string) => {
    const [lat, lon] = location.split(':').map(Number);
    dispatch(addLocationThunk({ lat, lon }));
  };

  const removeWeatherLocation = (location: string) => {
    const [lat, lon] = location.split(':').map(Number);
    dispatch(removeLocationThunk({ lat, lon }));
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
