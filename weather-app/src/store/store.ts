import { configureStore } from '@reduxjs/toolkit';
import weatherReducer from './features/weatherSlice';
import authReducer from './features/authSlice';
import uiReducer from './features/uiSlice';

export const store = configureStore({
  reducer: {
    weather: weatherReducer,
    auth: authReducer,
    ui: uiReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
