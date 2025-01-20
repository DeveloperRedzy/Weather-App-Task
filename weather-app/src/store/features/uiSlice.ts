import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SnackbarState {
  open: boolean;
  message: string;
  severity: 'success' | 'error' | 'info' | 'warning';
}

interface UiState {
  snackbar: SnackbarState;
}

const initialState: UiState = {
  snackbar: {
    open: false,
    message: '',
    severity: 'success',
  },
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    showSnackbar: (
      state,
      action: PayloadAction<{
        message: string;
        severity: SnackbarState['severity'];
      }>
    ) => {
      state.snackbar.open = true;
      state.snackbar.message = action.payload.message;
      state.snackbar.severity = action.payload.severity;
    },
    hideSnackbar: (state) => {
      state.snackbar.open = false;
    },
  },
});

export const { showSnackbar, hideSnackbar } = uiSlice.actions;
export default uiSlice.reducer;
