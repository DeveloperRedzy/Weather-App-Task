import { configureStore } from "@reduxjs/toolkit";
import weatherReducer, { initialState } from "./features/weatherSlice";
import { loadState, saveState } from "./localStorage";

const preloadedState = loadState();

export const store = configureStore({
  reducer: {
    weather: weatherReducer,
  },
  preloadedState: preloadedState
    ? {
        weather: {
          ...initialState,
          savedLocations: preloadedState.savedLocations,
        },
      }
    : undefined,
});

store.subscribe(() => {
  saveState({
    savedLocations: store.getState().weather.savedLocations,
  });
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
